-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-04-2025 a las 09:00:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `grey`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacenes_ubicaciones`
--

CREATE TABLE `almacenes_ubicaciones` (
  `Id_Ubicacion` int(11) NOT NULL,
  `Area` varchar(100) NOT NULL,
  `Ubicacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacenes_ubicaciones`
--

INSERT INTO `almacenes_ubicaciones` (`Id_Ubicacion`, `Area`, `Ubicacion`) VALUES
(1, 'Consultorio', 'Área principal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `id` bigint(20) NOT NULL,
  `id_paciente` bigint(20) NOT NULL,
  `fecha_cita` datetime NOT NULL,
  `turno` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `tipo_cita_id` bigint(20) NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`id`, `id_paciente`, `fecha_cita`, `turno`, `estado`, `tipo_cita_id`, `observaciones`) VALUES
(3, 3, '2025-04-09 17:02:41', 'tarde', 'completado', 3, 'jhvhasxasxvsxvxgvsxvsgvxgvsxgvasx'),
(4, 4, '2025-04-09 17:02:41', 'tarde', 'completado', 4, '2122232323212'),
(7, 4, '2025-04-10 18:08:15', 'Tarde', 'completado', 4, 'dfgdfgdfgdfgfd'),
(8, 3, '2025-04-10 18:08:15', 'tarde', 'completado', 2, 'fgdfgdfgdgfdg'),
(9, 3, '2025-04-12 10:55:00', 'manana', 'completado', 1, 'wrerwerw'),
(10, 1, '2025-04-09 17:02:41', 'tarde', 'completado', 3, 'jhvhasxasxvsxvxgvsxvsgvxgvsxgvasx'),
(11, 2, '2025-04-09 17:02:41', 'tarde', 'pendiente', 4, '2122232323212'),
(12, 2, '2025-04-10 18:08:15', 'Tarde', 'completado', 4, 'dfgdfgdfgdfgfd'),
(13, 1, '2025-04-10 18:08:15', 'tarde', 'completado', 2, 'fgdfgdfgdgfdg'),
(14, 1, '2025-04-12 10:55:00', 'manana', 'pendiente', 1, 'wrerwerw'),
(15, 3, '2025-04-23 22:56:18', 'tarde', 'completado', 1, 'dcdcdcccd'),
(16, 3, '2025-04-24 17:11:32', 'tarde', 'completado', 2, NULL),
(17, 6, '2025-04-24 19:42:31', 'tarde', 'pendiente', 2, NULL),
(18, 6, '2025-04-24 19:42:31', 'tarde', 'completado', 2, NULL),
(19, 6, '2025-04-24 19:45:09', 'tarde', 'completado', 1, NULL),
(20, 3, '2025-04-24 19:45:09', 'tarde', 'completado', 4, NULL),
(21, 5, '2025-04-25 06:22:26', 'tarde', 'completado', 1, NULL),
(22, 6, '2025-04-25 08:48:16', 'tarde', 'pendiente', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consultas_medicas`
--

