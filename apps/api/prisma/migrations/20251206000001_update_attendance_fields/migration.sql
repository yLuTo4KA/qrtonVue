-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "authorized",
DROP COLUMN "status",
ADD COLUMN "authStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "scanStatus" TEXT NOT NULL DEFAULT 'absent';
