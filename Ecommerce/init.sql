-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: WebServices
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `AccountStatisticsView`
--

DROP TABLE IF EXISTS `AccountStatisticsView`;
/*!50001 DROP VIEW IF EXISTS `AccountStatisticsView`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `AccountStatisticsView` AS SELECT 
 1 AS `total_accounts`,
 1 AS `total_status_1`,
 1 AS `total_status_2`,
 1 AS `total_status_3`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `MostOrderedPdView`
--

DROP TABLE IF EXISTS `MostOrderedPdView`;
/*!50001 DROP VIEW IF EXISTS `MostOrderedPdView`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `MostOrderedPdView` AS SELECT 
 1 AS `id`,
 1 AS `category_id`,
 1 AS `description`,
 1 AS `manufacturer`,
 1 AS `name`,
 1 AS `picture`,
 1 AS `total`,
 1 AS `product_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `provider` tinyint DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_h6dr47em6vg85yuwt4e2roca4` (`user_id`),
  CONSTRAINT `FK7m8ru44m93ukyb61dfxw0apf6` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `account_chk_1` CHECK ((`provider` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'$2a$10$6.whu5cuIROjRzkKbwcD3.QehjULPLVE32dgWxy3DoqQ04GREajiq',0,1,'111111',1),(2,'$2a$10$aOFi/jAnzw8S9EoyU3ziCeWjenZu8hhNhEzHq9xXzu3E/2uDuF/TS',0,1,'adminn',2);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_role`
--

DROP TABLE IF EXISTS `account_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_role` (
  `account_id` int NOT NULL,
  `role_id` int NOT NULL,
  KEY `FKrs2s3m3039h0xt8d5yhwbuyam` (`role_id`),
  KEY `FK1f8y4iy71kb1arff79s71j0dh` (`account_id`),
  CONSTRAINT `FK1f8y4iy71kb1arff79s71j0dh` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FKrs2s3m3039h0xt8d5yhwbuyam` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_role`
--

LOCK TABLES `account_role` WRITE;
/*!40000 ALTER TABLE `account_role` DISABLE KEYS */;
INSERT INTO `account_role` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `account_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accountstatisticsview`
--

