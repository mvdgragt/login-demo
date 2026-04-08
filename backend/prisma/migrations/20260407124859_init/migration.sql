/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postalcode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `code` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WAITER', 'RUNNER', 'HEAD_WAITER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "admin",
DROP COLUMN "city",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "postalcode",
DROP COLUMN "updatedAt",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'WAITER';
