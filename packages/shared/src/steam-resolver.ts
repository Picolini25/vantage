import SteamIDResolver from 'steamid-resolver';

/**
 * Resolves any Steam input (URL, vanity name, SteamID64, etc.) to a SteamID64
 */
export async function resolveUser(input: string): Promise<string> {
  // Remove whitespace
  const trimmed = input.trim();
  
  // 1. Check if it's already a SteamID64
  if (/^7656119\d{10}$/.test(trimmed)) {
    return trimmed;
  }
  
  // 2. Extract from Steam URL patterns
  // Profile URL: steamcommunity.com/profiles/76561198...
  const profileMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d+)/);
  if (profileMatch) {
    return profileMatch[1];
  }
  
  // Vanity URL: steamcommunity.com/id/username
  const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^\/\?]+)/);
  if (vanityMatch) {
    try {
      const sid64 = await SteamIDResolver.customUrlToSteamID64(vanityMatch[1]);
      return sid64;
    } catch (e) {
      throw new Error(`Could not resolve vanity URL: ${vanityMatch[1]}`);
    }
  }
  
  // 3. Try resolving as a direct vanity name
  try {
    const sid64 = await SteamIDResolver.customUrlToSteamID64(trimmed);
    return sid64;
  } catch (e) {
    throw new Error(`Could not resolve user: ${trimmed}`);
  }
}

/**
 * Validates if a string is a valid SteamID64
 */
export function isValidSteamId64(steamId: string): boolean {
  return /^7656119\d{10}$/.test(steamId);
}

/**
 * Converts SteamID64 to SteamID32
 */
export function steamId64ToSteamId32(steamId64: string): string {
  const steamId64Num = BigInt(steamId64);
  const accountId = Number(steamId64Num - BigInt('76561197960265728'));
  const universe = 1;
  const instance = accountId & 1;
  
  return `STEAM_${universe}:${instance}:${Math.floor(accountId / 2)}`;
}
