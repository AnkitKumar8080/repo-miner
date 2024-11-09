-- DropForeignKey
ALTER TABLE "Mine" DROP CONSTRAINT "Mine_userId_fkey";

-- DropForeignKey
ALTER TABLE "QueryHistory" DROP CONSTRAINT "QueryHistory_mineId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_mineId_fkey";

-- AddForeignKey
ALTER TABLE "Mine" ADD CONSTRAINT "Mine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_mineId_fkey" FOREIGN KEY ("mineId") REFERENCES "Mine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryHistory" ADD CONSTRAINT "QueryHistory_mineId_fkey" FOREIGN KEY ("mineId") REFERENCES "Mine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
