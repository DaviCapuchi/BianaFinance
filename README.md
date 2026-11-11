# Biana Finance 💰

O **Biana Finance** é uma aplicação web de gestão financeira pessoal desenvolvida para facilitar o controle de receitas, despesas, metas financeiras e visualização de relatórios analíticos com uma interface moderna e intuitiva.

---

## ✨ Funcionalidades

- **Dashboard Interativo:** Visão geral de saldo atual, receitas do mês, despesas, percentual comprometido da renda e gráficos de evolução financeira e categorias.
- **Gestão de Transações (`/transacoes`):** Listagem, busca, filtros por tipo (Receitas, Despesas, Cartão de Crédito) e cadastro de novas transações.
- **Relatórios (`/relatorios`):** Análise detalhada de gastos por categoria e comparativos mensais.
- **Metas Financeiras (`/metas`):** Acompanhamento de objetivos financeiros e progresso de economia.
- **Configurações e Conta (`/configuracoes`, `/signin`, `/signup`):** Gerenciamento de perfil, preferências e telas de autenticação.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM, Lucide React
- **Backend:** Node.js, Fastify, TypeScript, Zod
- **Banco de Dados & Infraestrutura:** PostgreSQL 16, Docker & Docker Compose
- **Testes:** Vitest & Testing Library

---

## 💻 Como rodar o projeto em outro PC

Você pode rodar o projeto de **duas formas**: **Sem Docker** (usando apenas o Node.js, ideal para rodar rápido em qualquer computador) ou **Com Docker** (que sobe o frontend junto com o container do banco PostgreSQL).

---

### Opção 1: Rodar SEM Docker (Mais rápido e recomendado para apresentações locais)

#### 1. O que você precisa baixar e instalar:
1. **Git:** [Baixar Git](https://git-scm.com/downloads)
2. **Node.js (versão 20 ou superior):** [Baixar Node.js LTS](https://nodejs.org/)

#### 2. Comandos para rodar (abra o Terminal / PowerShell):

```bash
# 1. Clone o repositório do GitHub
git clone https://github.com/DaviCapuchi/BianaFinance.git

# 2. Entre na pasta do projeto
cd BianaFinance

# 3. Instale as dependências do Frontend
npm --prefix frontend install

# 4. Inicie o servidor do Frontend
npm run dev:frontend
```

#### 3. Como acessar:
Abra o navegador e acesse:
👉 **`http://localhost:5173`**

*(Opcional) Caso também queira iniciar a API do Backend em outro terminal:*
```bash
npm --prefix backend install
npm run dev:backend
```

---

### Opção 2: Rodar COM Docker (Frontend + PostgreSQL)

#### 1. O que você precisa baixar e instalar:
1. **Git:** [Baixar Git](https://git-scm.com/downloads)
2. **Docker Desktop** (Windows/Mac) ou **Docker Engine + Docker Compose** (Linux): [Baixar Docker](https://www.docker.com/products/docker-desktop/)
   > ⚠️ *Certifique-se de que o Docker Desktop esteja aberto e rodando antes de executar os comandos.*

#### 2. Comandos para rodar:

```bash
# 1. Clone o repositório do GitHub
git clone https://github.com/DaviCapuchi/BianaFinance.git

# 2. Entre na pasta do projeto
cd BianaFinance

# 3. Suba os containers (Frontend + Banco de Dados PostgreSQL)
docker compose up --build
```

#### 3. Como acessar:
- **Aplicação Web (Frontend):** 👉 **`http://localhost:5173`**
- **Banco de Dados (PostgreSQL):** rodando na porta `5432`

Para encerrar os containers depois de usar:
```bash
docker compose down
```

---

## 🌐 Deploy Gratuito (Vercel)

O projeto já está configurado com `vercel.json` na raiz e na pasta `frontend/` para deploy imediato na **Vercel**:

1. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta do **GitHub**.
2. Clique em **"Add New..." → "Project"** e importe o repositório **`DaviCapuchi/BianaFinance`**.
3. Clique direto em **"Deploy"** (o arquivo `vercel.json` já configura automaticamente o build do `frontend` e as rotas do React Router).

---

## 🧪 Executando os Testes

```bash
# Testes do Frontend
npm run test:frontend

# Testes do Backend
npm run test:backend
```
