-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_organizationName_fkey";

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_organizationName_fkey" FOREIGN KEY ("organizationName") REFERENCES "Organization"("name") ON DELETE CASCADE ON UPDATE CASCADE;
