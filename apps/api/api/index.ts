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
      where: { telegramId: BigInt(telegramUser.id) },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          ...telegramUserToDbUser(telegramUser),
          telegramId: BigInt(telegramUser.id),
        },
      });
      console.log(`New user registered: ${user.id} (${user.telegramId})`);
    } else {
      // Update existing user with latest data
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...telegramUserToDbUser(telegramUser),
          telegramId: BigInt(telegramUser.id),
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, Number(user.telegramId));

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        telegramId: Number(user.telegramId),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
        nickname: user.nickname,
        plt_login: user.plt_login,
        plt_pass: user.plt_pass,
        device: user.device,
        access: user.access,
        admin: user.admin,
        groupId: user.groupId,
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
        device: true,
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

    res.json({
      ...user,
      telegramId: Number(user.telegramId),
    });
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
        ...(req.body.device && { device: req.body.device }),
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
        device: true,
        access: true,
        admin: true,
        groupId: true,
      },
    });

    res.json({
      ...user,
      telegramId: Number(user.telegramId),
    });
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
      user: {
        ...user,
        telegramId: Number(user.telegramId),
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /api/group/create
 * Create a new group (authenticated user becomes admin and member)
 */
app.post('/api/group/create', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({ error: 'Group title is required' });
      return;
    }

    // Create group with authenticated user as admin
    const group = await prisma.group.create({
      data: {
        title: title.trim(),
        adminId: req.userId,
      },
    });

    // Add creator as member
    await prisma.groupMember.create({
      data: {
        userId: req.userId,
        groupId: group.id,
        status: 'active',
      },
    });

    // Update user to set groupId
    await prisma.user.update({
      where: { id: req.userId },
      data: { groupId: group.id },
    });

    console.log(`New group created: ${group.id} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      group: {
        id: group.id,
        title: group.title,
        adminId: group.adminId,
        isActive: group.isActive,
      },
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

/**
 * GET /api/group/:groupId
 * Get group with all members and their details
 */
app.get('/api/group/:groupId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        groupMembers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    res.json({
      id: group.id,
      title: group.title,
      adminId: group.adminId,
      isActive: group.isActive,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      members: (group.groupMembers as any).map((m: any) => ({
        id: m.user.id,
        telegramId: Number(m.user.telegramId),
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        username: m.user.username,
        photoUrl: m.user.photoUrl,
        nickname: m.user.nickname,
        plt_login: m.user.plt_login,
        plt_pass: m.user.plt_pass,
        groupMemberStatus: m.status,
        joinedAt: m.joinedAt,
        isAdmin: group.adminId === m.userId,
      })),
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to get group' });
  }
});

/**
 * GET /api/groups
 * Get all available groups
 */
app.get('/api/groups', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const groups = await prisma.group.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        adminId: true,
        isActive: true,
        _count: {
          select: { groupMembers: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

/**
 * POST /api/group/join/:groupId
 * Join or change to a different group
 */
app.post('/api/group/join/:groupId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { groupId } = req.params;

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    // Get current user to find old group
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    // If user is in a different group, remove them from it
    if (currentUser?.groupId && currentUser.groupId !== groupId) {
      await prisma.groupMember.deleteMany({
        where: {
          userId: req.userId,
          groupId: currentUser.groupId
        }
      });
    }

    // Check if user is already a member of new group
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.userId,
          groupId: groupId
        }
      }
    });

    if (!existingMember) {
      // Add user as member
      await prisma.groupMember.create({
        data: {
          userId: req.userId,
          groupId: groupId,
          status: 'active'
        }
      });
    }

    // Update user's groupId
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { groupId: groupId }
    });

    console.log(`User ${req.userId} joined group ${groupId}`);

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        groupId: updatedUser.groupId
      }
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

/**
 * DELETE /api/group/:groupId/member/:userId
 * Remove member from group (admin only)
 */
app.delete('/api/group/:groupId/member/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { groupId, userId } = req.params;

    // Check if group exists and user is admin
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    // Check if requester is admin
    if (group.adminId !== req.userId) {
      res.status(403).json({ error: 'Only admin can remove members' });
      return;
    }

    // Cannot remove admin (except admin can remove self)
    if (group.adminId === userId && userId !== req.userId) {
      res.status(400).json({ error: 'Cannot remove admin' });
      return;
    }

    // Remove member from group
    await prisma.groupMember.deleteMany({
      where: {
        userId: userId,
        groupId: groupId
      }
    });

    // If removed user is the one being deleted, also update their groupId
    if (userId !== req.userId) {
      const memberCount = await prisma.groupMember.count({
        where: { userId: userId }
      });

      // If user has no more groups, clear their groupId
      if (memberCount === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { groupId: null }
        });
      }
    }

    console.log(`User ${userId} removed from group ${groupId} by ${req.userId}`);

    res.json({
      success: true,
      message: 'Member removed from group'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

/**
 * DELETE /api/group/:groupId
 * Delete group (admin only)
 */
app.delete('/api/group/:groupId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { groupId } = req.params;

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    // Get requester info to check admin status
    const requester = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!requester) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Check if requester is group admin or system admin
    const isGroupAdmin = group.adminId === req.userId;
    const isSystemAdmin = requester.admin;

    if (!isGroupAdmin && !isSystemAdmin) {
      res.status(403).json({ error: 'Only admin can delete group' });
      return;
    }

    // Get all members of the group to clear their groupId
    const members = await prisma.groupMember.findMany({
      where: { groupId: groupId },
      select: { userId: true }
    });

    // Clear groupId for all members
    await prisma.user.updateMany({
      where: {
        id: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          in: members.map((m: any) => m.userId)
        }
      },
      data: { groupId: null }
    });

    // Delete all group members
    await prisma.groupMember.deleteMany({
      where: { groupId: groupId }
    });

    // Delete all attendance records
    await prisma.attendance.deleteMany({
      where: { groupId: groupId }
    });

    // Delete the group
    await prisma.group.delete({
      where: { id: groupId }
    });

    console.log(`Group ${groupId} deleted by ${req.userId}`);

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

/**
 * GET /api/group/:groupId/attendance
 * Get last 5 attendance records for a group with all users who attended
 */
app.get('/api/group/:groupId/attendance', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get last 5 unique dates with attendance records
    // Use date range query to handle date comparison
    const attendanceDates = await prisma.attendance.findMany({
      where: { groupId },
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' },
      take: 5,
    });

    console.log('Found attendance dates:', attendanceDates);

    if (attendanceDates.length === 0) {
      res.json({
        groupId,
        attendance: [],
      });
      return;
    }

    // Convert dates to ISO date strings (YYYY-MM-DD) for comparison
    const dateStrings = attendanceDates.map((a: { date: Date }) => {
      const d = new Date(a.date);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    console.log('Date strings:', dateStrings);

    // Get all attendance records for those dates using raw query
    const attendance = await prisma.attendance.findMany({
      where: {
        groupId,
        date: {
          in: attendanceDates.map((a: { date: Date }) => a.date),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            photoUrl: true,
            nickname: true,
            plt_login: true,
            telegramId: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { user: { firstName: 'asc' } }],
    });

    console.log('Found attendance records:', attendance.length);

    // Group by date (YYYY-MM-DD format)
    interface GroupedRecord {
      id: string;
      userId: string;
      groupId: string;
      date: Date;
      authStatus: string;
      scanStatus: string;
      createdAt: Date;
      updatedAt: Date;
      user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        photoUrl: string | null;
        nickname: string | null;
        plt_login: string | null;
        telegramId: number;
      };
    }

    const grouped: Record<string, GroupedRecord[]> = {};
    attendance.forEach((record: GroupedRecord) => {
      const dateKey = new Date(record.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push({
        ...record,
        user: {
          ...record.user,
          telegramId: Number(record.user.telegramId),
        },
      });
    });

    res.json({
      groupId,
      attendance: Object.entries(grouped).map(([date, records]) => ({
        date,
        records,
      })),
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

/**
 * Error handler
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: express.Request, res: express.Response) => {
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
