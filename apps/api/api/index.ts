import express, { Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, generateToken, AuthRequest } from '../middleware/auth';
import { verifyTelegramData, telegramUserToDbUser } from '../utils/telegram';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/auth/register
 * Register or authenticate user via Telegram initData
 */
app.post('/api/auth/register', async (req: AuthRequest, res: Response) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      res.status(400).json({ error: 'initData is required' });
      return;
    }

    // Verify Telegram data
    const telegramUser = verifyTelegramData(initData);
    if (!telegramUser) {
      res.status(401).json({ error: 'Invalid Telegram data' });
      return;
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { telegramId: telegramUser.id },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          ...telegramUserToDbUser(telegramUser),
        },
      });
      console.log(`New user registered: ${user.id} (${user.telegramId})`);
    } else {
      // Update existing user with latest data
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...telegramUserToDbUser(telegramUser),
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.telegramId);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
        access: user.access,
        admin: user.admin,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/user/profile
 * Get current user profile
 */
app.get('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        telegramId: true,
        firstName: true,
        lastName: true,
        username: true,
        photoUrl: true,
        nickname: true,
        plt_login: true,
        plt_pass: true,
        access: true,
        admin: true,
        groupId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
app.put('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { nickname, plt_login, plt_pass } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(nickname && { nickname }),
        ...(plt_login && { plt_login }),
        ...(plt_pass && { plt_pass }),
      },
      select: {
        id: true,
        telegramId: true,
        firstName: true,
        lastName: true,
        username: true,
        photoUrl: true,
        nickname: true,
        plt_login: true,
        plt_pass: true,
        access: true,
        admin: true,
        groupId: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
app.post('/api/auth/verify', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        telegramId: true,
        access: true,
        admin: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      valid: true,
      user,
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * Error handler
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  });
}

export default app;
