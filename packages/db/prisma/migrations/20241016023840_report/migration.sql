/*
  Warnings:

  - Changed the type of `contentType` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "contentType",
ADD COLUMN     "contentType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ContentTypeForReport";
