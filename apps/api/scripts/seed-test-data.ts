import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define status messages
const authStatusMessages = [
  'Авторизация: Авторизация прошла успешно',
  'Авторизация: Ожидание одобрения',
  'Авторизация: Авторизация отклонена',
];

const scanStatusMessages = [
  'Сканирование: Сканирование прошло успешно',
  'Сканирование: Ручная отметка',
  'Сканирование: Отсутствует',
];

function getRandomAuthStatus() {
  return authStatusMessages[Math.floor(Math.random() * authStatusMessages.length)];
}

function getRandomScanStatus() {
  return scanStatusMessages[Math.floor(Math.random() * scanStatusMessages.length)];
}

async function seedTestData() {
  try {
    console.log('🌱 Starting test data seeding...\n');

    // 1. Create test users
    console.log('👥 Creating test users...');
    const users = await Promise.all([
      prisma.user.upsert({
        where: { telegramId: BigInt(5905480332) },
        update: {
          firstName: 'Admin',
          lastName: 'User',
          username: 'admin_user',
          admin: true,
        },
        create: {
          telegramId: BigInt(5905480332),
          telegramHash: 'test_hash_1',
          firstName: 'Admin',
          lastName: 'User',
          username: 'admin_user',
          admin: true,
          access: true,
        },
      }),
      prisma.user.upsert({
        where: { telegramId: BigInt(123456789) },
        update: {},
        create: {
          telegramId: BigInt(123456789),
          telegramHash: 'test_hash_2',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          access: true,
        },
      }),
      prisma.user.upsert({
        where: { telegramId: BigInt(987654321) },
        update: {},
        create: {
          telegramId: BigInt(987654321),
          telegramHash: 'test_hash_3',
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          access: true,
        },
      }),
      prisma.user.upsert({
        where: { telegramId: BigInt(456789123) },
        update: {},
        create: {
          telegramId: BigInt(456789123),
          telegramHash: 'test_hash_4',
          firstName: 'Bob',
          lastName: 'Johnson',
          username: 'bobjohnson',
          access: true,
        },
      }),
      prisma.user.upsert({
        where: { telegramId: BigInt(321654987) },
        update: {},
        create: {
          telegramId: BigInt(321654987),
          telegramHash: 'test_hash_5',
          firstName: 'Alice',
          lastName: 'Williams',
          username: 'alicewilliams',
          access: true,
        },
      }),
    ]);

    console.log(`✓ Created ${users.length} users\n`);

    // 2. Create test group
    console.log('👥 Creating test group...');
    const group = await prisma.group.upsert({
      where: { id: 'cmit72fdq00012t6mkkd2ntxk' },
      update: {
        title: 'Test Group',
        isActive: true,
      },
      create: {
        id: 'cmit72fdq00012t6mkkd2ntxk',
        title: 'Test Group',
        adminId: users[0].id, // Admin user
        isActive: true,
      },
    });

    console.log(`✓ Created group: ${group.title}\n`);

    // 3. Add users to group as members
    console.log('👥 Adding users to group...');
    const groupMembers = await Promise.all(
      users.map((user, index) =>
        prisma.groupMember.upsert({
          where: {
            userId_groupId: {
              userId: user.id,
              groupId: group.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            groupId: group.id,
            status: 'approved',
          },
        })
      )
    );

    console.log(`✓ Added ${groupMembers.length} members to group\n`);

    // 4. Update users' groupId
    console.log('📝 Updating user group assignments...');
    await Promise.all(
      users.map(user =>
        prisma.user.update({
          where: { id: user.id },
          data: { groupId: group.id },
        })
      )
    );
    console.log(`✓ Updated ${users.length} users with groupId\n`);

    // 5. Create attendance records
    console.log('📅 Creating attendance records...');
    const attendanceRecords = [];
    const today = new Date();

    // Create 5 days of attendance records
    for (let daysAgo = 0; daysAgo < 5; daysAgo++) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(0, 0, 0, 0);

      // For each day, create records for all users
      for (const user of users) {
        const authStatus = getRandomAuthStatus();
        const scanStatus = getRandomScanStatus();

        try {
          const record = await prisma.attendance.upsert({
            where: {
              userId_groupId_date: {
                userId: user.id,
                groupId: group.id,
                date,
              },
            },
            update: {
              authStatus,
              scanStatus,
            },
            create: {
              userId: user.id,
              groupId: group.id,
              date,
              authStatus,
              scanStatus,
            },
          });

          attendanceRecords.push(record);
          console.log(
            `  ✓ ${user.firstName} - ${date.toDateString()}`
          );
        } catch (err) {
          console.log(`  ⊘ Record already exists for ${user.firstName} on ${date.toDateString()}`);
        }
      }
    }

    console.log(`\n✓ Created ${attendanceRecords.length} attendance records\n`);
    console.log('🎉 Test data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