DROP TABLE IF EXISTS `accountstatisticsview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountstatisticsview` (
  `total_accounts` bigint NOT NULL,
  `total_status_1` decimal(22,0) DEFAULT NULL,
  `total_status_2` decimal(22,0) DEFAULT NULL,
  `total_status_3` decimal(22,0) DEFAULT NULL,
  PRIMARY KEY (`total_accounts`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountstatisticsview`
--

LOCK TABLES `accountstatisticsview` WRITE;
/*!40000 ALTER TABLE `accountstatisticsview` DISABLE KEYS */;
/*!40000 ALTER TABLE `accountstatisticsview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address_line_1` varchar(45) DEFAULT NULL,
  `address_line_2` varchar(45) DEFAULT NULL,
  `building` varchar(45) DEFAULT NULL,
  `business_address` tinyint DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `region` varchar(45) DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe54x81nmccsk5569hsjg1a6ka` (`country_id`),
  CONSTRAINT `FKe54x81nmccsk5569hsjg1a6ka` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'No 15, alley 60, Chua Boc Street, Dong Da',NULL,'bbbb',NULL,'Hanoi','100000','Thành phố Hà Nội',2);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qty` int DEFAULT NULL,
  `product_item_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj46f52s31n4pbpgucd6x2ci46` (`product_item_id`),
  KEY `FKjnaj4sjyqjkr4ivemf9gb25w` (`user_id`),
  CONSTRAINT `FKj46f52s31n4pbpgucd6x2ci46` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`id`),
  CONSTRAINT `FKjnaj4sjyqjkr4ivemf9gb25w` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `cart_item_chk_1` CHECK ((`qty` >= 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `parent_category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs2ride9gvilxy2tcuv7witnxc` (`parent_category_id`),
  CONSTRAINT `FKs2ride9gvilxy2tcuv7witnxc` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'This is root category! Don\'t add anything','root',NULL),(2,'Collection of laptop devices','Laptop',1),(3,'Collection of smartphone devices','Smartphone',1),(4,'Collection of software devices','Software',1),(5,'Collection of speaker devices','Speaker',1),(6,'Collection of display devices','Display',1),(7,'Collection of Accessories','Accessories',1),(8,'APPLE laptops (MACBOOK)','Apple',2),(9,'Acer laptops','Acer',2),(10,'HP laptops','HP',2),(11,'DELL laptops','DELL',2),(12,'iPhone','Apple',3),(13,'Galaxy phones','Samsung',3),(14,'Xiaomi phones','Xiaomi',3),(15,'Oppo phones','Oppo',3),(16,'Sony phones','Sony',3),(17,'Sony speakers','Sony',5),(18,'Speakers','JBL',5),(19,'Laptop LENOVO','Lenovo',2),(20,'Microsoft Softwares','Microsoft',4),(21,'Autodesk Softwares','Autodesk',4),(22,'Capcut Pro Account','Capcut',4),(23,'Canva Account','Canva',4),(24,'Speakers','Edifier',5),(25,'Display','Asus',6),(26,'Display','LG',6),(27,'Display','Samsung',6),(28,'Apple Accessories','Apple',7),(29,'Logitech Accessories','Logitech',7),(30,'MSI Accessories','MSI',7);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `rate` tinyint DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm1rmnfcvq5mk26li4lit88pc5` (`product_id`),
  KEY `FK8kcum44fvpupyw6f5baccx25c` (`user_id`),
  CONSTRAINT `FK8kcum44fvpupyw6f5baccx25c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKm1rmnfcvq5mk26li4lit88pc5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'Viet Name'),(2,NULL),(3,'China'),(4,'Viet Name'),(5,'USA'),(6,'China');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_line`
--

DROP TABLE IF EXISTS `order_line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_line` (
  `id` int NOT NULL,
  `qty` int DEFAULT NULL,
  `total` decimal(18,9) DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `product_item_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbjk762ct6wq2bwsibfd2khc6m` (`order_id`),
  KEY `FKa8w7lfrwdh7muehfgi8tvek4q` (`product_item_id`),
  CONSTRAINT `FKa8w7lfrwdh7muehfgi8tvek4q` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`id`),
  CONSTRAINT `FKbjk762ct6wq2bwsibfd2khc6m` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`),
  CONSTRAINT `order_line_chk_1` CHECK ((`total` >= 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_line`
--

LOCK TABLES `order_line` WRITE;
/*!40000 ALTER TABLE `order_line` DISABLE KEYS */;
INSERT INTO `order_line` VALUES (1,1,46890000.000000000,1,6),(2,1,26900000.000000000,2,2),(52,1,17490000.000000000,3,4),(102,1,25900000.000000000,7,1),(152,1,17493000.000000000,8,3);
/*!40000 ALTER TABLE `order_line` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_line_seq`
--

DROP TABLE IF EXISTS `order_line_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_line_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_line_seq`
--

LOCK TABLES `order_line_seq` WRITE;
/*!40000 ALTER TABLE `order_line_seq` DISABLE KEYS */;
INSERT INTO `order_line_seq` VALUES (251);
/*!40000 ALTER TABLE `order_line_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `provider` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'COD','DEFAULT'),(2,'ZaloPay','ZaloPay');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `provider` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,'COD','NONE');
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `manufacturer` varchar(512) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `picture` varchar(512) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,8,'Loại card đồ họa	\nGPU 8 lõi\nNeural Engine 16 lõi\nCông nghệ dò tia tốc độ cao bằng phần cứng\nBăng thông bộ nhớ 120GB/s\n\nDung lượng RAM	\n16GB\n\nỔ cứng	\n256GB\n\nKích thước màn hình	\n13.6 inches\n\nCông nghệ màn hình	\nMàn hình Liquid Retina\nCó đèn nền LED\nMật độ 224 pixel mỗi inch\nĐộ sáng 500 nit\nHỗ trợ một tỷ màu\nDải màu rộng (P3)\nCông nghệ True Tone\n\nPin	\nThời gian xem video trực tuyến lên đến 18 giờ\nThời gian duyệt web trên mạng không dây lên đến 15 giờ\nPin Li-Po 53.8 watt‑giờ tích hợp\n\nHệ điều hành	\nmacOS\n\nĐộ phân giải màn hình	\n2560 x 1664 pixels\n\nLoại CPU	\nCPU 10 lõi với 4 lõi hiệu năng và 6 lõi tiết kiệm điện\n\nCổng giao tiếp	\nCổng sạc MagSafe 3\nJack cắm tai nghe 3.5 mm\nHai cổng Thunderbolt 4 (USB-C) hỗ trợ: Sạc / DisplayPort / Thunderbolt 4 (lên đến 40Gb/s) / USB 4 (lên đến 40Gb/s)','Apple','MacBook Air M4 13 inch 2025','/uploads/1aee377c-b8bd-4ee4-97d3-a6a6db654983.webp','2026-03-21 19:35:15.403452','AVAILABLE'),(2,8,'Loại card đồ họa	\n8 nhân GPU, 16 nhân Neural Engine\n\nDung lượng RAM	\n16GB\n\nỔ cứng	\n256GB\n\nKích thước màn hình	\n13.6 inches\n\nCông nghệ màn hình	\nLiquid Retina Display\n\nPin	\n52,6 Wh\n\nHệ điều hành	\nMacOS\n\nĐộ phân giải màn hình	\n2560 x 1664 pixels\n\nLoại CPU	\nApple M2 8 nhân\n\nCổng giao tiếp	\n2 x Thunderbolt 3\nJack tai nghe 3.5 mm\nMagSafe 3','Apple','Apple MacBook Air M2 2024','/uploads/1aec58df-5177-47ac-a0a7-e82f24bcbe6b.webp','2026-03-21 19:35:15.403452','AVAILABLE'),(3,8,'Chip AI	\nApple Intelligence\n\nLoại card đồ họa	\nGPU 10 lõi\nNeural Engine 16 lõi\n\nDung lượng RAM	\n16GB\n\nỔ cứng	\n512GB\n\nKích thước màn hình	\n14.2 inches\n\nCông nghệ màn hình	\nLiquid Retina XDR\nTỷ lệ tương phản 1.000.000:1\nĐộ sáng XDR 1.000 nit toàn màn hình, độ sáng đỉnh 1.600 nit (chỉ nội dung HDR)\nĐộ sáng SDR 1.000 nit (ngoài trời)\n1 tỷ màu\nDải màu rộng (P3)\nCông nghệ True Tone\nCông nghệ ProMotion\n\nPin	\nThời gian xem video trực tuyến lên đến 24 giờ\nThời gian duyệt web trên mạng không dây lên đến 16 giờ\nPin Li-Po 72.4 watt-giờ\n\nHệ điều hành	\nmacOS\n\nĐộ phân giải màn hình	\n3024 x 1964 pixels\n\nLoại CPU	\nChip Apple M5 10 lõi với 4 lõi hiệu năng và 6 lõi tiết kiệm điện\n\nCổng giao tiếp	\nKhe thẻ nhớ SDXC\nCổng HDMI\nJack cắm tai nghe 3.5 mm\nCổng MagSafe 3\nBa cổng Thunderbolt 4 (USB‑C) hỗ trợ: Sạc / DisplayPort / Thunderbolt 4 (lên đến 40Gb/s) / USB 4 (lên đến 40Gb/s)','Apple','MacBook Pro 14 M5','/uploads/8fcd9daa-0c1e-4e41-bd82-3657680a8264.webp','2026-03-21 19:35:15.403452',NULL),(4,8,'Loại card đồ họa	\nGPU 10 lõi\n\nDung lượng RAM	\n16GB\n\nỔ cứng	\n256GB\n\nCông nghệ màn hình	\nHỗ trợ đồng thời đến ba màn hình\nĐầu ra video kỹ thuật số Thunderbolt 4\n\nHệ điều hành	\nmacOS\n\nLoại CPU	\nApple M4 10 lõi với 4 lõi hiệu năng và 6 lõi tiết kiệm điện\nNeural Engine 16 lõi\n\nCổng giao tiếp	\nMặt trước:\nHai cổng USB‑C hỗ trợ cho USB 3 (lên đến 10Gb/s)\nJack cắm tai nghe 3,5 mm\nMặt sau (M4):\nCổng Gigabit Ethernet (có thể lựa chọn cấu hình Ethernet 10Gb)\nCổng HDMI\nThunderbolt 4 (lên đến 40Gb/s)\nUSB 4 (lên đến 40Gb/s)','Apple','Mac mini M4 2024','/uploads/68129f59-cef0-492a-a463-bff4d006fe7f.webp','2026-03-21 19:35:15.403452',NULL),(6,8,'iMac M4 2024 24 inch 16GB 256GB là sản phẩm iMac mới nhất từ Apple, được trang bị chip Apple M4 tiên tiến với CPU 8 nhân và GPU 8 nhân, hiệu năng vượt trội. iMac M4 2024 được trang bị 16GB RAM, xử lý hiệu quả, mượt mà ngay cả các ứng dụng đồ họa nặng. Bộ nhớ SSD 256GB cung cấp dung lượng lưu trữ đáng kể, truy cập và khởi động ứng dụng nhanh chóng. Màn hình Retina 4.5K 24 inch với dải màu P3 và công nghệ True Tone đem đến trải nghiệm hình ảnh sống động và chân thực.','Apple','iMac M4 2024','/uploads/d5efbe4a-8d13-460d-a98e-1605bb975e9e.webp','2026-03-21 19:35:15.403452',NULL),(7,9,'Acer Aspire Go 14 AI AG14-71M-52LH là dòng laptop AI mỏng nhẹ giá tốt có thiết kế siêu di động cùng bộ vi xử lý Intel Core Ultra thông minh. Aspire Go đảm bảo đáp ứng tốt nhu cầu học tập, làm việc hàng ngày lẫn vui chơi giải trí cơ bản, thích hợp cho học sinh, sinh viên hay nhân viên văn phòng.','Acer','Laptop Acer Aspire Go 14 AI AG14-71M-52LH','/uploads/83a605ca-9946-4543-be21-ac38412c5911.webp','2026-03-21 19:35:15.403452',NULL),(8,9,'Laptop Acer Gaming Nitro V 15 ProPanel ANV15-41-R7CR sở hữu cấu hình mạnh mẽ với CPU AMD Ryzen 5 7535HS và card đồ họa NVIDIA GeForce RTX 4050 6GB GDDR6. Màn hình 15.6 inch FHD IPS và tần số quét 180Hz đem lại hình ảnh sắc nét. Ổ cứng 512GB PCIe NVMe SSD và RAM 16GB DDR5, với hệ thống tản nhiệt Dual-fan đảm bảo hiệu suất tối ưu.','Acer','Laptop Gaming Acer Nitro V 15 ProPanel','/uploads/3bce420f-a536-4bd6-a50d-575fa888e5db.webp','2026-03-21 19:35:15.403452',NULL),(9,9,'Laptop Acer Aspire Lite 15 AL15-41P-R3U5 với chip AMD Ryzen 7 5700U và AMD Radeon Graphics cung cấp khả năng xử lý mượt mà cho các tác vụ văn phòng. Mẫu laptop Acer Aspire này còn được trang bị tới 16GB RAM để người dùng thoải sức thực hiện đa nhiệm. Vẻ ngoài thanh lịch, mỏng nhẹ giúp laptop phù hợp sử dụng trong nhiều không gian.','Acer','Laptop Acer Aspire Lite 15','/uploads/a6e26dfa-9448-45b0-b88b-6a364dc80b12.webp','2026-03-21 19:35:15.403452',NULL),(10,9,'Laptop Acer Gaming Nitro Lite 16 NL16-71G-71UJ sở hữu CPU Intel Core i7-13620H mạnh mẽ, hỗ trợ xử lý nhanh mọi tác vụ từ chơi game đến thiết kế đồ họa. RAM DDR5 tốc độ cao nâng khả năng đa nhiệm, giúp khách hàng chuyển đổi mượt mà giữa các ứng dụng. Mẫu laptop Acer Nitro này còn được tích hợp VGA RTX 3050 để mang đến chất lượng hình ảnh sống động, sắc nét.','Acer','Laptop Acer Gaming Nitro Lite 16','/uploads/18b13d9a-5d4a-4f0a-b6c0-42f93acef5a5.webp','2026-03-21 19:35:15.403452',NULL),(11,9,'Laptop Acer Swift Lite 14 AI SFL14-51M-56HS mang đến hiệu suất mạnh mẽ với vi xử lý Intel Core Ultra 5-125U, RAM 16GB DDR5 và ổ cứng 512GB PCIe NVMe SSD. Laptop sở hữu màn hình 14 inch FHD+ với tỉ lệ 16:10, độ sáng 300 nits và công nghệ Acer ComfyView cho trải nghiệm hình ảnh sống động. Thiết bị cũng được tích hợp công nghệ Wi-Fi 6, cùng thời lượng pin 58Whr hỗ trợ sạc nhanh qua PD Type-C Adapter. ','Acer','Laptop Acer Swift Lite 14 AI','/uploads/551ad9b2-f9aa-4d7d-ab19-2d0d2971a8a7.webp','2026-03-21 19:35:15.403452',NULL),(12,10,'Laptop HP 14-EP0220TU B73VWPA 16GB được trang bị chip Intel Core i3-1315U, RAM 16GB và bộ nhớ trong SSD 512GB, cùng viên pin 3-cell, 41Wh Li-ion polymer. Máy tích hợp chip Intel UHD Graphics, sở hữu màn hình 14 inch FHD, độ sáng 250 nits cùng dải màu 62.5% sRGB. Máy có khối lượng 1.4kg, hỗ trợ Wi-Fi 6 và bàn phím full-size.','HP','Laptop HP 14-EP0220TU','/uploads/a9de4bf2-9158-4d58-8b43-fb9614dab258.webp','2026-03-21 19:35:15.403452',NULL),(13,10,'Laptop HP Omnibook X Flip 14-FM0088TU BZ7Q2PA sở hữu bộ xử lý Intel Core Ultra 5 226V kèm NPU Intel AI Boost 40 TOPS hỗ trợ tăng tốc độ xử lý tác vụ AI. Trải nghiệm thị giác sắc nét qua màn hình cảm ứng 14 inch 2K IPS. Sản phẩm dùng viên pin 59 Wh mang lại sự linh hoạt khi hỗ trợ phát video liên tục suốt 22 giờ 45 phút.','HP','Laptop HP Omnibook X Flip 14','/uploads/b218c8b5-af06-4087-9630-a36e7906e303.webp','2026-03-21 19:35:15.403452',NULL),(14,10,'Chip AI	\nIntel AI Boost (12 NPU TOPS)\n\nLoại card đồ họa	\nIntel Graphics\n\nDung lượng RAM	\n16GB\n\nLoại RAM	\nLPDDR5-5200 MT/s Onboard\n\nỔ cứng	\n512 GB PCIe Gen4 NVMe M.2 SSD\n\nKích thước màn hình	\n14 inches\n\nCông nghệ màn hình	\nViền mỏng\nMàn hình chống chói\nĐộ sáng 300 nits\nĐộ phủ màu 62.5% sRGB\n\nPin	\n4-cell, 68 Wh Li-ion polymer\nBộ đổi nguồn USB Type-C 65 W\nHỗ trợ sạc pin nhanh: khoảng 50% trong 45 phút\n\nHệ điều hành	\nWindows 11 Home Single Language + Office\n\nĐộ phân giải màn hình	\n1920 x 1200 pixels (WUXGA)\n\nLoại CPU	\nIntel Core Ultra 5 225U (lên đến 4.8 GHz với Công nghệ Intel Turbo Boost, bộ nhớ đệm L3 12 MB, 12 lõi, 14 luồng)\n\nCổng giao tiếp	\n1 x USB Type-A\n1 x USB Type-A\n1 x HDMI-out 2.1\n1 x combo tai nghe/micro\n1 x Thunderbolt 4 Type-C 40Gbps (Power Delivery 3.1, DP 2.1, HP Sleep and Charge)\n1 x USB Type-C 10Gbps (Power Delivery 3.1, DP 1.4a, HP Sleep and Charge)','HP','Laptop HP OmniBook 7','/uploads/1daae673-9d2b-4bb9-816d-8913f4006c8b.webp','2026-03-21 19:35:15.403452',NULL),(15,10,'Laptop HP Victus 15-FB3116AX BX8U4PA được trang bị bộ xử lý CPU AMD Ryzen 7 7445H, đi kèm ổ cứng lưu trữ 512GB PCIe và bộ nhớ RAM có dung lượng 16GB. Thêm vào đó, mẫu laptop HP Victus 15 này còn hiển thị mượt mà trên màn hình 15.6 inch, tần số quét 144Hz. Card đồ họa NVIDIA GeForce RTX 3050 tích hợp cũng mang lại trải nghiệm ấn tượng.','HP','Laptop HP Victus 15','/uploads/270ab7b8-e9f4-47bb-891a-a770ebf7b1ae.webp','2026-03-21 19:35:15.403452',NULL),(17,11,'Laptop Dell Inspiron 15 3530 J9XFD được trang bị RAM 16GB DDR4 và ổ cứng SSD 512GB PCIe 4.0, mang lại tốc độ đọc ghi vượt trội. Với trọng lượng chỉ 1.62 kg và lớp vỏ nhựa bền bỉ, sản phẩm laptop Dell Inspiron dễ dàng đồng hành cùng bạn trong mọi hành trình. Bộ vi xử lý Intel Core i5-1334U cho hiệu năng ổn định khi làm việc và giải trí cơ bản.','DELL','Laptop Dell Inspiron 15','/uploads/d762f027-4dcc-4b54-a936-593dc56e7e46.webp','2026-03-21 19:35:15.403452',NULL),(18,11,'Laptop Dell 15 DC15255 DC5R5802W1 mang đến sức mạnh xử lý đột phá nhờ trang bị CPU Ryzen 5 7530U kết hợp với card đồ hoạ AMD Radeon Graphics tân tiến. RAM 16GB và SSD dung lượng 512GB chuẩn giao tiếp PCIe cho phép chạy đa tác vụ mượt, hiệu quả. Màn hình IPS lớn 15.6 inch 120Hz phục vụ chất lượng hình ảnh bắt mắt, đầy sống động. ','DELL','Laptop Dell 15 DC15255 DC5R5802W1','/uploads/3c7af9ab-bfbc-4ab8-8f23-e5d218c2247b.webp','2026-03-21 19:35:15.403452',NULL),(19,11,'Laptop Dell Pro 15 Essential PV15250 VKVKD có vi xử lý Intel Core 3-100U và bộ nhớ RAM 8GB DDR5 giúp xử lý mượt mà các tác vụ văn phòng hàng ngày. Dung lượng SSD 512GB hỗ trợ thiết bị lưu trữ thông tin ổn định và hiệu quả. Với trọng lượng chỉ 1.90kg, máy cực kỳ linh hoạt để người dùng mang theo đến bất cứ đâu.','DELL','Laptop Dell Pro 15 Essential','/uploads/e5bc7593-4d73-4558-ab80-c21dad593db7.webp','2026-03-21 19:35:15.403452',NULL),(20,11,'Laptop Dell Inspiron 14 5440 D0F3W được trang bị vi xử lý Intel Core i5-1334U,24GB RAM DDR5 và ổ cứng SSD dung lượng 512GB cùng màn hình 1920 x 1200. Mẫu laptop Dell Inspiron 5440 này được trang bị viên pin 54Wh kèm công nghệ sạc nhanh ExpressCharge mạnh mẽ. Bên cạnh đó, trọng lượng 1.69kg cùng chất liệu vỏ nhựa giúp tăng tính di động cho người dùng.','DELL','Laptop Dell Inspiron 14','/uploads/17be9f7b-2cc1-4557-9e45-ec15532b2fec.webp','2026-03-21 19:35:15.403452',NULL),(21,19,'Laptop Lenovo LOQ 15IAX9E 83LK0079VN là dòng laptop gaming có hiệu năng mạnh mẽ với chip Intel Core i5-12450HX với 8 nhân 12 luồng, xung nhịp tối đa 4.4GHz. Laptop tích hợp card rời NVIDIA GeForce RTX 3050 6GB GDDR6 để tối ưu khả năng đồ họa. Máy sở hữu 16GB RAM DDR5-4800 và ổ cứng SSD 512GB PCIe 4.0x4 NVMe hỗ trợ nâng lên 1TB.','Lenovo','Laptop Lenovo LOQ 15IAX9E','/uploads/982f6c85-992c-46fc-8a36-0dae9299060e.webp','2026-03-21 19:35:15.403452',NULL),(22,19,'Laptop Lenovo LOQ 15AHP10 83JG0047VN có kích thước 359.86 x 258.7 x 21.9-23.9 mm, trọng lượng máy khoảng 2.4kg thuận tiện di chuyển, sử dụng ngoài trời. Sản phẩm sở hữu sức mạnh được nâng cấp với con chip AI LA1. Cấu hình laptop Lenovo LOQ này mạnh mẽ từ CPU AMD R7 250, card đồ họa NVIDIA GeForce RTX 5050, 16GB RAM cùng SSD 512GB.','Lenovo','Laptop Lenovo LOQ 15AHP10','/uploads/a1685c7d-8743-496c-b635-c59eb17be8ef.webp','2026-03-21 19:35:15.403452',NULL),(23,19,'Laptop Lenovo Legion 5 15IRX10 83LY00HQVN được trang bị màn hình có kích thước 15.3inch, tần số quét 165Hz cùng nhiều công nghệ hiển thị hiện đại. Thiết bị sở hữu cổng kết nối hiện đại, tăng tính tiện lợi trong nhiều tình huống. Trải nghiệm hình ảnh trên laptop cũng vô cùng sống động nhờ vào card đồ họa RTX 5060 8GB. ','Lenovo','Laptop Lenovo Legion 5','/uploads/602f474b-7ee2-45ae-b352-1afa10511433.webp','2026-03-21 19:35:15.403452',NULL),(24,19,'Laptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN với chip xử lý Intel Core i5-13420H có 8 nhân và 12 luồng, đảm bảo hiệu năng mạnh mẽ cho đa nhiệm. Cùng với đó, bộ nhớ RAM 16GB DDR5-4800MHz và SSD 512GB PCIe 4.0 mang lại tốc độ phản hồi nhanh chóng. Màn hình 14 inch WUXGA IPS 300 nits sắc nét và pin 60Wh, giúp duy trì trải nghiệm ổn định và liền mạch.','Lenovo','Laptop Lenovo IdeaPad Slim 3','/uploads/4d55f055-53a3-4b2f-a890-f93a507c36de.webp','2026-03-21 19:35:15.403452',NULL),(25,12,'iPhone 17 Pro Max là phiên bản \"xịn xò\" nhất của thế hệ iPhone 17 series, được Apple trang bị những công nghệ hàng đầu về màn hình, hiệu năng và camera. Với ngoại hình hoàn toàn mới cùng nhiều nâng cấp về phần cứng lẫn tính năng, sản phẩm mang đến sức mạnh vượt trội, đáp ứng trọn vẹn từ nhu cầu sử dụng hằng ngày cho đến trải nghiệm chuyên nghiệp.','Apple','iPhone 17 Pro Max','/uploads/0390ccb0-697b-490a-b1e4-083816933d69.webp','2026-03-21 19:35:15.403452',NULL),(26,12,'Apple iPhone 17 thường nổi bật với thiết kế viền mỏng tinh tế, mặt trước Ceramic Shield 2 và màn hình Super Retina XDR 6.3 inch hỗ trợ ProMotion 120Hz. Máy được trang bị chip A19 với CPU 6 nhân và GPU 5 lõi, mang lại khả năng xử lý nhanh chóng các tác vụ nặng, từ giải trí đến làm việc. Ngoài ra, iPhone 17 còn được hỗ trợ Apple Intelligence, hỗ trợ các tác vụ thông thường thông minh, tiện lợi.','Apple','iPhone 17','/uploads/375accba-f74e-41ca-a861-664e297e1c4b.webp','2026-03-21 19:35:15.403452',NULL),(27,12,'Dung lượng RAM	\n8 GB\n\nBộ nhớ trong	\n256 GB\n\nThẻ SIM	\nSim kép (nano-Sim và e-Sim) - Hỗ trợ 2 e-Sim\n\nHệ điều hành	\niOS 18\n\nĐộ phân giải màn hình	\n2868 x 1320 pixels\n\nTính năng màn hình	\nDynamic Island\nMàn hình Luôn Bật\nCông nghệ ProMotion với tốc độ làm mới thích ứng lên đến 120Hz\nMàn hình HDR\nTrue Tone\nDải màu rộng (P3)\nHaptic Touch\nTỷ lệ tương phản 2.000.000:1\n\nLoại CPU	\nCPU 6 lõi mới với 2 lõi hiệu năng và 4 lõi hiệu suất\n\nTương thích	\nTương Thích Với Thiết Bị Trợ Thính','Apple','iPhone 16 Pro Max','/uploads/020e97d3-58e0-4403-ab76-86509f7d0aae.webp','2026-03-21 19:35:15.403452',NULL),(28,12,'Hệ điều hành	\niOS 18\n\nĐộ phân giải màn hình	\n2622 x 1206 pixels\n\nTính năng màn hình	\nDynamic Island\nMàn hình HDR\nTrue Tone\nDải màu rộng (P3)\nHaptic Touch\nTỷ lệ tương phản 2.000.000:1\nĐộ sáng tối đa 1000 nit\n460 ppi\nLớp phủ kháng dầu chống in dấu vân tay\nHỗ trợ hiển thị đồng thời nhiều ngôn ngữ và ký tự\n\nLoại CPU	\nCPU 6 lõi mới với 2 lõi hiệu năng và 4 lõi tiết kiệm điện\n\nTương thích	\nTương Thích Với Thiết Bị Trợ Thính','Apple','iPhone 16 Pro','/uploads/c87fd458-5629-447c-8f15-4d026ab2c62c.webp','2026-03-21 19:35:15.403452',NULL),(29,12,'Kích thước màn hình	\n6.5 inches\n\nCông nghệ màn hình	\nSuper Retina XDR\n\nCamera sau	\n48MP Fusion Main f/1.6\n\nCamera trước	\n18MP Center Stage f/1.6\n\nChipset	\nChip A19 Pro\n\nCông nghệ NFC	\nCó\n\nBộ nhớ trong	\n256 GB\n\nPin	\nXem video: 27 giờ\nXem video trực tuyến: 22 giờ\n\nThẻ SIM	\n2 eSIM\n\nHệ điều hành	\niOS 26\n\nĐộ phân giải màn hình	\n2736 x 1260 pixels\n\nTính năng màn hình	\nDynamic Island\nMàn hình luôn bật\nHDR\n460 ppi\nTrue Tone\nDải màu rộng (P3)\nHaptic Touch\nTỷ lệ tương phản 2.000.000:1\nĐộ sáng 1000 nit (typ)\nĐỉnh 1600 nit (HDR)\nĐỉnh 3000 nit (ngoài trời)\nLớp phủ chống vân tay, chống phản chi\n\nLoại CPU	\n6 lõi (2 hiệu năng + 4 tiết kiệm điện)','Apple','iPhone Air','/uploads/e7635472-7929-49db-944a-f9d4021f7427.webp','2026-03-21 19:35:15.403452',NULL),(30,13,'Kích thước màn hình	\n6.9 inches\n\nCông nghệ màn hình	\nDynamic AMOLED 2X\n\nCamera sau	\nCamera siêu rộng: 50MP\nCamera góc rộng: 200MP\nCamera Tele (5x): 50MP\nCamera Tele (3x): 10MP\n\nCamera trước	\n12MP\n\nChipset	\nSnapdragon 8 Elite Gen 5 dành cho Galaxy (3nm)\n\nCông nghệ NFC	\nCó\n\nDung lượng RAM	\n12 GB\n\nBộ nhớ trong	\n256 GB\n\nPin	\n5000 mAh\n\nThẻ SIM	\n2 Nano-SIM + eSIM\n\nĐộ phân giải màn hình	\n3120 x 1440 pixels (Quad HD+)\n\nTính năng màn hình	\nTần số quét: 1-120Hz\nĐộ sáng tối đa: 2600 nits','Samsung','Samsung Galaxy S26 Ultra','/uploads/ccd00f57-e601-4059-81a3-4621c93221e1.webp','2026-03-21 19:35:15.403452',NULL),(31,13,'Samsung Galaxy S26 Base trang bị chip Exynos 2600 tiến trình 2nm, RAM 12GB, bộ nhớ 256GB và pin 4.300mAh nâng cấp. Thiết bị nổi bật với thiết kế 7,2mm mỏng nhẹ, khung Armor Aluminum cải tiến, camera 50MP zoom quang 3x cùng Galaxy AI cá nhân hóa thông minh.','Samsung','Samsung Galaxy S26','/uploads/29bd2578-82e5-4277-a9d3-e880c36f1ba5.webp','2026-03-21 19:35:15.403452',NULL),(32,13,'Samsung Galaxy S26 Plus 12GB 512GB sở hữu màn hình 6.7 inch QHD+ Dynamic AMOLED 2X hiển thị sắc nét cùng độ phân giải cao vô cùng sống động. Bộ vi xử lý Exynos 2600 (tiến trình 2nm) đóng vai trò then chốt trong quá trình vận hành. Cụm camera sau với ống kính chính độ phân giải 50MP khẩu độ F1.8, hỗ trợ zoom chất lượng quang học 2x.','Samsung','Samsung Galaxy S26 Plus','/uploads/a00eea82-7864-49a6-9d97-f076801143f8.webp','2026-03-21 19:35:15.403452',NULL),(33,13,'Kích thước màn hình	\n6.9 inches\n\nCông nghệ màn hình	\nDynamic AMOLED 2X\n\nCamera sau	\nCamera siêu rộng 50MP\nCamera góc rộng 200 MP\nCamera Tele (5x) 50MP\nCamera Tele (3x) 10MP\"\n\nCamera trước	\n12 MP\n\nChipset	\nSnapdragon 8 Elite dành cho Galaxy (3nm)\n\nCông nghệ NFC	\nCó\n\nDung lượng RAM	\n12 GB\n\nBộ nhớ trong	\n256 GB\n\nPin	\n5000 mAh\n\nThẻ SIM	\n2 Nano-SIM + eSIM\n\nHệ điều hành	\nAndroid 15\n\nĐộ phân giải màn hình	\n3120 x 1440 pixels (Quad HD+)\n\nTính năng màn hình	\n120Hz\n2600 nits','Samsung','Samsung Galaxy S25 Ultra','/uploads/2ab66945-24d1-4e89-a94f-5b17360a6c29.webp','2026-03-21 19:35:15.403452',NULL),(34,13,'Kích thước màn hình	\n6.7 inches\n\nCông nghệ màn hình	\nDynamic AMOLED 2X\n\nCamera sau	\nCamera siêu rộng 12MP\nCamera góc rộng 50MP\nCamera Tele 10MP\n\nCamera trước	\n12MP\n\nChipset	\nSnapdragon 8 Elite dành cho Galaxy (3nm)\n\nCông nghệ NFC	\nCó\n\nDung lượng RAM	\n12 GB\n\nBộ nhớ trong	\n512 GB\n\nPin	\n4900 mAh\n\nThẻ SIM	\n2 Nano-SIM + eSIM\n\nĐộ phân giải màn hình	\n3120 x 1440 pixels (Quad HD+)\n\nTính năng màn hình	\n120Hz\n2600 nits\nCorning® Gorilla® Armor 2\n\nLoại CPU	\nTốc độ CPU: 4.47GHz, 3.5GHz\n8 nhân','Samsung','Samsung Galaxy S25 Plus','/uploads/9bd375a4-b080-4cee-ac39-4ba82df328e3.webp','2026-03-21 19:35:15.403452',NULL),(35,14,'Redmi Note 15 trang bị chip Helio G100 Ultra, chạy hệ điều hành HyperOS 2 cho trải nghiệm mượt mà khi sử dụng. Màn hình AMOLED 6.77 inch FHD+ 120Hz mang lại cảm giác cuộn chạm đã mắt, trong khi pin 6.000mAh, sạc nhanh 33W và camera 108MP giúp Note 15 sẵn sàng đáp ứng trọn vẹn nhu cầu học tập, làm việc và giải trí mỗi ngày.','Xiaomi','Xiaomi Redmi Note 15','/uploads/2606732e-7e20-4821-958b-1d713b3862cd.webp','2026-03-21 19:35:15.403452',NULL),(36,14,'Xiaomi 15T được trang bị vi xử lý MediaTek Dimensity 8.400-Ultra mạnh mẽ, sẵn sàng chinh phục các tựa game đỉnh cao. Sự kết hợp hoàn hảo giữa màn hình lớn 6.83 inch và camera Leica 50MP mang lại trải nghiệm nghe nhìn và nhiếp ảnh chuyên nghiệp. Đặc biệt, viên pin khủng 5.500 mAh kèm sạc nhanh 67W đảm bảo chiếc máy luôn là người bạn đồng hành bền bỉ.','Xiaomi','Xiaomi 15T 5G','/uploads/9229a8ee-e254-442b-aa92-9bfda85df2b8.webp','2026-03-21 19:35:15.403452',NULL),(37,14,'Kích thước màn hình	\n6.67 inches\n\nCông nghệ màn hình	\nAMOLED\n\nCamera sau	\nHệ thống camera AI 108MP\nCamera đo chiều sâu 2MP - f/2.4\nCamera cận cảnh 2MP - f/2.4\n\nCamera trước	\nCamera trước 20MP - f/2.2\n\nChipset	\nMediaTek Helio G99-Ultra\n\nCông nghệ NFC	\nCó\n\nDung lượng RAM	\n6 GB\n\nBộ nhớ trong	\n128 GB\n\nPin	\n5500mAh\n\nThẻ SIM	\n2 Nano-SIM\n\nHệ điều hành	\nAndroid 14\n\nĐộ phân giải màn hình	\n1080 x 2400 pixels (FullHD+)\n\nTính năng màn hình	\nTốc độ làm mới: Lên đến 120Hz\nĐộ sáng: 1800 nits đỉnh\nTỷ lệ tương phản: 5.000.000:1\n\nLoại CPU	\n8 nhân, lên đến 2.2GHz','Xiaomi','Xiaomi Redmi Note 14','/uploads/f796d878-db9e-49ea-8ac7-3f524526e480.webp','2026-03-21 19:35:15.403452',NULL),(38,14,'Kích thước màn hình	\n6.67 inches\n\nCông nghệ màn hình	\nAMOLED\n\nCamera sau	\nChính 200MP, OIS - f/1.65\nGóc siêu rộng 8MP - f/2.2\nMacro 2MP - f/2.4\n\nCamera trước	\nCamera trước - f/2.2\n\nChipset	\nSnapdragon® 7s Gen 3\n\nCông nghệ NFC	\nCó\n\nDung lượng RAM	\n8 GB\n\nBộ nhớ trong	\n256 GB\n\nPin	\n5110 mAh\n\nThẻ SIM	\n2 Nano-SIM\n\nHệ điều hành	\nAndroid 14\n\nĐộ phân giải màn hình	\n2712 x 1220 pixels\n\nTính năng màn hình	\nTần số quét: Lên đến 120Hz\nĐộ sáng: 3000 nits\nĐộ sâu màu: 12-bit\nTỷ lệ tương phản: 5,000,000:1\n\nLoại CPU	\n8 nhân, xung nhịp 2.5Ghz','Xiaomi','Xiaomi Redmi Note 14 Pro Plus','/uploads/73b724e6-8b2d-4303-ab5a-bbf8c181597c.webp','2026-03-21 19:35:15.403452',NULL),(39,15,'OPPO Find X9 là điện thoại flagship cao cấp của OPPO, chính thức ra mắt vào tháng 10/2025, nổi bật với hiệu năng mạnh mẽ từ MediaTek Dimensity 9500 5G (4.21GHz) và RAM 12GB, đáp ứng tốt nhu cầu đa nhiệm, chơi game và quay phim. Máy sở hữu màn hình AMOLED 6.59 inch 1.5K, 120Hz, viền siêu mỏng cho trải nghiệm hiển thị sắc nét, đắm chìm.\n\nBên cạnh đó, OPPO Find X9 được trang bị hệ thống camera hợp tác Hasselblad 50MP cho chất lượng ảnh cao cấp, cùng pin dung lượng lớn 7025 mAh, đảm bảo thời gian sử dụng bền bỉ.','Oppo','OPPO Find X9','/uploads/d754f9d0-a7b2-46a7-9834-3928e757b879.webp','2026-03-21 19:35:15.403452',NULL),(40,15,'OPPO Find X8 là mẫu smartphone flagship cao cấp đến từ OPPO, chính thức ra mắt toàn cầu và tại Việt Nam vào tháng 11/2024. Sản phẩm được trang bị chip MediaTek Dimensity 9400 mạnh mẽ, kết hợp màn hình AMOLED 6.59 inch, tần số quét 120Hz, độ phân giải FHD+, mang lại trải nghiệm hiển thị mượt mà và sắc nét.\n\nĐiểm nhấn của OPPO Find X8 còn đến từ cụm 3 camera sau 50MP, khả năng kháng nước, kháng bụi chuẩn IP68/IP69, cùng viên pin dung lượng lớn 5.630mAh hỗ trợ sạc nhanh 80W và sạc nhanh không dây AirVOOC 50W. Tất cả tạo nên một bước đột phá toàn diện về hiệu năng, camera và thiết kế sang trọng, xứng tầm flagship cao cấp.','Oppo','OPPO Find X8','/uploads/54ed8af5-accb-4e2d-8d2b-fe7f9a51f2de.webp','2026-03-21 19:35:15.403452',NULL),(41,15,'OPPO Reno 15 là mẫu smartphone cận cao cấp mới ra mắt tại Việt Nam tháng 1/2026, nổi bật với thiết kế hiện đại và cấu hình mạnh trong phân khúc. Máy sở hữu màn hình AMOLED 6.59 inch, độ phân giải 1.5K, tần số quét 120Hz, độ sáng 1200nits cho trải nghiệm hiển thị sắc nét, mượt mà.\n\nThiết bị trang bị Snapdragon 7 Gen 4 5G, RAM 12GB cho hiệu năng ổn định. Camera chính 50MP OIS chụp ảnh rõ nét, cùng pin 6500 mAh hỗ trợ sạc nhanh SuperVOOC/UFCS 80W, đáp ứng tốt nhu cầu sử dụng cả ngày.','Oppo','OPPO Reno15','/uploads/77ffed5f-5046-4f95-9134-690fd40d9fd9.webp','2026-03-21 19:35:15.403452',NULL),(42,15,'OPPO A58 sở hữu màn hình dạng nốt ruồi 6.72 inch, độ phân giải 2400×1080 pixels với tần số quét 60Hz, độ sáng tối đa 680 nits cho khả năng hiển thị sống động. Chipset MediaTek Helio G85 cùng GPU Mali-G52 MC2, RAM 8GB, ROM 128GB xử lý mạnh mẽ. Sản phẩm có khả năng chụp ảnh ấn tượng với camera chính 50MP, hỗ trợ nhiều tính năng phong phú.','Oppo','OPPO A58','/uploads/95df226a-2ec7-46d6-a0f4-43c3f3ad9d28.webp','2026-03-21 19:35:15.403452',NULL),(43,16,'Điện thoại Sony Xperia 1 VII sở hữu hiệu năng mạnh mẽ với chip Snapdragon 8 Elite, RAM 12GB và bộ nhớ trong 256GB mang đến trải nghiệm sử dụng mượt mà. Máy trang bị màn hình OLED FHD+ HDR kích thước 6.5 inch cùng tần số quét 120Hz. Hệ thống camera sau gồm 3 ống kính độ phân giải 52MP, 12MP và 50MP kết hợp cùng camera selfie 12MP. ','Sony','Sony Xperia 1 VII','/uploads/4e0dc9e2-48c1-4a57-ab92-32d771428491.webp','2026-03-21 19:35:15.403452',NULL),(44,16,'Điện thoại Sony Xperia 10 VII mang đến trải nghiệm trọn vẹn với hiệu năng ổn định nhờ có chip Snapdragon 6 Gen 3 và thời lượng pin 5.000mAh bền bỉ. Sản phẩm được trang bị màn hình OLED 120Hz giúp hiển thị rõ nét. Bên cạnh đó, camera chính có cảm biến Exmor RS™ mang đến chất lượng hình ảnh sống động.','Sony','Sony Xperia 10 VII','/uploads/07faaa89-abbf-4afb-b11d-982fd608f75c.webp','2026-03-21 19:35:15.403452',NULL),(46,20,'Microsoft Windows là dòng hệ điều hành dựa trên giao diện người dùng đồ họa (GUI) được phát triển và phân phối bởi Microsoft. Đây là hệ điều hành phổ biến nhất thế giới dành cho máy tính cá nhân, chiếm thị phần lớn nhờ khả năng tương thích cao với phần cứng và phần mềm','Microsoft','Microsoft Windows','/uploads/bcb90469-78a7-4798-9903-9f49af7cd41e.avif','2026-03-21 19:35:15.403452',NULL),(47,20,'Bộ phần mềm bao gồm các công cụ quen thuộc: \nWord: Soạn thảo văn bản và hỗ trợ viết thông minh.\nExcel: Xử lý bảng tính và phân tích dữ liệu chuyên sâu.\nPowerPoint: Thiết kế bản trình bày chuyên nghiệp.\nOutlook: Quản lý email, lịch làm việc và danh bạ.\nOneNote: Ghi chú kỹ thuật số đa năng.','Microsoft','Microsoft Office','/uploads/499172bd-59f7-447a-923f-01ade3880ced.avif','2026-03-21 19:35:15.403452',NULL),(48,21,'AutoCAD là phần mềm ứng dụng CAD để vẽ bản vẽ kỹ thuật bằng vectơ 2D hay bề mặt 3D, được phát triển bởi tập đoàn Autodesk. Với phiên bản đầu tiên được phát hành vào cuối năm 1982, AutoCAD là một trong những chương trình vẽ kĩ thuật đầu tiên chạy được trên máy tính cá nhân, nhất là máy tính IBM','Autodesk','AutoCAD','/uploads/87bfbfe9-c82d-49d6-bdbd-f5946f502537.webp','2026-03-21 19:35:15.403452',NULL),(49,21,'Autodesk Revit là phần mềm hàng đầu về mô hình thông tin công trình (BIM), cho phép kiến trúc sư và kỹ sư thiết kế, tài liệu hóa, trực quan hóa và mô phỏng dự án 3D một cách nhất quán. Revit tự động đồng bộ hóa các thay đổi (mặt bằng, mặt cắt, bảng thống kê) trong suốt vòng đời dự án, giúp giảm sai sót và tăng hiệu quả thi công','Autodesk','Revit','/uploads/462e0f2b-ac98-47ca-9edf-7055b71d3925.webp','2026-03-21 19:35:15.403452',NULL),(50,21,'Autodesk Maya, thường được gọi tắt là Maya, là một phần mềm đồ họa 3D chạy trên nền Windows, OS X và Linux, ban đầu thiết kế bởi Alias Systems Corporation và hiện tại đang được sở hữu và phát triển bởi Autodesk, Inc.','Autodesk','Maya','/uploads/f0f9986f-c7b5-4170-9f26-cb97504ede48.webp','2026-03-21 19:35:15.403452',NULL),(51,21,'Autodesk 3ds Max là phần mềm đồ họa máy tính 3D chuyên nghiệp hàng đầu, chuyên dùng để mô hình hóa, hoạt hình (animation) và kết xuất (render) hình ảnh/video chất lượng cao. Được phát triển bởi Autodesk dành riêng cho Windows, đây là công cụ tiêu chuẩn trong ngành phát triển game, trực quan hóa kiến trúc (ArchViz), và kỹ xảo điện ảnh.','Autodesk','3ds Max','/uploads/aab93a73-eade-4cc6-8cd2-26fabf586586.webp','2026-03-21 19:35:15.403452',NULL),(52,22,'Tài khoản Capcut Pro uy tín.\nCông cụ chỉnh sửa bằng AI\nCác tính năng chỉnh sửa bằng AI đáng tin cậy và thiết yếu từ CapCut để tạo văn bản, âm thanh và video.','Capcut','Capcut Pro','/uploads/61615d34-cf45-4366-9775-46ed30fe72f0.webp','2026-03-21 19:35:15.403452',NULL),(53,23,'Canva là một trang web công cụ thiết kế đồ hoạ, được thành lập năm 2013. Canva sử dụng định dạng kéo thả và cung cấp quyền truy cập vào hơn một triệu mẫu thiết kế, bức ảnh, video, đồ họa và phông chữ. Canva được sử dụng bởi những người nghiệp dư cũng như các chuyên gia trong lĩnh vực đồ họa.','Canva','Canva Pro','/uploads/fe22660f-e2e9-4e54-8cb6-64bf2557a94d.webp','2026-03-21 19:35:15.403452',NULL),(54,17,'Loa Sony SRS-XB100 - Âm thanh sống động\nLoa Bluetooth Sony SRS-XB100 với thiết kế nhỏ gọn, năng động cùng với âm bass mạnh mẽ sẽ là một lựa chọn không thể bỏ qua. Với công nghệ hiện đại đặc trưng của hãng, sản phẩm loa Sony này sẽ mang lại cho bạn trải nghiệm âm thanh sôi động và hấp dẫn, cùng với tính di động tiện lợi.','Sony','Loa Bluetooth Sony SRS-XB100','/uploads/d13d4494-b4b8-4baa-9fdb-7181b729ed66.webp','2026-03-21 19:35:15.403452',NULL),(55,17,'Loa Sony ULT sở hữu bộ sưu tập màu sắc đa dạng từ đen, cam, trắng đến xám cùng trọng lượng chỉ 650g. Loa với loa tweeter và woofer cùng chế độ âm thanh ULT Field Sound. Mẫu loa Sony này cũng được trang bị viên pin cho thời lượng sử dụng lên đến 12 giờ cũng như cổng sạc USB-C tiện lợi.','Sony','Loa Bluetooth Sony ULT','/uploads/15f416a6-dd45-4ecf-ad60-cc9ae15fae32.webp','2026-03-21 19:35:15.403452',NULL),(56,18,'Loa bluetooth JBL Flip 6 gây ấn tượng với vẻ ngoài hiện đại, chất lượng âm thanh tuyệt vời để đồng hành cùng bạn trên mọi chặng đường. Sở hữu nhiều ưu điểm nổi bật, loa JBL Flip 6 hứa hẹn sẽ mang đến cho người dùng những trải nghiệm âm thanh đáng nhớ.','JBL','Loa Bluetooth JBL Flip 6','/uploads/9b400f08-2a98-4a0c-829c-cbbfb64252ae.webp','2026-03-21 19:35:15.403452',NULL),(57,18,'JBL Charge 5 – Siêu phẩm loa di động thế hệ mới, chất âm vượt trội ở mọi không gian.\nTiếp nối sự thành công của người tiền nhiệm, dòng loa huyền thoại loa JBL Charge 5 với sự thay đổi mạnh mẽ cả về thiết kế lẫn công nghệ âm thanh mang đến chất lượng âm thanh vượt trội dù là ngoài trời hay trong nhà. Là sản phẩm loa bluetooth đồng hành cùng bạn ở mọi cuộc vui.','JBL','Loa Bluetooth JBL Charge 5','/uploads/d474c856-8df4-4273-a488-3cafe833478a.webp','2026-03-21 19:35:15.403452',NULL),(58,18,'JBL Encore Essential có kích thước khá nhỏ gọn, nhưng phát ra âm thanh công suất đến 100W, nên mọi người có thể sử dụng sản phẩm ở bất cứ không gian nào, kể cả ngoài trời hay trong nhà.\n\nPhiên bản Loa bluetooth JBL Encore Essential 2 nâng cấp với nhiều cải tiến tính năng thông minh, công nghệ âm thanh hiện đại và những tiện ích bổ sung như thời lượng pin, cổng kết nối,... đã đem đến một sự lựa chọn hoàn hào cho người dùng.\n\n','JBL','Loa JBL PartyBox Encore Essential','/uploads/0cef6d6d-8f7f-49c6-8c39-b459e1f899bd.webp','2026-03-21 19:35:15.403452',NULL),(59,18,'Loa JBL Authentics 300 là dòng loa không dây với thiết kế cặp loa tweeter 1 inch cùng với đó sản phẩm với thiết kế retro cổ điển cùng gam màu đen sang trọng. Loa có công suất lên đến 100W và cấu trúc âm thanh hai đường tiếng gồm một cho âm thanh chi tiết và một củ loa trầm toàn dải 5,25 inch (133mm).','JBL','Loa Bluetooth JBL Authentics 300','/uploads/4de86501-3c31-4cb4-a99b-f2d004045ea2.webp','2026-03-21 19:35:15.403452',NULL),(60,24,'Edifier MR4 Đen mang đến âm thanh trung thực nhờ hệ thống phân tích âm thanh đạt chứng nhận KLIPPEL của Đức. Với loa Edifier MR4, người dùng có thể hiệu chỉnh âm thanh một cách tối ưu phục vụ cho mọi nhu cầu sử dụng.','Edifier','Loa kiểm âm Edifier MR4','/uploads/928a1f22-c87d-4a92-83de-a8c92f095fc8.webp','2026-03-21 19:35:15.403452',NULL),(61,24,'Edifier MR5 được trang bị thiết kế với thân gỗ sang trọng cùng 2 loa với loa tweeter 1-inch và loa bass 4-inch. Loa mang lại âm thanh chất lượng với dải tần 60Hz-20KHz cho trải nghiệm giải trí sống động.','Edifier','Loa kiểm âm Edifier MR5','/uploads/c1fc6fba-1e08-49d3-bbfc-ee1ead153a4d.webp','2026-03-21 19:35:15.403452',NULL),(62,24,'Loa Edifier R1080BT có công suất lớn và củ loa được làm bằng lụa, có khả năng tái tạo âm thanh đỉnh cao và sống động hơn. Loa Edifier còn sử dụng chuẩn bluetooth 5.0 nên liên kết được với nhiều thiết bị, cho đường truyền ổn định.','Edifier','Loa Bluetooth Edifier R1080BT','/uploads/0fd56ed4-40e4-417f-98c8-dd44b8fcedc4.webp','2026-03-21 19:35:15.403452',NULL),(63,24,'Loa Bluetooth Edifier MP85 tuy làm nhỏ gọn nhưng được trang bị driver toàn dải 1.5 inch. Sản phẩm loa mini sử dụng truyền phát không dây Bluetooth V5.3 nổi bật, cho tốc độ ổn và trải nghiệm âm thanh chất lượng cao.','Edifier','Loa Bluetooth Edifier MP85','/uploads/a9aa5ffe-efdb-408d-9ce1-1fc859ebd476.webp','2026-03-21 19:35:15.403452',NULL),(64,24,'Edifier QD35 kết nối nhanh chóng với các thiết bị khác nhau như: laptop, điện thoại,… để tăng trải nghiệm sử dụng của khách hàng. Màn loa vi tính thiết kế hiện đại, giúp giảm thiểu bụi bẩn bám vào bên trong làm giảm chất lượng âm thanh.','Edifier','Loa Bluetooth Edifier QD35','/uploads/50e9fdc0-f5b6-4dc8-a29a-dda7f0e84bfc.webp','2026-03-21 19:35:15.403452',NULL),(65,25,'Màn hình Gaming Asus TUF VG27AQ5A 27 inch sở hữu tần số quét ép xung lên tới 210Hz và tấm nền Fast IPS, mang lại trải nghiệm chơi game cực mượt mà. Sản phẩm màn hình 2K được trang bị độ phân giải QHD 2560x1440 giúp hiển thị hình ảnh sắc nét, màu sắc chân thực hơn. Ngoài ra, thiết bị còn có tạo hình bền chắc với khả năng tinh chỉnh linh hoạt góc nghiêng.','Asus','Màn hình Gaming ASUS TUF','/uploads/0ad7cf0e-985c-485b-ae9e-8090510af1bc.webp','2026-03-21 19:35:15.403452',NULL),(66,25,'Màn hình Gaming ASUS ROG Strix XG27ACMS  có tốc độ làm mới 320Hz siêu nhanh, được thiết kế tối ưu cho người dùng là game thủ chuyên nghiệp. Với công nghệ AI ROG Gaming tích hợp, thiết bị đem đến trải nghiệm chiến game đỉnh cao. Màn có tấm nền Fast IPS 1440p, cho các hình ảnh game hiện ra đầy chân thực.','Asus','Màn hình Gaming ASUS ROG Strix','/uploads/1c60d18b-3d75-4e07-8b91-7ddc7673f285.webp','2026-03-21 19:35:15.403452',NULL),(67,26,'Màn hình LG UltraGear 27G411A-B 27 inch sở hữu tấm nền IPS 27 inch độ phân giải Full HD cùng độ phủ màu sRGB 99%, mang lại hình ảnh đầy sống động. Tốc độ làm mới 144Hz cùng độ phản hồi 5ms, màn hình thể hiện tốt các nội dung nhanh. Màn hình còn hỗ trợ NVIDIA G-SYNC, AMD FreeSync, Black Stabilizer và 1ms MBR.','LG','Màn hình Gaming LG UltraGear','/uploads/724f572b-011b-4a81-8e02-fde15af49dca.webp','2026-03-21 19:35:15.403452',NULL),(68,26,'Màn hình Gaming LG Ultragear OLED 32GS95UV-B 32 inch có kích thước 32 inch rộng rãi, chất lượng 4K với độ sáng 250 cd/m2 cùng tần số 240Hz. Nhiều công nghệ hiển thị như DisplayHDR, NVIDIA G-Sync, AMD FreeSync Premium Pro được tích hợp. Sản phẩm có kiểu dáng gaming cá tính với thiết kế Unity độc đáo.','LG','Màn hình Gaming LG UltraGear OLED','/uploads/0bf65bd6-414a-4eaf-a2fc-5fd43aa7f365.webp','2026-03-21 19:35:15.403452',NULL),(69,27,'Màn hình Samsung gaming Odyssey G5 LC34G55TWWEXXV 34 inch với độ cong hoàn hảo cùng độ phân giải cao mang lại hình ảnh vượt trội. Chiếc màn hình Samsung này hứa hẹn không làm các tín đồ công nghệ thất vọng.','','Màn hình Samsung Gaming Odyssey','/uploads/bce30e0f-0471-4cc7-ab67-20fd653d878f.webp','2026-03-21 19:35:15.403452',NULL),(70,27,'Màn hình Samsung Viewfinity S8 UHD LS27B800PXEXXV 27 inch cho trải nghiệm thị giác vượt trội, xứng đáng là một công cụ hữu ích dành cho những người chuyên thiết kế đồ họa. Bên cạnh khả năng hiển thị hình ảnh rõ nét với đa dạng màu sắc sống động, chiếc màn hình đồ hoạ này còn giúp bảo vệ thị lực, cũng như cho phép làm việc với mọi điều kiện ánh sáng','Samsung','Màn hình Samsung Viewfinity S8','/uploads/c45eeb7d-7b1c-4e61-8c21-6d2863a517d5.webp','2026-03-21 19:35:15.403452',NULL),(71,27,'Với màn hình hiển thị cỡ lớn, lên tới 24 inch, màn hình cong Samsung LS24C360EAEXXV 24 inch dễ dàng tạo nên một không gian giải trí xuất sắc ngay tại khu vực làm việc của bạn. Cùng với đó là thiết kế màn hình cong cao cấp giúp tạo ra trải nghiệm hấp dẫn, mang lại góc nhìn rộng và sống động trong từng khung hình. Nếu bạn đang tìm kiếm một thiết bị màn hình máy tính cao cấp thì Samsung LS24C360EAEXXV là một lựa chọn không nên bỏ qua nhé!','Samsung','Màn hình cong Samsung','/uploads/cae2479f-c0b0-48e9-8372-d2a93837f8dd.webp','2026-03-21 19:35:15.403452',NULL),(72,28,'AirPods 4 là tai nghe không dây Apple với chip H2 cùng EQ thích ứng và âm thanh không gian cá nhân hóa mang lại trải nghiệm âm thanh ấn tượng. Tai nghe được trang bị Micrô kép với cảm biến quang học cùng micro hướng vào trong giúp thu âm tốt hơn. Cùng với điều khiển chạm cho phép người dùng điều khiển qua các thao tác nhấn tiện lợi.','Apple','AirPods 4','/uploads/cfc513cd-402f-45b7-a535-0b335f677598.webp','2026-03-21 19:35:15.403452',NULL),(73,28,'\nKích thước	\nTai Nghe: 30,9 x 19,2 x 27,0 mm\nHộp Sạc: 47,2 mm x 62,2 x 21,8 mm\n\nTrọng lượng	\nTai Nghe: 5,55 gram\nHộp Sạc + Tai Nghe: 43,99 gram\n\nCông nghệ âm thanh	\nTrình điều khiển Apple với độ lệch tương phản cao có thể tùy chỉnh\nBộ khuếch đại với độ lệch tương phản cao có thể tùy chỉnh\nChủ Động Khử Tiếng Ồn tai bạn chưa từng nghe\nÂm Thanh Thích Ứng\nChế độ Xuyên Âm\nNhận Biết Cuộc Hội Thoại\n\nMicro	\nCó\n\nCổng kết nối	\nType C\n\nThời lượng sử dụng Pin	\nTai nghe: lên đến 8 giờ\nTai nghe + hộp sạc: lên đến 24 giờ\n\nPhương thức điều khiển	\nCảm ứng chạm\n\nTính năng khác	\nKiểm tra thính giác\nThiết bị trợ thính\nGiảm âm thanh lớn\nCảm biến theo dõi nhịp tim khi tập luyện\nChống bụi, chống mồ hôi và chống nước (IP57)\n\nChipset	\nChip Apple H2\n\nHãng sản xuất	\nApple Chính hãng','Apple','AirPods Pro','/uploads/d3ca1dd9-3724-486e-8065-5a028112bf34.webp','2026-03-21 19:35:15.403452',NULL),(74,28,'Tai nghe Apple EarPods USB-C sở hữu thiết kế phá cách với loa bên trong được tối ưu hóa để cung cấp âm thanh chất lượng cao và giảm thiểu biến dạng âm. Sử dụng cổng kết nối USB-C hiện đại, tai nghe đảm bảo khả năng tương thích với tất cả các mẫu máy trong dòng iPhone 15 Series mới. Bên cạnh đó, mẫu tai nghe còn được thiết kế với tính năng chống mồ hôi và nước, kết hợp với các phím điều khiển cho việc điều chỉnh âm lượng thuận tiện hơn bao giờ hết.','Apple','EarPods USB-C','/uploads/ca1b1f0d-0e4e-4707-b6b3-a08b8582d814.webp','2026-03-21 19:35:15.403452',NULL),(75,28,'Bàn phím Apple Magic Keyboard Touch ID 2024 chiều dài của sản phẩm là 16.48 inch (41.87 cm) có thể dễ dàng di chuyển và sử dụng làm việc, chiến game. Trọng lượng nhẹ chỉ 0.369 kg , màu sắc trắng tinh tế không phù hợp với góc nhỏ làm việc của bạn. Tang bị một cổng USB-C , giúp bạn kết nối nhanh chóng với nhiều thiết bị.','Apple','Bàn phím Apple Magic Keyboard','/uploads/8d1496bf-731b-497f-a92a-0d1729667546.webp','2026-03-21 19:35:15.403452',NULL),(76,28,'Dây đeo Apple Watch Nike Sport Band 42mm S/M mang chất liệu mềm mịn kết hợp độ đàn hồi ổn định hỗ trợ thao tác đeo hằng ngày. Tông màu phụ kiện Apple Watch hiện đại, họa tiết ngẫu nhiên giúp Nike Sport Band tạo điểm nhấn cho phong cách sử dụng. Nike Sport Band là lựa chọn phù hợp cho nhu cầu thay dây và duy trì sự thoải mái ở cổ tay.','Apple','Dây đeo Apple Watch Nike Sport Band','/uploads/3f87284c-5a8a-4576-8acc-93fefe09fc43.webp','2026-03-21 19:35:15.403452',NULL),(77,29,'Chuột không dây Logitech MX Master thông qua Bluetooth giúp dễ dàng kết nối với hệ điều hành Windows 8, 10 trở lên, Mac OS 10.13 +, iPad 13.1 trở lên và Linux. Sản phẩm sở hữu cảm biến Darkfield và độ phân giải tối đa lên đến 4000 DPI giúp làm việc mượt mà trên mọi bề mặt phẳng. Kích thước sản phẩm 126,0 mm x 85,7 mm x 48,4 mm và trọng lượng chỉ 145g. Nhờ đó, Logitech MX Master không chỉ nhỏ gọn, nhẹ nhàng mà còn êm tay với thiết kế chuột công thái học. ','Logitech','Chuột không dây Logitech MX Master','/uploads/d1f5f400-ac96-49b2-8a63-83db5beb16e0.webp','2026-03-21 19:35:15.403452',NULL),(78,29,'Logitech MX Anywhere 2S thuộc loại chuột không dây kích cỡ chỉ vỏn vẹn vừa khít trong lòng bàn tay. Thuận tiện mang chuột đi bất cứ đâu, vừa cà phê du lịch vừa học tập, làm việc được. Ngoài ra chuột còn sử dụng liên tục liền mạch được cho 3 màn hình máy tính để sao chép, dán nội dung giữa chúng.','Logitech','Chuột không dây Logitech MX Anywhere','/uploads/986fb07d-12f4-42eb-a99f-7a34689fe436.webp','2026-03-21 19:35:15.403452',NULL),(79,29,'G102 LightSync là mẫu chuột có dây Logitech mang vẻ ngoài sang trọng cùng kích cỡ gọn trong lòng bàn tay. Logitech G102 có thiết kế 6 nút ứng lực, bao gồm hai nút chuột trái & phải và 4 nút ở hai cạnh để bạn dễ dàng điều khiển thao tác trên hệ thống. Thông qua tùy chỉnh trong ứng dụng HUB G của Logitech, game thủ có thể thiết lập tổ hợp phím và tạo lệnh chuột riêng để tăng tính đơn giản hóa trong việc chơi game.','Logitech','Chuột có dây Gaming Logitech G102','/uploads/772640ac-1980-4743-93a7-4f59896ed71b.webp','2026-03-21 19:35:15.403452',NULL),(80,29,'Tốc độ phản hồi của một chiếc chuột là rất quan trọng và chuột có dây Logitech B100 đã làm rất tốt nhiệm vụ này. Nhờ vào việc được trang bị cảm biến Optical cùng với độ phân giải 800 DPI sẽ mang lại một tốc độ phản hồi nhanh, các thao tác bấm, cuộn đều được thực hiện một cách nhanh chóng và có độ trễ thấp. Người dùng sẽ cảm thấy thoải mái, đạt được hiệu quả công việc cao khi sử dụng chiếc chuột này.','Logitech','Chuột có dây Logitech B100','/uploads/5efce920-6ee0-4f21-bb7d-0fdfcd246e3e.webp','2026-03-21 19:35:15.403452',NULL),(81,30,'Bàn phím gaming MSI Forge GK100 RGB LED đen sở hữu đèn LED RGB bắt mắt tạo nên không gian chiến game độc đáo cùng các phím tắt hỗ trợ điều khiển nhanh. Kết hợp với đó là phím switch chắc chắn có khả năng chịu đến 10 triệu lần nhấn. Đặc biệt hơn, mẫu bàn phím của nhà MSI còn có khả năng nhận tín hiệu cùng lúc của 19 phím bấm. ','MSI','Bàn phím Gaming MSI Force','/uploads/14cfe5b4-f2d7-4f98-ba16-ae21229ee9cb.webp','2026-03-21 19:35:15.403452',NULL),(82,30,'Chuột Gaming không dây MSI Clutch GM41 Lightweight được thiết kế với kiểu dáng gọn nhẹ, sang trọng, Tay cầm được thiết kế chống trơn trượt có độ nhám giúp cho người cầm có cảm giác được thỏa mái khi cầm được chắc chắn hơn.','MSI','Chuột Gaming không dây MSI GM41 Lightweight','/uploads/da1012ae-436f-44be-adc9-cd72202ff7bd.webp','2026-03-21 19:35:15.403452',NULL),(83,30,'Chuột gaming có dây MSI Forge GM10 có cảm biến quang học với độ phân giải tùy chỉnh từ 1000 DPI đến 6400 DPI, kích thước 120 x 60 x 40mm và khối lượng 108g. Mẫu chuột MSI này sử dụng Micro Switch với độ bền tới 10 triệu lần nhấp, đi kèm 7 nút bấm có thể tùy chỉnh linh hoạt. Chuột tích hợp đèn LED RGB 6 chế độ và kết nối qua cổng USB 2.0 với dây dài 1.5m.','MSI','Chuột Gaming có dây MSI Force GM100','/uploads/c17dc0fc-ec7b-4ed3-bcc0-b8b2541436b0.webp','2026-03-21 19:35:15.403452',NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_item`
--

DROP TABLE IF EXISTS `product_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_price` decimal(38,2) DEFAULT NULL,
  `picture` varchar(512) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa9mjpi98ark8eovbtnnreygbb` (`product_id`),
  CONSTRAINT `FKa9mjpi98ark8eovbtnnreygbb` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=266 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_item`
--

LOCK TABLES `product_item` WRITE;
/*!40000 ALTER TABLE `product_item` DISABLE KEYS */;
INSERT INTO `product_item` VALUES (1,26990000.00,NULL,25900000.00,1),(2,27990000.00,'/uploads/5e6312de-37bb-4074-8fa9-e6f2d1225ffd.webp',26900000.00,1),(3,19690000.00,NULL,17493000.00,2),(4,17490000.00,'/uploads/01b5641c-fd5f-47b0-83c4-4bca4e1c6e81.webp',17490000.00,2),(5,40690000.00,NULL,38283000.00,3),(6,46890000.00,NULL,46890000.00,3),(7,51790000.00,NULL,49272000.00,3),(9,51790000.00,NULL,51790000.00,3),(10,60360000.00,NULL,57756000.00,3),(11,14990000.00,NULL,12840000.00,4),(12,19990000.00,NULL,17790000.00,4),(13,24990000.00,NULL,23990000.00,4),(14,34990000.00,NULL,34490000.00,4),(15,34990000.00,NULL,32690000.00,6),(16,44260000.00,NULL,44260000.00,6),(17,44990000.00,NULL,44990000.00,6),(19,21490000.00,NULL,14490000.00,7),(20,22990000.00,NULL,17990000.00,7),(21,27590000.00,NULL,23990000.00,7),(23,21490000.00,NULL,16490000.00,8),(24,28990000.00,NULL,26990000.00,8),(26,19990000.00,NULL,17490000.00,9),(27,29990000.00,NULL,27990000.00,8),(28,29590000.00,NULL,26690000.00,10),(29,31590000.00,NULL,28690000.00,10),(30,23990000.00,NULL,22990000.00,11),(31,19990000.00,NULL,17490000.00,11),(32,22990000.00,NULL,19490000.00,11),(33,13490000.00,NULL,12990000.00,12),(34,19190000.00,NULL,15990000.00,12),(35,22090000.00,NULL,20290000.00,12),(36,28590000.00,NULL,28590000.00,13),(37,32590000.00,NULL,30990000.00,13),(38,28590000.00,NULL,28590000.00,14),(39,32590000.00,NULL,30990000.00,14),(40,24590000.00,NULL,16790000.00,15),(41,26990000.00,NULL,24790000.00,15),(42,31490000.00,NULL,23990000.00,15),(43,16990000.00,NULL,16490000.00,17),(44,21990000.00,NULL,20990000.00,17),(45,16990000.00,NULL,16390000.00,18),(47,33990000.00,NULL,30990000.00,18),(48,16990000.00,NULL,16490000.00,18),(49,16990000.00,NULL,16390000.00,19),(50,33990000.00,NULL,30990000.00,19),(51,16990000.00,NULL,16490000.00,19),(52,33990000.00,NULL,30990000.00,20),(53,16990000.00,NULL,16490000.00,20),(54,21990000.00,NULL,20990000.00,20),(55,23990000.00,NULL,22990000.00,21),(56,28990000.00,NULL,25990000.00,21),(57,37990000.00,NULL,34990000.00,21),(58,23990000.00,NULL,22990000.00,22),(59,28990000.00,NULL,25990000.00,22),(60,37990000.00,NULL,34990000.00,22),(61,102990000.00,NULL,87990000.00,23),(62,40990000.00,NULL,38990000.00,23),(63,43990000.00,NULL,42690000.00,23),(64,18990000.00,NULL,17490000.00,24),(65,22990000.00,NULL,21490000.00,24),(66,63990000.00,NULL,62790000.00,25),(67,63990000.00,NULL,62990000.00,25),(68,63990000.00,NULL,62990000.00,25),(69,50990000.00,NULL,50690000.00,25),(70,50990000.00,NULL,50490000.00,25),(71,50990000.00,NULL,49990000.00,25),(72,31490000.00,NULL,30990000.00,26),(73,31490000.00,NULL,30990000.00,26),(74,31490000.00,NULL,30990000.00,26),(75,24990000.00,NULL,24590000.00,26),(76,24990000.00,NULL,24990000.00,26),(77,24990000.00,NULL,24990000.00,26),(78,46990000.00,NULL,42990000.00,27),(79,46990000.00,NULL,42990000.00,27),(80,40990000.00,NULL,37990000.00,27),(81,40990000.00,NULL,37990000.00,27),(82,34990000.00,NULL,31990000.00,27),(83,34990000.00,NULL,31990000.00,27),(85,37990000.00,NULL,33490000.00,28),(86,37990000.00,NULL,33490000.00,28),(87,31990000.00,NULL,28590000.00,28),(88,31990000.00,NULL,28590000.00,28),(89,28990000.00,NULL,26590000.00,28),(90,28990000.00,NULL,26590000.00,28),(91,44990000.00,NULL,35990000.00,29),(92,44990000.00,NULL,35990000.00,29),(93,44990000.00,NULL,35990000.00,29),(94,44990000.00,NULL,35990000.00,29),(95,38490000.00,NULL,30990000.00,29),(96,38490000.00,NULL,30990000.00,29),(97,38490000.00,NULL,30990000.00,29),(98,38490000.00,NULL,30990000.00,29),(99,31990000.00,NULL,24990000.00,29),(100,31990000.00,NULL,24990000.00,29),(101,31990000.00,NULL,24990000.00,29),(102,31990000.00,NULL,24990000.00,29),(103,51990000.00,NULL,47490000.00,30),(104,51990000.00,NULL,47490000.00,30),(105,51990000.00,NULL,47490000.00,30),(106,42990000.00,NULL,36990000.00,30),(107,42990000.00,NULL,36990000.00,30),(108,42990000.00,NULL,36990000.00,30),(109,42990000.00,NULL,36990000.00,30),(110,42990000.00,NULL,36990000.00,30),(111,42990000.00,NULL,36990000.00,30),(112,31990000.00,NULL,27490000.00,31),(113,31990000.00,NULL,27490000.00,31),(114,31990000.00,NULL,27490000.00,31),(115,25990000.00,NULL,24990000.00,31),(116,25990000.00,NULL,24990000.00,31),(117,25990000.00,NULL,24990000.00,31),(118,35990000.00,NULL,31490000.00,32),(119,35990000.00,NULL,31490000.00,32),(120,35990000.00,NULL,31490000.00,32),(121,29990000.00,NULL,28990000.00,32),(122,29990000.00,NULL,28990000.00,32),(123,29990000.00,NULL,28990000.00,32),(124,43980000.00,NULL,35490000.00,33),(125,43980000.00,NULL,35490000.00,33),(126,43980000.00,NULL,35490000.00,33),(127,43980000.00,NULL,35490000.00,33),(128,36810000.00,NULL,30180000.00,33),(129,36810000.00,NULL,30180000.00,33),(130,36810000.00,NULL,30180000.00,33),(131,36810000.00,NULL,30180000.00,33),(136,33380000.00,NULL,28990000.00,33),(137,33380000.00,NULL,28990000.00,33),(138,33380000.00,NULL,28990000.00,33),(139,33380000.00,NULL,28990000.00,33),(140,29490000.00,NULL,25490000.00,34),(141,29490000.00,NULL,25490000.00,34),(142,26500000.00,NULL,22700000.00,34),(143,26500000.00,NULL,22700000.00,34),(144,11490000.00,NULL,11190000.00,35),(145,11490000.00,NULL,11190000.00,35),(146,11490000.00,NULL,11190000.00,35),(147,10990000.00,NULL,10990000.00,35),(148,10990000.00,NULL,10990000.00,35),(149,10990000.00,NULL,10990000.00,35),(150,7490000.00,NULL,6990000.00,35),(151,7490000.00,NULL,6990000.00,35),(152,14990000.00,NULL,13990000.00,36),(153,14990000.00,NULL,13990000.00,36),(154,19490000.00,NULL,19490000.00,36),(155,19490000.00,NULL,19490000.00,36),(156,49000000.00,'/uploads/aaee957a-b482-45cf-809e-6dac99abd950.webp',42900000.00,37),(157,49000000.00,'/uploads/0248d29a-4772-4101-b5f4-2985d4effc8e.webp',42900000.00,37),(158,49000000.00,'/uploads/8cbd045e-45f3-4b82-ad13-bb5ff1c55c7d.webp',42900000.00,37),(160,10800000.00,NULL,7990000.00,38),(161,10800000.00,NULL,7990000.00,38),(162,10800000.00,NULL,7990000.00,38),(163,22990000.00,'/uploads/d0e52133-5705-4a67-a7cf-6b54f2a00929.webp',22990000.00,39),(164,26990000.00,'/uploads/961b0a59-5a2b-40bd-9391-eaec563a8756.webp',26990000.00,39),(165,22990000.00,'/uploads/c862e695-155a-4bae-9615-cf7d0fab0345.webp',22990000.00,39),(166,22990000.00,'/uploads/459c7999-2a52-4982-90d8-a49233dec68d.webp',17490000.00,40),(167,22990000.00,'/uploads/25945a12-d475-40bb-adaf-86a255e69796.webp',17490000.00,40),(168,16990000.00,NULL,16990000.00,41),(169,16990000.00,NULL,16990000.00,41),(170,11990000.00,NULL,11990000.00,41),(171,5490000.00,NULL,4500000.00,42),(172,5490000.00,NULL,4500000.00,42),(173,4990000.00,NULL,4090000.00,42),(174,4990000.00,NULL,4090000.00,42),(175,34990000.00,NULL,27090000.00,43),(176,34990000.00,NULL,27090000.00,43),(177,13490000.00,NULL,11690000.00,44),(178,13490000.00,NULL,11690000.00,44),(179,13490000.00,NULL,11690000.00,44),(180,400000.00,'/uploads/93fa9c51-8b62-4243-a2cc-fceaf444e206.avif',290000.00,46),(181,400000.00,'/uploads/3a891f59-93cb-4abd-9c9f-1522be641501.avif',290000.00,46),(182,600000.00,'/uploads/b4c1275c-fe65-44f1-97d8-6fc84da1ebb1.avif',250000.00,46),(183,600000.00,'/uploads/ed38f2c0-4114-48b9-bde6-7feadd5cf69a.avif',250000.00,46),(187,1299000.00,'/uploads/ecdbf47c-50e6-41d5-b7d7-afd443dc3a57.avif',390000.00,47),(188,9500000.00,'/uploads/014e45a0-1653-4b42-a7a0-4c1d0172874f.avif',699000.00,47),(189,11500000.00,'/uploads/6976cd65-c22c-491d-a352-aae616f5a7a0.avif',550000.00,47),(190,35000000.00,NULL,390000.00,48),(191,47000000.00,NULL,390000.00,49),(192,41800000.00,NULL,390000.00,50),(193,41950000.00,NULL,390000.00,51),(194,55000.00,NULL,29000.00,52),(195,200000.00,NULL,89000.00,52),(196,2000000.00,NULL,890000.00,52),(197,150000.00,NULL,25000.00,53),(198,1500000.00,NULL,295000.00,53),(199,1490000.00,'/uploads/7681efdc-9d8c-4192-80f3-ede091bca94a.webp',1090000.00,54),(200,1490000.00,'/uploads/4f2ac6c0-8268-4c9b-9db6-8545198c2bd9.webp',1090000.00,54),(201,1490000.00,'/uploads/eb8cbbd5-40f6-412c-a6a9-1b6c02c91d01.webp',1090000.00,54),(202,2990000.00,'/uploads/e7b6d809-300e-4255-8c69-112134de380f.webp',2025000.00,55),(203,4990000.00,'/uploads/cb9a173e-4681-40ff-82a2-836438b45b9d.webp',3290000.00,55),(204,8190000.00,'/uploads/cc6fd892-636b-47cb-97d5-cc729fda4433.webp',5990000.00,55),(205,2935000.00,NULL,2330000.00,56),(206,2935000.00,NULL,2330000.00,56),(207,2935000.00,NULL,2330000.00,56),(208,3990000.00,NULL,3490000.00,57),(209,3990000.00,NULL,3490000.00,57),(210,3990000.00,NULL,3490000.00,57),(211,3990000.00,NULL,3490000.00,57),(212,6490000.00,NULL,6290000.00,58),(213,11900000.00,NULL,9990000.00,59),(214,2670000.00,NULL,1690000.00,60),(215,2670000.00,NULL,1690000.00,60),(216,3990000.00,NULL,3990000.00,61),(217,3990000.00,NULL,3990000.00,61),(218,2588000.00,NULL,1890000.00,62),(219,2588000.00,NULL,1890000.00,62),(220,416000.00,NULL,250000.00,63),(221,416000.00,NULL,250000.00,63),(222,416000.00,NULL,250000.00,63),(223,4385000.00,NULL,2650000.00,64),(224,4385000.00,NULL,2650000.00,64),(225,5290000.00,NULL,4990000.00,65),(226,3390000.00,NULL,2990000.00,65),(227,9990000.00,NULL,8590000.00,65),(229,37990000.00,NULL,29790000.00,66),(230,8990000.00,NULL,6890000.00,66),(231,3990000.00,NULL,2590000.00,67),(232,9990000.00,NULL,6990000.00,67),(233,23990000.00,NULL,20990000.00,67),(234,29990000.00,NULL,24890000.00,68),(235,29990000.00,NULL,28990000.00,68),(236,33990000.00,NULL,32990000.00,68),(237,4490000.00,NULL,3390000.00,69),(238,8990000.00,NULL,5390000.00,69),(239,39990000.00,NULL,21990000.00,69),(240,24990000.00,NULL,21990000.00,69),(241,12990000.00,NULL,7190000.00,70),(242,13990000.00,NULL,8890000.00,70),(243,2990000.00,NULL,2390000.00,71),(244,3490000.00,NULL,2590000.00,71),(245,3790000.00,NULL,2990000.00,72),(246,4990000.00,NULL,4350000.00,72),(247,6790000.00,NULL,6390000.00,73),(248,6190000.00,NULL,4990000.00,73),(249,550000.00,NULL,550000.00,74),(250,540000.00,NULL,540000.00,74),(251,4190000.00,NULL,4190000.00,75),(252,4190000.00,NULL,4190000.00,75),(253,1500000.00,NULL,1400000.00,76),(254,1500000.00,NULL,1400000.00,76),(255,1890000.00,NULL,1390000.00,77),(256,2990000.00,NULL,2390000.00,77),(257,1790000.00,NULL,1190000.00,78),(258,2190000.00,NULL,1550000.00,78),(259,599000.00,NULL,400000.00,79),(260,599000.00,NULL,400000.00,79),(261,89000.00,NULL,85000.00,80),(262,490000.00,NULL,390000.00,81),(263,1190000.00,NULL,990000.00,81),(264,1490000.00,NULL,790000.00,82),(265,290000.00,NULL,250000.00,83);
/*!40000 ALTER TABLE `product_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_item_in_warehouse`
--

DROP TABLE IF EXISTS `product_item_in_warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_item_in_warehouse` (
  `sku` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `product_item_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  PRIMARY KEY (`product_item_id`,`warehouse_id`),
  KEY `FKrcax6pprjgkcuubavjqqr1va4` (`warehouse_id`),
  CONSTRAINT `FKnbepwys16dg16w3h2kliiy2v3` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`id`),
  CONSTRAINT `FKrcax6pprjgkcuubavjqqr1va4` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_item_in_warehouse`
--

LOCK TABLES `product_item_in_warehouse` WRITE;
/*!40000 ALTER TABLE `product_item_in_warehouse` DISABLE KEYS */;
INSERT INTO `product_item_in_warehouse` VALUES (NULL,9,1,1),(NULL,10,2,1),(NULL,9,3,1),(NULL,10,4,1),(NULL,10,6,1),(NULL,9,7,1),(NULL,11,9,1),(NULL,11,10,1),(NULL,12,11,1),(NULL,12,12,1),(NULL,13,13,1),(NULL,13,14,1),(NULL,14,15,1),(NULL,14,17,1),(NULL,15,19,1),(NULL,16,20,1),(NULL,16,21,1),(NULL,17,23,1),(NULL,18,24,1),(NULL,19,26,1),(NULL,19,27,1),(NULL,20,28,1),(NULL,20,29,1),(NULL,21,30,1),(NULL,21,31,1),(NULL,22,32,1),(NULL,22,33,1),(NULL,23,34,1),(NULL,23,35,1),(NULL,24,36,1),(NULL,24,37,1),(NULL,25,38,1),(NULL,25,39,1),(NULL,26,40,1),(NULL,26,41,1),(NULL,27,42,1),(NULL,27,43,1),(NULL,28,44,1),(NULL,29,47,1),(NULL,29,48,1),(NULL,30,49,1),(NULL,30,50,1),(NULL,31,51,1),(NULL,31,52,1),(NULL,32,53,1),(NULL,32,54,1),(NULL,33,55,1),(NULL,33,56,1),(NULL,34,57,1),(NULL,34,58,1),(NULL,35,59,1),(NULL,35,60,1),(NULL,36,61,1),(NULL,36,62,1),(NULL,37,63,1),(NULL,37,64,1),(NULL,38,65,1),(NULL,38,66,1),(NULL,39,67,1),(NULL,39,68,1),(NULL,40,69,1),(NULL,40,70,1),(NULL,41,71,1),(NULL,41,72,1),(NULL,42,73,1),(NULL,42,74,1),(NULL,43,75,1),(NULL,43,76,1),(NULL,44,77,1),(NULL,44,78,1),(NULL,45,79,1),(NULL,45,80,1),(NULL,46,81,1),(NULL,46,82,1),(NULL,50,83,1);
/*!40000 ALTER TABLE `product_item_in_warehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_item_options`
--

DROP TABLE IF EXISTS `product_item_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_item_options` (
  `product_item_id` int NOT NULL,
  `variation_option_id` int NOT NULL,
  KEY `FK36su826ewlun31ve1agwa8uih` (`variation_option_id`),
  KEY `FKhixakfdkk6owppho793jeb5yo` (`product_item_id`),
  CONSTRAINT `FK36su826ewlun31ve1agwa8uih` FOREIGN KEY (`variation_option_id`) REFERENCES `variation_option` (`id`),
  CONSTRAINT `FKhixakfdkk6owppho793jeb5yo` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_item_options`
--

LOCK TABLES `product_item_options` WRITE;
/*!40000 ALTER TABLE `product_item_options` DISABLE KEYS */;
INSERT INTO `product_item_options` VALUES (1,1),(2,2),(3,1),(4,3),(5,2),(6,5),(7,6),(9,8),(10,7),(11,1),(12,1),(13,9),(14,7),(15,1),(15,10),(16,2),(17,11),(19,16),(19,17),(19,18),(20,19),(20,17),(20,15),(21,13),(21,14),(21,15),(23,16),(23,20),(23,15),(23,21),(23,22),(24,13),(24,23),(24,15),(24,21),(24,22),(26,25),(26,15),(26,21),(26,22),(27,24),(27,23),(27,15),(27,21),(27,22),(28,13),(28,20),(29,13),(29,23),(30,26),(30,15),(30,21),(31,28),(31,15),(31,27),(32,29),(32,15),(32,21),(33,30),(33,15),(33,21),(33,31),(34,32),(34,15),(34,21),(34,22),(35,33),(35,15),(35,21),(35,31),(36,34),(36,15),(36,21),(36,31),(37,35),(37,36),(37,21),(37,31),(38,28),(38,15),(38,21),(38,31),(39,35),(39,36),(39,21),(39,31),(40,16),(40,17),(40,15),(40,22),(41,13),(41,20),(41,15),(41,22),(42,24),(42,37),(42,36),(42,38),(43,32),(43,15),(43,21),(43,22),(44,33),(44,15),(44,27),(44,22),(45,39),(45,15),(45,21),(45,22),(47,28),(47,15),(47,27),(47,38),(48,32),(48,15),(48,21),(48,22),(49,39),(49,15),(49,21),(49,22),(50,28),(50,15),(50,27),(50,38),(51,32),(51,15),(51,21),(51,22),(52,28),(52,15),(52,27),(52,41),(53,32),(53,15),(53,21),(53,22),(54,33),(54,15),(54,27),(54,22),(55,13),(55,42),(55,15),(55,21),(56,24),(56,43),(56,15),(56,21),(57,44),(57,45),(57,15),(57,21),(58,13),(58,42),(58,15),(58,21),(59,24),(59,43),(59,15),(59,21),(60,46),(60,45),(60,15),(60,21),(61,47),(61,48),(61,36),(61,27),(61,41),(62,46),(62,45),(62,15),(62,21),(62,22),(63,49),(63,45),(63,15),(63,21),(63,22),(64,20),(64,15),(64,31),(65,23),(65,15),(65,41),(66,50),(66,51),(67,50),(67,52),(68,50),(68,53),(69,54),(69,53),(70,54),(70,51),(71,54),(71,52),(72,55),(72,10),(73,55),(73,56),(74,55),(74,57),(75,58),(75,10),(76,58),(76,57),(77,58),(77,56),(78,54),(78,56),(79,54),(79,57),(80,55),(80,57),(81,55),(81,56),(82,58),(82,56),(83,58),(83,57),(85,55),(85,57),(86,55),(86,56),(87,58),(87,56),(88,58),(88,57),(89,59),(89,57),(90,59),(90,56),(91,54),(91,10),(92,54),(92,56),(93,54),(93,57),(94,54),(94,60),(95,55),(95,60),(96,55),(96,10),(97,55),(97,56),(98,55),(98,57),(99,58),(99,57),(100,58),(100,56),(101,58),(101,60),(102,58),(102,10),(103,5),(103,57),(104,5),(104,10),(105,5),(105,56),(106,61),(106,10),(107,61),(107,56),(108,61),(108,57),(109,62),(109,57),(110,62),(110,56),(111,62),(111,10),(112,62),(112,10),(113,62),(113,56),(114,62),(114,57),(115,63),(115,57),(116,63),(116,56),(117,63),(117,10),(118,61),(118,10),(119,61),(119,56),(120,61),(120,57),(121,62),(121,57),(122,62),(122,56),(123,62),(123,10),(124,54),(124,10),(125,54),(125,56),(126,54),(126,57),(127,54),(127,64),(128,55),(128,10),(129,55),(129,56),(130,55),(130,57),(131,55),(131,64),(136,58),(136,10),(137,58),(137,56),(138,58),(138,57),(139,58),(139,64),(140,55),(140,10),(141,55),(141,64),(142,58),(142,64),(143,58),(143,10),(144,65),(144,57),(145,65),(145,66),(146,65),(146,64),(147,67),(147,10),(148,67),(148,57),(149,67),(149,64),(150,68),(150,10),(151,68),(151,57),(152,69),(152,57),(153,69),(153,60),(154,70),(154,60),(155,70),(155,64),(156,71),(156,57),(157,71),(157,72),(158,71),(158,66),(160,73),(160,60),(161,73),(161,57),(162,73),(162,66),(163,62),(163,57),(164,2),(164,57),(165,62),(165,64),(166,64),(167,57),(168,74),(168,56),(169,74),(169,10),(170,75),(170,10),(171,76),(171,10),(172,76),(172,57),(173,77),(173,57),(174,77),(174,10),(175,66),(176,57),(177,72),(178,56),(179,57),(180,78),(181,79),(182,80),(183,81),(187,84),(188,82),(189,83),(190,85),(191,85),(192,85),(193,85),(194,86),(195,87),(196,88),(197,91),(198,88),(199,92),(200,57),(201,10),(202,93),(203,94),(204,95),(205,57),(206,56),(207,64),(208,57),(209,56),(210,64),(211,72),(212,57),(213,57),(214,57),(215,56),(216,57),(217,56),(218,56),(219,57),(220,57),(221,64),(222,72),(223,56),(224,57),(225,96),(225,97),(225,98),(226,99),(226,100),(226,101),(227,102),(227,103),(227,104),(229,106),(229,107),(229,108),(229,109),(230,110),(230,96),(230,97),(230,105),(231,96),(231,100),(231,111),(232,96),(232,97),(232,101),(233,96),(233,108),(233,109),(234,96),(234,97),(234,112),(235,107),(235,108),(235,112),(236,107),(236,103),(236,109),(237,114),(237,96),(237,100),(237,105),(238,114),(238,107),(238,97),(238,115),(239,110),(239,96),(239,108),(239,115),(240,114),(240,116),(240,117),(240,115),(241,96),(241,108),(241,118),(242,107),(242,108),(242,118),(243,119),(243,100),(243,120),(244,96),(244,100),(244,120),(245,121),(246,122),(247,123),(248,124),(249,125),(250,126),(251,56),(252,57),(253,10),(254,127),(255,128),(256,129),(257,128),(258,129),(259,56),(260,57),(261,57),(262,130),(263,131),(264,57),(265,57);
/*!40000 ALTER TABLE `product_item_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `prospectiveUser`
--

DROP TABLE IF EXISTS `prospectiveUser`;
/*!50001 DROP VIEW IF EXISTS `prospectiveUser`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `prospectiveUser` AS SELECT 
 1 AS `id`,
 1 AS `date_of_birth`,
 1 AS `email`,
 1 AS `firstname`,
 1 AS `gender`,
 1 AS `lastname`,
 1 AS `phone_number`,
 1 AS `picture`,
 1 AS `total_amount`,
 1 AS `total_order`,
 1 AS `user_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `prospectiveuser`
--

DROP TABLE IF EXISTS `prospectiveuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prospectiveuser` (
  `id` int NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `total_amount` decimal(40,2) DEFAULT NULL,
  `total_order` bigint NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prospectiveuser`
--

LOCK TABLES `prospectiveuser` WRITE;
/*!40000 ALTER TABLE `prospectiveuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `prospectiveuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expired_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `account_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_r4k4edos30bx9neoq81mdvwph` (`token`),
  KEY `FKiox3wo9jixvp9boxfheq7l99w` (`account_id`),
  CONSTRAINT `FKiox3wo9jixvp9boxfheq7l99w` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (1,'2026-03-05 08:24:20.016967','aa8a6e28-c881-4253-826b-9a8801ded962',1),(2,'2026-03-05 08:25:50.858239','0ba384fd-615e-4280-9577-6247eb506847',2);
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'USER'),(2,'ADMIN'),(3,'SUPER_ADMIN');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_method`
--

DROP TABLE IF EXISTS `shipping_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_method` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_method`
--

LOCK TABLES `shipping_method` WRITE;
/*!40000 ALTER TABLE `shipping_method` DISABLE KEYS */;
INSERT INTO `shipping_method` VALUES (1,'STANDARD',50000.00),(2,'FAST',10000.00),(3,'EXPRESS',20000.00),(4,'STANDARD',50000.00),(5,'FAST',10000.00),(6,'EXPRESS',20000.00);
/*!40000 ALTER TABLE `shipping_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note` tinytext,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(18,2) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `payment_id` int NOT NULL,
  `shipping_method` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_fjpvl16s95xxxjjagg39fbngs` (`payment_id`),
  KEY `FK7qvgu9j9j0webqibpbjggiq10` (`address_id`),
  KEY `FKatxhfqwimvpshgr64ifo6dx2o` (`shipping_method`),
  KEY `FK7ln2hb3a1ugyr7h92rloxv0b` (`user_id`),
  CONSTRAINT `FK7ln2hb3a1ugyr7h92rloxv0b` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK7qvgu9j9j0webqibpbjggiq10` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FKatxhfqwimvpshgr64ifo6dx2o` FOREIGN KEY (`shipping_method`) REFERENCES `shipping_method` (`id`),
  CONSTRAINT `FKbirtnc4ybtp8rr0a76tl04by4` FOREIGN KEY (`payment_id`) REFERENCES `shop_order_payment` (`id`),
  CONSTRAINT `shop_order_chk_1` CHECK ((`total` >= 1))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order`
--

LOCK TABLES `shop_order` WRITE;
/*!40000 ALTER TABLE `shop_order` DISABLE KEYS */;
INSERT INTO `shop_order` VALUES (1,NULL,'2026-03-21 02:43:32',46940000.00,1,1,1,1),(2,NULL,'2026-03-21 02:45:52',26950000.00,1,1,2,1),(3,NULL,'2026-03-22 02:27:11',17540000.00,1,1,3,1),(4,'Mock order for Feb growth #1','2026-02-10 09:15:00',12500000.00,1,NULL,4,1),(5,'Mock order for Feb growth #2','2026-02-16 14:20:00',17800000.00,1,NULL,5,1),(6,'Mock order for Feb growth #3','2026-02-24 18:05:00',9900000.00,2,NULL,6,1),(7,NULL,'2026-03-24 04:02:57',25950000.00,1,1,7,1),(8,NULL,'2026-03-24 04:24:18',17543000.00,1,1,8,1);
/*!40000 ALTER TABLE `shop_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order_payment`
--

DROP TABLE IF EXISTS `shop_order_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `order_number` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ol8owhr7hqq2343u8qhqi2cq` (`payment_id`),
  CONSTRAINT `FK7ol8owhr7hqq2343u8qhqi2cq` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order_payment`
--

LOCK TABLES `shop_order_payment` WRITE;
/*!40000 ALTER TABLE `shop_order_payment` DISABLE KEYS */;
INSERT INTO `shop_order_payment` VALUES (1,NULL,NULL,3,NULL,1),(2,NULL,NULL,3,NULL,1),(3,NULL,NULL,3,NULL,1),(4,'2026-02-10 09:15:00.000000','MOCK-FEB-2026-001',1,'2026-02-10 09:15:00',1),(5,'2026-02-16 14:20:00.000000','MOCK-FEB-2026-002',1,'2026-02-16 14:20:00',1),(6,'2026-02-24 18:05:00.000000','MOCK-FEB-2026-003',1,'2026-02-24 18:05:00',1),(7,NULL,NULL,3,NULL,1),(8,NULL,NULL,3,NULL,1);
/*!40000 ALTER TABLE `shop_order_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order_status`
--

DROP TABLE IF EXISTS `shop_order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `detail` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `shop_order_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK3tq3odenne3ku7bwni90exe9k` (`shop_order_id`),
  CONSTRAINT `FK3tq3odenne3ku7bwni90exe9k` FOREIGN KEY (`shop_order_id`) REFERENCES `shop_order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order_status`
--

LOCK TABLES `shop_order_status` WRITE;
/*!40000 ALTER TABLE `shop_order_status` DISABLE KEYS */;
INSERT INTO `shop_order_status` VALUES (1,NULL,'Order created - awaiting payment',1,1,'2026-03-20 19:43:31'),(2,'Order confirmed by admin','Order confirmed by admin',1,3,'2026-03-20 19:43:56'),(3,NULL,'Warehouse is preparing order',1,4,'2026-03-20 19:43:58'),(4,'GHN123456789 ','Order shipped via GHN',1,5,'2026-03-20 19:44:08'),(5,NULL,'Delivery successful. COD payment of 46,940,000₫ collected',1,6,'2026-03-20 19:44:10'),(6,NULL,'Order completed',1,7,'2026-03-20 19:44:13'),(7,NULL,'Order created - awaiting payment',2,1,'2026-03-20 19:45:52'),(8,'Order confirmed by admin','Order confirmed by admin',2,3,'2026-03-20 19:46:21'),(9,NULL,'Warehouse is preparing order',2,4,'2026-03-20 19:46:24'),(10,'GHN123456789 ','Order shipped via GHN',2,5,'2026-03-20 19:46:29'),(11,NULL,'Delivery successful. COD payment of 26,950,000₫ collected',2,6,'2026-03-20 19:46:31'),(12,NULL,'Order completed',2,7,'2026-03-20 19:46:44'),(13,NULL,'Order created - awaiting payment',3,1,'2026-03-21 19:27:10'),(14,'Order confirmed by admin','Order confirmed by admin',3,3,'2026-03-21 19:27:38'),(15,NULL,'Warehouse is preparing order',3,4,'2026-03-21 19:27:41'),(16,'JT1234567890','Order shipped via J&T Express',3,5,'2026-03-21 19:27:45'),(17,NULL,'Delivery successful. COD payment of 17,540,000₫ collected',3,6,'2026-03-21 19:27:48'),(18,NULL,'Order completed',3,7,'2026-03-21 19:27:50'),(19,'Completed','Mock completed order #1',4,7,'2026-02-10 10:00:00'),(20,'Completed','Mock completed order #2',5,7,'2026-02-16 15:00:00'),(21,'Completed','Mock completed order #3',6,7,'2026-02-24 18:30:00'),(22,NULL,'Order created - awaiting payment',7,1,'2026-03-23 21:02:57'),(23,'Order confirmed by admin','Order confirmed by admin',7,3,'2026-03-23 21:05:01'),(24,NULL,'Warehouse is preparing order',7,4,'2026-03-23 21:05:03'),(25,'JT1234567890','Order shipped via J&T Express',7,5,'2026-03-23 21:05:07'),(26,NULL,'Delivery successful. COD payment of 25,950,000₫ collected',7,6,'2026-03-23 21:05:09'),(27,NULL,'Order completed',7,7,'2026-03-23 21:05:11'),(28,NULL,'Order created - awaiting payment',8,1,'2026-03-23 21:24:17');
/*!40000 ALTER TABLE `shop_order_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'2026-03-12','long@gmail.com','long','Male','long','0123488888',NULL,'2026-03-21 19:17:43.268530'),(2,'2026-03-02','long1@gmail.com','long','Male','long','0123488887',NULL,'2026-03-21 19:17:43.268530');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `is_business` bit(1) DEFAULT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`address_id`,`user_id`),
  KEY `FKk2ox3w9jm7yd6v1m5f68xibry` (`user_id`),
  CONSTRAINT `FKdaaxogn1ss81gkcsdn05wi6jp` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FKk2ox3w9jm7yd6v1m5f68xibry` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (NULL,_binary '','0961994576',1,1);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_payment`
--

DROP TABLE IF EXISTS `user_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_number` int DEFAULT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `is_default` tinyint DEFAULT NULL,
  `payment_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp26q7g746j5gga3w5l1ulr0mq` (`payment_type_id`),
  KEY `FK8fb9fr82lb1qk2cw55ito9rk6` (`user_id`),
  CONSTRAINT `FK8fb9fr82lb1qk2cw55ito9rk6` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKp26q7g746j5gga3w5l1ulr0mq` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_method` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_payment`
--

LOCK TABLES `user_payment` WRITE;
/*!40000 ALTER TABLE `user_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variation`
--

DROP TABLE IF EXISTS `variation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation`
--

LOCK TABLES `variation` WRITE;
/*!40000 ALTER TABLE `variation` DISABLE KEYS */;
INSERT INTO `variation` VALUES (1,'Phiên bản'),(2,'Màu sắc'),(3,'GPU'),(4,'Bộ vi xử lý'),(5,'RAM'),(6,'Ổ cứng'),(7,'Màn hình'),(8,'Kích thước'),(9,'Độ phân giải'),(10,'Tần số quét');
/*!40000 ALTER TABLE `variation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variation_option`
--

DROP TABLE IF EXISTS `variation_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variation_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) DEFAULT NULL,
  `variation_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlfkypq92cr21b9mtc7mihks1e` (`variation_id`),
  CONSTRAINT `FKlfkypq92cr21b9mtc7mihks1e` FOREIGN KEY (`variation_id`) REFERENCES `variation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation_option`
--

LOCK TABLES `variation_option` WRITE;
/*!40000 ALTER TABLE `variation_option` DISABLE KEYS */;
INSERT INTO `variation_option` VALUES (1,'16GB-256GB',1),(2,'16GB-512GB',1),(3,'8GB-256GB',1),(4,'8GB-256GB',1),(5,'16GB-1TB',1),(6,'24GB-1TB',1),(7,'32GB-1TB',1),(8,'32GB-512GB',1),(9,'32GB-256GB',1),(10,'Xanh',2),(11,'24GB-512GB',1),(12,'24GB-512GB',1),(13,'6GB-RTX3050',3),(14,'i7-12650H',4),(15,'16GB',5),(16,'4GB-RTX2050',3),(17,'i5-12450H',4),(18,'8GB',5),(19,'4GB-RTX3050',3),(20,'i5-13420H',4),(21,'512GB SSD',6),(22,'15.6',7),(23,' i7-13620H',4),(24,'6GB-RTX4050',3),(25,'i5-13500H',4),(26,'U5-125H',4),(27,'1TB SSD',6),(28,'U5-226V',4),(29,'U7-155U',4),(30,'i3-1315U',4),(31,'14',7),(32,'i5-1334U',4),(33,'i7-1355U',4),(34,'U5-226V',4),(35,'U7-255H',4),(36,'32GB',5),(37,'R5-7640HS',4),(38,'16.1',7),(39,'R5-7530U',4),(40,'15',7),(41,'16',7),(42,'i5-12450HX',4),(43,'R7-7735HS',4),(44,'8GB-RTX4050',3),(45,'i7-13650HX',4),(46,'8GB-RTX5050',3),(47,'16GB-RTX5080',3),(48,'U9-275HX',4),(49,'8GB-RTX5060',3),(50,'2TB',1),(51,'Xanh đậm',2),(52,'Cam vũ trụ',2),(53,'Bạc',2),(54,'1TB',1),(55,'512GB',1),(56,'Trắng',2),(57,'Đen',2),(58,'256GB',1),(59,'128GB',1),(60,'Vàng',2),(61,'12GB-512GB',1),(62,'12GB-256GB',1),(63,'12GB-128GB',1),(64,'Xám',2),(65,'Note 15 Pro 5G 12GB 256GB',1),(66,'Tím',2),(67,'Note 15 Pro 12GB 256GB',1),(68,'Note 15 5G 6GB 128GB',1),(69,'15T',1),(70,'15T Pro',1),(71,'Note 14 6GB 128GB',1),(72,'Xanh lá',2),(73,'Note 14 Pro Plus 5G 8GB 256GB',1),(74,'Reno15',1),(75,'Reno15F',1),(76,'8GB-128GB',1),(77,'6GB-128GB',1),(78,'Windows 10 Pro',1),(79,'Windows 11 Pro',1),(80,'Windows 10 Education',1),(81,'Windows 11 Education',1),(82,'Office 2016 Professional Plus (Windows)',1),(83,'Office 2016 Professional Plus (MacOS)',1),(84,'Microsoft 365 (Office 365) 1 năm 1TB',1),(85,'1 năm',1),(86,'7 ngày',1),(87,'35 ngày',1),(88,'1 năm',1),(89,'1 năm',1),(90,'1 năm',1),(91,'1 tháng',1),(92,'Cam',2),(93,'Field 1',1),(94,'Field 3',1),(95,'Field 5',1),(96,'27 inch',8),(97,'2K',9),(98,'210Hz',10),(99,'25 inch',8),(100,'FHD',9),(101,'200Hz',10),(102,'34 inch',8),(103,'WQHD',9),(104,'250HZ',10),(105,'180Hz',10),(106,'OLED',1),(107,'32 inch',8),(108,'4K',9),(109,'240Hz',10),(110,'IPS',1),(111,'144Hz',10),(112,'480Hz',10),(113,'39 inch',8),(114,'VA',1),(115,'165Hz',10),(116,'49 inch',8),(117,'DQHD',9),(118,'60Hz',10),(119,'24 inch',8),(120,'75Hz',10),(121,'Thường',1),(122,'Chống ồn chủ động',1),(123,'AirPods Pro 3',1),(124,'AirPods Pro 2',1),(125,'MTJY3ZA/A',1),(126,'MYQY3ZA/A',1),(127,'Hồng',2),(128,'2S',1),(129,'3S',1),(130,'GK100',1),(131,'GK300',1);
/*!40000 ALTER TABLE `variation_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `detail` varchar(255) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `status` enum('OPERATIONAL','FULL','INACTIVE') DEFAULT NULL,
  `status_manual_override` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp7xymgre8vt94ihf75e9movyt` (`address_id`),
  CONSTRAINT `FKp7xymgre8vt94ihf75e9movyt` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse`
--

LOCK TABLES `warehouse` WRITE;
/*!40000 ALTER TABLE `warehouse` DISABLE KEYS */;
INSERT INTO `warehouse` VALUES (1,'This is a warehouse object','Warehouse 1',NULL,NULL,'OPERATIONAL',NULL),(2,'This is a warehouse object','Warehouse 2',NULL,NULL,NULL,NULL),(3,'This is a warehouse object','Warehouse 3',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `warehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `AccountStatisticsView`
--

/*!50001 DROP VIEW IF EXISTS `AccountStatisticsView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`WebServices_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `AccountStatisticsView` AS select count(0) AS `total_accounts`,sum((case when (`account`.`status` = 1) then 1 else 0 end)) AS `total_status_1`,sum((case when (`account`.`status` = 2) then 1 else 0 end)) AS `total_status_2`,sum((case when (`account`.`status` = 3) then 1 else 0 end)) AS `total_status_3` from `account` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `MostOrderedPdView`
--

/*!50001 DROP VIEW IF EXISTS `MostOrderedPdView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`WebServices_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `MostOrderedPdView` AS select `product`.`id` AS `id`,`product`.`category_id` AS `category_id`,`product`.`description` AS `description`,`product`.`manufacturer` AS `manufacturer`,`product`.`name` AS `name`,`product`.`picture` AS `picture`,`product_total`.`total` AS `total`,`product_total`.`product_id` AS `product_id` from (`product` join (select sum(`total`.`total`) AS `total`,`product_item`.`product_id` AS `product_id` from (`product_item` join (select count(0) AS `total`,`order_line`.`product_item_id` AS `product_item_id` from (`order_line` join `shop_order` on((`order_line`.`order_id` = `shop_order`.`id`))) group by `order_line`.`product_item_id` order by count(0) desc) `total` on((`total`.`product_item_id` = `product_item`.`id`))) group by `product_item`.`product_id`) `product_total` on((`product`.`id` = `product_total`.`product_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `prospectiveUser`
--

/*!50001 DROP VIEW IF EXISTS `prospectiveUser`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`WebServices_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `prospectiveUser` AS select `user`.`id` AS `id`,`user`.`date_of_birth` AS `date_of_birth`,`user`.`email` AS `email`,`user`.`firstname` AS `firstname`,`user`.`gender` AS `gender`,`user`.`lastname` AS `lastname`,`user`.`phone_number` AS `phone_number`,`user`.`picture` AS `picture`,`user_order_total`.`total_amount` AS `total_amount`,`user_order_total`.`total_order` AS `total_order`,`user_order_total`.`user_id` AS `user_id` from (`user` join (select sum(`shop_order`.`total`) AS `total_amount`,count(0) AS `total_order`,`shop_order`.`user_id` AS `user_id` from `shop_order` group by `shop_order`.`user_id` order by `total_amount` desc) `user_order_total` on((`user`.`id` = `user_order_total`.`user_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23 21:34:12
