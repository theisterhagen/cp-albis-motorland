-- CreateTable
CREATE TABLE `ModulEinstellungen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vertragsart` VARCHAR(191) NOT NULL,
    `restwertInBeiTAVertrag` BOOLEAN NULL,
    `produktgruppe` VARCHAR(191) NOT NULL,
    `produktgruppeLabel` VARCHAR(191) NOT NULL,
    `zahlungsweisen` VARCHAR(191) NOT NULL,
    `auswahlZahlungsweiseAnzeigen` BOOLEAN NOT NULL,
    `minLeasingsumme` VARCHAR(191) NOT NULL,
    `servicePauschaleNetto` VARCHAR(191) NOT NULL,
    `albisServiceGebuhrNetto` VARCHAR(191) NOT NULL,
    `provisionsangabe` VARCHAR(191) NOT NULL,
    `objektVersicherung` BOOLEAN NOT NULL,
    `auswahlObjektVersicherungAnzeigen` BOOLEAN NOT NULL,
    `mietsonderzahlung` VARCHAR(191) NOT NULL,
    `eingabeSonderzahlungErmoglichen` BOOLEAN NOT NULL,
    `pInfoseiteZeigeAlle` BOOLEAN NOT NULL,
    `antragOhneArtikelMoglich` BOOLEAN NOT NULL,
    `kundeKannFinanzierungsbetragAndern` BOOLEAN NOT NULL,
    `zugangsdatenId` INTEGER NOT NULL,

    UNIQUE INDEX `ModulEinstellungen_zugangsdatenId_key`(`zugangsdatenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModulEinstellungen` ADD CONSTRAINT `ModulEinstellungen_zugangsdatenId_fkey` FOREIGN KEY (`zugangsdatenId`) REFERENCES `ModulZugangsdaten`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
