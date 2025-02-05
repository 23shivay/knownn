-- CreateTable
CREATE TABLE "Gossip" (
    "id" TEXT NOT NULL,
    "contentName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "intrestingCount" INTEGER NOT NULL DEFAULT 0,
    "shitCount" INTEGER NOT NULL DEFAULT 0,
    "shockCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationName" TEXT NOT NULL,

    CONSTRAINT "Gossip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gossipComment" (
    "id" TEXT NOT NULL,
    "gossipId" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gossipComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gossip_contentName_key" ON "Gossip"("contentName");

-- CreateIndex
CREATE INDEX "Gossip_createdAt_idx" ON "Gossip"("createdAt");

-- CreateIndex
CREATE INDEX "gossipComment_createdAt_idx" ON "gossipComment"("createdAt");

-- AddForeignKey
ALTER TABLE "Gossip" ADD CONSTRAINT "Gossip_organizationName_fkey" FOREIGN KEY ("organizationName") REFERENCES "Organization"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gossipComment" ADD CONSTRAINT "gossipComment_gossipId_fkey" FOREIGN KEY ("gossipId") REFERENCES "Gossip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
