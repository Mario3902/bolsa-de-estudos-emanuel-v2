# Configuração do Projeto - Bolsa de Estudo Emanuel Xirimbimbi (Versão 2)

## Resumo do Projeto

Esta é a versão 2 do projeto Next.js para o sistema de candidatura a bolsas de estudo. O sistema permite que candidatos preencham um formulário em múltiplas etapas e submetam suas candidaturas para uma base de dados MySQL. Esta versão inclui melhorias na estrutura da base de dados e na gestão de dados.

## Principais Diferenças da Versão 2

### Melhorias na Base de Dados
- **Pool de conexões MySQL:** Melhor gestão de conexões com a base de dados
- **Estrutura simplificada:** Campos otimizados na tabela `applications`
- **Novos campos:** Adicionados `endereco`, `nome_encarregado`, `telefone_encarregado`
- **Timestamps:** Campos `created_at` e `updated_at` para melhor rastreamento

### Atualizações Técnicas
- **Next.js:** Atualizado para versão 15.2.4
- **React:** Atualizado para versão 19
- **Multer:** Adicionado para melhor gestão de uploads
- **Pool de conexões:** Implementado para melhor performance

## Estrutura do Projeto

### Frontend (Next.js)
- **Framework:** Next.js 15.2.4 com TypeScript
- **UI:** Radix UI + Tailwind CSS
- **Formulários:** React Hook Form + Zod para validação
- **Autenticação:** bcryptjs + jsonwebtoken

### Backend (API Routes)
- **API:** Next.js API Routes
- **Base de Dados:** MySQL com mysql2 e pool de conexões
- **Upload de Ficheiros:** Multer para gestão de uploads

## Configuração da Base de Dados

### Tabelas Necessárias

#### 1. Tabela `applications` (Versão 2)
```sql
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
```

#### 2. Tabela `application_documents`
```sql
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
```

#### 3. Tabela `admin_users`
```sql
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Configurações da Base de Dados MySQL - Versão 2
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=bolsa_emanuel_xirimbimbi_v2
DB_PORT=3306

# Configurações de Autenticação
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_aqui
ADMIN_PASSWORD_HASH=$2b$10$rOzJqKqKqKqKqKqKqKqKqOzJqKqKqKqKqKqKqKqKqKqKqKqKqKqKq

# Configurações de Upload
UPLOAD_MAX_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/jpg,image/png,image/webp
UPLOAD_DIR=public/uploads

# URL da aplicação (para produção na Vercel)
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_API_URL=https://seu-dominio.vercel.app/api
```

## Funcionalidades do Sistema

### Formulário de Candidatura
- **Dados Pessoais:** Nome, data de nascimento, BI, telefone, email, endereço
- **Dados Académicos:** Situação académica, escola, média, universidade, curso
- **Dados do Encarregado:** Nome e telefone do encarregado (se aplicável)
- **Categoria:** Seleção da categoria de bolsa
- **Carta de Motivação:** Texto livre para justificação

### Categorias de Bolsa
1. **Recém-Formados do Ensino Médio**
2. **Universitários em Curso**
3. **Cursos Técnicos Superiores**
4. **Pós-Graduação e Mestrado**

### Validações
- **Média mínima:** 18 valores
- **Campos obrigatórios:** Validados no frontend e backend
- **Email único:** Não permite emails duplicados
- **BI único:** Não permite bilhetes de identidade duplicados

## Instruções para Hospedagem na Vercel

### Pré-requisitos
1. Conta na Vercel
2. Base de dados MySQL (recomendado: PlanetScale, Railway, ou AWS RDS)
3. Repositório Git (GitHub, GitLab, ou Bitbucket)

### Passos para Deploy

#### 1. Preparar o Repositório
```bash
# Inicializar repositório Git (se ainda não feito)
git init
git add .
git commit -m "Initial commit - Versão 2"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/seu-repositorio-v2.git
git push -u origin main
```

#### 2. Configurar Base de Dados
- Criar uma base de dados MySQL num provedor cloud
- Executar o script `create_tables_v2.sql` para criar as tabelas
- Anotar as credenciais de conexão

#### 3. Deploy na Vercel
1. Aceder a [vercel.com](https://vercel.com) e fazer login
2. Clicar em "New Project"
3. Importar o repositório Git
4. Configurar as variáveis de ambiente (conforme listado acima)
5. Clicar em "Deploy"

### Melhorias da Versão 2

#### Performance
- **Pool de conexões:** Melhor gestão de conexões com a base de dados
- **Índices:** Adicionados índices para consultas mais rápidas
- **Timestamps:** Melhor rastreamento de criação e atualização

#### Estrutura de Dados
- **Campos adicionais:** Endereço e dados do encarregado
- **Validações melhoradas:** Emails e BIs únicos
- **Status tracking:** Melhor gestão do status das candidaturas

#### Segurança
- **Hash de senhas:** Implementado para administradores
- **Validação de dados:** Melhorada no backend
- **Gestão de sessões:** Implementada para administradores

## Manutenção e Monitorização

### Logs
- Verificar logs na Vercel para erros de API
- Monitorizar pool de conexões com a base de dados
- Acompanhar performance das consultas

### Backup
- Configurar backup automático da base de dados
- Manter cópias dos ficheiros enviados
- Backup regular das variáveis de ambiente

### Atualizações
- Testar alterações localmente antes do deploy
- Usar branches para funcionalidades novas
- Configurar CI/CD para deploys automáticos

## Diferenças Técnicas da Versão 1

| Aspecto | Versão 1 | Versão 2 |
|---------|----------|----------|
| Next.js | 14.2.16 | 15.2.4 |
| React | 18 | 19 |
| Conexão DB | Simples | Pool de conexões |
| Campos | Básicos | Expandidos (endereço, encarregado) |
| Timestamps | Simples | created_at + updated_at |
| Upload | Básico | Multer integrado |
| Validações | Frontend | Frontend + Backend melhorado |

## Suporte Técnico

Para questões técnicas ou problemas:
1. Verificar logs na Vercel
2. Testar pool de conexões com a base de dados
3. Validar variáveis de ambiente
4. Verificar permissões de ficheiros
5. Monitorizar performance das consultas

---

**Nota:** Esta versão 2 oferece melhor performance, estrutura de dados mais robusta e melhor gestão de recursos. Recomendada para ambientes de produção com maior volume de candidaturas.

