-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               9.6.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.16.0.7229
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for dgcc
CREATE DATABASE IF NOT EXISTS `dgcc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dgcc`;

-- Dumping structure for table dgcc.agent
CREATE TABLE IF NOT EXISTS `agent` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `num_matricule` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `droit_id` int DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `is_on_line` tinyint(1) NOT NULL DEFAULT '0',
  `last_activity` datetime DEFAULT NULL,
  `code_verification` varchar(255) DEFAULT NULL,
  `reset_code_expiry` datetime DEFAULT NULL,
  `is_verified_for_reset` tinyint(1) DEFAULT '0',
  `photo_profil` varchar(255) DEFAULT '',
  `fonction_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `enregistrer_par` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `telephone_2` (`telephone`),
  UNIQUE KEY `username_2` (`username`),
  KEY `droit_id` (`droit_id`),
  KEY `fonction_id` (`fonction_id`),
  KEY `enregistrer_par` (`enregistrer_par`),
  CONSTRAINT `agent_ibfk_4` FOREIGN KEY (`droit_id`) REFERENCES `droit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_ibfk_5` FOREIGN KEY (`fonction_id`) REFERENCES `fonctions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_ibfk_6` FOREIGN KEY (`enregistrer_par`) REFERENCES `agent` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.agent: ~2 rows (approximately)
INSERT INTO `agent` (`id`, `nom`, `prenom`, `num_matricule`, `email`, `password`, `telephone`, `droit_id`, `username`, `is_on_line`, `last_activity`, `code_verification`, `reset_code_expiry`, `is_verified_for_reset`, `photo_profil`, `fonction_id`, `created_at`, `updated_at`, `enregistrer_par`) VALUES
	(1, 'Diouma', 'Mamadou', 'ADMIN001', 'admin@systeme.local', '$2b$10$CMnadSa9NgJHKL94/Vyzi.T7hWSycNCb0U7GBytZztrJOEUpsU9nm', '+22360068815', 1, 'admin1234', 1, '2026-04-14 15:02:55', NULL, NULL, 1, '', 1, '2026-04-06 09:52:03', '2026-04-14 15:02:55', NULL),
	(2, 'YK', 'Michel', 'ARCH001', 'michelyk2020@gmail.com', '$2b$10$nx2022satfZYNtGznapgJO4gAqTGCk2OewAljT0LA3JfikDm0GpCa', '71979418', 2, 'yk71', 0, '2026-04-13 22:07:33', NULL, NULL, 0, '', 2, '2026-04-10 11:11:31', '2026-04-13 22:07:33', NULL);

-- Dumping structure for table dgcc.agent_entitee_access
CREATE TABLE IF NOT EXISTS `agent_entitee_access` (
  `id` int NOT NULL AUTO_INCREMENT,
  `direction_id` int DEFAULT NULL,
  `sous_direction_id` int DEFAULT NULL,
  `division_id` int DEFAULT NULL,
  `section_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `agent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `direction_id` (`direction_id`),
  KEY `sous_direction_id` (`sous_direction_id`),
  KEY `division_id` (`division_id`),
  KEY `section_id` (`section_id`),
  KEY `service_id` (`service_id`),
  KEY `agent_id` (`agent_id`),
  CONSTRAINT `agent_entitee_access_ibfk_1` FOREIGN KEY (`direction_id`) REFERENCES `directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_entitee_access_ibfk_2` FOREIGN KEY (`sous_direction_id`) REFERENCES `sous_directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_entitee_access_ibfk_3` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_entitee_access_ibfk_4` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_entitee_access_ibfk_5` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `agent_entitee_access_ibfk_6` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.agent_entitee_access: ~3 rows (approximately)

-- Dumping structure for table dgcc.directions
CREATE TABLE IF NOT EXISTS `directions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.directions: ~2 rows (approximately)
INSERT INTO `directions` (`id`, `code`, `libelle`, `created_at`, `updated_at`) VALUES
	(1, 'DG', 'Direction général', '2026-04-06 09:56:03', '2026-04-06 09:56:03');

-- Dumping structure for table dgcc.divisions
CREATE TABLE IF NOT EXISTS `divisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `sous_direction_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  KEY `sous_direction_id` (`sous_direction_id`),
  CONSTRAINT `divisions_ibfk_1` FOREIGN KEY (`sous_direction_id`) REFERENCES `sous_directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.divisions: ~1 rows (approximately)

-- Dumping structure for table dgcc.document_fichiers
CREATE TABLE IF NOT EXISTS `document_fichiers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` int NOT NULL,
  `piece_id` int DEFAULT NULL,
  `piece_value_id` int DEFAULT NULL,
  `fichier` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `new_file_name` varchar(255) DEFAULT NULL,
  `mode` enum('INDIVIDUEL','LOT_UNIQUE') NOT NULL DEFAULT 'INDIVIDUEL',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `document_value_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `document_id` (`document_id`),
  KEY `piece_id` (`piece_id`),
  KEY `piece_value_id` (`piece_value_id`),
  KEY `document_value_id` (`document_value_id`),
  CONSTRAINT `document_fichiers_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `document_fichiers_ibfk_2` FOREIGN KEY (`piece_id`) REFERENCES `pieces` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `document_fichiers_ibfk_3` FOREIGN KEY (`piece_value_id`) REFERENCES `piece_values` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `document_fichiers_ibfk_4` FOREIGN KEY (`document_value_id`) REFERENCES `documentvalues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.document_fichiers: ~0 rows (approximately)

