import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Verify Telegram Web App initialization data
 * Returns decoded user data if valid, null otherwise
 */
export function verifyTelegramData(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      console.error('No hash provided');
      return null;
    }

    // Create a string of all query parameters except hash
    const dataCheckString = Array.from(params.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create HMAC SHA-256
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      console.error('Hash verification failed');
      return null;
    }

    // Check if auth_date is not too old (max 1 hour)
    const authDate = parseInt(params.get('auth_date') || '0', 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 3600) {
      console.error('Auth data too old');
      return null;
    }

    // Parse user data
    const userString = params.get('user');
    if (!userString) {
      console.error('No user data provided');
      return null;
    }

    const user = JSON.parse(userString) as TelegramUser;
    user.hash = hash;
    user.auth_date = authDate;

    return user;
  } catch (error) {
    console.error('Error verifying Telegram data:', error);
    return null;
  }
}

/**
 * Convert Telegram user to our User model format
 */
export function telegramUserToDbUser(telegramUser: TelegramUser) {
  return {
    telegramId: telegramUser.id,
    telegramHash: telegramUser.hash,
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name,
    username: telegramUser.username,
    photoUrl: telegramUser.photo_url,
    isBot: telegramUser.is_bot,
    languageCode: telegramUser.language_code,
    isPremium: telegramUser.is_premium || false,
  };
}
