# Golden Raspberry API - Migração Completa

## Resumo das Mudanças Realizadas

### ✅ 1. Migração para PNPM
- Removido `package-lock.json` e `node_modules`
- Agora usa `pnpm-lock.yaml` para gerenciamento de dependências
- Comando: `pnpm install` em vez de `npm install`

### ✅ 2. Docker Compose com PostgreSQL
- Criado `docker-compose.yml` com PostgreSQL 15
- **Removido** script `init.sql` (não é mais necessário)
- Banco configurado para usar credenciais: `golden_user/golden_password`
- Banco principal: `golden_raspberry`
- Banco de teste: `golden_raspberry_test`

### ✅ 3. Knex.js para Banco de Dados
- Substituído CSV por PostgreSQL usando Knex.js
- Configurado `knexfile.ts` para diferentes ambientes
- Migrations e seeds configurados
- Conexão automática baseada no `NODE_ENV`

### ✅ 4. Testes com Banco de Dados
- Configurado banco de teste separado (`golden_raspberry_test`)
- Setup/teardown automático para testes
- Todos os testes passando com dados do PostgreSQL

## Como Executar

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Subir Banco de Dados
```bash
# Subir PostgreSQL com Docker
pnpm docker:up

# Aguardar 5 segundos para o banco inicializar
sleep 5
```

### 3. Configurar Banco (Desenvolvimento)
```bash
# Executar migrations
pnpm db:migrate

# Popular com dados do CSV
pnpm db:seed
```

### 4. Configurar Banco de Teste
```bash
# Configurar banco de teste
pnpm db:test:setup
```

### 5. Executar Aplicação
```bash
# Desenvolvimento
pnpm dev

# Produção (após build)
pnpm build
pnpm start
```

### 6. Executar Testes
```bash
# Todos os testes
pnpm test

# Testes com watch
pnpm test:watch

# Testes com coverage
pnpm test:coverage
```

## Scripts Disponíveis

### Banco de Dados
- `pnpm db:migrate` - Executar migrations
- `pnpm db:rollback` - Reverter última migration
- `pnpm db:seed` - Popular dados do CSV
- `pnpm db:reset` - Reset completo (rollback + migrate + seed)
- `pnpm db:test:setup` - Configurar banco de teste

### Docker
- `pnpm docker:up` - Subir PostgreSQL
- `pnpm docker:down` - Parar PostgreSQL

### Setup Completo
- `pnpm setup:db` - Comando único para subir tudo (docker + migrate + seed)

## Variáveis de Ambiente

### Desenvolvimento (`.env`)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=golden_raspberry
DB_USER=golden_user
DB_PASSWORD=golden_password
DB_SSL=false
DATABASE_URL=postgresql://golden_user:golden_password@localhost:5432/golden_raspberry
PORT=3000
NODE_ENV=development
```

### Teste (`.env.test`)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=golden_raspberry_test
DB_USER=golden_user
DB_PASSWORD=golden_password
DB_SSL=false
DATABASE_URL=postgresql://golden_user:golden_password@localhost:5432/golden_raspberry_test
PORT=3001
NODE_ENV=test
```

## Estrutura de Banco

### Tabela `movies`
```sql
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  title VARCHAR NOT NULL,
  studios TEXT NOT NULL,
  producers TEXT NOT NULL,
  winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX movies_year_index ON movies (year);
CREATE INDEX movies_winner_index ON movies (winner);
CREATE INDEX movies_year_winner_index ON movies (year, winner);
```

## Mudanças no Código

### MovieRepository
- Métodos agora são `async` e retornam `Promise<Movie[]>`
- Conecta ao PostgreSQL via Knex.js em vez de ler CSV
- Dados populados via seed do CSV original

### ProducerService
- Atualizado para usar métodos `async` do repository
- Lógica mantida igual, apenas await adicionado

### Testes
- Configurado setup/teardown automático
- Usa banco de teste separado
- Todos os testes adaptados para métodos async

## Troubleshooting

### Error: relation "movies_winner_index" already exists
✅ **Resolvido** - Migration corrigida para evitar índices duplicados

### Error: database "golden_raspberry_test" does not exist
✅ **Resolvido** - Banco de teste criado automaticamente

### Testes falhando por await
✅ **Resolvido** - Todos os métodos do repository agora são async

## Próximos Passos

A migração está completa e funcional. O projeto agora:
- ✅ Usa PNPM em vez de NPM
- ✅ Usa PostgreSQL em vez de CSV
- ✅ Tem testes funcionando com banco de dados
- ✅ Tem setup automatizado via Docker Compose
- ✅ Suporta ambientes separados (dev/test/prod)
