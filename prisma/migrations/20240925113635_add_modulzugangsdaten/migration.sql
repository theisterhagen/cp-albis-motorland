-- CreateTable
CREATE TABLE `ModulZugangsdaten` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apiLink` VARCHAR(191) NOT NULL,
    `benutzer` VARCHAR(191) NOT NULL,
    `passwort` VARCHAR(191) NOT NULL,
    `isCredentialsValid` BOOLEAN NULL,
    `modulAktivId` INTEGER NOT NULL,

    UNIQUE INDEX `ModulZugangsdaten_modulAktivId_key`(`modulAktivId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModulZugangsdaten` ADD CONSTRAINT `ModulZugangsdaten_modulAktivId_fkey` FOREIGN KEY (`modulAktivId`) REFERENCES `ModulAktiv`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
