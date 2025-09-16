# Golden Raspberry API

API REST para consulta dos indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

## Tecnologias Utilizadas

- **Node.js** com TypeScript
- **Hono** - Framework web rápido e leve
- **PostgreSQL** - Banco de dados
- **Knex.js** - Query builder e migrations
- **Docker Compose** - Orquestração de containers
- **Jest** - Framework de testes
- **PNPM** - Gerenciador de pacotes

## Pré-requisitos

- Node.js 18+
- PNPM
- Docker e Docker Compose

## Instalação e Execução

### 1. Clone o repositório
```bash
git clone <repository-url>
cd golden-raspberry-api
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure o banco de dados
```bash
# Suba o container do PostgreSQL
pnpm docker:up

# Aguarde alguns segundos para o banco inicializar, então execute as migrations e seeds
pnpm migrate:latest
pnpm seed
```

### 4. Inicie a aplicação
```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

## Scripts Disponíveis

### Desenvolvimento
- `pnpm dev` - Executa a aplicação em modo de desenvolvimento
- `pnpm build` - Compila o TypeScript para JavaScript
- `pnpm start` - Executa a aplicação compilada

### Docker
- `pnpm docker:up` - Sobe o container do PostgreSQL
- `pnpm docker:down` - Para e remove o container do PostgreSQL

### Banco de Dados
- `pnpm migrate:latest` - Executa as migrations mais recentes
- `pnpm migrate:rollback` - Desfaz a última migration
- `pnpm seed` - Popula o banco com dados iniciais
- `pnpm reset` - Reseta o banco (rollback + migrate + seed)

### Testes
- `pnpm test` - Executa todos os testes
- `pnpm test:watch` - Executa os testes em modo watch
- `pnpm test:coverage` - Executa os testes com relatório de cobertura
- `pnpm test:setup` - Configura o banco de dados de teste

### Setup Completo (Recomendado)
```bash
# Comando único que configura tudo
pnpm setup:db
```

Este comando irá:
1. Subir o container do PostgreSQL
2. Aguardar 5 segundos para inicialização
3. Executar as migrations
4. Popular o banco com os dados do CSV

## Endpoints da API

### GET /
Retorna informações básicas da API.

### GET /producers/intervals
Retorna os produtores com os maiores e menores intervalos entre vitórias consecutivas.

**Exemplo de resposta:**
```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```