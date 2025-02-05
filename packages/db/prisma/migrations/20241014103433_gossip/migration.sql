/*
  Warnings:

  - You are about to drop the column `shitCount` on the `Gossip` table. All the data in the column will be lost.
  - You are about to drop the column `shockCount` on the `Gossip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gossip" DROP COLUMN "shitCount",
DROP COLUMN "shockCount",
ADD COLUMN     "dislikeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;
