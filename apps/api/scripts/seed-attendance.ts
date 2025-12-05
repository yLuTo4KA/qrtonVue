import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAttendance() {
  try {
    const groupId = 'cmit72fdq00012t6mkkd2ntxk';

    // Get all users in this group
    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId },
      include: { user: true },
    });

    if (groupMembers.length === 0) {
      console.log('No members found in this group');
      return;
    }

    console.log(`Found ${groupMembers.length} members in group`);

    // Create 5 days of attendance records (going back from today)
    const today = new Date();
    for (let daysAgo = 0; daysAgo < 5; daysAgo++) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(0, 0, 0, 0);

      // For each day, create records for some members
      for (let i = 0; i < groupMembers.length; i++) {
        const member = groupMembers[i];
        
        // Randomly decide if user attended (80% chance)
        if (Math.random() < 0.8) {
          // Randomly choose auth and scan statuses
          const authStatuses = ['authorized', 'pending', 'rejected'];
          const scanStatuses = ['scanned', 'manual', 'absent'];
          
          const authStatus = authStatuses[Math.floor(Math.random() * authStatuses.length)];
          const scanStatus = scanStatuses[Math.floor(Math.random() * scanStatuses.length)];

          try {
            await prisma.attendance.create({
              data: {
                userId: member.userId,
                groupId,
                date,
                authStatus,
                scanStatus,
              },
            });

            console.log(`✓ Created attendance: ${member.user.firstName} - ${date.toDateString()} - auth: ${authStatus}, scan: ${scanStatus}`);
          } catch (e) {
            const error = e as { code?: string };
            if (error.code === 'P2002') {
              console.log(`⊘ Attendance already exists for ${member.user.firstName} on ${date.toDateString()}`);
            }
          }
        }
      }
    }

    console.log('Attendance records created successfully!');
  } catch (error) {
    console.error('Error seeding attendance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAttendance();
