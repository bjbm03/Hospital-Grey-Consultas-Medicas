-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.7.0.6850
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Configuración inicial
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `grey` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `grey`;

-- --------------------------------------------------------
-- Tablas principales sin dependencias (deben crearse primero)
-- --------------------------------------------------------

-- Volcando estructura para tabla grey.medico
CREATE TABLE IF NOT EXISTS `medico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `especialidad` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla grey.paciente
CREATE TABLE IF NOT EXISTS `paciente` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('masculino','femenino','','') COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` text COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tablas con dependencias (se crean después)
-- --------------------------------------------------------

-- Volcando estructura para tabla grey.cita
CREATE TABLE IF NOT EXISTS `cita` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_paciente` bigint NOT NULL,
  `fecha_cita` datetime NOT NULL,
  `turno` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_cita_id` bigint NOT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `id_paciente` (`id_paciente`) USING BTREE,
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla grey.consultas_medicas
CREATE TABLE IF NOT EXISTS `consultas_medicas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_medico` bigint NOT NULL,
  `id_cita` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_medico` (`id_medico`),
  KEY `id_cita` (`id_cita`),
  CONSTRAINT `consultas_medicas_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id`),
  CONSTRAINT `consultas_medicas_ibfk_3` FOREIGN KEY (`id_cita`) REFERENCES `cita` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla grey.historial_medico
CREATE TABLE IF NOT EXISTS `historial_medico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_consultas_medicas` bigint NOT NULL,
  `id_paciente` bigint NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `diagnostico` text COLLATE utf8mb4_general_ci NOT NULL,
  `tratamiento` text COLLATE utf8mb4_general_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_consultas_medicas` (`id_consultas_medicas`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`id_consultas_medicas`) REFERENCES `consultas_medicas` (`id`),
  CONSTRAINT `historial_medico_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Inserción de datos (modificada para evitar IDs duplicados)
-- --------------------------------------------------------

-- Desactivar verificaciones temporalmente
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;

-- Insertar médicos (sin IDs específicos)
INSERT INTO `medico` (`nombre`, `apellido`, `especialidad`, `telefono`, `email`, `password`) VALUES
('Roberto', 'Siracosa', 'Urologo', '0414-3497390', 'roberto@email.com', '123456'),
('Maria', 'Viratti', 'Cardiologo', '0414-3497398', 'maria@email.com', '123456'),
('Ronald', 'Melendez', 'cardiologo', '04124026782', 'ronald@email.com', '123456'),
('Pepe', 'Trueno', 'urologo', '123456789', 'pepe@email.com', '123456'),
('jhon', 'ccccc', 'urologo', '7778888', 'jhon@email.com', '123456');

-- Insertar pacientes (sin IDs específicos)
INSERT INTO `paciente` (`nombre`, `apellido`, `fecha_nacimiento`, `genero`, `telefono`, `direccion`, `email`) VALUES
('Pepe', 'Truenito', '2025-04-22', 'masculino', '0414-3497390', 'wjswwswsbwbswsbjs', 'jwsswskwswkws'),
('Juan', 'Pepito', '2025-04-15', 'masculino', '0412-2345678', 'dcfeffrffrf', 'wedededeedededee');

-- Insertar citas (sin IDs específicos)
INSERT INTO `cita` (`id_paciente`, `fecha_cita`, `turno`, `estado`, `tipo_cita_id`, `observaciones`) VALUES
(1, '2025-04-09 17:02:41', 'tarde', 'completado', 3, 'jhvhasxasxvsxvxgvsxvsgvxgvsxgvasx'),
(2, '2025-04-09 17:02:41', 'tarde', 'pendiente', 4, '2122232323212'),
(2, '2025-04-10 18:08:15', 'Tarde', 'completado', 4, 'dfgdfgdfgdfgfd'),
(1, '2025-04-10 18:08:15', 'tarde', 'completado', 2, 'fgdfgdfgdgfdg'),
(1, '2025-04-12 10:55:00', 'manana', 'pendiente', 1, 'wrerwerw');

-- Reactivar verificaciones
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;

-- Restaurar configuraciones
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;