CREATE TABLE `consultas_medicas` (
  `id` bigint(20) NOT NULL,
  `id_medico` bigint(20) NOT NULL,
  `id_cita` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `consultas_medicas`
--

INSERT INTO `consultas_medicas` (`id`, `id_medico`, `id_cita`) VALUES
(13, 6, 3),
(14, 5, 4),
(15, 5, 7),
(16, 5, 8),
(17, 5, 9),
(18, 5, 8),
(19, 5, 15),
(20, 15, 16),
(21, 5, 16),
(22, 5, 18),
(23, 5, 19),
(24, 5, 20),
(25, 5, 21),
(26, 5, 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `Id_Equipo` int(11) NOT NULL,
  `Fecha_Instalacion` date DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `Frecuencia_mantenimiento` varchar(50) DEFAULT NULL,
  `Numero_de_serie` varchar(100) DEFAULT NULL,
  `Id_Modelo` int(11) NOT NULL,
  `Id_Ubicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id` bigint(20) NOT NULL,
  `id_consultas_medicas` bigint(20) NOT NULL,
  `id_paciente` bigint(20) NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `observaciones` text NOT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`id`, `id_consultas_medicas`, `id_paciente`, `fecha_registro`, `diagnostico`, `tratamiento`, `observaciones`, `img`) VALUES
(27, 16, 3, '2025-04-11 15:13:02', 'wwwwwwwwwwwwwdscsdsds', 'xxxxxxxxxxxxxxxxxcdscsdcs', 'xxxxxxxxxxxxxxxxxxcdscsc', '/uploads/archivo-1745470412785-40327198.pdf'),
(33, 15, 4, '2025-04-12 11:07:06', 'rtrtrteret', 'tertter', 'rtetr', NULL),
(34, 17, 3, '2025-04-22 00:21:57', 'qwdwewe', 'feffeff', 'fefefef', '/uploads/archivo-1745295717449-905100412.pdf'),
(35, 14, 4, '2025-04-23 12:36:56', 'cdcdcd', 'dcdc', 'sdsdv', '/uploads/archivo-1745426216496-845999371.pdf'),
(36, 19, 3, '2025-04-24 10:35:00', 'edwawdasdada', 'asddsdaasd', 'sdadsdsaad', '/uploads/archivo-1745505300954-875016191.pdf'),
(37, 18, 3, '2025-04-24 10:54:12', 'ssdsdas', 'asdsdadasd', 'sadadasda', '/uploads/archivo-1745506452898-178842284.pdf'),
(38, 18, 3, '2025-04-24 11:02:46', 'wfweewd', 'edewwewe', 'dewdwedwed', '/uploads/archivo-1745506966952-375793489.pdf'),
(39, 16, 3, '2025-04-24 11:09:00', 'assx', 'axsaa', 'assdad', '/uploads/archivo-1745507340720-528036751.pdf'),
(40, 21, 3, '2025-04-24 11:14:24', 'dadasdadasdasd', 'sddadsadasdsd', 'sdadasadsadasdaas', '/uploads/archivo-1745507664069-89588256.pdf'),
(41, 24, 3, '2025-04-24 13:50:35', 'qwqwdwd', 'wdwdwdwq', 'wqdwqdwq', '/uploads/archivo-1745517035067-196652312.pdf'),
(42, 22, 6, '2025-04-25 01:21:37', 'qwewddqw', 'wqdqwdwqdqw', 'wdqwwqdsq', '/uploads/archivo-1745558497295-329610321.pdf'),
(43, 25, 5, '2025-04-25 01:48:47', 'sassaaxasxs', 'sxssdccdscsc', 'csscsdcsdcssdc', '/uploads/archivo-1745560127873-933927586.pdf'),
(44, 23, 6, '2025-04-25 02:47:36', 'hhwdvedvwedwvhgd', 'hevdedvwdvededewdv', 'dwhjdbedhje', '/uploads/archivo-1745563656726-552323194.pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instrumentos`
--

CREATE TABLE `instrumentos` (
  `Id_Instrumento` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Codigo` varchar(50) DEFAULT NULL,
  `Tipo_Instrumento` varchar(50) DEFAULT NULL,
  `Unidades` int(11) DEFAULT 0,
  `Unidades_Minimas` int(11) DEFAULT 0,
  `Unidades_Maximas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instrumentos_ubicacion`
--

CREATE TABLE `instrumentos_ubicacion` (
  `Unidades_Por_Ubicacion` int(11) DEFAULT 0,
  `Id_Instrumento` int(11) NOT NULL,
  `Id_Ubicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `apellido` varchar(25) NOT NULL,
  `especialidad` varchar(20) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`id`, `nombre`, `apellido`, `especialidad`, `telefono`, `email`, `password`) VALUES
(5, 'Roberto', 'Siracosa', 'Urologo', '0414-3497390', 'roberto@email.com', '123456'),
(6, 'Maria', 'Viratti', 'Cardiologo', '0414-3497398', 'maria@email.com', '123456'),
(7, 'Ronald', 'Melendez', 'cardiologo', '04124026782', 'ronald@email.com', '123456'),
(8, 'Pepe', 'Trueno', 'urologo', '123456789', 'pepe@email.com', '123456'),
(9, 'jhon', 'ccccc', 'urologo', '7778888', 'jhon@email.com', '123456'),
(15, 'Brian', 'Vervey', 'cardiologo', '0424-4084902', 'bjbm0302@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos_equipos`
--

CREATE TABLE `modelos_equipos` (
  `Id_Modelo` int(11) NOT NULL,
  `Modelo` varchar(100) DEFAULT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Codigo` varchar(50) NOT NULL,
  `Marca` varchar(100) DEFAULT NULL,
  `Unidades` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos_productos`
--

CREATE TABLE `modelos_productos` (
  `Id_Producto` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Codigo` varchar(50) DEFAULT NULL,
  `Tipo_Producto` varchar(50) DEFAULT NULL,
  `Tipo_Unidad` varchar(20) DEFAULT NULL,
  `Unidades_Maximas` int(11) DEFAULT NULL,
  `Unidades_Minimas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modelos_productos`
--

INSERT INTO `modelos_productos` (`Id_Producto`, `Nombre`, `Descripcion`, `Codigo`, `Tipo_Producto`, `Tipo_Unidad`, `Unidades_Maximas`, `Unidades_Minimas`) VALUES
(1, 'Guantes quirúrgicos', 'Guantes estériles talla M', 'GQ-2023', 'Insumo médico', 'Unidad', 100, 10),
(2, 'Jeringas 5ml', 'Jeringas estériles descartables', 'JER-5ML', 'Insumo médico', 'Unidad', 200, 20),
(3, 'Guantes Quirurgicos', 'Guantes Esteriles talla M', NULL, NULL, NULL, NULL, 0),
(4, 'Jeringas 5ml', 'Jeringas esteriles descartables', NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `apellido` varchar(25) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('masculino','femenino','','') NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` text NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`id`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `telefono`, `direccion`, `email`) VALUES
(3, 'Pepe', 'Truenito', '2025-04-22', 'masculino', '0414-3497390', 'wjswwswsbwbswsbjs', 'jwsswskwswkws'),
(4, 'Juan', 'Pepito', '2025-04-15', 'masculino', '0412-2345678', 'dcfeffrffrf', 'wedededeedededee'),
(5, 'Pepe', 'Truenito', '2025-04-22', 'masculino', '0414-3497390', 'wjswwswsbwbswsbjs', 'jwsswskwswkws'),
(6, 'Juan', 'Pepito', '2025-04-15', 'masculino', '0412-2345678', 'dcfeffrffrf', 'wedededeedededee');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `Id_Producto` int(11) NOT NULL,
  `Id_modelo_productos` int(11) NOT NULL,
  `Unidades` int(11) DEFAULT NULL,
  `Fecha_Vencimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`Id_Producto`, `Id_modelo_productos`, `Unidades`, `Fecha_Vencimiento`) VALUES
(1, 1, 20, '2025-12-31'),
(2, 2, 100, '2025-10-31'),
(3, 1, 50, '0000-00-00'),
(4, 2, 50, '0000-00-00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_ubicacion`
--

CREATE TABLE `productos_ubicacion` (
  `Unidades_Por_Ubicacion` int(11) DEFAULT 0,
  `Id_Producto` int(11) NOT NULL,
  `Id_Ubicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos_ubicacion`
--

INSERT INTO `productos_ubicacion` (`Unidades_Por_Ubicacion`, `Id_Producto`, `Id_Ubicacion`) VALUES
(20, 1, 1),
(50, 2, 1),
(0, 3, 1);

--
-- Disparadores `productos_ubicacion`
--
DELIMITER $$
CREATE TRIGGER `actualizar_unidades_producto` AFTER UPDATE ON `productos_ubicacion` FOR EACH ROW BEGIN
    UPDATE Productos
    SET Unidades = (
        SELECT SUM(Unidades_Por_Ubicacion)
        FROM Productos_Ubicacion
        WHERE Id_Producto = NEW.Id_Producto
    )
    WHERE Id_Producto = NEW.Id_Producto;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `repuestos`
--

CREATE TABLE `repuestos` (
  `Id_Repuesto` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Numero_de_Pieza` varchar(100) DEFAULT NULL,
  `Unidades` int(11) DEFAULT NULL,
  `Unidades_Minimas` int(11) DEFAULT 0,
  `Unidades_Maximas` int(11) DEFAULT NULL,
  `Id_Ubicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacenes_ubicaciones`
--
ALTER TABLE `almacenes_ubicaciones`
  ADD PRIMARY KEY (`Id_Ubicacion`);

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`) USING BTREE;

--
-- Indices de la tabla `consultas_medicas`
--
ALTER TABLE `consultas_medicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_medico` (`id_medico`),
  ADD KEY `id_cita` (`id_cita`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`Id_Equipo`),
  ADD KEY `Id_Modelo` (`Id_Modelo`),
  ADD KEY `Id_Ubicacion` (`Id_Ubicacion`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_consultas_medicas` (`id_consultas_medicas`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `instrumentos`
--
ALTER TABLE `instrumentos`
  ADD PRIMARY KEY (`Id_Instrumento`);

--
-- Indices de la tabla `instrumentos_ubicacion`
--
ALTER TABLE `instrumentos_ubicacion`
  ADD PRIMARY KEY (`Id_Instrumento`,`Id_Ubicacion`),
  ADD KEY `Id_Ubicacion` (`Id_Ubicacion`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modelos_equipos`
--
ALTER TABLE `modelos_equipos`
  ADD PRIMARY KEY (`Id_Modelo`);

--
-- Indices de la tabla `modelos_productos`
--
ALTER TABLE `modelos_productos`
  ADD PRIMARY KEY (`Id_Producto`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`Id_Producto`),
  ADD KEY `Id_modelo_productos` (`Id_modelo_productos`);

--
-- Indices de la tabla `productos_ubicacion`
--
ALTER TABLE `productos_ubicacion`
  ADD PRIMARY KEY (`Id_Producto`,`Id_Ubicacion`),
  ADD KEY `Id_Ubicacion` (`Id_Ubicacion`);

--
-- Indices de la tabla `repuestos`
--
ALTER TABLE `repuestos`
  ADD PRIMARY KEY (`Id_Repuesto`),
  ADD KEY `Id_Ubicacion` (`Id_Ubicacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacenes_ubicaciones`
--
ALTER TABLE `almacenes_ubicaciones`
  MODIFY `Id_Ubicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `consultas_medicas`
--
ALTER TABLE `consultas_medicas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `Id_Equipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `instrumentos`
--
ALTER TABLE `instrumentos`
  MODIFY `Id_Instrumento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medico`
--
ALTER TABLE `medico`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `modelos_equipos`
--
ALTER TABLE `modelos_equipos`
  MODIFY `Id_Modelo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modelos_productos`
--
ALTER TABLE `modelos_productos`
  MODIFY `Id_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `Id_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `repuestos`
--
ALTER TABLE `repuestos`
  MODIFY `Id_Repuesto` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`);

--
-- Filtros para la tabla `consultas_medicas`
--
ALTER TABLE `consultas_medicas`
  ADD CONSTRAINT `consultas_medicas_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id`),
  ADD CONSTRAINT `consultas_medicas_ibfk_3` FOREIGN KEY (`id_cita`) REFERENCES `cita` (`id`);

--
-- Filtros para la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`Id_Modelo`) REFERENCES `modelos_equipos` (`Id_Modelo`) ON DELETE CASCADE,
  ADD CONSTRAINT `equipos_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`id_consultas_medicas`) REFERENCES `consultas_medicas` (`id`),
  ADD CONSTRAINT `historial_medico_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`);

--
-- Filtros para la tabla `instrumentos_ubicacion`
--
ALTER TABLE `instrumentos_ubicacion`
  ADD CONSTRAINT `instrumentos_ubicacion_ibfk_1` FOREIGN KEY (`Id_Instrumento`) REFERENCES `instrumentos` (`Id_Instrumento`),
  ADD CONSTRAINT `instrumentos_ubicacion_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_modelo_productos`) REFERENCES `modelos_productos` (`Id_Producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos_ubicacion`
--
ALTER TABLE `productos_ubicacion`
  ADD CONSTRAINT `productos_ubicacion_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos` (`Id_Producto`),
  ADD CONSTRAINT `productos_ubicacion_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`);

--
-- Filtros para la tabla `repuestos`
--
ALTER TABLE `repuestos`
  ADD CONSTRAINT `repuestos_ibfk_1` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
