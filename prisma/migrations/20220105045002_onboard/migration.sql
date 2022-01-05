/*
  Warnings:

  - The primary key for the `Onboard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Onboard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Onboard` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`email`);
