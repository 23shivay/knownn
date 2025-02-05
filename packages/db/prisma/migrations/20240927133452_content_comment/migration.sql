/*
  Warnings:

  - You are about to drop the column `contentSuggestionId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "contentSuggestionId",
DROP COLUMN "file";

-- CreateTable
CREATE TABLE "contentComment" (
    "id" TEXT NOT NULL,
    "contentSuggestionId" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contentComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contentComment_createdAt_idx" ON "contentComment"("createdAt");

-- AddForeignKey
ALTER TABLE "contentComment" ADD CONSTRAINT "contentComment_contentSuggestionId_fkey" FOREIGN KEY ("contentSuggestionId") REFERENCES "contentSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
