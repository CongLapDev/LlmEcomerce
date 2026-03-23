-- Ensure dashboard-relevant timestamps are initialized consistently.
SET @has_created_at = (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'user'
	  AND COLUMN_NAME = 'created_at'
);

SET @ddl_user = IF(
	@has_created_at = 0,
	'ALTER TABLE `user` ADD COLUMN `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6)',
	'ALTER TABLE `user` MODIFY COLUMN `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6)'
);

PREPARE stmt_user FROM @ddl_user;
EXECUTE stmt_user;
DEALLOCATE PREPARE stmt_user;

ALTER TABLE `user`
	MODIFY COLUMN `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6);

ALTER TABLE `shop_order`
	MODIFY COLUMN `order_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill invalid historical values used by local testing datasets.
UPDATE `user`
SET `created_at` = NOW(6)
WHERE `created_at` IS NULL
   OR `created_at` < '2000-01-01';

UPDATE `shop_order`
SET `order_date` = NOW()
WHERE `order_date` IS NULL
   OR `order_date` < '2000-01-01';

SET @has_product_created_at = (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'product'
	  AND COLUMN_NAME = 'created_at'
);

SET @ddl_product = IF(
	@has_product_created_at = 0,
	'ALTER TABLE `product` ADD COLUMN `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6)',
	'ALTER TABLE `product` MODIFY COLUMN `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6)'
);

PREPARE stmt_product FROM @ddl_product;
EXECUTE stmt_product;
DEALLOCATE PREPARE stmt_product;

UPDATE `product`
SET `created_at` = NOW(6)
WHERE `created_at` IS NULL
   OR `created_at` < '2000-01-01';

SET @has_warehouse_status = (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'warehouse'
	  AND COLUMN_NAME = 'status'
);

SET @ddl_warehouse_status = IF(
	@has_warehouse_status = 0,
	'ALTER TABLE `warehouse` ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT ''OPERATIONAL''',
	'SELECT 1'
);

PREPARE stmt_warehouse_status FROM @ddl_warehouse_status;
EXECUTE stmt_warehouse_status;
DEALLOCATE PREPARE stmt_warehouse_status;

SET @has_warehouse_capacity = (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'warehouse'
	  AND COLUMN_NAME = 'max_capacity'
);

SET @ddl_warehouse_capacity = IF(
	@has_warehouse_capacity = 0,
	'ALTER TABLE `warehouse` ADD COLUMN `max_capacity` INT NULL',
	'SELECT 1'
);

PREPARE stmt_warehouse_capacity FROM @ddl_warehouse_capacity;
EXECUTE stmt_warehouse_capacity;
DEALLOCATE PREPARE stmt_warehouse_capacity;

SET @has_warehouse_manual_override = (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'warehouse'
	  AND COLUMN_NAME = 'status_manual_override'
);

SET @ddl_warehouse_manual_override = IF(
	@has_warehouse_manual_override = 0,
	'ALTER TABLE `warehouse` ADD COLUMN `status_manual_override` TINYINT(1) NOT NULL DEFAULT 0',
	'SELECT 1'
);

PREPARE stmt_warehouse_manual_override FROM @ddl_warehouse_manual_override;
EXECUTE stmt_warehouse_manual_override;
DEALLOCATE PREPARE stmt_warehouse_manual_override;

UPDATE `warehouse`
SET `status` = 'OPERATIONAL'
WHERE `status` IS NULL
   OR `status` = '';

UPDATE `warehouse`
SET `status_manual_override` = 0
WHERE `status_manual_override` IS NULL;

SET @has_product_status = (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'product'
	  AND COLUMN_NAME = 'status'
);

SET @ddl_product_status = IF(
	@has_product_status = 0,
	'ALTER TABLE `product` ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT ''AVAILABLE''',
	'SELECT 1'
);

PREPARE stmt_product_status FROM @ddl_product_status;
EXECUTE stmt_product_status;
DEALLOCATE PREPARE stmt_product_status;

UPDATE `product`
SET `status` = 'AVAILABLE'
WHERE `status` IS NULL
   OR `status` = '';
