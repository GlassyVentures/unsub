-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `originEmail` BOOLEAN NOT NULL DEFAULT false,
    `userEmail` VARCHAR(191) NOT NULL,
    `unsubscribe` VARCHAR(191) NOT NULL,
    `unsubscribed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
