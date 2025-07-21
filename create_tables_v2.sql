-- Script SQL para criar as tabelas da base de dados do projeto de bolsa de estudos
-- Versão 2 - Atualizada conforme a nova estrutura

CREATE DATABASE IF NOT EXISTS bolsa_emanuel_xirimbimbi_v2;
USE bolsa_emanuel_xirimbimbi_v2;

-- Tabela principal de candidaturas
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(50) NOT NULL,
    bilhete_identidade VARCHAR(50) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    endereco TEXT,
    situacao_academica VARCHAR(100) NOT NULL,
    nome_escola VARCHAR(255) NOT NULL,
    media_final DECIMAL(4,2) NOT NULL,
    universidade VARCHAR(255),
    curso VARCHAR(255),
    categoria VARCHAR(100) NOT NULL,
    carta_motivacao TEXT NOT NULL,
    nome_encarregado VARCHAR(255),
    telefone_encarregado VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para documentos anexados (se necessário)
CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Tabela para administradores (se necessário)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Inserir um administrador padrão (senha: admin123)
-- IMPORTANTE: Altere a senha após o primeiro login!
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOzJqKqKqKqKqKqKqKqKqOzJqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'admin@bolsaemanuel.com')
ON DUPLICATE KEY UPDATE username = username;

-- Índices para melhor performance
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_categoria ON applications(categoria);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_bi ON applications(bilhete_identidade);

