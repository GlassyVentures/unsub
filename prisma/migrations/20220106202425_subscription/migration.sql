/*
  Warnings:

  - You are about to alter the column `originEmail` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - The required column `batchId` was added to the `Subscription` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `batchId` VARCHAR(191) NOT NULL,
    MODIFY `originEmail` VARCHAR(191) NOT NULL;
