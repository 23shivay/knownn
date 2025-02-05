/*
  Warnings:

  - You are about to drop the `ContentComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentSuggestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_chatRoomName_fkey";

-- DropForeignKey
ALTER TABLE "ContentComment" DROP CONSTRAINT "ContentComment_contentSuggestionId_fkey";

-- DropForeignKey
ALTER TABLE "ContentSuggestion" DROP CONSTRAINT "ContentSuggestion_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "contentSuggestionId" TEXT,
ALTER COLUMN "chatRoomName" DROP NOT NULL;

-- DropTable
DROP TABLE "ContentComment";

-- DropTable
DROP TABLE "ContentSuggestion";

-- CreateTable
CREATE TABLE "contentSuggestion" (
    "id" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "genre" TEXT NOT NULL,
    "contentName" TEXT NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "contentSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contentSuggestion_contentName_key" ON "contentSuggestion"("contentName");

-- CreateIndex
CREATE INDEX "contentSuggestion_createdAt_idx" ON "contentSuggestion"("createdAt");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_chatRoomName_fkey" FOREIGN KEY ("chatRoomName") REFERENCES "ChatRoom"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_contentSuggestionId_fkey" FOREIGN KEY ("contentSuggestionId") REFERENCES "contentSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contentSuggestion" ADD CONSTRAINT "contentSuggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
