-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('like', 'dislike');

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_sessionId_contentId_key" ON "Vote"("sessionId", "contentId");
