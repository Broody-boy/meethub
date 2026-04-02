/*
  Warnings:

  - You are about to drop the column `startTime` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `startedAt` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "startTime",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
