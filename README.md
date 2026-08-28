# Site Atividades - Loja de Materiais Pedagógicos Digitais

Aplicação web completa para venda de apostilas, atividades e materiais pedagógicos digitais em PDF para docentes do Ensino Fundamental.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Autenticação segura com cookie HTTP-only assinado
- API via Route Handlers
- Storage privado com URL temporária de download
- Camada de abstração para PIX (`PaymentService`) com webhooks

## Funcionalidades implementadas

### Público

- Homepage com hero, CTA, categorias por ano/disciplina, destaque e seção "Como funciona"
- Catálogo com filtros (ano, disciplina, tipo, preço) e busca
- Páginas de categorias e categoria por slug
- Página de produto por slug
- Carrinho
- Checkout
- Login
- Cadastro
- Recuperação de senha
- Confirmação de compra
- Termos de uso
- Política de privacidade
- Contato

### Fluxo de compra e pagamento

- Criação de pedido no backend com validação de preço no banco
- Aplicação de cupom no backend
- Criação de cobrança PIX via `PaymentService`
- Consulta de status do pagamento
- Webhook com validação de assinatura
- Estados de pedido: `PENDING`, `PAID`, `CANCELLED`, `EXPIRED`
- Ao confirmar pagamento:
  - atualiza pedido para `PAID`
  - registra data de pagamento
  - dispara confirmação por e-mail (via API configurável)

### Área do cliente

- "Minha conta"
- Meus pedidos
- Meus materiais
- Dados pessoais

### Download protegido

- Endpoint: `GET /api/download/[productId]`
- Valida autenticação
- Valida compra paga e posse do produto
- Gera URL temporária para download
- Registra auditoria de download (`Download`)

### Administração

- Dashboard administrativo protegido
- Métricas de faturamento/vendas/pedidos
- Produtos mais vendidos
- Últimos pedidos
- Visualização de clientes
- APIs de gerenciamento para produtos, pedidos, usuários e cupons

## Estrutura principal

- `src/app` — páginas e route handlers
- `src/components` — componentes de layout e catálogo
- `src/lib` — auth, prisma, rate-limit, utilitários
- `src/services/payment` — abstração e integração PIX
- `src/services/storage` — storage privado e token temporário
- `prisma/schema.prisma` — schema e relações
- `prisma/seed.ts` — seed inicial (admin/categorias/cupom)

## Variáveis de ambiente

Use `.env.example` como base:

- `DATABASE_URL`
- `AUTH_SECRET`
- `PAYMENT_API_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `PAYMENT_API_BASE_URL`
- `STORAGE_*`
- `NEXT_PUBLIC_APP_URL`
- `EMAIL_API_URL`
- `EMAIL_API_KEY`

## Como executar

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar PostgreSQL

Crie um banco e ajuste `DATABASE_URL` no `.env`.

### 3) Executar migrations

```bash
npx prisma migrate dev --name init
npm run prisma:generate
```

### 4) Configurar storage

- Desenvolvimento: coloque os PDFs em `private/pdfs` (ou ajuste `STORAGE_LOCAL_DIR`)
- Produção: implemente provider privado (S3/GCS) mantendo a interface `StorageService`

### 5) Configurar gateway PIX

- Defina `PAYMENT_API_BASE_URL` para o endpoint sandbox do seu gateway
- Defina `PAYMENT_API_KEY`
- A integração usa:
  - `POST /charges`
  - `GET /charges/:id`

### 6) Configurar webhook

- Endpoint: `POST /api/payments/webhook`
- Configure o gateway para enviar header `x-signature`
- Defina `PAYMENT_WEBHOOK_SECRET` para validação HMAC SHA-256

### 7) Criar primeiro administrador

Opção seed:

```bash
npm run prisma:seed
```

Usuário seed padrão:
- e-mail: `admin@example.com`
- senha: `Admin@123456`

Troque imediatamente em produção.

### 8) Executar localmente

```bash
npm run dev
```

Abra `http://localhost:3000`.

### 9) Deploy

1. Configure variáveis de ambiente no provedor (Vercel/Railway/Fly/Render).
2. Garanta acesso ao PostgreSQL gerenciado.
3. Execute migrations em produção:
   ```bash
   npm run prisma:deploy
   npm run prisma:generate
   ```
4. Configure webhook público do gateway PIX para `/api/payments/webhook`.
5. Configure storage privado e envio de e-mail.

## Segurança

- Autenticação com cookie HTTP-only assinado
- Autorização por função (admin/customer)
- Rotas administrativas protegidas
- Validação de entrada com Zod
- Cálculo de preço e desconto somente no backend
- Rate limiting em rotas sensíveis
- Webhook validado por assinatura
- Download com token temporário e auditoria
- Sem exposição de credenciais no frontend

## SEO

- Metadata base
- URLs amigáveis por slug
- `sitemap.xml` dinâmico
- `robots.txt`
- Open Graph base
