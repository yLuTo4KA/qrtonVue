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
 * In development without TELEGRAM_BOT_TOKEN, uses test initData
 */
export function verifyTelegramData(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      console.error('No hash provided');
      return null;
    }

    // If development environment, use test initData
    if (process.env.NODE_ENV === 'development') {
      const devInitData = "user=%7B%22id%22%3A901201138%2C%22first_name%22%3A%22yLuTo4KA%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22yLuTo4KA%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FNRcF7ODzLkhMiuuu99PaYkZ4TekmkYZjyQiDSYDwFbc.svg%22%7D&chat_instance=6989095933885439821&chat_type=sender&auth_date=1764956942&signature=3JzPvaAigTH7ZjtTFinpTCQI33Z-Y8jXqKshmgQPw6FM3kzWU2zOOX_wm1wJld6D_KuWxT_LMPhtXuaeJbGcDQ&hash=f63e4ad98447d5186730a6f0fb46547d706a00c1ffcfd26c200b3566f1fb9ec3";
      // const devInitData = "user=%7B%22id%22%3A5905480332%2C%22first_name%22%3A%22Not%20now%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22ru%22%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FEqho1WzjOz510CFHPckZCq6fVpQ72m3-j4WtjLth7asoEx1J15M2I6-JvAkHuSbs.svg%22%7D&chat_instance=870526689705853426&chat_type=sender&auth_date=1764960114&signature=eMhSAvT60Sk1hYEMFEjRboPb4hCEemmgJ07moHrwxpZ2EyjcX1tftnD0GNZVttmKAxLyuxOq1H5NH84Mnp3aDg&hash=c82923cb50055a5058a88c26049a5ed2a25740c98852511d8a841b79c284aa49";
      const devParams = new URLSearchParams(devInitData);
      const userString = devParams.get('user');
      
      if (!userString) {
        console.error('Failed to parse dev user data');
        return null;
      }

      try {
        const user = JSON.parse(decodeURIComponent(userString)) as TelegramUser;
        user.hash = devParams.get('hash') || '';
        user.auth_date = parseInt(devParams.get('auth_date') || '0', 10);
        user.is_bot = false;
        return user;
      } catch (e) {
        console.error('Error parsing dev user:', e);
        return null;
      }
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
