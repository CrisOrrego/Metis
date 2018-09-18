-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-09-2018 a las 01:56:36
-- Versión del servidor: 10.1.26-MariaDB
-- Versión de PHP: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `metis`
--
CREATE DATABASE IF NOT EXISTS `metis` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `metis`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pqrs`
--

CREATE TABLE `pqrs` (
  `Id` int(11) NOT NULL,
  `Formato` varchar(5) NOT NULL,
  `Tipo_Cre` varchar(5) NOT NULL,
  `Subcuenta` varchar(5) NOT NULL,
  `Identificacion` varchar(50) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Nro_Credito` varchar(50) NOT NULL,
  `Descripcion` varchar(255) NOT NULL,
  `Estado_Reclama` varchar(5) NOT NULL,
  `Tipo_Respuesta` varchar(5) NOT NULL,
  `Fecha_Radicado` date NOT NULL,
  `Mes` varchar(20) NOT NULL,
  `Fecha_Respuesta` date NOT NULL,
  `Favorabilidad` varchar(50) NOT NULL,
  `Tipificacion` varchar(50) NOT NULL,
  `Subtipificacion` varchar(50) NOT NULL,
  `Tipo_Llamada` varchar(50) NOT NULL,
  `Canal` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pqrs`
--

INSERT INTO `pqrs` (`Id`, `Formato`, `Tipo_Cre`, `Subcuenta`, `Identificacion`, `Nombre`, `Nro_Credito`, `Descripcion`, `Estado_Reclama`, `Tipo_Respuesta`, `Fecha_Radicado`, `Mes`, `Fecha_Respuesta`, `Favorabilidad`, `Tipificacion`, `Subtipificacion`, `Tipo_Llamada`, `Canal`) VALUES
(1, '379', '3', '265', '1128469492', 'CARLOS  ANDRES RAMIREZ CEBALLOS ', '1000510501', 'Garantías y levantamiento de gravámenes', '2', '3', '2018-01-02', 'ENERO', '2018-01-04', 'LA ENTIDAD', 'PRENDAS', 'CONFIRMACIÓN PROCESO DE LEVANTAMIENTO DE PRENDA', 'QUEJA', 'LLAMADA'),
(2, '378', '3', '30', '1044420800', 'Maria Angelica Blanco Wilches', '1000328242', 'Aspectos contractuales', '2', '3', '2018-01-02', 'ENERO', '2018-01-09', 'LA ENTIDAD', 'ABONOS_A_CAPITAL', 'APLICACIÓN DE ABONO A REDUCE CUOTA', 'DEFENSOR', 'CORREO'),
(3, 'N/A', 'N/A', 'N/A', '92500641', 'RAFAEL ANTONIO FERNANDEZ OLIVERA', '1000607623', 'N/A', 'N/A', 'N/A', '2018-01-02', 'ENERO', '2018-01-02', 'N/A', 'SALDO', 'SOLICITUD VALOR DE LA CUOTA MENSUAL A PAGAR', 'PETICION', 'LLAMADA'),
(4, '379', '3', '510', '31879150', 'SANDRA VILMA GONZALEZ DURAN', '1000615202', 'Revision y/o liquidación', '2', '1', '2018-01-02', 'ENERO', '2018-01-05', 'DEL CLIENTE', 'SALDO', 'SOLICITUD DEL SALDO TOTAL ADEUDADO', 'QUEJA', 'CORREO'),
(5, '379', '3', '265', '30775632', 'LIBIA MERCEDES VIGGIANI GUARDO', '1000097707', 'Garantías y levantamiento de gravámenes', '2', '1', '2018-01-03', 'ENERO', '2018-01-05', 'DEL CLIENTE', 'Prendas', 'SOLICITUD LEVANTAMIENTO DE PRENDA', 'DERECHO DE PETICIÓN', 'CORREO'),
(6, '379', '3', '30', '55159104', 'MARTHA BEATRIZ HERRERA QUINTERO', '1000263096', 'Aspectos contractuales', '2', '1', '2018-03-02', 'MARZO', '2018-03-14', 'DEL CLIENTE', 'PAGOS', 'DETALLE DEL PAGO REALIZADO DE LA CUOTA MENSUAL - C', 'SFC', 'CORREO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id`, `Email`, `Nombre`, `Contraseña`) VALUES
(1, 'admin@metisla.com', 'Administrador', '$2y$10$bPACs0R5FnQYvOvb6PgUXuli9q1wM7QuEQLEF2V6MxuFvJkLemqA2');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
