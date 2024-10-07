-- CreateTable
CREATE TABLE `ShopifyOrders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `draftOrderId` VARCHAR(191) NOT NULL,
    `draftOrderName` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `orderName` VARCHAR(191) NULL,
    `antragnr` INTEGER NULL,

    UNIQUE INDEX `ShopifyOrders_draftOrderId_key`(`draftOrderId`),
    UNIQUE INDEX `ShopifyOrders_draftOrderName_key`(`draftOrderName`),
    UNIQUE INDEX `ShopifyOrders_orderId_key`(`orderId`),
    UNIQUE INDEX `ShopifyOrders_antragnr_key`(`antragnr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShopifyOrders` ADD CONSTRAINT `ShopifyOrders_antragnr_fkey` FOREIGN KEY (`antragnr`) REFERENCES `AntragDetails`(`antragnr`) ON DELETE SET NULL ON UPDATE CASCADE;
