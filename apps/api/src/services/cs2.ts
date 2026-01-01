import axios from 'axios';
import type { PremierStats, CompetitiveStats, WingmanStats } from '@vantage/shared';

const STEAM_API_BASE = 'https://api.steampowered.com';
const CS2_APP_ID = '730'; // CS2/CSGO App ID

export class CS2Service {
  /**
   * Get Premier stats
   * Note: Steam API doesn't directly expose Premier ratings
   * This is a placeholder for when we integrate with CS2 demo parsers or third-party services
   */
  async getPremierStats(steamId64: string): Promise<PremierStats | null> {
    try {
      const STEAM_API_KEY = process.env.STEAM_API_KEY;
      if (!STEAM_API_KEY) {
        return null;
      }

      // Get user stats for CS2
      const statsRes = await axios.get(`${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v2/`, {
        params: {
          key: STEAM_API_KEY,
          steamid: steamId64,
          appid: CS2_APP_ID,
        },
      }).catch(() => null);

      if (!statsRes || !statsRes.data?.playerstats?.stats) {
        return null;
      }

      const stats = statsRes.data.playerstats.stats;
      
      // Find relevant stats
      const findStat = (name: string) => {
        const stat = stats.find((s: any) => s.name === name);
        return stat ? stat.value : 0;
      };

      // Premier/Competitive stats from CS2
      const totalWins = findStat('total_wins');
      const totalMatchesWon = findStat('total_matches_won');
      const totalRoundsPlayed = findStat('total_rounds_played');
      
      // Estimate matches played (rounds / average 24 rounds per match)
      const estimatedMatches = Math.floor(totalRoundsPlayed / 24);
      const winRate = estimatedMatches > 0 ? (totalMatchesWon / estimatedMatches) * 100 : 0;

      return {
        rating: 0, // Premier rating not available via API
        wins: totalMatchesWon || totalWins,
        matchesPlayed: estimatedMatches,
        winRate: winRate,
        rank: undefined,
        rankName: 'Unknown (Private/Not Available)',
      };
    } catch (error) {
      console.error('CS2 Premier stats error:', error);
      return null;
    }
  }

  /**
   * Get Competitive stats
   */
  async getCompetitiveStats(steamId64: string): Promise<CompetitiveStats | null> {
    try {
      const STEAM_API_KEY = process.env.STEAM_API_KEY;
      if (!STEAM_API_KEY) {
        return null;
      }

      const statsRes = await axios.get(`${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v2/`, {
        params: {
          key: STEAM_API_KEY,
          steamid: steamId64,
          appid: CS2_APP_ID,
        },
      }).catch(() => null);

      if (!statsRes || !statsRes.data?.playerstats?.stats) {
        return null;
      }

      const stats = statsRes.data.playerstats.stats;
      const findStat = (name: string) => {
        const stat = stats.find((s: any) => s.name === name);
        return stat ? stat.value : 0;
      };

      const totalMatchesWon = findStat('total_matches_won');
      const totalRoundsPlayed = findStat('total_rounds_played');
      
      const estimatedMatches = Math.floor(totalRoundsPlayed / 24);
      const winRate = estimatedMatches > 0 ? (totalMatchesWon / estimatedMatches) * 100 : 0;

      return {
        wins: totalMatchesWon,
        matchesPlayed: estimatedMatches,
        winRate: winRate,
        rank: undefined,
        rankName: 'Unknown (Private/Not Available)',
      };
    } catch (error) {
      console.error('CS2 Competitive stats error:', error);
      return null;
    }
  }

  /**
   * Get Wingman stats
   */
  async getWingmanStats(steamId64: string): Promise<WingmanStats | null> {
    try {
      const STEAM_API_KEY = process.env.STEAM_API_KEY;
      if (!STEAM_API_KEY) {
        return null;
      }

      const statsRes = await axios.get(`${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v2/`, {
        params: {
          key: STEAM_API_KEY,
          steamid: steamId64,
          appid: CS2_APP_ID,
        },
      }).catch(() => null);

      if (!statsRes || !statsRes.data?.playerstats?.stats) {
        return null;
      }

      const stats = statsRes.data.playerstats.stats;
      const findStat = (name: string) => {
        const stat = stats.find((s: any) => s.name === name);
        return stat ? stat.value : 0;
      };

      const wingmanWins = findStat('total_wins_wingman');
      
      return {
        wins: wingmanWins,
        rank: undefined,
        rankName: 'Unknown (Private/Not Available)',
      };
    } catch (error) {
      console.error('CS2 Wingman stats error:', error);
      return null;
    }
  }

  /**
   * Get CS2 game stats (hours played, last played, etc.)
   */
  async getCS2GameStats(steamId64: string): Promise<any> {
    try {
      const STEAM_API_KEY = process.env.STEAM_API_KEY;
      if (!STEAM_API_KEY) {
        return null;
      }

      // Get recently played games
      const recentRes = await axios.get(`${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v1/`, {
        params: {
          key: STEAM_API_KEY,
          steamid: steamId64,
        },
      }).catch(() => null);

      if (recentRes?.data?.response?.games) {
        const cs2Game = recentRes.data.response.games.find((g: any) => g.appid === parseInt(CS2_APP_ID));
        if (cs2Game) {
          return {
            hoursPlayed: Math.floor(cs2Game.playtime_forever / 60),
            lastPlayed: new Date(cs2Game.rtime_last_played * 1000),
          };
        }
      }

      // Get owned games (if recent not available)
      const ownedRes = await axios.get(`${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/`, {
        params: {
          key: STEAM_API_KEY,
          steamid: steamId64,
          include_played_free_games: 1,
        },
      }).catch(() => null);

      if (ownedRes?.data?.response?.games) {
        const cs2Game = ownedRes.data.response.games.find((g: any) => g.appid === parseInt(CS2_APP_ID));
        if (cs2Game) {
          return {
            hoursPlayed: Math.floor(cs2Game.playtime_forever / 60),
          };
        }
      }

      return null;
    } catch (error) {
      console.error('CS2 game stats error:', error);
      return null;
    }
  }
}
