-- CreateTable
CREATE TABLE `ModulAktiv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `isModulAktiv` BOOLEAN NOT NULL,

    UNIQUE INDEX `ModulAktiv_shop_key`(`shop`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
