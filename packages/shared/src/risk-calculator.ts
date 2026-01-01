import type { RiskAssessment, RiskFlag, SteamProfile, FaceitStats, LeetifyStats } from './types';

export interface RiskCalculationInput {
  steam: SteamProfile;
  faceit?: FaceitStats;
  leetify?: LeetifyStats;
  premier?: { rating: number };
}

/**
 * Calculates the Vantage Risk Factor (0-100)
 * Based on multiple red flags with weighted scoring
 */
export function calculateRiskScore(data: RiskCalculationInput): RiskAssessment {
  const flags: RiskFlag[] = [];
  let totalScore = 0;
  
  // Flag 1: New Account (+30)
  if (data.steam.accountCreated) {
    const accountCreatedTime = typeof data.steam.accountCreated === 'string' 
      ? new Date(data.steam.accountCreated).getTime() 
      : data.steam.accountCreated.getTime();
    const accountAgeYears = (Date.now() - accountCreatedTime) / (1000 * 60 * 60 * 24 * 365);
    if (accountAgeYears < 1) {
      const weight = 30;
      flags.push({
        flag: 'NEW_ACCOUNT',
        weight,
        reason: `Account created less than 1 year ago (${accountAgeYears.toFixed(1)} years)`,
        detected: true
      });
      totalScore += weight;
    }
  }
  
  // Flag 2: Private Profile (+10)
  if (data.steam.isPrivate) {
    const weight = 10;
    flags.push({
      flag: 'HIDDEN_PROFILE',
      weight,
      reason: 'Profile is set to private',
      detected: true
    });
    totalScore += weight;
  }
  
  // Flag 3: VAC/Game Ban History (+40 for VAC, +25 for game ban)
  if (data.steam.vacBanned) {
    const weight = 40;
    flags.push({
      flag: 'VAC_BANNED',
      weight,
      reason: `VAC ban detected${data.steam.daysSinceLastBan ? ` (${data.steam.daysSinceLastBan} days ago)` : ''}`,
      detected: true
    });
    totalScore += weight;
  } else if (data.steam.gameBanned) {
    const weight = 25;
    flags.push({
      flag: 'GAME_BANNED',
      weight,
      reason: `Game ban detected${data.steam.daysSinceLastBan ? ` (${data.steam.daysSinceLastBan} days ago)` : ''}`,
      detected: true
    });
    totalScore += weight;
  }
  
  // Flag 4: No Prime Status - REMOVED
  // Note: Prime status cannot be reliably detected via Steam Web API
  // It requires Game Coordinator access which is not publicly available
  // Keeping this commented out to avoid false positives
  /*
  if (!data.steam.isPrime) {
    const weight = 15;
    flags.push({
      flag: 'NO_PRIME',
      weight,
      reason: 'No Prime status on account',
      detected: true
    });
    totalScore += weight;
  }
  */
  
  // Flag 5: Faceit Ban History (+35)
  if (data.faceit?.hasBan && data.faceit.activeBans && data.faceit.activeBans.length > 0) {
    const weight = 35;
    flags.push({
      flag: 'FACEIT_BANNED',
      weight,
      reason: `Active Faceit ban(s): ${data.faceit.activeBans.map((b: any) => b.reason).join(', ')}`,
      detected: true
    });
    totalScore += weight;
  }
  
  // Flag 6: Inconsistent Stats (+25)
  // High aim but low positioning suggests possible aim assistance
  if (data.leetify && data.leetify.rating) {
    const aim = data.leetify.rating.aim || 0;
    const positioning = data.leetify.rating.positioning || 0;
    if (aim > 90 && positioning < 30) {
      const weight = 25;
      flags.push({
        flag: 'INCONSISTENT_STATS',
        weight,
        reason: `Leetify: High aim (${aim}) but low positioning (${positioning})`,
        detected: true
      });
      totalScore += weight;
    }
  }
  
  // Flag 7: Extremely High K/D with Low Experience (+20)
  if (data.faceit) {
    if (data.faceit.avgKD > 1.5 && data.faceit.matches < 50) {
      const weight = 20;
      flags.push({
        flag: 'HIGH_KD_LOW_MATCHES',
        weight,
        reason: `High K/D (${data.faceit.avgKD.toFixed(2)}) with only ${data.faceit.matches} matches`,
        detected: true
      });
      totalScore += weight;
    }
  }
  
  // Flag 8: Very New Faceit Account with High Skill (+20)
  if (data.faceit && data.faceit.accountAge !== undefined) {
    if (data.faceit.accountAge < 30 && data.faceit.level >= 8) {
      const weight = 20;
      flags.push({
        flag: 'NEW_FACEIT_HIGH_SKILL',
        weight,
        reason: `New Faceit account (${data.faceit.accountAge} days) with high level (${data.faceit.level})`,
        detected: true
      });
      totalScore += weight;
    }
  }
  
  // Cap score at 100
  totalScore = Math.min(totalScore, 100);
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'critical';
  if (totalScore >= 70) level = 'critical';
  else if (totalScore >= 50) level = 'high';
  else if (totalScore >= 30) level = 'medium';
  else level = 'low';
  
  return {
    totalScore,
    level,
    flags,
    calculatedAt: new Date()
  };
}

/**
 * Gets color class for risk score display
 */
export function getRiskColor(score: number): string {
  if (score >= 70) return 'red';
  if (score >= 50) return 'orange';
  if (score >= 30) return 'yellow';
  return 'green';
}

/**
 * Gets risk level text
 */
export function getRiskLevelText(level: string): string {
  switch (level) {
    case 'critical': return 'CRITICAL THREAT';
    case 'high': return 'HIGH RISK';
    case 'medium': return 'MODERATE RISK';
    case 'low': return 'LOW RISK';
    default: return 'UNKNOWN';
  }
}
