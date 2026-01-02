-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "steamId64" TEXT NOT NULL,
    "steamId32" TEXT,
    "vanityUrl" TEXT,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "profileUrl" TEXT,
    "accountCreated" TIMESTAMP(3),
    "level" INTEGER,
    "yearsOfService" INTEGER,
    "isPrime" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "vacBanned" BOOLEAN NOT NULL DEFAULT false,
    "gameBanned" BOOLEAN NOT NULL DEFAULT false,
    "daysSinceLastBan" INTEGER,
    "inventoryValue" DOUBLE PRECISION,
    "inventoryPrivate" BOOLEAN NOT NULL DEFAULT false,
    "faceitElo" INTEGER,
    "faceitLevel" INTEGER,
    "premierRating" INTEGER,
    "leetifyRating" DOUBLE PRECISION,
    "riskScore" INTEGER,
    "riskFlags" JSONB,
    "lastCalculated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLookup" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lookupCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lookup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "kills" INTEGER,
    "deaths" INTEGER,
    "assists" INTEGER,
    "headshots" INTEGER,
    "mapName" TEXT,
    "won" BOOLEAN,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId64_key" ON "User"("steamId64");

-- CreateIndex
CREATE INDEX "User_steamId64_idx" ON "User"("steamId64");

-- CreateIndex
CREATE INDEX "User_riskScore_idx" ON "User"("riskScore");

-- CreateIndex
CREATE INDEX "User_lastLookup_idx" ON "User"("lastLookup");

-- CreateIndex
CREATE INDEX "Lookup_userId_idx" ON "Lookup"("userId");

-- CreateIndex
CREATE INDEX "Lookup_createdAt_idx" ON "Lookup"("createdAt");

-- CreateIndex
CREATE INDEX "Match_userId_idx" ON "Match"("userId");

-- CreateIndex
CREATE INDEX "Match_matchDate_idx" ON "Match"("matchDate");

-- CreateIndex
CREATE UNIQUE INDEX "Match_platform_matchId_key" ON "Match"("platform", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_key_key" ON "Stats"("key");

-- CreateIndex
CREATE INDEX "Stats_key_idx" ON "Stats"("key");

-- AddForeignKey
ALTER TABLE "Lookup" ADD CONSTRAINT "Lookup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
