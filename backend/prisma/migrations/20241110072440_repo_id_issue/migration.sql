/*
  Warnings:

  - Added the required column `repoId` to the `QueryHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QueryHistory" ADD COLUMN     "repoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QueryHistory" ADD CONSTRAINT "QueryHistory_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
