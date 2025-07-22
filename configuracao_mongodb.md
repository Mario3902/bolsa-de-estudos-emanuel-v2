# Configuração MongoDB - Bolsa de Estudo Emanuel Xirimbimbi

## Resumo das Alterações

O projeto foi configurado para usar **MongoDB** em vez de MySQL, com as seguintes melhorias:

### ✅ Alterações Implementadas

1. **Base de Dados:** Migração de MySQL para MongoDB
2. **Média Mínima:** Reduzida de 18 para **16 valores**
3. **Sistema de Relevância:** Implementado baseado na média final
4. **Filtros Avançados:** Por média, categoria, status
5. **Agrupamentos:** Estatísticas detalhadas por categoria e faixas de média
6. **Vercel Analytics:** Integrado para análise de tráfego
7. **Hospedagem:** Configurado para Vercel

## Configuração do MongoDB

### String de Conexão
```
mongodb+srv://nlua28902:LZ4ikC3q3gtBVLNV@cluster0.r9pzybd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Estrutura de Dados

#### Collection: `applications`
```javascript
{
  _id: ObjectId,
  nome_completo: String,
  email: String (unique),
  telefone: String,
  bilhete_identidade: String (unique),
  data_nascimento: String,
  endereco: String,
  situacao_academica: String,
  nome_escola: String,
  media_final: Number,
  universidade: String,
  curso: String,
  categoria: String,
  carta_motivacao: String,
  nome_encarregado: String,
  telefone_encarregado: String,
  status: String (default: 'pendente'),
  relevancia_score: Number, // Calculado automaticamente
  created_at: Date,
  updated_at: Date
}
```

## Sistema de Relevância

### Cálculo do Score
- **Média Mínima:** 16 valores
- **Média Máxima:** 20 valores
- **Score:** 0-100 (baseado na média)

```javascript
function calculateRelevanceScore(media_final) {
  const minMedia = 16
  const maxMedia = 20
  
  if (media_final < minMedia) return 0
  if (media_final > maxMedia) return 100
  
  return Math.round(((media_final - minMedia) / (maxMedia - minMedia)) * 100)
}
```

### Exemplos de Score
- Média 16.0 = Score 0
- Média 17.0 = Score 25
- Média 18.0 = Score 50
- Média 19.0 = Score 75
- Média 20.0+ = Score 100

## Filtros e Agrupamentos

### Filtros Disponíveis
1. **Por Texto:** Nome, email, BI
2. **Por Status:** pendente, aprovado, rejeitado
3. **Por Categoria:** ensino-medio, universitario, tecnico, pos-graduacao
4. **Por Média:** Faixa mínima e máxima
5. **Ordenação:** Por relevância (score) descendente

### Agrupamentos Implementados
1. **Estatísticas Gerais:** Total, médias, status
2. **Por Categoria:** Contagem e média por categoria
3. **Por Faixas de Média:** 16-17, 17-18, 18-19, 19-20, 20+
4. **Por Relevância:** Faixas de score 0-25, 25-50, 50-75, 75-100
5. **Timeline:** Candidaturas por dia (últimos 30 dias)

## APIs Disponíveis

### GET /api/applications
Parâmetros:
- `search`: Busca por texto
- `status`: Filtro por status
- `categoria`: Filtro por categoria
- `media_min`: Média mínima
- `media_max`: Média máxima
- `page`: Página (paginação)
- `limit`: Itens por página

### GET /api/stats
Parâmetros:
- `type=geral`: Estatísticas gerais
- `type=relevancia`: Por faixas de relevância
- `type=categoria_media`: Por categoria e média
- `type=timeline`: Por período
- `type=top_candidatos`: Top 10 por relevância

### POST /api/applications
Criar nova candidatura com validação de média ≥ 16

## Vercel Analytics

### Integração
- Instalado: `@vercel/analytics`
- Configurado no `app/layout.tsx`
- Ativo automaticamente na Vercel

### Métricas Disponíveis
- Visualizações de página
- Tempo de carregamento
- Origem do tráfego
- Dispositivos utilizados
- Conversões (candidaturas submetidas)

## Variáveis de Ambiente para Vercel

```env
# MongoDB
MONGODB_URI=mongodb+srv://nlua28902:LZ4ikC3q3gtBVLNV@cluster0.r9pzybd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=bolsa_emanuel_xirimbimbi
PORT=5000

# Autenticação
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_aqui

# URLs
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_API_URL=https://seu-dominio.vercel.app/api
```

## Índices MongoDB

Os seguintes índices são criados automaticamente:
```javascript
// Únicos
{ email: 1 } // unique
{ bilhete_identidade: 1 } // unique

// Performance
{ status: 1 }
{ categoria: 1 }
{ media_final: -1 } // Descendente
{ relevancia_score: -1 } // Descendente
{ created_at: -1 } // Descendente
```

## Deploy na Vercel

### Passos
1. **Push para GitHub:** Código já está no repositório
2. **Conectar à Vercel:** Importar projeto do GitHub
3. **Configurar Variáveis:** Adicionar as variáveis de ambiente
4. **Deploy:** Automático após configuração

### Vantagens do MongoDB na Vercel
- **Serverless:** Ideal para funções serverless
- **Escalabilidade:** Escala automaticamente
- **Performance:** Consultas otimizadas
- **Agregações:** Estatísticas em tempo real

## Monitorização

### MongoDB Atlas
- Dashboard de performance
- Alertas de uso
- Backup automático
- Métricas de consultas

### Vercel Analytics
- Tráfego em tempo real
- Performance das páginas
- Conversões de candidaturas
- Origem dos utilizadores

## Manutenção

### Backup
- MongoDB Atlas: Backup automático
- Código: Versionado no GitHub
- Configurações: Documentadas

### Atualizações
- Dependências: Atualizadas regularmente
- Índices: Monitorizados e otimizados
- Performance: Acompanhada via Analytics

---

**Nota:** Esta configuração oferece máxima performance, escalabilidade e facilidade de manutenção para o sistema de bolsas de estudo.

