-- AlterTable
ALTER TABLE "User" ADD COLUMN     "altitude" DOUBLE PRECISION,
ADD COLUMN     "clipboardPermission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fileSystemPermission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "geolocationAccuracy" DOUBLE PRECISION,
ADD COLUMN     "geolocationPermission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heading" DOUBLE PRECISION,
ADD COLUMN     "notificationPermission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissionsRawData" TEXT,
ADD COLUMN     "preciseLatitude" DOUBLE PRECISION,
ADD COLUMN     "preciseLongitude" DOUBLE PRECISION,
ADD COLUMN     "speed" DOUBLE PRECISION,
ADD COLUMN     "webrtcIPs" TEXT;
