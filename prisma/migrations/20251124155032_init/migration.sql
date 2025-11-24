-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `species` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `observation` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `observation` VARCHAR(191) NOT NULL,
    `petId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pets` ADD CONSTRAINT `Pets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
