import type { FastifyInstance } from 'fastify';
import { resolveUser } from '@vantage/shared';
import { SteamService } from '../services/steam';
import { FaceitService } from '../services/faceit';
import { LeetifyService } from '../services/leetify';
import { CS2Service } from '../services/cs2';
import { DatabaseService } from '../services/database';
import { CacheService } from '../services/cache';
import { rateLimitService, RateLimitService } from '../services/rate-limit';
import { antiSpamService } from '../services/anti-spam';
import { calculateRiskScore } from '@vantage/shared';
import type { UserProfile, ApiResponse } from '@vantage/shared';

const steamService = new SteamService();
const faceitService = new FaceitService();
const leetifyService = new LeetifyService();
const cs2Service = new CS2Service();
const dbService = new DatabaseService();
const cacheService = new CacheService();

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: { id: string };
    Querystring: { recaptcha_token?: string };
  }>('/profile/:id', async (request, reply) => {
    const { id } = request.params;
    const { recaptcha_token } = request.query;
    const clientIP = request.ip;
    const userAgent = request.headers['user-agent'];
    const forwardedFor = request.headers['x-forwarded-for'] as string | undefined;

    try {
      // Generate secure client key to prevent bypass attempts
      const clientKey = RateLimitService.getClientKey(clientIP, userAgent, forwardedFor);
      
      // CRITICAL: Verify Redis is operational - fail-safe if not
      const redisHealthy = await rateLimitService.isRedisHealthy();
      if (!redisHealthy) {
        fastify.log.error('Redis is down - blocking all requests as fail-safe');
        return reply.status(503).send({
          success: false,
          error: 'Service temporarily unavailable. Please try again later.',
          timestamp: new Date().toISOString(),
        } as ApiResponse<never>);
      }
      
      // Check spam detection results from middleware
      const spamDetection = (request as any).spamDetection;
      
      // Check and record rate limit atomically - this MUST happen for every request
      const rateLimit = await rateLimitService.checkAndRecordRequest(clientKey);
      
      // Log for debugging
      fastify.log.info(`Rate limit check for ${clientKey}: allowed=${rateLimit.allowed}, count=${rateLimit.currentCount}/${rateLimit.total}`);
      
      // If rate limit exceeded or spam detection requires CAPTCHA, verify reCAPTCHA
      if (!rateLimit.allowed || spamDetection?.requiresCaptcha) {
        // If reCAPTCHA token is not provided, return error
        if (!recaptcha_token) {
          return reply.status(429).send({
            success: false,
            error: 'Rate limit exceeded. Please complete reCAPTCHA to continue.',
            requiresCaptcha: true,
            timestamp: new Date().toISOString(),
          } as ApiResponse<never>);
        }

        // Verify reCAPTCHA token
        const recaptchaValid = await antiSpamService.verifyRecaptcha(recaptcha_token, clientIP);
        if (!recaptchaValid) {
          return reply.status(400).send({
            success: false,
            error: 'reCAPTCHA verification failed. Please try again.',
            requiresCaptcha: true,
            timestamp: new Date().toISOString(),
          } as ApiResponse<never>);
        }
        
        // reCAPTCHA verified - allow this request but don't reset rate limit
        fastify.log.info(`reCAPTCHA verified for ${clientKey}, allowing rate-limited request`);
      }

      // Log rate limit info for monitoring (internal only)
      fastify.log.info(`Rate limit for ${clientKey}: ${rateLimit.currentCount}/${rateLimit.total} used, ${rateLimit.remaining} remaining`);

      // 1. Resolve to SteamID64
      const steamId64 = await resolveUser(id);

      // 2. Check cache first and determine what needs to be fetched
      const cached = await cacheService.getProfile(steamId64);
      let needsFetch = {
        steam: !cached,
        faceit: !cached || !cached.faceit,
        leetify: !cached || !cached.leetify,
        leetifyTeammates: !cached || !cached.leetify?.recent_teammates || 
                          cached.leetify.recent_teammates.length === 0 ||
                          !cached.leetify.recent_teammates[0]?.name, // Check if teammates have profile info
        premier: !cached || !cached.premier,
        competitive: !cached || !cached.competitive,
        wingman: !cached || !cached.wingman,
      };

      // If everything is cached, return immediately
      if (!Object.values(needsFetch).some(v => v)) {
        fastify.log.info(`Full cache hit for ${steamId64}`);
        return {
          success: true,
          data: cached,
          timestamp: new Date().toISOString(),
        } as ApiResponse<UserProfile>;
      }

      fastify.log.info(`Partial cache miss for ${steamId64}: ${JSON.stringify(needsFetch)}`);

      // 3. Fetch only missing data
      const fetchPromises: Promise<any>[] = [];
      const fetchKeys: string[] = [];

      if (needsFetch.steam) {
        fetchKeys.push('steam');
        fetchPromises.push(steamService.getProfile(steamId64));
      }
      if (needsFetch.faceit) {
        fetchKeys.push('faceit');
        fetchPromises.push(faceitService.getStats(steamId64).catch(() => null));
      }
      if (needsFetch.leetify) {
        fetchKeys.push('leetify');
        fetchPromises.push(leetifyService.getStats(steamId64).catch(() => null));
      }
      if (needsFetch.premier) {
        fetchKeys.push('premier');
        fetchPromises.push(cs2Service.getPremierStats(steamId64).catch(() => null));
      }
      if (needsFetch.competitive) {
        fetchKeys.push('competitive');
        fetchPromises.push(cs2Service.getCompetitiveStats(steamId64).catch(() => null));
      }
      if (needsFetch.wingman) {
        fetchKeys.push('wingman');
        fetchPromises.push(cs2Service.getWingmanStats(steamId64).catch(() => null));
      }

      const results = await Promise.allSettled(fetchPromises);
      
      // Map results back to their keys
      const fetchedData: any = {};
      results.forEach((result, index) => {
        const key = fetchKeys[index];
        fetchedData[key] = result.status === 'fulfilled' ? result.value : undefined;
      });

      // Merge cached data with newly fetched data
      const steam = fetchedData.steam || cached?.steam;
      const faceit = fetchedData.faceit || cached?.faceit;
      const leetify = fetchedData.leetify || cached?.leetify;
      const premier = fetchedData.premier || cached?.premier;
      const competitive = fetchedData.competitive || cached?.competitive;
      const wingman = fetchedData.wingman || cached?.wingman;

      if (!steam) {
        throw new Error('Failed to fetch Steam profile');
      }

      // Fetch teammate profiles if needed
      if (needsFetch.leetifyTeammates && leetify?.recent_teammates && leetify.recent_teammates.length > 0) {
        const teammateProfiles = await Promise.allSettled(
          leetify.recent_teammates.slice(0, 6).map(async (teammate: any) => {
            try {
              const profile = await steamService.getProfile(teammate.steam64_id);
              return {
                ...teammate,
                name: profile.username,
                avatar: profile.avatar,
              };
            } catch {
              return teammate;
            }
          })
        );
        
        leetify.recent_teammates = teammateProfiles
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<any>).value);
      }

      // 5. Calculate risk score
      const risk = calculateRiskScore({
        steam,
        faceit: faceit || undefined,
        leetify: leetify || undefined,
      });

      // 6. Build profile
      const profile: UserProfile = {
        premier: premier || undefined,
        competitive: competitive || undefined,
        wingman: wingman || undefined,
        steam,
        faceit: faceit || undefined,
        leetify: leetify || undefined,
        risk,
      };

      // 7. Save to database and cache
      await Promise.all([
        dbService.upsertUser(steamId64, profile),
        cacheService.setProfile(steamId64, profile),
        dbService.incrementStat('total_searches'),
      ]);

      return {
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      } as ApiResponse<UserProfile>;

    } catch (error) {
      fastify.log.error(error);
      return reply.status(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        timestamp: new Date().toISOString(),
      } as ApiResponse<never>);
    }
  });

  // Endpoint to check job status
  fastify.get<{
    Params: { jobId: string };
  }>('/profile/job/:jobId', async (request, reply) => {
    const { jobId } = request.params;

    try {
      // In a real implementation, you'd check the job status in the queue
      // For now, return a placeholder response
      return {
        success: true,
        data: {
          jobId,
          status: 'processing',
          progress: 50,
          estimatedCompletion: new Date(Date.now() + 30000).toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return reply.status(404).send({
        success: false,
        error: 'Job not found',
        timestamp: new Date().toISOString(),
      });
    }
  });
}
