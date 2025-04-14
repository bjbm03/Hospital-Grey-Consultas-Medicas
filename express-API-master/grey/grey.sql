-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla grey.cita: ~4 rows (aproximadamente)
INSERT INTO `cita` (`id`, `id_paciente`, `fecha_cita`, `turno`, `estado`, `tipo_cita_id`, `observaciones`) VALUES
	(3, 3, '2025-04-09 17:02:41', 'tarde', 'completado', 3, 'jhvhasxasxvsxvxgvsxvsgvxgvsxgvasx'),
	(4, 4, '2025-04-09 17:02:41', 'tarde', 'pendiente', 4, '2122232323212'),
	(7, 4, '2025-04-10 18:08:15', 'Tarde', 'completado', 4, 'dfgdfgdfgdfgfd'),
	(8, 3, '2025-04-10 18:08:15', 'tarde', 'completado', 2, 'fgdfgdfgdgfdg'),
	(9, 3, '2025-04-12 10:55:00', 'manana', 'pendiente', 1, 'wrerwerw');

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla grey.consultas_medicas: ~4 rows (aproximadamente)
INSERT INTO `consultas_medicas` (`id`, `id_medico`, `id_cita`) VALUES
	(13, 6, 3),
	(14, 5, 4),
	(15, 5, 7),
	(16, 5, 8),
	(17, 5, 9);

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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla grey.historial_medico: ~1 rows (aproximadamente)
INSERT INTO `historial_medico` (`id`, `id_consultas_medicas`, `id_paciente`, `fecha_registro`, `diagnostico`, `tratamiento`, `observaciones`, `img`) VALUES
	(27, 16, 3, '2025-04-11 15:13:02', 'wwwwwwwwwwwww', 'xxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxx', '/uploads/archivo-1744398782809-673608826.pdf'),
	(33, 15, 4, '2025-04-12 11:07:06', 'rtrtrteret', 'tertter', 'rtetr', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla grey.medico: ~4 rows (aproximadamente)
INSERT INTO `medico` (`id`, `nombre`, `apellido`, `especialidad`, `telefono`, `email`, `password`) VALUES
	(5, 'Roberto', 'Siracosa', 'Urologo', '0414-3497390', 'roberto@email.com', '123456'),
	(6, 'Maria', 'Viratti', 'Cardiologo', '0414-3497398', 'maria@email.com', '123456'),
	(7, 'Ronald', 'Melendez', 'cardiologo', '04124026782', 'ronald@email.com', '123456'),
	(8, 'Pepe', 'Trueno', 'urologo', '123456789', 'pepe@email.com', '123456'),
	(9, 'jhon', 'ccccc', 'urologo', '7778888', 'jhon@email.com', '123456');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla grey.paciente: ~2 rows (aproximadamente)
INSERT INTO `paciente` (`id`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `telefono`, `direccion`, `email`) VALUES
	(3, 'Pepe', 'Truenito', '2025-04-22', 'masculino', '0414-3497390', 'wjswwswsbwbswsbjs', 'jwsswskwswkws'),
	(4, 'Juan', 'Pepito', '2025-04-15', 'masculino', '0412-2345678', 'dcfeffrffrf', 'wedededeedededee');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
