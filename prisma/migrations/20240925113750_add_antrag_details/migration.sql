-- CreateTable
CREATE TABLE `AntragDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `antragnr` INTEGER NOT NULL,
    `complete` BOOLEAN NOT NULL,
    `status` INTEGER NOT NULL,
    `status_txt` VARCHAR(191) NOT NULL,
    `kaufpreis` DOUBLE NOT NULL,
    `eingegangen` VARCHAR(191) NOT NULL,
    `ln_name` VARCHAR(191) NOT NULL,
    `ln_telefon` VARCHAR(191) NULL,
    `ln_mobil` VARCHAR(191) NULL,
    `ln_email` VARCHAR(191) NOT NULL,
    `gf_name` VARCHAR(191) NOT NULL,
    `gf_vname` VARCHAR(191) NOT NULL,
    `lastCheckAt` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AntragDetails_antragnr_key`(`antragnr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
