# 🧩 Banco de Dados - Projeto Áuria

Este projeto implementa um banco de dados MySQL chamado **`auria`**, desenvolvido para gerenciar grupos, usuários, doações e comunicações por e-mail dentro da plataforma Áuria — um sistema colaborativo voltado à arrecadação de recursos e alimentos.

---

## 🏗️ Estrutura Geral

O banco de dados contém as seguintes tabelas principais:

1. **`users`** – Armazena as informações dos usuários cadastrados.  
2. **`groups`** – Representa os grupos de arrecadação e suas metas.  
3. **`donations`** – Registra as doações realizadas pelos usuários.  
4. **`email_outbox`** – Gerencia o envio de e-mails automáticos.  
5. **`invitations`** – Controla convites enviados para novos usuários.

Essas tabelas foram criadas utilizando o mecanismo **InnoDB** e o conjunto de caracteres **utf8mb4**, garantindo suporte a acentuação e emojis.

---

## 🧱 Estrutura das Tabelas

### 1. Tabela `users`

Armazena os dados dos usuários cadastrados na plataforma.

| Campo | Tipo | Descrição |
|-------|------|------------|
| `id` | INT (PK) | Identificador único do usuário |
| `group_id` | INT (FK) | Grupo ao qual o usuário pertence |
| `name` | VARCHAR(255) | Nome completo do usuário |
| `email` | VARCHAR(255) | Endereço de e-mail (único) |
| `type` | ENUM('Mentor','Colaborador','Administrador') | Função do usuário |
| `password` | VARCHAR(255) | Senha criptografada |
| `created_at` | TIMESTAMP | Data de criação do usuário |
| `current_money_collection` | DOUBLE | Total em dinheiro doado |
| `current_food_collection` | DOUBLE | Total em alimentos doados |
| `status` | TINYINT(1) | Indica se o usuário está ativo (1) ou inativo (0) |

🔗 **Relacionamentos:**
- `group_id` → chave estrangeira que referencia `groups.id`.

---

### 2. Tabela `groups`

Representa os grupos de arrecadação e seus objetivos.

| Campo | Tipo | Descrição |
|--------|------|------------|
| `id` | INT (PK) | Identificador único do grupo |
| `name` | VARCHAR(45) | Nome do grupo |
| `members` | INT | Quantidade de integrantes |
| `created_at` | TIMESTAMP | Data de criação do grupo |
| `monetary_target` | DOUBLE | Meta financeira (em R$) |
| `food_goal` | DOUBLE | Meta de alimentos (em Kg) |
| `current_food_collection` | DOUBLE | Total atual arrecadado em alimentos |
| `current_money_collection` | DOUBLE | Total atual arrecadado em dinheiro |
| `status` | TINYINT(1) | Indica se o grupo está ativo (1) ou inativo (0) |

---

### 3. Tabela `donations`

Registra as doações realizadas pelos usuários.

| Campo | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT (PK) | Identificador único da doação |
| `id_group` | INT (FK) | Grupo beneficiado pela doação |
| `type` | TINYINT(1) | Tipo de doação (0 = alimento, 1 = dinheiro) |
| `quantity` | DOUBLE | Quantidade doada (Kg ou R$) |
| `user_agent` | VARCHAR(255) | Identificação do usuário doador |
| `proof` | VARCHAR(255) | Caminho do arquivo de comprovante |
| `inserted_at` | TIMESTAMP | Data/hora da doação |
| `score_fraud` | INT | Índice de risco de fraude |

🔗 **Relacionamentos:**
- `id_group` → chave estrangeira que referencia `groups.id`.

---

### 4. Tabela `email_outbox`

Gerencia o envio de e-mails automáticos da aplicação (como convites e notificações).

| Campo | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT (PK) | Identificador do e-mail |
| `from_email` | VARCHAR(255) | Endereço do remetente |
| `to_email` | VARCHAR(255) | Endereço do destinatário |
| `subject` | VARCHAR(255) | Assunto do e-mail |
| `body_text` | MEDIUMTEXT | Corpo do e-mail em texto puro |
| `body_html` | MEDIUMTEXT | Corpo do e-mail em HTML |
| `sent_at` | DATETIME | Data/hora do envio |
| `last_error` | TEXT | Mensagem de erro (se houver falha) |
| `retries` | INT | Número de tentativas de envio |
| `created_at` | TIMESTAMP | Data de criação do registro |

---

### 5. Tabela `invitations`

Controla os convites enviados a novos usuários para participarem de grupos.

| Campo | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT (PK) | Identificador do convite |
| `group_id` | INT (FK) | Grupo relacionado ao convite |
| `email` | VARCHAR(255) | E-mail do convidado |
| `role` | VARCHAR(50) | Função oferecida no grupo |
| `token_hash` | VARBINARY(32) | Token criptografado para aceite |
| `status` | ENUM('pending','accepted','revoked','expired') | Situação atual do convite |
| `invited_by_user_id` | INT | ID do usuário que fez o convite |
| `expires_at` | DATETIME | Data de expiração do convite |
| `accepted_at` | DATETIME | Data de aceite |
| `revoked_at` | DATETIME | Data de revogação |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última atualização |

🔗 **Relacionamentos:**
- `group_id` → chave estrangeira que referencia `groups.id`.

---

## 🔑 Relacionamentos Principais

```mermaid
erDiagram
    GROUPS ||--o{ USERS : possui
    GROUPS ||--o{ DONATIONS : recebe
    GROUPS ||--o{ INVITATIONS : gera
    USERS ||--o{ DONATIONS : realiza
