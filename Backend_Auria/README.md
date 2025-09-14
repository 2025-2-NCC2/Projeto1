# Auria API

API backend minimal para o projeto Auria, construída com Node.js, Express e MySQL.

## Recursos
- Registro e login de usuários
- Autenticação via JWT
- Endpoint de perfil (/auth/me)
- Scripts de inicialização e criação de admin

## Pré-requisitos
- Node.js >= 18
- MySQL rodando e acessível

## Instalação
1. Clonar o repositório
2. Instalar dependências:
   npm install

## Variáveis de ambiente
Criar um arquivo `.env` na raiz com as seguintes chaves:
- PORT (opcional) — porta da API (padrão 3000)
- DB_HOST — host do MySQL
- DB_PORT — porta do MySQL (padrão 3306)
- DB_USER — usuário do banco
- DB_PASSWORD — senha do banco
- DB_NAME — nome do banco
- JWT_SECRET — chave secreta para tokens JWT

## Como rodar
- Ambiente de desenvolvimento (recarregamento automático):
  npm run dev
- Produção:
  npm start

## Criar usuário admin
No repositório existe um script para criar um admin localmente:
  node scritps/createAdmin.js
Ajuste o arquivo se necessário antes de executar.

## Endpoints principais
- GET / — status da API
- POST /auth/register — registrar usuário (student)
- POST /auth/login — autenticar e receber JWT
- GET /auth/me — obter dados do usuário (requer header Authorization: Bearer <token>)

## Observações
- Certifique-se de que a tabela `users` exista e possua os campos esperados (name, email, password_hash, role, is_active, created_at, updated_at).
- Mantenha o `JWT_SECRET` seguro e não o commit em código-fonte.