import Redis from 'ioredis';
import type { UserProfile } from '@vantage/shared';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
});

const CACHE_TTL = 300; // 5 minutes

export class CacheService {
  async getProfile(steamId64: string): Promise<UserProfile | null> {
    try {
      const cached = await redis.get(`profile:${steamId64}`);
      if (cached) {
        const profile = JSON.parse(cached);
        // Convert date strings back to Date objects
        if (profile.steam?.accountCreated) {
          profile.steam.accountCreated = new Date(profile.steam.accountCreated);
        }
        if (profile.steam?.cs2Stats?.lastPlayed) {
          profile.steam.cs2Stats.lastPlayed = new Date(profile.steam.cs2Stats.lastPlayed);
        }
        if (profile.risk?.calculatedAt) {
          profile.risk.calculatedAt = new Date(profile.risk.calculatedAt);
        }
        if (profile.faceit?.matchHistory) {
          profile.faceit.matchHistory.forEach((match: any) => {
            if (match.date) match.date = new Date(match.date);
          });
        }
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }
  
  async setProfile(steamId64: string, profile: UserProfile): Promise<void> {
    try {
      await redis.setex(
        `profile:${steamId64}`,
        CACHE_TTL,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  
  async invalidateProfile(steamId64: string): Promise<void> {
    try {
      await redis.del(`profile:${steamId64}`);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  // Generic cache methods for any data
  async get(key: string): Promise<any | null> {
    try {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = CACHE_TTL): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
}
