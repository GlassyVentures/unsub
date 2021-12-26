/*
  Warnings:

  - You are about to drop the column `expired` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expires` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` DROP COLUMN `expired`,
    ADD COLUMN `expires` DATETIME(3) NOT NULL;
