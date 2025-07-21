-- Create database
CREATE DATABASE IF NOT EXISTS bolsa_estudos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bolsa_estudos;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    bilhete_identidade VARCHAR(50) NOT NULL,
    data_nascimento DATE NOT NULL,
    endereco TEXT NOT NULL,
    situacao_academica ENUM('matriculado', 'terminado') NOT NULL,
    nome_escola VARCHAR(255) NOT NULL,
    media_final DECIMAL(4,2),
    universidade VARCHAR(255),
    curso VARCHAR(255),
    categoria ENUM('ensino-medio', 'universitario', 'tecnico', 'pos-graduacao') NOT NULL,
    carta_motivacao TEXT NOT NULL,
    nome_encarregado VARCHAR(255),
    telefone_encarregado VARCHAR(20),
    status ENUM('pendente', 'em-analise', 'aprovado', 'rejeitado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_categoria (categoria),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type ENUM('bilhete_identidade', 'certificado_ensino', 'declaracao_notas', 'declaracao_matricula', 'carta_recomendacao') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id),
    INDEX idx_document_type (document_type)
);

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('ensino-medio', 'universitario', 'tecnico', 'pos-graduacao') NOT NULL,
    total_scholarships INT NOT NULL DEFAULT 0,
    available_scholarships INT NOT NULL DEFAULT 0,
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default scholarships
INSERT INTO scholarships (category, total_scholarships, available_scholarships, description) VALUES
('ensino-medio', 5, 5, 'Bolsas para recém-formados do ensino médio'),
('universitario', 10, 10, 'Bolsas para estudantes universitários'),
('tecnico', 3, 3, 'Bolsas para cursos técnicos superiores'),
('pos-graduacao', 2, 2, 'Bolsas para pós-graduação e mestrado')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
