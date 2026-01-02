import { PrismaClient } from '@prisma/client';
import type { UserProfile } from '@vantage/shared';

const prisma = new PrismaClient();

export class DatabaseService {
  async upsertUser(steamId64: string, profile: UserProfile) {
    const { steam, faceit, leetify, risk } = profile;
    
    return prisma.user.upsert({
      where: { steamId64 },
      create: {
        steamId64,
        username: steam.username,
        avatar: steam.avatar,
        profileUrl: steam.profileUrl,
        accountCreated: steam.accountCreated,
        level: steam.level,
        yearsOfService: steam.yearsOfService,
        isPrime: steam.isPrime,
        isPrivate: steam.isPrivate,
        vacBanned: steam.vacBanned,
        gameBanned: steam.gameBanned,
        daysSinceLastBan: steam.daysSinceLastBan,
        faceitElo: faceit?.elo,
        faceitLevel: faceit?.level,
        leetifyRating: leetify?.ranks?.leetify,
        riskScore: risk.totalScore,
        riskFlags: risk.flags as any,
        lastCalculated: risk.calculatedAt,
      },
      update: {
        username: steam.username,
        avatar: steam.avatar,
        accountCreated: steam.accountCreated,
        level: steam.level,
        yearsOfService: steam.yearsOfService,
        isPrime: steam.isPrime,
        isPrivate: steam.isPrivate,
        vacBanned: steam.vacBanned,
        gameBanned: steam.gameBanned,
        daysSinceLastBan: steam.daysSinceLastBan,
        faceitElo: faceit?.elo,
        faceitLevel: faceit?.level,
        leetifyRating: leetify?.ranks?.leetify,
        riskScore: risk.totalScore,
        riskFlags: risk.flags as any,
        lastCalculated: risk.calculatedAt,
        lastLookup: new Date(),
        lookupCount: { increment: 1 },
      },
    });
  }
  
  async getUserBySteamId(steamId64: string) {
    return prisma.user.findUnique({
      where: { steamId64 },
    });
  }
  
  async recordLookup(userId: string, ipAddress?: string, userAgent?: string) {
    return prisma.lookup.create({
      data: {
        userId,
        ipAddress,
        userAgent,
      },
    });
  }

  async incrementStat(key: string) {
    return prisma.stats.upsert({
      where: { key },
      create: {
        key,
        value: 1,
      },
      update: {
        value: { increment: 1 },
      },
    });
  }

  async getStat(key: string): Promise<bigint> {
    const stat = await prisma.stats.findUnique({
      where: { key },
    });
    return stat?.value || BigInt(0);
  }

  async getAllStats() {
    return prisma.stats.findMany();
  }
}
