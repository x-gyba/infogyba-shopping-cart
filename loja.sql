SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `loja` DEFAULT CHARACTER SET latin1 COLLATE latin1_bin;
USE `loja`;

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_pessoa` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `compras` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` INT(11) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `desconto` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_com_desconto` DECIMAL(10,2) NOT NULL,
  `data_compra` DATETIME NOT NULL,
  `status` ENUM('pendente','confirmado') NOT NULL DEFAULT 'pendente',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `itens_compra` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `compra_id` INT(11) NOT NULL,
  `item` VARCHAR(255) NOT NULL,
  `quantidade` INT(11) NOT NULL,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  `imagem_url` VARCHAR(255) NULL,  -- Adicionando a coluna imagem_url
  PRIMARY KEY (`id`),
  KEY `compra_id` (`compra_id`),
  CONSTRAINT `itens_compra_ibfk_1` FOREIGN KEY (`compra_id`) REFERENCES `compras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `login_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `pessoa_fisica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) DEFAULT NULL,
  `nome_completo` varchar(255) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `celular` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `pessoa_fisica_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

CREATE TABLE `pessoa_juridica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) DEFAULT NULL,
  `cnpj` varchar(18) NOT NULL,
  `inscricao_estadual` varchar(20) NOT NULL,
  `razao_social` varchar(255) NOT NULL,
  `nome_responsavel` varchar(255) NOT NULL,
  `celular_responsavel` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `pessoa_juridica_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- Inserir dados nas tabelas
INSERT INTO `clientes` (`id`, `tipo_pessoa`, `email`, `senha`, `created_at`) VALUES
(1, 'fisica', 'admin@infogyba.com.br', '$2y$10$Bn.xBsD.jM9.MBr4kLF.G.Z0s07URO22SHx5W2Zz.QkI3X3TvfAd2', '2025-01-27 12:21:41');

INSERT INTO `login` (`id`, `usuario`, `email`, `senha`, `cliente_id`, `created_at`) VALUES
(1, 'Admin', 'admin@infogyba.com.br', '$2y$10$Bn.xBsD.jM9.MBr4kLF.G.Z0s07URO22SHx5W2Zz.QkI3X3TvfAd2', 1, '2025-01-10 22:21:24');

COMMIT;
