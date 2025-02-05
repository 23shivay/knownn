/*
  Warnings:

  - Changed the type of `voteType` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "voteType",
ADD COLUMN     "voteType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "VoteType";
