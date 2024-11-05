-- AlterTable
ALTER TABLE "Repository" ALTER COLUMN "repositoryStatus" DROP NOT NULL,
ALTER COLUMN "repositoryStatus" SET DEFAULT 'CLONING';