-- Dumping structure for table dgcc.document_files
CREATE TABLE IF NOT EXISTS `document_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `size` int DEFAULT NULL,
  `mimetype` varchar(255) DEFAULT NULL,
  `document_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `document_value_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `document_id` (`document_id`),
  KEY `document_value_id` (`document_value_id`),
  CONSTRAINT `document_files_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `document_files_ibfk_2` FOREIGN KEY (`document_value_id`) REFERENCES `documentvalues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.document_files: ~0 rows (approximately)

-- Dumping structure for table dgcc.document_pieces
CREATE TABLE IF NOT EXISTS `document_pieces` (
  `document_id` int NOT NULL,
  `piece_id` int NOT NULL,
  `disponible` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`document_id`,`piece_id`),
  UNIQUE KEY `document_pieces_document_id_piece_id_unique` (`document_id`,`piece_id`),
  KEY `piece_id` (`piece_id`),
  CONSTRAINT `document_pieces_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `document_pieces_ibfk_2` FOREIGN KEY (`piece_id`) REFERENCES `pieces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.document_pieces: ~0 rows (approximately)

-- Dumping structure for table dgcc.document_type_pieces
CREATE TABLE IF NOT EXISTS `document_type_pieces` (
  `document_type_id` int NOT NULL,
  `piece_id` int NOT NULL,
  PRIMARY KEY (`document_type_id`,`piece_id`),
  UNIQUE KEY `document_type_pieces_document_type_id_piece_id_unique` (`document_type_id`,`piece_id`),
  KEY `piece_id` (`piece_id`),
  CONSTRAINT `document_type_pieces_ibfk_1` FOREIGN KEY (`document_type_id`) REFERENCES `typedocuments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `document_type_pieces_ibfk_2` FOREIGN KEY (`piece_id`) REFERENCES `pieces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.document_type_pieces: ~0 rows (approximately)

-- Dumping structure for table dgcc.documents
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_document_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_document_id` (`type_document_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`type_document_id`) REFERENCES `typedocuments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.documents: ~0 rows (approximately)

-- Dumping structure for table dgcc.documentvalues
CREATE TABLE IF NOT EXISTS `documentvalues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `meta_field_id` int DEFAULT NULL,
  `document_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `meta_field_id` (`meta_field_id`),
  KEY `document_id` (`document_id`),
  CONSTRAINT `documentvalues_ibfk_1` FOREIGN KEY (`meta_field_id`) REFERENCES `metafields` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `documentvalues_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.documentvalues: ~0 rows (approximately)

-- Dumping structure for table dgcc.droit
CREATE TABLE IF NOT EXISTS `droit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.droit: ~2 rows (approximately)
INSERT INTO `droit` (`id`, `libelle`, `created_at`, `updated_at`) VALUES
	(1, 'Administrateur', '2026-04-06 09:52:03', '2026-04-06 09:52:03'),
	(2, 'Archiviste', '2026-04-10 10:46:50', '2026-04-10 10:46:50');

-- Dumping structure for table dgcc.droit_permission
CREATE TABLE IF NOT EXISTS `droit_permission` (
  `permission_id` int NOT NULL,
  `droit_id` int NOT NULL,
  PRIMARY KEY (`permission_id`,`droit_id`),
  KEY `droit_id` (`droit_id`),
  CONSTRAINT `droit_permission_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `droit_permission_ibfk_2` FOREIGN KEY (`droit_id`) REFERENCES `droit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.droit_permission: ~107 rows (approximately)
INSERT INTO `droit_permission` (`permission_id`, `droit_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 1),
	(7, 1),
	(8, 1),
	(9, 1),
	(10, 1),
	(11, 1),
	(12, 1),
	(13, 1),
	(14, 1),
	(15, 1),
	(16, 1),
	(17, 1),
	(18, 1),
	(19, 1),
	(20, 1),
	(21, 1),
	(22, 1),
	(23, 1),
	(24, 1),
	(25, 1),
	(26, 1),
	(27, 1),
	(28, 1),
	(29, 1),
	(30, 1),
	(30, 2),
	(31, 1),
	(31, 2),
	(32, 1),
	(32, 2),
	(33, 1),
	(33, 2),
	(34, 1),
	(34, 2),
	(35, 1),
	(36, 1),
	(36, 2),
	(37, 1),
	(38, 1),
	(39, 1),
	(40, 1),
	(41, 1),
	(42, 1),
	(43, 1),
	(44, 1),
	(44, 2),
	(45, 1),
	(46, 1),
	(47, 1),
	(48, 1),
	(49, 1),
	(49, 2),
	(50, 1),
	(51, 1),
	(52, 1),
	(53, 1),
	(54, 1),
	(54, 2),
	(55, 1),
	(56, 1),
	(57, 1),
	(58, 1),
	(59, 1),
	(59, 2),
	(60, 1),
	(61, 1),
	(62, 1),
	(63, 1),
	(64, 1),
	(64, 2),
	(65, 1),
	(66, 1),
	(67, 1),
	(68, 1),
	(69, 1),
	(70, 1),
	(71, 1),
	(72, 1),
	(73, 1),
	(74, 1),
	(75, 1),
	(76, 1),
	(77, 1),
	(78, 1),
	(79, 1),
	(80, 1),
	(81, 1),
	(82, 1),
	(83, 1),
	(84, 1),
	(85, 1),
	(86, 1),
	(87, 1),
	(88, 1),
	(89, 1),
	(90, 1),
	(91, 1),
	(92, 1),
	(93, 1),
	(94, 1),
	(95, 1),
	(96, 1);

-- Dumping structure for table dgcc.exercice
CREATE TABLE IF NOT EXISTS `exercice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `annee` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `annee` (`annee`),
  UNIQUE KEY `annee_2` (`annee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.exercice: ~0 rows (approximately)

-- Dumping structure for table dgcc.fonctions
CREATE TABLE IF NOT EXISTS `fonctions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `direction_id` int DEFAULT NULL,
  `sous_direction_id` int DEFAULT NULL,
  `division_id` int DEFAULT NULL,
  `section_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `direction_id` (`direction_id`),
  KEY `sous_direction_id` (`sous_direction_id`),
  KEY `division_id` (`division_id`),
  KEY `section_id` (`section_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `fonctions_ibfk_10` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fonctions_ibfk_6` FOREIGN KEY (`direction_id`) REFERENCES `directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fonctions_ibfk_7` FOREIGN KEY (`sous_direction_id`) REFERENCES `sous_directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fonctions_ibfk_8` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fonctions_ibfk_9` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.fonctions: ~2 rows (approximately)
INSERT INTO `fonctions` (`id`, `libelle`, `created_at`, `updated_at`, `direction_id`, `sous_direction_id`, `division_id`, `section_id`, `service_id`) VALUES
	(1, 'DSI', '2026-04-06 09:58:26', '2026-04-06 09:58:26', 1, NULL, NULL, NULL, NULL),
	(2, 'DRH', '2026-04-10 10:45:45', '2026-04-10 10:45:45', 1, NULL, NULL, NULL, NULL);

-- Dumping structure for table dgcc.historiquelog
CREATE TABLE IF NOT EXISTS `historiquelog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `agent_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `resource` varchar(255) NOT NULL,
  `resource_id` int DEFAULT NULL,
  `resource_identifier` varchar(255) DEFAULT NULL,
  `description` text,
  `method` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` text,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `deleted_data` json DEFAULT NULL,
  `data` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agent_id` (`agent_id`),
  CONSTRAINT `historiquelog_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=353 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.historiquelog: ~352 rows (approximately)
INSERT INTO `historiquelog` (`id`, `agent_id`, `action`, `resource`, `resource_id`, `resource_identifier`, `description`, `method`, `path`, `status`, `ip`, `user_agent`, `old_data`, `new_data`, `deleted_data`, `data`, `created_at`, `updated_at`) VALUES
	(1, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-06 09:54:58', '2026-04-06 09:54:58'),
	(2, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 25}', '2026-04-06 09:55:27', '2026-04-06 09:55:27'),
	(3, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 10}', '2026-04-06 09:55:27', '2026-04-06 09:55:27'),
	(4, 1, 'create', 'direction', 1, 'Direction général (1)', 'Création de direction : Direction général (1)', 'POST', '/api/directions', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "code": "DG", "libelle": "Direction général", "createdAt": "2026-04-06T09:56:03.495Z", "updatedAt": "2026-04-06T09:56:03.495Z"}', NULL, NULL, '2026-04-06 09:56:03', '2026-04-06 09:56:03'),
	(5, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 43}', '2026-04-06 09:56:12', '2026-04-06 09:56:12'),
	(6, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 23}', '2026-04-06 09:56:12', '2026-04-06 09:56:12'),
	(7, 1, 'update', 'agent', 1, 'Diouma (1)', 'Modification de agent : Diouma (1) - nom: Administrateur → Diouma, prenom: Système → Mamadou, telephone: 0000000000 → +22360068815', 'PUT', '/api/user/update-by-admin/1', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 1, "nom": "Administrateur", "email": "admin@systeme.local", "prenom": "Système", "droit_id": 1, "password": "$2b$10$CMnadSa9NgJHKL94/Vyzi.T7hWSycNCb0U7GBytZztrJOEUpsU9nm", "username": "admin1234", "createdAt": "2026-04-06T09:52:03.000Z", "telephone": "0000000000", "updatedAt": "2026-04-06T09:57:28.000Z", "is_on_line": true, "fonction_id": null, "photo_profil": "", "last_activity": "2026-04-06T09:57:28.000Z", "num_matricule": "ADMIN001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": true}', '{"id": 1, "nom": "Diouma", "email": "admin@systeme.local", "prenom": "Mamadou", "droit_id": 1, "password": "$2b$10$CMnadSa9NgJHKL94/Vyzi.T7hWSycNCb0U7GBytZztrJOEUpsU9nm", "username": "admin1234", "createdAt": "2026-04-06T09:52:03.000Z", "telephone": "+22360068815", "updatedAt": "2026-04-06T09:57:28.000Z", "is_on_line": true, "fonction_id": null, "photo_profil": "", "last_activity": "2026-04-06T09:57:28.000Z", "num_matricule": "ADMIN001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": true}', NULL, NULL, '2026-04-06 09:57:28', '2026-04-06 09:57:28'),
	(8, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 15}', '2026-04-06 09:57:28', '2026-04-06 09:57:28'),
	(9, 1, 'read', 'fonction', NULL, 'liste des fonctions', 'Consultation de la liste des fonctions', 'GET', '/api/fonctions/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 14}', '2026-04-06 09:57:48', '2026-04-06 09:57:48'),
	(10, 1, 'read', 'fonction', NULL, 'liste des fonctions', 'Consultation de la liste des fonctions', 'GET', '/api/fonctions/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 27}', '2026-04-06 09:58:13', '2026-04-06 09:58:13'),
	(11, 1, 'create', 'fonction', 1, 'DSI (1)', 'Création de fonction : DSI (1)', 'POST', '/api/fonctions/', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "libelle": "DSI", "createdAt": "2026-04-06T09:58:26.494Z", "updatedAt": "2026-04-06T09:58:26.494Z", "direction_id": 1}', NULL, NULL, '2026-04-06 09:58:26', '2026-04-06 09:58:26'),
	(12, 1, 'read', 'fonction', NULL, 'liste des fonctions', 'Consultation de la liste des fonctions', 'GET', '/api/fonctions/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 8}', '2026-04-06 09:58:26', '2026-04-06 09:58:26'),
	(13, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 29}', '2026-04-06 09:58:37', '2026-04-06 09:58:37'),
	(14, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 27}', '2026-04-06 09:58:37', '2026-04-06 09:58:37'),
	(15, 1, 'update', 'agent', 1, 'Diouma (1)', 'Modification de agent : Diouma (1) - fonction_id: null → 1', 'PUT', '/api/user/update-by-admin/1', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 1, "nom": "Diouma", "email": "admin@systeme.local", "prenom": "Mamadou", "droit_id": 1, "password": "$2b$10$CMnadSa9NgJHKL94/Vyzi.T7hWSycNCb0U7GBytZztrJOEUpsU9nm", "username": "admin1234", "createdAt": "2026-04-06T09:52:03.000Z", "telephone": "+22360068815", "updatedAt": "2026-04-06T09:58:47.000Z", "is_on_line": true, "fonction_id": null, "photo_profil": "", "last_activity": "2026-04-06T09:58:47.000Z", "num_matricule": "ADMIN001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": true}', '{"id": 1, "nom": "Diouma", "email": "admin@systeme.local", "prenom": "Mamadou", "droit_id": 1, "password": "$2b$10$CMnadSa9NgJHKL94/Vyzi.T7hWSycNCb0U7GBytZztrJOEUpsU9nm", "username": "admin1234", "createdAt": "2026-04-06T09:52:03.000Z", "telephone": "+22360068815", "updatedAt": "2026-04-06T09:58:47.000Z", "is_on_line": true, "fonction_id": 1, "photo_profil": "", "last_activity": "2026-04-06T09:58:47.000Z", "num_matricule": "ADMIN001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": true}', NULL, NULL, '2026-04-06 09:58:47', '2026-04-06 09:58:47'),
	(16, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 14}', '2026-04-06 09:58:48', '2026-04-06 09:58:48'),
	(17, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 8}', '2026-04-06 09:59:21', '2026-04-06 09:59:21'),
	(18, 1, 'create', 'pieces', 1, 'SANS MÉTA (1)', 'Création de pieces : SANS MÉTA (1)', 'POST', '/api/pieces/', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "libelle": "SANS MÉTA", "createdAt": "2026-04-06T10:03:29.491Z", "updatedAt": "2026-04-06T10:03:29.491Z", "code_pieces": "P-001"}', NULL, NULL, '2026-04-06 10:03:29', '2026-04-06 10:03:29'),
	(19, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 5}', '2026-04-06 10:03:29', '2026-04-06 10:03:29'),
	(20, 1, 'create', 'pieces', 2, 'AVEC MÉTA (2)', 'Création de pieces : AVEC MÉTA (2)', 'POST', '/api/pieces/', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "libelle": "AVEC MÉTA", "createdAt": "2026-04-06T10:03:51.756Z", "updatedAt": "2026-04-06T10:03:51.756Z", "code_pieces": "P-002"}', NULL, NULL, '2026-04-06 10:03:51', '2026-04-06 10:03:51'),
	(21, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 3}', '2026-04-06 10:03:51', '2026-04-06 10:03:51'),
	(22, 1, 'create', 'typeDocument', 1, 'facture (1)', 'Création de typeDocument : facture (1)', 'POST', '/api/types-documents', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "nom": "facture", "code": "TD-001", "createdAt": "2026-04-06T10:08:29.175Z", "updatedAt": "2026-04-06T10:08:29.175Z"}', NULL, NULL, '2026-04-06 10:08:29', '2026-04-06 10:08:29'),
	(23, 1, 'create', 'typeDocument', 2, 'marche (2)', 'Création de typeDocument : marche (2)', 'POST', '/api/types-documents', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "nom": "marche", "code": "TD-002", "createdAt": "2026-04-06T10:08:44.984Z", "updatedAt": "2026-04-06T10:08:44.984Z"}', NULL, NULL, '2026-04-06 10:08:45', '2026-04-06 10:08:45'),
	(24, 1, 'update', 'typeDocument', 2, 'marché (2)', 'Modification de typeDocument : marché (2) - nom: marche → marché', 'PUT', '/api/types-documents/2', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 2, "nom": "marche", "code": "TD-002", "createdAt": "2026-04-06T10:08:44.000Z", "updatedAt": "2026-04-06T10:08:44.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', '{"id": 2, "nom": "marché", "code": "TD-002", "createdAt": "2026-04-06T10:08:44.000Z", "updatedAt": "2026-04-06T10:08:55.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', NULL, NULL, '2026-04-06 10:08:55', '2026-04-06 10:08:55'),
	(25, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 28}', '2026-04-06 10:09:38', '2026-04-06 10:09:38'),
	(26, 1, 'create', 'direction', 2, 'Direction des systèmes informatique (2)', 'Création de direction : Direction des systèmes informatique (2)', 'POST', '/api/directions', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "code": "DSI", "libelle": "Direction des systèmes informatique", "createdAt": "2026-04-06T10:11:28.991Z", "updatedAt": "2026-04-06T10:11:28.991Z"}', NULL, NULL, '2026-04-06 10:11:29', '2026-04-06 10:11:29'),
	(27, 1, 'update', 'typeDocument_pieces', 2, 'marché (2)', 'Ajout de 2 pièce(s) au type de document', 'POST', '/api/types-documents/2/pieces', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 67, "piecesCount": 2}', '2026-04-06 10:12:01', '2026-04-06 10:12:01'),
	(28, 1, 'update', 'typeDocument_pieces', 1, 'facture (1)', 'Ajout de 2 pièce(s) au type de document', 'POST', '/api/types-documents/1/pieces', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 38, "piecesCount": 2}', '2026-04-06 10:12:14', '2026-04-06 10:12:14'),
	(29, 1, 'update', 'typeDocument', 2, 'marché (2)', 'Modification de typeDocument : marché (2) - direction_id: null → 1', 'PUT', '/api/types-documents/2', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 2, "nom": "marché", "code": "TD-002", "createdAt": "2026-04-06T10:08:44.000Z", "updatedAt": "2026-04-06T10:08:55.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', '{"id": 2, "nom": "marché", "code": "TD-002", "createdAt": "2026-04-06T10:08:44.000Z", "updatedAt": "2026-04-06T10:12:37.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": 1, "sous_direction_id": null}', NULL, NULL, '2026-04-06 10:12:37', '2026-04-06 10:12:37'),
	(30, 1, 'update', 'typeDocument', 1, 'facture (1)', 'Modification de typeDocument : facture (1) - direction_id: null → 2', 'PUT', '/api/types-documents/1', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 1, "nom": "facture", "code": "TD-001", "createdAt": "2026-04-06T10:08:29.000Z", "updatedAt": "2026-04-06T10:08:29.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', '{"id": 1, "nom": "facture", "code": "TD-001", "createdAt": "2026-04-06T10:08:29.000Z", "updatedAt": "2026-04-06T10:12:44.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": 2, "sous_direction_id": null}', NULL, NULL, '2026-04-06 10:12:44', '2026-04-06 10:12:44'),
	(31, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 6}', '2026-04-06 10:13:19', '2026-04-06 10:13:19'),
	(32, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 8}', '2026-04-06 10:13:24', '2026-04-06 10:13:24'),
	(33, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-06 21:20:39', '2026-04-06 21:20:39'),
	(34, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-06 21:20:54', '2026-04-06 21:20:54'),
	(35, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-06 21:25:16', '2026-04-06 21:25:16'),
	(36, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-06 21:25:22', '2026-04-06 21:25:22'),
	(37, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 19}', '2026-04-06 21:25:54', '2026-04-06 21:25:54'),
	(38, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 18}', '2026-04-06 21:26:00', '2026-04-06 21:26:00'),
	(39, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 7}', '2026-04-06 21:26:05', '2026-04-06 21:26:05'),
	(40, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-06 21:27:28', '2026-04-06 21:27:28'),
	(41, 1, 'update', 'typeDocument_pieces', 2, 'marché (2)', 'Ajout de 0 pièce(s) au type de document', 'POST', '/api/types-documents/2/pieces', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 17, "piecesCount": 0}', '2026-04-06 21:28:45', '2026-04-06 21:28:45'),
	(42, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 38}', '2026-04-06 21:28:49', '2026-04-06 21:28:49'),
	(43, 1, 'create', 'pieces', 3, 'SANS META 2 (3)', 'Création de pieces : SANS META 2 (3)', 'POST', '/api/pieces/', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 3, "libelle": "SANS META 2", "createdAt": "2026-04-06T21:29:38.129Z", "updatedAt": "2026-04-06T21:29:38.129Z", "code_pieces": "P-003"}', NULL, NULL, '2026-04-06 21:29:38', '2026-04-06 21:29:38'),
	(44, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 6}', '2026-04-06 21:29:38', '2026-04-06 21:29:38'),
	(45, 1, 'create', 'pieces', 4, 'AVEC META 2 (4)', 'Création de pieces : AVEC META 2 (4)', 'POST', '/api/pieces/', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 4, "libelle": "AVEC META 2", "createdAt": "2026-04-06T21:29:51.275Z", "updatedAt": "2026-04-06T21:29:51.275Z", "code_pieces": "P-004"}', NULL, NULL, '2026-04-06 21:29:51', '2026-04-06 21:29:51'),
	(46, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 4, "duration": 9}', '2026-04-06 21:29:51', '2026-04-06 21:29:51'),
	(47, 1, 'delete', 'pieces', 2, 'AVEC MÉTA (2)', 'Suppression de pieces : AVEC MÉTA (2)', 'DELETE', '/api/pieces/2', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 2, "libelle": "AVEC MÉTA", "createdAt": "2026-04-06T10:03:51.000Z", "updatedAt": "2026-04-06T10:03:51.000Z", "code_pieces": "P-002"}', NULL, '2026-04-06 21:30:00', '2026-04-06 21:30:00'),
	(48, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 6}', '2026-04-06 21:30:00', '2026-04-06 21:30:00'),
	(49, 1, 'delete', 'pieces', 1, 'SANS MÉTA (1)', 'Suppression de pieces : SANS MÉTA (1)', 'DELETE', '/api/pieces/1', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "libelle": "SANS MÉTA", "createdAt": "2026-04-06T10:03:29.000Z", "updatedAt": "2026-04-06T10:03:29.000Z", "code_pieces": "P-001"}', NULL, '2026-04-06 21:30:04', '2026-04-06 21:30:04'),
	(50, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 4}', '2026-04-06 21:30:04', '2026-04-06 21:30:04'),
	(51, 1, 'delete', 'typeDocument', 1, 'facture (1)', 'Suppression de typeDocument : facture (1)', 'DELETE', '/api/types-documents/1', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "nom": "facture", "code": "TD-001", "createdAt": "2026-04-06T10:08:29.000Z", "updatedAt": "2026-04-06T10:12:44.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": 2, "sous_direction_id": null}', NULL, '2026-04-06 21:30:11', '2026-04-06 21:30:11'),
	(52, 1, 'delete', 'typeDocument', 2, 'marché (2)', 'Suppression de typeDocument : marché (2)', 'DELETE', '/api/types-documents/2', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 2, "nom": "marché", "code": "TD-002", "createdAt": "2026-04-06T10:08:44.000Z", "updatedAt": "2026-04-06T10:12:37.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": 1, "sous_direction_id": null}', NULL, '2026-04-06 21:30:17', '2026-04-06 21:30:17'),
	(53, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 31}', '2026-04-06 21:30:34', '2026-04-06 21:30:34'),
	(54, 1, 'create', 'typeDocument', 3, 'Marché (3)', 'Création de typeDocument : Marché (3)', 'POST', '/api/types-documents', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 3, "nom": "Marché", "code": "TD-001", "createdAt": "2026-04-06T21:30:50.819Z", "updatedAt": "2026-04-06T21:30:50.819Z"}', NULL, NULL, '2026-04-06 21:30:50', '2026-04-06 21:30:50'),
	(55, 1, 'create', 'typeDocument', 4, 'Facture (4)', 'Création de typeDocument : Facture (4)', 'POST', '/api/types-documents', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 4, "nom": "Facture", "code": "TD-002", "createdAt": "2026-04-06T21:31:10.628Z", "updatedAt": "2026-04-06T21:31:10.628Z"}', NULL, NULL, '2026-04-06 21:31:10', '2026-04-06 21:31:10'),
	(56, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 8}', '2026-04-06 22:29:59', '2026-04-06 22:29:59'),
	(57, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 25}', '2026-04-06 22:34:31', '2026-04-06 22:34:31'),
	(58, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-08 11:52:47', '2026-04-08 11:52:47'),
	(59, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-08 12:44:44', '2026-04-08 12:44:44'),
	(60, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-08 12:45:14', '2026-04-08 12:45:14'),
	(61, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 13}', '2026-04-08 22:32:07', '2026-04-08 22:32:07'),
	(62, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 41}', '2026-04-08 22:34:57', '2026-04-08 22:34:57'),
	(63, 1, 'create', 'pieces', 5, 'SANS META 3 (5)', 'Création de pieces : SANS META 3 (5)', 'POST', '/api/pieces/', 201, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 5, "libelle": "SANS META 3", "createdAt": "2026-04-08T22:35:12.822Z", "updatedAt": "2026-04-08T22:35:12.822Z", "code_pieces": "P-005"}', NULL, NULL, '2026-04-08 22:35:12', '2026-04-08 22:35:12'),
	(64, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 5}', '2026-04-08 22:35:12', '2026-04-08 22:35:12'),
	(65, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-09 21:21:40', '2026-04-09 21:21:40'),
	(66, 1, 'create', 'sousDirection', 1, 'ddd (1)', 'Création de sousDirection : ddd (1)', 'POST', '/api/sous-directions', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "code": "SD-001", "libelle": "ddd", "createdAt": "2026-04-09T21:25:17.311Z", "updatedAt": "2026-04-09T21:25:17.311Z", "direction_id": 1}', NULL, NULL, '2026-04-09 21:25:17', '2026-04-09 21:25:17'),
	(67, 1, 'create', 'division', 1, 'cccc (1)', 'Création de division : cccc (1)', 'POST', '/api/divisions', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "code": "D-001", "libelle": "cccc", "createdAt": "2026-04-09T21:25:30.463Z", "updatedAt": "2026-04-09T21:25:30.463Z"}', NULL, NULL, '2026-04-09 21:25:30', '2026-04-09 21:25:30'),
	(68, 1, 'update', 'division', 1, 'cccc (1)', 'Modification de division : cccc (1) - sous_direction_id: null → 1', 'PUT', '/api/divisions/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 1, "code": "D-001", "libelle": "cccc", "createdAt": "2026-04-09T21:25:30.000Z", "updatedAt": "2026-04-09T21:25:30.000Z", "sous_direction_id": null}', '{"id": 1, "code": "D-001", "libelle": "cccc", "createdAt": "2026-04-09T21:25:30.000Z", "updatedAt": "2026-04-09T21:28:36.000Z", "sous_direction_id": 1}', NULL, NULL, '2026-04-09 21:28:36', '2026-04-09 21:28:36'),
	(69, 1, 'create', 'section', 1, 'aaa (1)', 'Création de section : aaa (1)', 'POST', '/api/sections', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "code": "SEC-001", "libelle": "aaa", "createdAt": "2026-04-09T21:29:02.795Z", "updatedAt": "2026-04-09T21:29:02.795Z"}', NULL, NULL, '2026-04-09 21:29:02', '2026-04-09 21:29:02'),
	(70, 1, 'update', 'section', 1, 'aaa (1)', 'Modification de section : aaa (1) - division_id: null → 1', 'PUT', '/api/sections/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 1, "code": "SEC-001", "libelle": "aaa", "createdAt": "2026-04-09T21:29:02.000Z", "updatedAt": "2026-04-09T21:29:02.000Z", "division_id": null}', '{"id": 1, "code": "SEC-001", "libelle": "aaa", "createdAt": "2026-04-09T21:29:02.000Z", "updatedAt": "2026-04-09T21:29:09.000Z", "division_id": 1}', NULL, NULL, '2026-04-09 21:29:09', '2026-04-09 21:29:09'),
	(71, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 39}', '2026-04-09 21:44:32', '2026-04-09 21:44:32'),
	(72, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 122}', '2026-04-10 00:00:04', '2026-04-10 00:00:04'),
	(73, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 93}', '2026-04-10 00:00:18', '2026-04-10 00:00:18'),
	(74, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 80}', '2026-04-10 00:10:48', '2026-04-10 00:10:48'),
	(75, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 99}', '2026-04-10 00:42:38', '2026-04-10 00:42:38'),
	(76, 1, 'create', 'fonction', 2, 'DRH (2)', 'Création de fonction : DRH (2)', 'POST', '/api/fonctions/', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "libelle": "DRH", "createdAt": "2026-04-10T10:45:45.132Z", "updatedAt": "2026-04-10T10:45:45.132Z", "direction_id": 1}', NULL, NULL, '2026-04-10 10:45:45', '2026-04-10 10:45:45'),
	(77, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 109}', '2026-04-10 10:45:51', '2026-04-10 10:45:51'),
	(78, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 37}', '2026-04-10 10:45:52', '2026-04-10 10:45:52'),
	(79, 1, 'create', 'droit', 2, 'Archiviste (2)', 'Création de droit : Archiviste (2)', 'POST', '/api/droits/', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "libelle": "Archiviste", "createdAt": "2026-04-10T10:46:50.699Z", "updatedAt": "2026-04-10T10:46:50.699Z"}', NULL, NULL, '2026-04-10 10:46:50', '2026-04-10 10:46:50'),
	(80, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-10 10:46:50', '2026-04-10 10:46:50'),
	(81, 1, 'read', 'permission', NULL, 'liste des permissions', 'Consultation de la liste des permissions', 'GET', '/api/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 91, "duration": 7}', '2026-04-10 10:46:53', '2026-04-10 10:46:53'),
	(82, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 11, "permissionCount": 0}', '2026-04-10 10:46:53', '2026-04-10 10:46:53'),
	(83, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 17}', '2026-04-10 10:49:44', '2026-04-10 10:49:44'),
	(84, 1, 'read', 'permission', NULL, 'liste des permissions', 'Consultation de la liste des permissions', 'GET', '/api/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 91, "duration": 15}', '2026-04-10 10:49:47', '2026-04-10 10:49:47'),
	(85, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 9, "permissionCount": 0}', '2026-04-10 10:49:47', '2026-04-10 10:49:47'),
	(86, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 42}', '2026-04-10 11:00:04', '2026-04-10 11:00:04'),
	(87, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 19, "permissionCount": 0}', '2026-04-10 11:00:08', '2026-04-10 11:00:08'),
	(88, 1, 'read', 'permission', NULL, 'liste des permissions', 'Consultation de la liste des permissions', 'GET', '/api/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 91, "duration": 28}', '2026-04-10 11:00:08', '2026-04-10 11:00:08'),
	(89, 1, 'update', 'droit_permission', 2, 'Archiviste (2)', 'Modification des permissions : ajouté: 1 permission(s)', 'PUT', '/api/droitPermission/2/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"permissionIds": []}', '{"permissionIds": [44]}', NULL, '{"added": 1, "removed": 0, "duration": 71}', '2026-04-10 11:07:30', '2026-04-10 11:07:30'),
	(90, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 16}', '2026-04-10 11:07:31', '2026-04-10 11:07:31'),
	(91, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 16}', '2026-04-10 11:08:49', '2026-04-10 11:08:49'),
	(92, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 65}', '2026-04-10 11:08:51', '2026-04-10 11:08:51'),
	(93, 1, 'read', 'permission', NULL, 'liste des permissions', 'Consultation de la liste des permissions', 'GET', '/api/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 91, "duration": 16}', '2026-04-10 11:08:56', '2026-04-10 11:08:56'),
	(94, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 24, "permissionCount": 1}', '2026-04-10 11:08:56', '2026-04-10 11:08:56'),
	(95, 1, 'update', 'droit_permission', 2, 'Archiviste (2)', 'Modification des permissions : ajouté: 10 permission(s)', 'PUT', '/api/droitPermission/2/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"permissionIds": [44]}', '{"permissionIds": [44, 54, 30, 32, 31, 33, 34, 36, 59, 64, 49]}', NULL, '{"added": 10, "removed": 0, "duration": 46}', '2026-04-10 11:10:33', '2026-04-10 11:10:33'),
	(96, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-10 11:10:34', '2026-04-10 11:10:34'),
	(97, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 15}', '2026-04-10 11:10:34', '2026-04-10 11:10:34'),
	(98, 1, 'create', 'agent', 2, 'YK (2)', 'Création de agent : YK (2)', 'POST', '/api/user/', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "nom": "YK", "email": "michelyk2020@gmail.com", "prenom": "Michel", "droit_id": "2", "password": "$2b$10$nx2022satfZYNtGznapgJO4gAqTGCk2OewAljT0LA3JfikDm0GpCa", "username": "yk71", "createdAt": "2026-04-10T11:11:31.202Z", "telephone": "71979418", "updatedAt": "2026-04-10T11:11:31.202Z", "is_on_line": false, "fonction_id": "2", "photo_profil": "", "num_matricule": "ARCH001", "is_verified_for_reset": false}', NULL, NULL, '2026-04-10 11:11:34', '2026-04-10 11:11:34'),
	(99, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 54}', '2026-04-10 11:11:34', '2026-04-10 11:11:34'),
	(100, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-10 11:11:38', '2026-04-10 11:11:38'),
	(101, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-10 11:12:39', '2026-04-10 11:12:39'),
	(102, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 35}', '2026-04-10 11:13:20', '2026-04-10 11:13:20'),
	(103, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 5}', '2026-04-10 11:13:20', '2026-04-10 11:13:20'),
	(104, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-10 11:17:42', '2026-04-10 11:17:42'),
	(105, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-10 19:34:47', '2026-04-10 19:34:47'),
	(106, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 14}', '2026-04-10 19:34:53', '2026-04-10 19:34:53'),
	(107, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-10 19:49:15', '2026-04-10 19:49:15'),
	(108, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 95}', '2026-04-10 19:49:27', '2026-04-10 19:49:27'),
	(109, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 85}', '2026-04-10 19:49:27', '2026-04-10 19:49:27'),
	(110, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 88}', '2026-04-10 19:50:27', '2026-04-10 19:50:27'),
	(111, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 105}', '2026-04-10 19:50:33', '2026-04-10 19:50:33'),
	(112, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 12}', '2026-04-10 20:01:48', '2026-04-10 20:01:48'),
	(113, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-11 20:26:33', '2026-04-11 20:26:33'),
	(114, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-11 20:27:37', '2026-04-11 20:27:37'),
	(115, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-11 21:16:14', '2026-04-11 21:16:14'),
	(116, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 18:21:32', '2026-04-12 18:21:32'),
	(117, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 18:21:40', '2026-04-12 18:21:40'),
	(118, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 59}', '2026-04-12 18:21:50', '2026-04-12 18:21:50'),
	(119, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 16}', '2026-04-12 18:21:50', '2026-04-12 18:21:50'),
	(120, 1, 'create', 'fonction', 3, 'Technicien sup (3)', 'Création de fonction : Technicien sup (3)', 'POST', '/api/fonctions/', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 3, "libelle": "Technicien sup", "createdAt": "2026-04-12T18:25:51.679Z", "updatedAt": "2026-04-12T18:25:51.679Z", "sous_direction_id": 1}', NULL, NULL, '2026-04-12 18:25:51', '2026-04-12 18:25:51'),
	(121, 1, 'delete', 'fonction', 3, 'Technicien sup (3)', 'Suppression de fonction : Technicien sup (3)', 'DELETE', '/api/fonctions/3', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 3, "libelle": "Technicien sup", "createdAt": "2026-04-12T18:25:51.000Z", "updatedAt": "2026-04-12T18:25:51.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": 1}', NULL, '2026-04-12 18:26:43', '2026-04-12 18:26:43'),
	(122, 1, 'update', 'agent', 2, 'YK (2)', 'Modification de agent : YK (2) - aucun changement', 'PUT', '/api/user/update-by-admin/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 2, "nom": "YK", "email": "michelyk2020@gmail.com", "prenom": "Michel", "droit_id": 2, "password": "$2b$10$nx2022satfZYNtGznapgJO4gAqTGCk2OewAljT0LA3JfikDm0GpCa", "username": "yk71", "createdAt": "2026-04-10T11:11:31.000Z", "telephone": "71979418", "updatedAt": "2026-04-10T11:17:42.000Z", "is_on_line": false, "fonction_id": 2, "photo_profil": "", "last_activity": "2026-04-10T11:17:42.000Z", "num_matricule": "ARCH001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": false}', '{"id": 2, "nom": "YK", "email": "michelyk2020@gmail.com", "prenom": "Michel", "droit_id": 2, "password": "$2b$10$nx2022satfZYNtGznapgJO4gAqTGCk2OewAljT0LA3JfikDm0GpCa", "username": "yk71", "createdAt": "2026-04-10T11:11:31.000Z", "telephone": "71979418", "updatedAt": "2026-04-12T18:27:10.000Z", "is_on_line": false, "fonction_id": 2, "photo_profil": "", "last_activity": "2026-04-10T11:17:42.000Z", "num_matricule": "ARCH001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": false}', NULL, NULL, '2026-04-12 18:27:10', '2026-04-12 18:27:10'),
	(123, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 30}', '2026-04-12 18:27:10', '2026-04-12 18:27:10'),
	(124, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-12 18:27:26', '2026-04-12 18:27:26'),
	(125, 1, 'read', 'droit', 1, 'Administrateur (1)', 'Consultation du droit #1', 'GET', '/api/droits/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 10, "permissionCount": 91}', '2026-04-12 18:27:28', '2026-04-12 18:27:28'),
	(126, 1, 'read', 'permission', NULL, 'liste des permissions', 'Consultation de la liste des permissions', 'GET', '/api/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 96, "duration": 8}', '2026-04-12 18:27:28', '2026-04-12 18:27:28'),
	(127, 1, 'update', 'droit_permission', 1, 'Administrateur (1)', 'Modification des permissions : ajouté: 5 permission(s)', 'PUT', '/api/droitPermission/1/permissions', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"permissionIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91]}', '{"permissionIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96]}', NULL, '{"added": 5, "removed": 0, "duration": 64}', '2026-04-12 18:27:43', '2026-04-12 18:27:43'),
	(128, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-12 18:27:44', '2026-04-12 18:27:44'),
	(129, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-12 18:27:47', '2026-04-12 18:27:47'),
	(130, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 49}', '2026-04-12 18:27:49', '2026-04-12 18:27:49'),
	(131, 1, 'update', 'agent', 2, 'YK (2)', 'Modification de agent : YK (2) - aucun changement', 'PUT', '/api/user/update-by-admin/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 2, "nom": "YK", "email": "michelyk2020@gmail.com", "prenom": "Michel", "droit_id": 2, "password": "$2b$10$nx2022satfZYNtGznapgJO4gAqTGCk2OewAljT0LA3JfikDm0GpCa", "username": "yk71", "createdAt": "2026-04-10T11:11:31.000Z", "telephone": "71979418", "updatedAt": "2026-04-12T18:27:10.000Z", "is_on_line": false, "fonction_id": 2, "photo_profil": "", "last_activity": "2026-04-10T11:17:42.000Z", "num_matricule": "ARCH001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": false}', '{"id": 2, "nom": "YK", "email": "michelyk2020@gmail.com", "prenom": "Michel", "droit_id": 2, "password": "$2b$10$nx2022satfZYNtGznapgJO4gAqTGCk2OewAljT0LA3JfikDm0GpCa", "username": "yk71", "createdAt": "2026-04-10T11:11:31.000Z", "telephone": "71979418", "updatedAt": "2026-04-12T18:28:04.000Z", "is_on_line": false, "fonction_id": 2, "photo_profil": "", "last_activity": "2026-04-10T11:17:42.000Z", "num_matricule": "ARCH001", "enregistrer_par": null, "code_verification": null, "reset_code_expiry": null, "is_verified_for_reset": false}', NULL, NULL, '2026-04-12 18:28:04', '2026-04-12 18:28:04'),
	(132, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 20}', '2026-04-12 18:28:05', '2026-04-12 18:28:05'),
	(133, 1, 'create', 'agentEntiteeAccess', 1, '#1', 'Création de agentEntiteeAccess : #1', 'POST', '/api/agent-access/grant-all-sub-entity', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "section": null, "service": null, "agent_id": 2, "division": null, "createdAt": "2026-04-12T18:28:05.000Z", "direction": null, "updatedAt": "2026-04-12T18:28:05.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sousDirection": {"id": 1, "code": "SD-001", "libelle": "ddd", "createdAt": "2026-04-09T21:25:17.000Z", "updatedAt": "2026-04-09T21:25:17.000Z", "direction_id": 1}, "sous_direction_id": 1}', NULL, NULL, '2026-04-12 18:28:05', '2026-04-12 18:28:05'),
	(134, 1, 'create', 'agentEntiteeAccess', 2, '#2', 'Création de agentEntiteeAccess : #2', 'POST', '/api/agent-access/grant-all-sub-entity', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "section": null, "service": null, "agent_id": 2, "division": {"id": 1, "code": "D-001", "libelle": "cccc", "createdAt": "2026-04-09T21:25:30.000Z", "updatedAt": "2026-04-09T21:28:36.000Z", "sous_direction_id": 1}, "createdAt": "2026-04-12T18:28:05.000Z", "direction": null, "updatedAt": "2026-04-12T18:28:05.000Z", "section_id": null, "service_id": null, "division_id": 1, "direction_id": null, "sousDirection": null, "sous_direction_id": null}', NULL, NULL, '2026-04-12 18:28:05', '2026-04-12 18:28:05'),
	(135, 1, 'create', 'agentEntiteeAccess', 3, '#3', 'Création de agentEntiteeAccess : #3', 'POST', '/api/agent-access/grant-all-sub-entity', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 3, "section": {"id": 1, "code": "SEC-001", "libelle": "aaa", "createdAt": "2026-04-09T21:29:02.000Z", "updatedAt": "2026-04-09T21:29:09.000Z", "division_id": 1}, "service": null, "agent_id": 2, "division": null, "createdAt": "2026-04-12T18:28:05.000Z", "direction": null, "updatedAt": "2026-04-12T18:28:05.000Z", "section_id": 1, "service_id": null, "division_id": null, "direction_id": null, "sousDirection": null, "sous_direction_id": null}', NULL, NULL, '2026-04-12 18:28:05', '2026-04-12 18:28:05'),
	(136, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 36}', '2026-04-12 18:28:05', '2026-04-12 18:28:05'),
	(137, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 42}', '2026-04-12 18:40:25', '2026-04-12 18:40:25'),
	(138, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-12 18:40:25', '2026-04-12 18:40:25'),
	(139, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 8}', '2026-04-12 18:41:02', '2026-04-12 18:41:02'),
	(140, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 92}', '2026-04-12 18:41:02', '2026-04-12 18:41:02'),
	(141, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 18:57:10', '2026-04-12 18:57:10'),
	(142, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 18:59:33', '2026-04-12 18:59:33'),
	(143, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 19:03:34', '2026-04-12 19:03:34'),
	(144, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 19:05:12', '2026-04-12 19:05:12'),
	(145, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 19:06:34', '2026-04-12 19:06:34'),
	(146, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-12 19:11:26', '2026-04-12 19:11:26'),
	(147, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 28}', '2026-04-12 19:11:34', '2026-04-12 19:11:34'),
	(148, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 38}', '2026-04-12 22:49:17', '2026-04-12 22:49:17'),
	(149, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 22}', '2026-04-12 22:49:55', '2026-04-12 22:49:55'),
	(150, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 8}', '2026-04-12 22:50:04', '2026-04-12 22:50:04'),
	(151, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 3, "duration": 4}', '2026-04-12 22:50:11', '2026-04-12 22:50:11'),
	(152, 1, 'delete', 'pieces', 5, 'SANS META 3 (5)', 'Suppression de pieces : SANS META 3 (5)', 'DELETE', '/api/pieces/5', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 5, "libelle": "SANS META 3", "createdAt": "2026-04-08T22:35:12.000Z", "updatedAt": "2026-04-08T22:35:12.000Z", "code_pieces": "P-005"}', NULL, '2026-04-12 22:51:06', '2026-04-12 22:51:06'),
	(153, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 8}', '2026-04-12 22:51:06', '2026-04-12 22:51:06'),
	(154, 1, 'create', 'pieceMetaField', 1, '#1', 'Création de pieceMetaField : #1', 'POST', '/api/pieces/4/meta-fields', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "name": "titre", "label": "titre", "piece_id": "4", "position": 0, "required": true, "createdAt": "2026-04-12T22:51:21.831Z", "updatedAt": "2026-04-12T22:51:21.831Z", "field_type": "text"}', NULL, NULL, '2026-04-12 22:51:21', '2026-04-12 22:51:21'),
	(155, 1, 'create', 'pieceMetaField', 2, '#2', 'Création de pieceMetaField : #2', 'POST', '/api/pieces/4/meta-fields', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "name": "fichier", "label": "Fichier", "piece_id": "4", "position": 1, "required": true, "createdAt": "2026-04-12T22:51:21.936Z", "updatedAt": "2026-04-12T22:51:21.936Z", "field_type": "file"}', NULL, NULL, '2026-04-12 22:51:21', '2026-04-12 22:51:21'),
	(156, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-12 22:51:22', '2026-04-12 22:51:22'),
	(157, 1, 'update', 'typeDocument_pieces', 4, 'Facture (4)', 'Ajout de 2 pièce(s) au type de document', 'POST', '/api/types-documents/4/pieces', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 134, "piecesCount": 2}', '2026-04-12 22:51:40', '2026-04-12 22:51:40'),
	(158, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 15}', '2026-04-12 22:51:43', '2026-04-12 22:51:43'),
	(159, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 18}', '2026-04-12 22:51:47', '2026-04-12 22:51:47'),
	(160, 1, 'create', 'metaField', 1, '#1', 'Création de metaField : #1', 'POST', '/api/meta-fields/4', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "name": "nom", "label": "nom", "required": true, "createdAt": "2026-04-12T22:52:02.095Z", "updatedAt": "2026-04-12T22:52:02.095Z", "field_type": "text", "type_document_id": "4"}', NULL, NULL, '2026-04-12 22:52:02', '2026-04-12 22:52:02'),
	(161, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-12 22:52:05', '2026-04-12 22:52:05'),
	(162, 1, 'update', 'typeDocument', 4, 'Facture (4)', 'Modification de typeDocument : Facture (4) - direction_id: null → 1', 'PUT', '/api/types-documents/4', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 4, "nom": "Facture", "code": "TD-002", "createdAt": "2026-04-06T21:31:10.000Z", "updatedAt": "2026-04-06T21:31:10.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', '{"id": 4, "nom": "Facture", "code": "TD-002", "createdAt": "2026-04-06T21:31:10.000Z", "updatedAt": "2026-04-12T22:52:14.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": 1, "sous_direction_id": null}', NULL, NULL, '2026-04-12 22:52:14', '2026-04-12 22:52:14'),
	(163, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 12}', '2026-04-12 22:52:21', '2026-04-12 22:52:21'),
	(164, 1, 'create', 'document', 1, '#1', 'Création de document : #1', 'POST', '/api/documents', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "createdAt": "2026-04-12T22:52:32.064Z", "updatedAt": "2026-04-12T22:52:32.064Z", "type_document_id": 4}', NULL, NULL, '2026-04-12 22:52:32', '2026-04-12 22:52:32'),
	(165, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 9}', '2026-04-12 22:52:32', '2026-04-12 22:52:32'),
	(166, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 12}', '2026-04-12 22:52:32', '2026-04-12 22:52:32'),
	(167, 1, 'update', 'document_pieces', NULL, 'Pièce #4 du document #1', 'Mise à jour disponibilité: disponible', 'PATCH', '/api/documents/1/pieces/4/disponible', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 44, "disponible": true}', '2026-04-12 22:57:10', '2026-04-12 22:57:10'),
	(168, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 107}', '2026-04-12 22:57:10', '2026-04-12 22:57:10'),
	(169, 1, 'update', 'document_pieces', NULL, 'Pièce #3 du document #1', 'Mise à jour disponibilité: disponible', 'PATCH', '/api/documents/1/pieces/3/disponible', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 45, "disponible": true}', '2026-04-12 22:57:11', '2026-04-12 22:57:11'),
	(170, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 25}', '2026-04-12 22:57:11', '2026-04-12 22:57:11'),
	(171, 1, 'create', 'pieceValue', 1, '#1', 'Création de pieceValue : #1', 'POST', '/api/documents/1/piece-values', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 1, "value": "fiche", "row_id": 87025, "piece_id": 4, "createdAt": "2026-04-12T23:01:37.205Z", "updatedAt": "2026-04-12T23:01:37.205Z", "document_id": 1, "piece_meta_field_id": 1}', NULL, NULL, '2026-04-12 23:01:37', '2026-04-12 23:01:37'),
	(172, 1, 'create', 'pieceValue', 2, '#2', 'Création de pieceValue : #2', 'POST', '/api/documents/1/piece-values', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "value": null, "row_id": 87025, "piece_id": 4, "createdAt": "2026-04-12T23:01:37.319Z", "updatedAt": "2026-04-12T23:01:37.319Z", "document_id": 1, "piece_meta_field_id": 2}', NULL, NULL, '2026-04-12 23:01:37', '2026-04-12 23:01:37'),
	(173, 1, 'upload', 'document_fichier', NULL, 'Upload de 1 fichier(s)', 'Upload de fichier pour métadonnée de pièce #4 du document #1', 'POST', '/api/documents/1/pieces/4/upload-file', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 49, "piece_value_id": "2"}', '2026-04-12 23:01:37', '2026-04-12 23:01:37'),
	(174, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 19}', '2026-04-12 23:01:37', '2026-04-12 23:01:37'),
	(175, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 109}', '2026-04-13 01:19:55', '2026-04-13 01:19:55'),
	(176, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 30}', '2026-04-13 01:19:59', '2026-04-13 01:19:59'),
	(177, 1, 'upload', 'document_fichier', NULL, 'Upload de 1 fichier(s)', 'Upload de 1 fichier(s) pour le document #1', 'POST', '/api/documents/1/document-type/4/piece/3/files', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "files": [{"id": 1, "name": "SD.pdf"}], "duration": 51}', '2026-04-13 01:20:48', '2026-04-13 01:20:48'),
	(178, 1, 'delete', 'document_fichier', 1, 'SD.pdf', 'Suppression du fichier "SD.pdf" du document #1', 'DELETE', '/api/documents/1/files/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"fileId": "1", "duration": 43, "filePath": "uploads/DGCC-file/Direction/Direction général/Facture/DOC-1/PIECES INDIVIDUEL/SANS_META_2/2026-04-13_1776043248683_SD.pdf", "documentId": "1", "originalName": "SD.pdf"}', '2026-04-13 01:20:57', '2026-04-13 01:20:57'),
	(179, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 23}', '2026-04-13 01:20:57', '2026-04-13 01:20:57'),
	(180, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 107}', '2026-04-13 01:50:15', '2026-04-13 01:50:15'),
	(181, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 20}', '2026-04-13 01:50:18', '2026-04-13 01:50:18'),
	(182, 1, 'upload', 'document_fichier', NULL, 'Upload de 1 fichier(s)', 'Upload de 1 fichier(s) pour le document #1', 'POST', '/api/documents/1/document-type/4/piece/3/files', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "files": [{"id": 2, "name": "SD.pdf"}], "duration": 55}', '2026-04-13 01:54:38', '2026-04-13 01:54:38'),
	(183, 1, 'delete', 'pieces_fichier', 1, 'SD.pdf', 'Suppression du fichier de pièce "SD.pdf"', 'DELETE', '/api/documents/1/pieces/4/files/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 01:54:48', '2026-04-13 01:54:48'),
	(184, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 24}', '2026-04-13 01:54:49', '2026-04-13 01:54:49'),
	(185, 1, 'update', 'pieceValue', 1, '#1', 'Modification de pieceValue : #1 - aucun changement', 'PUT', '/api/piece-values/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '{"id": 1, "value": "fiche", "row_id": 87025, "piece_id": 4, "createdAt": "2026-04-12T23:01:37.000Z", "updatedAt": "2026-04-12T23:01:37.000Z", "document_id": 1, "piece_meta_field_id": 1}', '{"id": 1, "value": "fiche", "row_id": 87025, "piece_id": 4, "createdAt": "2026-04-12T23:01:37.000Z", "updatedAt": "2026-04-12T23:01:37.000Z", "document_id": 1, "piece_meta_field_id": 1}', NULL, NULL, '2026-04-13 01:55:01', '2026-04-13 01:55:01'),
	(186, 1, 'upload', 'document_fichier', NULL, 'Upload de 1 fichier(s)', 'Upload de fichier pour métadonnée de pièce #4 du document #1', 'POST', '/api/documents/1/pieces/4/upload-file', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 46, "piece_value_id": "2"}', '2026-04-13 01:55:02', '2026-04-13 01:55:02'),
	(187, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 22}', '2026-04-13 01:55:02', '2026-04-13 01:55:02'),
	(188, 1, 'create', 'document', 2, '#2', 'Création de document : #2', 'POST', '/api/documents', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 2, "createdAt": "2026-04-13T02:03:19.492Z", "updatedAt": "2026-04-13T02:03:19.492Z", "type_document_id": 4}', NULL, NULL, '2026-04-13 02:03:19', '2026-04-13 02:03:19'),
	(189, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 8}', '2026-04-13 02:03:19', '2026-04-13 02:03:19'),
	(190, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-13 02:03:19', '2026-04-13 02:03:19'),
	(191, 1, 'upload', 'document_fichier', NULL, 'Upload lot unique avec 1 pièce(s)', 'Upload lot unique pour document #2 avec 1 pièce(s) associée(s)', 'POST', '/api/documents/2/document-type/4/lot-unique/files-with-pieces', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 86, "filesCount": 1, "associatedPieces": 1}', '2026-04-13 02:03:39', '2026-04-13 02:03:39'),
	(192, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 23}', '2026-04-13 02:03:39', '2026-04-13 02:03:39'),
	(193, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'PostmanRuntime/7.51.1', NULL, NULL, NULL, NULL, '2026-04-13 02:18:38', '2026-04-13 02:18:38'),
	(194, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 86}', '2026-04-13 02:27:09', '2026-04-13 02:27:09'),
	(195, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 15}', '2026-04-13 02:27:13', '2026-04-13 02:27:13'),
	(196, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 32}', '2026-04-13 09:11:50', '2026-04-13 09:11:50'),
	(197, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 32}', '2026-04-13 09:11:51', '2026-04-13 09:11:51'),
	(198, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 19}', '2026-04-13 09:11:54', '2026-04-13 09:11:54'),
	(199, 1, 'delete', 'pieces_fichier', 2, 'SD.pdf', 'Suppression du fichier de pièce "SD.pdf"', 'DELETE', '/api/documents/1/pieces/4/files/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 09:12:08', '2026-04-13 09:12:08'),
	(200, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 27}', '2026-04-13 09:12:09', '2026-04-13 09:12:09'),
	(201, 1, 'delete', 'pieceValue', 1, '#1', 'Suppression de pieceValue : #1', 'DELETE', '/api/piece-values/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "value": "fiche", "row_id": 87025, "piece_id": 4, "createdAt": "2026-04-12T23:01:37.000Z", "updatedAt": "2026-04-12T23:01:37.000Z", "document_id": 1, "piece_meta_field_id": 1}', NULL, '2026-04-13 09:13:16', '2026-04-13 09:13:16'),
	(202, 1, 'delete', 'pieceValue', 2, '#2', 'Suppression de pieceValue : #2', 'DELETE', '/api/piece-values/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 2, "value": null, "row_id": 87025, "piece_id": 4, "createdAt": "2026-04-12T23:01:37.000Z", "updatedAt": "2026-04-12T23:01:37.000Z", "document_id": 1, "piece_meta_field_id": 2}', NULL, '2026-04-13 09:13:16', '2026-04-13 09:13:16'),
	(203, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 22}', '2026-04-13 09:13:30', '2026-04-13 09:13:30'),
	(204, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 20}', '2026-04-13 09:13:31', '2026-04-13 09:13:31'),
	(205, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 41}', '2026-04-13 09:18:41', '2026-04-13 09:18:41'),
	(206, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 38}', '2026-04-13 09:18:43', '2026-04-13 09:18:43'),
	(207, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 23}', '2026-04-13 09:18:43', '2026-04-13 09:18:43'),
	(208, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 60}', '2026-04-13 13:39:23', '2026-04-13 13:39:23'),
	(209, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 33}', '2026-04-13 13:39:23', '2026-04-13 13:39:23'),
	(210, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 13:39:30', '2026-04-13 13:39:30'),
	(211, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 13:40:49', '2026-04-13 13:40:49'),
	(212, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 38}', '2026-04-13 13:41:01', '2026-04-13 13:41:01'),
	(213, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-13 13:41:10', '2026-04-13 13:41:10'),
	(214, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 13:41:18', '2026-04-13 13:41:18'),
	(215, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 13:41:22', '2026-04-13 13:41:22'),
	(216, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-13 13:41:27', '2026-04-13 13:41:27'),
	(217, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 46}', '2026-04-13 13:41:27', '2026-04-13 13:41:27'),
	(218, 1, 'delete', 'agentEntiteeAccess', 1, '#1', 'Suppression de agentEntiteeAccess : #1', 'DELETE', '/api/agent-access/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "agent_id": 2, "createdAt": "2026-04-12T18:28:05.000Z", "updatedAt": "2026-04-12T18:28:05.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": 1}', NULL, '2026-04-13 13:41:51', '2026-04-13 13:41:51'),
	(219, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 49}', '2026-04-13 13:41:51', '2026-04-13 13:41:51'),
	(220, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 7}', '2026-04-13 13:41:51', '2026-04-13 13:41:51'),
	(221, 1, 'delete', 'agentEntiteeAccess', 2, '#2', 'Suppression de agentEntiteeAccess : #2', 'DELETE', '/api/agent-access/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 2, "agent_id": 2, "createdAt": "2026-04-12T18:28:05.000Z", "updatedAt": "2026-04-12T18:28:05.000Z", "section_id": null, "service_id": null, "division_id": 1, "direction_id": null, "sous_direction_id": null}', NULL, '2026-04-13 13:41:54', '2026-04-13 13:41:54'),
	(222, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 28}', '2026-04-13 13:41:54', '2026-04-13 13:41:54'),
	(223, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 4}', '2026-04-13 13:41:54', '2026-04-13 13:41:54'),
	(224, 1, 'delete', 'agentEntiteeAccess', 3, '#3', 'Suppression de agentEntiteeAccess : #3', 'DELETE', '/api/agent-access/3', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 3, "agent_id": 2, "createdAt": "2026-04-12T18:28:05.000Z", "updatedAt": "2026-04-12T18:28:05.000Z", "section_id": 1, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', NULL, '2026-04-13 13:41:57', '2026-04-13 13:41:57'),
	(225, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 26}', '2026-04-13 13:41:57', '2026-04-13 13:41:57'),
	(226, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 7}', '2026-04-13 13:41:57', '2026-04-13 13:41:57'),
	(227, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 45}', '2026-04-13 13:42:05', '2026-04-13 13:42:05'),
	(228, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 56}', '2026-04-13 13:42:05', '2026-04-13 13:42:05'),
	(229, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 13:42:15', '2026-04-13 13:42:15'),
	(230, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 13:42:18', '2026-04-13 13:42:18'),
	(231, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 14}', '2026-04-13 13:42:22', '2026-04-13 13:42:22'),
	(232, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-13 13:42:22', '2026-04-13 13:42:22'),
	(233, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 14:07:02', '2026-04-13 14:07:02'),
	(234, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 26}', '2026-04-13 14:31:46', '2026-04-13 14:31:46'),
	(235, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 16}', '2026-04-13 14:37:53', '2026-04-13 14:37:53'),
	(236, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 35}', '2026-04-13 14:41:29', '2026-04-13 14:41:29'),
	(237, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 44}', '2026-04-13 14:56:05', '2026-04-13 14:56:05'),
	(238, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-13 14:56:08', '2026-04-13 14:56:08'),
	(239, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 14:59:06', '2026-04-13 14:59:06'),
	(240, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 14:59:11', '2026-04-13 14:59:11'),
	(241, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 12}', '2026-04-13 14:59:15', '2026-04-13 14:59:15'),
	(242, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 24}', '2026-04-13 14:59:31', '2026-04-13 14:59:31'),
	(243, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 50}', '2026-04-13 14:59:31', '2026-04-13 14:59:31'),
	(244, 1, 'create', 'agentEntiteeAccess', 4, '#4', 'Création de agentEntiteeAccess : #4', 'POST', '/api/agent-access', 201, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '{"id": 4, "section": null, "service": null, "agent_id": 2, "division": null, "createdAt": "2026-04-13T14:59:50.000Z", "direction": null, "updatedAt": "2026-04-13T14:59:50.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sousDirection": {"id": 1, "code": "SD-001", "libelle": "ddd", "createdAt": "2026-04-09T21:25:17.000Z", "direction": {"id": 1, "code": "DG", "libelle": "Direction général", "createdAt": "2026-04-06T09:56:03.000Z", "updatedAt": "2026-04-06T09:56:03.000Z"}, "updatedAt": "2026-04-09T21:25:17.000Z", "direction_id": 1}, "sous_direction_id": 1}', NULL, NULL, '2026-04-13 14:59:50', '2026-04-13 14:59:50'),
	(245, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 39}', '2026-04-13 14:59:50', '2026-04-13 14:59:50'),
	(246, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 19}', '2026-04-13 14:59:55', '2026-04-13 14:59:55'),
	(247, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:00:04', '2026-04-13 15:00:04'),
	(248, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:00:07', '2026-04-13 15:00:07'),
	(249, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:00:17', '2026-04-13 15:00:17'),
	(250, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:00:47', '2026-04-13 15:00:47'),
	(251, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 52}', '2026-04-13 15:00:54', '2026-04-13 15:00:54'),
	(252, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 47}', '2026-04-13 15:00:54', '2026-04-13 15:00:54'),
	(253, 1, 'delete', 'agentEntiteeAccess', 4, '#4', 'Suppression de agentEntiteeAccess : #4', 'DELETE', '/api/agent-access/4', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 4, "agent_id": 2, "createdAt": "2026-04-13T14:59:50.000Z", "updatedAt": "2026-04-13T14:59:50.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": 1}', NULL, '2026-04-13 15:00:59', '2026-04-13 15:00:59'),
	(254, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 56}', '2026-04-13 15:00:59', '2026-04-13 15:00:59'),
	(255, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-13 15:00:59', '2026-04-13 15:00:59'),
	(256, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 21}', '2026-04-13 15:01:02', '2026-04-13 15:01:02'),
	(257, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-13 15:01:02', '2026-04-13 15:01:02'),
	(258, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:01:10', '2026-04-13 15:01:10'),
	(259, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:01:32', '2026-04-13 15:01:32'),
	(260, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:05:43', '2026-04-13 15:05:43'),
	(261, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-13 15:05:47', '2026-04-13 15:05:47'),
	(262, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-13 15:05:49', '2026-04-13 15:05:49'),
	(263, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 9}', '2026-04-13 15:16:40', '2026-04-13 15:16:40'),
	(264, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 9}', '2026-04-13 15:16:43', '2026-04-13 15:16:43'),
	(265, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:17:25', '2026-04-13 15:17:25'),
	(266, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:27:00', '2026-04-13 15:27:00'),
	(267, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:27:12', '2026-04-13 15:27:12'),
	(268, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:35:02', '2026-04-13 15:35:02'),
	(269, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 9}', '2026-04-13 15:40:47', '2026-04-13 15:40:47'),
	(270, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 33}', '2026-04-13 15:49:12', '2026-04-13 15:49:12'),
	(271, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:57:53', '2026-04-13 15:57:53'),
	(272, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 15:58:06', '2026-04-13 15:58:06'),
	(273, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 12}', '2026-04-13 15:58:11', '2026-04-13 15:58:11'),
	(274, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 40}', '2026-04-13 21:06:37', '2026-04-13 21:06:37'),
	(275, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 19}', '2026-04-13 21:36:03', '2026-04-13 21:36:03'),
	(276, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 35}', '2026-04-13 21:54:40', '2026-04-13 21:54:40'),
	(277, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 21:56:39', '2026-04-13 21:56:39'),
	(278, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 21:56:55', '2026-04-13 21:56:55'),
	(279, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 21:57:43', '2026-04-13 21:57:43'),
	(280, 2, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 21:57:48', '2026-04-13 21:57:48'),
	(281, 2, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 64}', '2026-04-13 22:07:21', '2026-04-13 22:07:21'),
	(282, 2, 'logout', 'auth/deconnexion', 2, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 22:07:33', '2026-04-13 22:07:33'),
	(283, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-13 22:07:38', '2026-04-13 22:07:38'),
	(284, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 13}', '2026-04-14 11:18:45', '2026-04-14 11:18:45'),
	(285, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 19}', '2026-04-14 11:26:12', '2026-04-14 11:26:12'),
	(286, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 30}', '2026-04-14 11:39:30', '2026-04-14 11:39:30'),
	(287, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 16}', '2026-04-14 12:16:50', '2026-04-14 12:16:50'),
	(288, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-14 12:17:08', '2026-04-14 12:17:08'),
	(289, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 14}', '2026-04-14 12:17:31', '2026-04-14 12:17:31'),
	(290, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 13}', '2026-04-14 12:20:37', '2026-04-14 12:20:37'),
	(291, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 19}', '2026-04-14 12:26:02', '2026-04-14 12:26:02'),
	(292, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 46}', '2026-04-14 12:26:02', '2026-04-14 12:26:02'),
	(293, 1, 'read', 'droit_agent', 1, 'Administrateur (1)', 'Consultation des agents du droit #1', 'GET', '/api/droits/1/agents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 3, "agentCount": 1}', '2026-04-14 12:26:53', '2026-04-14 12:26:53'),
	(294, 1, 'read', 'droit', 1, 'Administrateur (1)', 'Consultation du droit #1', 'GET', '/api/droits/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 10, "permissionCount": 96}', '2026-04-14 12:26:53', '2026-04-14 12:26:53'),
	(295, 1, 'read', 'droit_agent', 2, 'Archiviste (2)', 'Consultation des agents du droit #2', 'GET', '/api/droits/2/agents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 14, "agentCount": 1}', '2026-04-14 12:27:07', '2026-04-14 12:27:07'),
	(296, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 8, "permissionCount": 11}', '2026-04-14 12:27:07', '2026-04-14 12:27:07'),
	(297, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 21}', '2026-04-14 12:37:16', '2026-04-14 12:37:16'),
	(298, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 13}', '2026-04-14 12:37:22', '2026-04-14 12:37:22'),
	(299, 1, 'logout', 'auth/deconnexion', 1, NULL, NULL, 'POST', '/api/auth/deconnexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-14 12:38:02', '2026-04-14 12:38:02'),
	(300, 1, 'login', 'auth/connexion', NULL, NULL, NULL, 'POST', '/api/auth/connexion', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, '2026-04-14 12:38:15', '2026-04-14 12:38:15'),
	(301, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-14 12:38:20', '2026-04-14 12:38:20'),
	(302, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-14 12:54:21', '2026-04-14 12:54:21'),
	(303, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 55}', '2026-04-14 13:17:02', '2026-04-14 13:17:02'),
	(304, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 9}', '2026-04-14 13:17:02', '2026-04-14 13:17:02'),
	(305, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 21}', '2026-04-14 13:17:13', '2026-04-14 13:17:13'),
	(306, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 4}', '2026-04-14 13:17:23', '2026-04-14 13:17:23'),
	(307, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 13, "permissionCount": 11}', '2026-04-14 13:20:07', '2026-04-14 13:20:07'),
	(308, 1, 'read', 'droit', 2, 'Archiviste (2)', 'Consultation du droit #2', 'GET', '/api/droits/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 3, "permissionCount": 11}', '2026-04-14 13:20:07', '2026-04-14 13:20:07'),
	(309, 1, 'read', 'droit', 1, 'Administrateur (1)', 'Consultation du droit #1', 'GET', '/api/droits/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 10, "permissionCount": 96}', '2026-04-14 13:20:12', '2026-04-14 13:20:12'),
	(310, 1, 'read', 'droit', 1, 'Administrateur (1)', 'Consultation du droit #1', 'GET', '/api/droits/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 4, "permissionCount": 96}', '2026-04-14 13:20:12', '2026-04-14 13:20:12'),
	(311, 1, 'read', 'droit', 1, 'Administrateur (1)', 'Consultation du droit #1', 'GET', '/api/droits/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 8, "permissionCount": 96}', '2026-04-14 13:20:17', '2026-04-14 13:20:17'),
	(312, 1, 'read', 'droit', 1, 'Administrateur (1)', 'Consultation du droit #1', 'GET', '/api/droits/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 7, "permissionCount": 96}', '2026-04-14 13:20:17', '2026-04-14 13:20:17'),
	(313, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 14}', '2026-04-14 13:21:37', '2026-04-14 13:21:37'),
	(314, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-14 13:21:39', '2026-04-14 13:21:39'),
	(315, 1, 'read', 'fonction', NULL, 'liste des fonctions', 'Consultation de la liste des fonctions', 'GET', '/api/fonctions/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 13}', '2026-04-14 13:22:18', '2026-04-14 13:22:18'),
	(316, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 15}', '2026-04-14 13:22:27', '2026-04-14 13:22:27'),
	(317, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 7}', '2026-04-14 13:22:27', '2026-04-14 13:22:27'),
	(318, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-14 13:23:26', '2026-04-14 13:23:26'),
	(319, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-14 13:23:26', '2026-04-14 13:23:26'),
	(320, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 16}', '2026-04-14 13:49:21', '2026-04-14 13:49:21'),
	(321, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 14}', '2026-04-14 13:49:25', '2026-04-14 13:49:25'),
	(322, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 25}', '2026-04-14 13:49:56', '2026-04-14 13:49:56'),
	(323, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-14 13:49:58', '2026-04-14 13:49:58'),
	(324, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-14 14:01:13', '2026-04-14 14:01:13'),
	(325, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-14 14:01:13', '2026-04-14 14:01:13'),
	(326, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 11}', '2026-04-14 14:05:51', '2026-04-14 14:05:51'),
	(327, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-14 14:05:53', '2026-04-14 14:05:53'),
	(328, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 6}', '2026-04-14 14:08:55', '2026-04-14 14:08:55'),
	(329, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-14 14:35:22', '2026-04-14 14:35:22'),
	(330, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 9}', '2026-04-14 14:35:24', '2026-04-14 14:35:24'),
	(331, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 5}', '2026-04-14 14:51:49', '2026-04-14 14:51:49'),
	(332, 1, 'read', 'fonction', NULL, 'liste des fonctions', 'Consultation de la liste des fonctions', 'GET', '/api/fonctions/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 13}', '2026-04-14 14:56:12', '2026-04-14 14:56:12'),
	(333, 1, 'read', 'agent', NULL, 'liste des utilisateurs', 'Consultation de la liste des utilisateurs', 'GET', '/api/user/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 54}', '2026-04-14 14:59:06', '2026-04-14 14:59:06'),
	(334, 1, 'read', 'droit', NULL, 'liste des droits', 'Consultation de la liste des droits', 'GET', '/api/droits/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 43}', '2026-04-14 14:59:06', '2026-04-14 14:59:06'),
	(335, 1, 'delete', 'section', 1, 'aaa (1)', 'Suppression de section : aaa (1)', 'DELETE', '/api/sections/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "code": "SEC-001", "libelle": "aaa", "createdAt": "2026-04-09T21:29:02.000Z", "updatedAt": "2026-04-09T21:29:09.000Z", "division_id": 1}', NULL, '2026-04-14 14:59:14', '2026-04-14 14:59:14'),
	(336, 1, 'delete', 'division', 1, 'cccc (1)', 'Suppression de division : cccc (1)', 'DELETE', '/api/divisions/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "code": "D-001", "libelle": "cccc", "createdAt": "2026-04-09T21:25:30.000Z", "updatedAt": "2026-04-09T21:28:36.000Z", "sous_direction_id": 1}', NULL, '2026-04-14 14:59:20', '2026-04-14 14:59:20'),
	(337, 1, 'delete', 'sousDirection', 1, 'ddd (1)', 'Suppression de sousDirection : ddd (1)', 'DELETE', '/api/sous-directions/1', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 1, "code": "SD-001", "libelle": "ddd", "createdAt": "2026-04-09T21:25:17.000Z", "updatedAt": "2026-04-09T21:25:17.000Z", "direction_id": 1}', NULL, '2026-04-14 14:59:27', '2026-04-14 14:59:27'),
	(338, 1, 'delete', 'direction', 2, 'Direction des systèmes informatique (2)', 'Suppression de direction : Direction des systèmes informatique (2)', 'DELETE', '/api/directions/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 2, "code": "DSI", "libelle": "Direction des systèmes informatique", "createdAt": "2026-04-06T10:11:28.000Z", "updatedAt": "2026-04-06T10:11:28.000Z"}', NULL, '2026-04-14 14:59:45', '2026-04-14 14:59:45'),
	(339, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-14 14:59:54', '2026-04-14 14:59:54'),
	(340, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 7}', '2026-04-14 15:00:00', '2026-04-14 15:00:00'),
	(341, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 2, "duration": 10}', '2026-04-14 15:00:04', '2026-04-14 15:00:04'),
	(342, 1, 'delete', 'document', 2, '#2', 'Suppression de document : #2', 'DELETE', '/api/documents/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 2, "createdAt": "2026-04-13T02:03:19.000Z", "updatedAt": "2026-04-13T02:03:19.000Z", "type_document_id": 4}', NULL, '2026-04-14 15:00:09', '2026-04-14 15:00:09'),
	(343, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 5}', '2026-04-14 15:00:09', '2026-04-14 15:00:09'),
	(344, 1, 'delete', 'document_fichier', 2, 'SD.pdf', 'Suppression du fichier "SD.pdf" du document #1', 'DELETE', '/api/documents/1/files/2', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"fileId": "2", "duration": 33, "filePath": "uploads/DGCC-file/Direction/Direction général/Facture/DOC-1/PIECES INDIVIDUEL/SANS_META_2/2026-04-13_1776045278191_SD.pdf", "documentId": "1", "originalName": "SD.pdf"}', '2026-04-14 15:00:25', '2026-04-14 15:00:25'),
	(345, 1, 'read', 'document', NULL, 'liste des documents', 'Consultation de la liste des documents', 'GET', '/api/documents', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 7}', '2026-04-14 15:00:25', '2026-04-14 15:00:25'),
	(346, 1, 'update', 'typeDocument_pieces', 4, 'Facture (4)', 'Ajout de 2 pièce(s) au type de document', 'POST', '/api/types-documents/4/pieces', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"duration": 21, "piecesCount": 2}', '2026-04-14 15:02:36', '2026-04-14 15:02:36'),
	(347, 1, 'delete', 'typeDocument', 4, 'Facture (4)', 'Suppression de typeDocument : Facture (4)', 'DELETE', '/api/types-documents/4', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 4, "nom": "Facture", "code": "TD-002", "createdAt": "2026-04-06T21:31:10.000Z", "updatedAt": "2026-04-12T22:52:14.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": 1, "sous_direction_id": null}', NULL, '2026-04-14 15:02:38', '2026-04-14 15:02:38'),
	(348, 1, 'delete', 'typeDocument', 3, 'Marché (3)', 'Suppression de typeDocument : Marché (3)', 'DELETE', '/api/types-documents/3', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 3, "nom": "Marché", "code": "TD-001", "createdAt": "2026-04-06T21:30:50.000Z", "updatedAt": "2026-04-06T21:30:50.000Z", "section_id": null, "service_id": null, "division_id": null, "direction_id": null, "sous_direction_id": null}', NULL, '2026-04-14 15:02:48', '2026-04-14 15:02:48'),
	(349, 1, 'delete', 'pieces', 3, 'SANS META 2 (3)', 'Suppression de pieces : SANS META 2 (3)', 'DELETE', '/api/pieces/3', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 3, "libelle": "SANS META 2", "createdAt": "2026-04-06T21:29:38.000Z", "updatedAt": "2026-04-06T21:29:38.000Z", "code_pieces": "P-003"}', NULL, '2026-04-14 15:02:52', '2026-04-14 15:02:52'),
	(350, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 1, "duration": 4}', '2026-04-14 15:02:52', '2026-04-14 15:02:52'),
	(351, 1, 'delete', 'pieces', 4, 'AVEC META 2 (4)', 'Suppression de pieces : AVEC META 2 (4)', 'DELETE', '/api/pieces/4', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, '{"id": 4, "libelle": "AVEC META 2", "createdAt": "2026-04-06T21:29:51.000Z", "updatedAt": "2026-04-06T21:29:51.000Z", "code_pieces": "P-004"}', NULL, '2026-04-14 15:02:55', '2026-04-14 15:02:55'),
	(352, 1, 'read', 'pieces', NULL, 'liste des pièces', 'Consultation de la liste des pièces', 'GET', '/api/pieces/', 200, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, NULL, NULL, '{"count": 0, "duration": 3}', '2026-04-14 15:02:55', '2026-04-14 15:02:55');

-- Dumping structure for table dgcc.metafields
CREATE TABLE IF NOT EXISTS `metafields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `field_type` varchar(255) DEFAULT NULL,
  `required` tinyint(1) DEFAULT NULL,
  `options` json DEFAULT NULL,
  `position` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `type_document_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_document_id` (`type_document_id`),
  CONSTRAINT `metafields_ibfk_1` FOREIGN KEY (`type_document_id`) REFERENCES `typedocuments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.metafields: ~1 rows (approximately)
INSERT INTO `metafields` (`id`, `name`, `label`, `field_type`, `required`, `options`, `position`, `created_at`, `updated_at`, `type_document_id`) VALUES
	(1, 'nom', 'nom', 'text', 1, NULL, NULL, '2026-04-12 22:52:02', '2026-04-12 22:52:02', NULL);

-- Dumping structure for table dgcc.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_resource_action` (`resource`,`action`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.permissions: ~96 rows (approximately)
INSERT INTO `permissions` (`id`, `resource`, `action`, `created_at`, `updated_at`) VALUES
	(1, 'exercice', 'access', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(2, 'exercice', 'create', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(3, 'exercice', 'read', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(4, 'exercice', 'update', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(5, 'exercice', 'delete', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(6, 'agent', 'access', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(7, 'agent', 'create', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(8, 'agent', 'read', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(9, 'agent', 'update', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(10, 'agent', 'delete', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(11, 'pieces', 'access', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(12, 'pieces', 'create', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(13, 'pieces', 'read', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(14, 'pieces', 'update', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(15, 'pieces', 'delete', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(16, 'statistique', 'access', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(17, 'statistique', 'create', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(18, 'statistique', 'read', '2026-04-06 09:50:08', '2026-04-06 09:50:08'),
	(19, 'statistique', 'update', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(20, 'droit', 'access', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(21, 'droit', 'create', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(22, 'droit', 'read', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(23, 'droit', 'update', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(24, 'droit', 'delete', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(25, 'fonction', 'access', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(26, 'fonction', 'read', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(27, 'fonction', 'create', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(28, 'fonction', 'update', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(29, 'fonction', 'delete', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(30, 'document', 'access', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(31, 'document', 'read', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(32, 'document', 'create', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(33, 'document', 'update', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(34, 'document', 'delete', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(35, 'documentType', 'access', '2026-04-06 09:50:09', '2026-04-06 09:50:09'),
	(36, 'documentType', 'read', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(37, 'documentType', 'create', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(38, 'documentType', 'update', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(39, 'documentType', 'delete', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(40, 'historique', 'access', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(41, 'historique', 'read', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(42, 'direction', 'access', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(43, 'direction', 'create', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(44, 'direction', 'read', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(45, 'direction', 'update', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(46, 'direction', 'delete', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(47, 'sousDirection', 'access', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(48, 'sousDirection', 'create', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(49, 'sousDirection', 'read', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(50, 'sousDirection', 'update', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(51, 'sousDirection', 'delete', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(52, 'division', 'access', '2026-04-06 09:50:10', '2026-04-06 09:50:10'),
	(53, 'division', 'create', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(54, 'division', 'read', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(55, 'division', 'update', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(56, 'division', 'delete', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(57, 'section', 'access', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(58, 'section', 'create', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(59, 'section', 'read', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(60, 'section', 'update', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(61, 'section', 'delete', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(62, 'service', 'access', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(63, 'service', 'create', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(64, 'service', 'read', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(65, 'service', 'update', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(66, 'service', 'delete', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(67, 'salle', 'access', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(68, 'salle', 'create', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(69, 'salle', 'read', '2026-04-06 09:50:11', '2026-04-06 09:50:11'),
	(70, 'salle', 'update', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(71, 'salle', 'delete', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(72, 'rayon', 'access', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(73, 'rayon', 'create', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(74, 'rayon', 'read', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(75, 'rayon', 'update', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(76, 'rayon', 'delete', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(77, 'box', 'access', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(78, 'box', 'create', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(79, 'box', 'read', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(80, 'box', 'update', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(81, 'box', 'delete', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(82, 'trave', 'access', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(83, 'trave', 'create', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(84, 'trave', 'read', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(85, 'trave', 'update', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(86, 'trave', 'delete', '2026-04-06 09:50:12', '2026-04-06 09:50:12'),
	(87, 'site', 'access', '2026-04-06 09:50:13', '2026-04-06 09:50:13'),
	(88, 'site', 'create', '2026-04-06 09:50:13', '2026-04-06 09:50:13'),
	(89, 'site', 'read', '2026-04-06 09:50:13', '2026-04-06 09:50:13'),
	(90, 'site', 'update', '2026-04-06 09:50:13', '2026-04-06 09:50:13'),
	(91, 'site', 'delete', '2026-04-06 09:50:13', '2026-04-06 09:50:13'),
	(92, 'agent-access', 'access', '2026-04-12 18:20:03', '2026-04-12 18:20:03'),
	(93, 'agent-access', 'create', '2026-04-12 18:20:03', '2026-04-12 18:20:03'),
	(94, 'agent-access', 'read', '2026-04-12 18:20:03', '2026-04-12 18:20:03'),
	(95, 'agent-access', 'update', '2026-04-12 18:20:03', '2026-04-12 18:20:03'),
	(96, 'agent-access', 'delete', '2026-04-12 18:20:03', '2026-04-12 18:20:03');

-- Dumping structure for table dgcc.piece_meta_fields
CREATE TABLE IF NOT EXISTS `piece_meta_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `piece_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `field_type` enum('text','date','file') NOT NULL,
  `required` tinyint(1) DEFAULT '0',
  `position` int DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `piece_id` (`piece_id`),
  CONSTRAINT `piece_meta_fields_ibfk_1` FOREIGN KEY (`piece_id`) REFERENCES `pieces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.piece_meta_fields: ~0 rows (approximately)

-- Dumping structure for table dgcc.piece_values
CREATE TABLE IF NOT EXISTS `piece_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` int NOT NULL,
  `piece_id` int NOT NULL,
  `piece_meta_field_id` int NOT NULL,
  `row_id` int DEFAULT NULL,
  `value` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `document_id` (`document_id`),
  KEY `piece_id` (`piece_id`),
  KEY `piece_meta_field_id` (`piece_meta_field_id`),
  CONSTRAINT `piece_values_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `piece_values_ibfk_2` FOREIGN KEY (`piece_id`) REFERENCES `pieces` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `piece_values_ibfk_3` FOREIGN KEY (`piece_meta_field_id`) REFERENCES `piece_meta_fields` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.piece_values: ~0 rows (approximately)

-- Dumping structure for table dgcc.pieces
CREATE TABLE IF NOT EXISTS `pieces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code_pieces` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.pieces: ~2 rows (approximately)

-- Dumping structure for table dgcc.pieces_fichiers
CREATE TABLE IF NOT EXISTS `pieces_fichiers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` int NOT NULL,
  `piece_id` int DEFAULT NULL,
  `piece_value_id` int DEFAULT NULL,
  `fichier` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `new_file_name` varchar(255) DEFAULT NULL,
  `mode` enum('INDIVIDUEL','LOT_UNIQUE') NOT NULL DEFAULT 'INDIVIDUEL',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `document_id` (`document_id`),
  KEY `piece_id` (`piece_id`),
  KEY `piece_value_id` (`piece_value_id`),
  CONSTRAINT `pieces_fichiers_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `pieces_fichiers_ibfk_2` FOREIGN KEY (`piece_id`) REFERENCES `pieces` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pieces_fichiers_ibfk_3` FOREIGN KEY (`piece_value_id`) REFERENCES `piece_values` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.pieces_fichiers: ~0 rows (approximately)

-- Dumping structure for table dgcc.pieces_files
CREATE TABLE IF NOT EXISTS `pieces_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `size` int DEFAULT NULL,
  `mimetype` varchar(255) DEFAULT NULL,
  `document_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `pieces_value_id` int DEFAULT NULL,
  `pieces_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pieces_value_id` (`pieces_value_id`),
  KEY `pieces_id` (`pieces_id`),
  CONSTRAINT `pieces_files_ibfk_1` FOREIGN KEY (`pieces_value_id`) REFERENCES `piece_values` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pieces_files_ibfk_2` FOREIGN KEY (`pieces_id`) REFERENCES `pieces` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.pieces_files: ~0 rows (approximately)

-- Dumping structure for table dgcc.sections
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `division_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  KEY `division_id` (`division_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.sections: ~1 rows (approximately)

-- Dumping structure for table dgcc.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `direction_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  KEY `direction_id` (`direction_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`direction_id`) REFERENCES `directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.services: ~0 rows (approximately)

-- Dumping structure for table dgcc.sous_directions
CREATE TABLE IF NOT EXISTS `sous_directions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `direction_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  KEY `direction_id` (`direction_id`),
  CONSTRAINT `sous_directions_ibfk_1` FOREIGN KEY (`direction_id`) REFERENCES `directions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.sous_directions: ~1 rows (approximately)

-- Dumping structure for table dgcc.token
CREATE TABLE IF NOT EXISTS `token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `agent_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agent_id` (`agent_id`),
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.token: ~17 rows (approximately)
INSERT INTO `token` (`id`, `token`, `agent_id`, `created_at`, `updated_at`) VALUES
	(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1NDY5Mjk4LCJleHAiOjE3NzYwNzQwOTh9.DMrkGt_veK4loqcDoFdDNmqOIrOWW7SINBosu3pXl9U', 1, '2026-04-06 09:54:58', '2026-04-06 09:54:58'),
	(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1NTEwNDU0LCJleHAiOjE3NzYxMTUyNTR9.vCdw7szKBCiN3z23QJl7gatQlI4gEYj6w8xKGY2mgzA', 1, '2026-04-06 21:20:54', '2026-04-06 21:20:54'),
	(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1NTEwNzIyLCJleHAiOjE3NzYxMTU1MjJ9.Itoa_CM7tgaKZaJxD392_Tm64kCWpsOp4MobjN5Pwgs', 1, '2026-04-06 21:25:22', '2026-04-06 21:25:22'),
	(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1NjQ5MTY3LCJleHAiOjE3NzYyNTM5Njd9.7v9DYOJmwdwC61j8-g3qSvrjjcQWUSWAewlknnm9LjA', 1, '2026-04-08 11:52:47', '2026-04-08 11:52:47'),
	(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1NjUyMzE0LCJleHAiOjE3NzYyNTcxMTR9.SJPC8zMmdoLUz7c3N0jh-Ohvzaj7lbyjVNcxnTAa6og', 1, '2026-04-08 12:45:14', '2026-04-08 12:45:14'),
	(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1NzY5NzAwLCJleHAiOjE3NzYzNzQ1MDB9.j5YREH-4D2gu0B7kVgL9M1DCFi4Lh53O7UzFgZqZKEk', 1, '2026-04-09 21:21:40', '2026-04-09 21:21:40'),
	(7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc1ODE5NTU5LCJleHAiOjE3NzY0MjQzNTl9.4UR6DlQGNdydHgxQePWR4hJGef1bQ2Co87Nr493u_6g', 2, '2026-04-10 11:12:39', '2026-04-10 11:12:39'),
	(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1ODQ5Njg3LCJleHAiOjE3NzY0NTQ0ODd9.IAcBl8kJLf_shBQ8_cDyW505_fM3nVfy6DRsISyaD_o', 1, '2026-04-10 19:34:47', '2026-04-10 19:34:47'),
	(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1ODUwNTU1LCJleHAiOjE3NzY0NTUzNTV9.J-ImMGXM0127kqvGCOxWHWvotqhVBbtSSJzKR-djlzk', 1, '2026-04-10 19:49:15', '2026-04-10 19:49:15'),
	(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1OTM5MTkyLCJleHAiOjE3NzY1NDM5OTJ9.lY85iaYXlw0Sd2sDcA6x15_arsg-uql18Lb1u4YGF9g', 1, '2026-04-11 20:26:32', '2026-04-11 20:26:32'),
	(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc1OTQyMTc0LCJleHAiOjE3NzY1NDY5NzR9.NtBiLT33qrjhCJzkC10271fwPr8LoAGudF9H5reryrE', 1, '2026-04-11 21:16:14', '2026-04-11 21:16:14'),
	(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDE4MTAwLCJleHAiOjE3NzY2MjI5MDB9.EF03_pSNKyOKoYd2buKnNl_lITFcF9ycRhDKzBWPt4U', 1, '2026-04-12 18:21:40', '2026-04-12 18:21:40'),
	(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDIwMjMwLCJleHAiOjE3NzY2MjUwMzB9.0S1KwTPoa_hS5OsI2W2Da5IwN4TmLS_TNIxBklFM2So', 1, '2026-04-12 18:57:10', '2026-04-12 18:57:10'),
	(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDIwMzczLCJleHAiOjE3NzY2MjUxNzN9.a-tjiwwAdj8Gh5QI0OYsRXuXoH2OmgEJg7vE53gmXsA', 1, '2026-04-12 18:59:33', '2026-04-12 18:59:33'),
	(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDIwNzEyLCJleHAiOjE3NzY2MjU1MTJ9.U4PwSR4HMiQ2AYJyghTrEKIUA0GwW3pqiYKN_EGzEYA', 1, '2026-04-12 19:05:12', '2026-04-12 19:05:12'),
	(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDIxMDg1LCJleHAiOjE3NzY2MjU4ODV9.dGpjmFln-8cMUnBOwj1tk4FlgsdTqlUqPWP4SS5HUFg', 1, '2026-04-12 19:11:25', '2026-04-12 19:11:25'),
	(17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDQ2NzE4LCJleHAiOjE3NzY2NTE1MTh9.aMNzMT-2GftSsrn958K_quhK1pvA6wTqz3CI33o1mn4', 1, '2026-04-13 02:18:38', '2026-04-13 02:18:38'),
	(18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDg3NjQ5LCJleHAiOjE3NzY2OTI0NDl9.tz4sI9iZ47ZArLWRXbIm_IGsTdNQBnp1n3xjJQbSWjI', 2, '2026-04-13 13:40:49', '2026-04-13 13:40:49'),
	(19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDg3NjgyLCJleHAiOjE3NzY2OTI0ODJ9.2t2_uoOOkxtHINeO8aEdLCmxO7wLZaRcU4KZXcQTt0E', 1, '2026-04-13 13:41:22', '2026-04-13 13:41:22'),
	(20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDg3NzM4LCJleHAiOjE3NzY2OTI1Mzh9.6Ue6C0WH9zx7OJiX082LHeopVO0O5POPtcIARhuoeTk', 2, '2026-04-13 13:42:18', '2026-04-13 13:42:18'),
	(21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDg5MjIyLCJleHAiOjE3NzY2OTQwMjJ9.aqs_S-DEYKkIaKotDEUbaR2HzR5HosGDFc2tTWCNowE', 2, '2026-04-13 14:07:02', '2026-04-13 14:07:02'),
	(22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDkyMzUxLCJleHAiOjE3NzY2OTcxNTF9.x09TaQnAcI-5KXsQQHjCdvxWqdFxPPJlumQ5bQI0oBU', 1, '2026-04-13 14:59:11', '2026-04-13 14:59:11'),
	(23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDkyNDA3LCJleHAiOjE3NzY2OTcyMDd9.8EPkdC71aU1gDrSQi318AMVC3Ell4UFNv_fEEuc4zUQ', 2, '2026-04-13 15:00:07', '2026-04-13 15:00:07'),
	(24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDkyNDQ3LCJleHAiOjE3NzY2OTcyNDd9.nkT1ghwhH-hN65SuK5y2DbrezNTvD1NYvgdUq2xOsQ8', 1, '2026-04-13 15:00:47', '2026-04-13 15:00:47'),
	(25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDkyNDcwLCJleHAiOjE3NzY2OTcyNzB9.FF76Rg1Bi04VN9s5e0Hx7gThF0BlVCFwF59jBUdvcGs', 2, '2026-04-13 15:01:10', '2026-04-13 15:01:10'),
	(26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDkyNzQzLCJleHAiOjE3NzY2OTc1NDN9.Fxh-72h-Cb3c5I_dcQq36hrQon41IYbbuYQS3-QInis', 2, '2026-04-13 15:05:43', '2026-04-13 15:05:43'),
	(27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MDk0MDIwLCJleHAiOjE3NzY2OTg4MjB9.Ume1ooOmqk3rMG1LMxvIO7psLc0RuevK_bc_-DwpF3w', 1, '2026-04-13 15:27:00', '2026-04-13 15:27:00'),
	(28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDk0NTAyLCJleHAiOjE3NzY2OTkzMDJ9.i16D51m8mch59VSN0E_Nc-FG6EhSXRFv_1B8dGKz9UQ', 2, '2026-04-13 15:35:02', '2026-04-13 15:35:02'),
	(29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MDk1ODg2LCJleHAiOjE3NzY3MDA2ODZ9.Ok4SZ40KSIesGMZP68wmWKB36k-2ZARCVxHrjz2AWNw', 2, '2026-04-13 15:58:06', '2026-04-13 15:58:06'),
	(30, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MTE3NDE1LCJleHAiOjE3NzY3MjIyMTV9.0nHaKKDCDad5odA3pxf13UnbbYuIgOYrCM372oLglNw', 1, '2026-04-13 21:56:55', '2026-04-13 21:56:55'),
	(31, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc2MTE3NDY4LCJleHAiOjE3NzY3MjIyNjh9.1eoDc8Gb_l-8utnrNCIbOnA6YtN3334SJvuZtMrs51w', 2, '2026-04-13 21:57:48', '2026-04-13 21:57:48'),
	(32, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MTE4MDU4LCJleHAiOjE3NzY3MjI4NTh9.Erj8NUxLoH2EYeq-kgSwCUM3W18UZZD2PylaFgvk8LQ', 1, '2026-04-13 22:07:38', '2026-04-13 22:07:38'),
	(33, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MTcwMjk1LCJleHAiOjE3NzY3NzUwOTV9.AwfLQW6fC6R5Wfg3-ztf244QerJ5koStTAbc7OU4Tgg', 1, '2026-04-14 12:38:15', '2026-04-14 12:38:15');

-- Dumping structure for table dgcc.typedocuments
CREATE TABLE IF NOT EXISTS `typedocuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `direction_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `sous_direction_id` int DEFAULT NULL,
  `division_id` int DEFAULT NULL,
  `section_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `direction_id` (`direction_id`),
  KEY `service_id` (`service_id`),
  KEY `sous_direction_id` (`sous_direction_id`),
  KEY `division_id` (`division_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `typedocuments_ibfk_1` FOREIGN KEY (`direction_id`) REFERENCES `directions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `typedocuments_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `typedocuments_ibfk_3` FOREIGN KEY (`sous_direction_id`) REFERENCES `sous_directions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `typedocuments_ibfk_4` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `typedocuments_ibfk_5` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table dgcc.typedocuments: ~2 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
