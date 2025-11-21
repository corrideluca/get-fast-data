-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "userAgent" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "device" TEXT,
    "os" TEXT,
    "platform" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "timezone" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "windowWidth" INTEGER,
    "windowHeight" INTEGER,
    "colorDepth" INTEGER,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "firstVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT,
    "cookiesEnabled" BOOLEAN,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_ipAddress_idx" ON "User"("ipAddress");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");
