# SalaPronta — Loja digital de materiais pedagógicos

Aplicação e-commerce com Next.js + TypeScript + Tailwind + Prisma + PostgreSQL para venda de materiais pedagógicos digitais em PDF com pagamento PIX e liberação pós-confirmação.

## Funcionalidades principais

- Catálogo público com filtros e busca
- Página de produto com prévias e CTA de compra
- Checkout com geração de cobrança PIX
- Webhook de pagamento com validação de assinatura
- Estados de pedido: `PENDING`, `PAID`, `CANCELLED`, `EXPIRED`
- Área do cliente: pedidos, materiais e dados pessoais
- Endpoint protegido de download: `GET /api/download/[productId]`
- Painel administrativo protegido por função `ADMIN`
- Persistência com Prisma/PostgreSQL
- Storage privado (S3 compatível) com URL temporária assinada
- SEO base: metadata, sitemap e robots

## Estrutura de pastas

- `app/` páginas e route handlers
- `components/` componentes de interface
- `lib/` utilitários, autenticação, regras de negócio
- `services/payment/` abstração de pagamento (`PaymentService`)
- `services/storage/` abstração de storage privado
- `prisma/` schema do banco
- `scripts/` scripts operacionais (ex.: criar admin)

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores reais.

```bash
cp .env.example .env
```

## 1) Instalar dependências

```bash
npm install
```

## 2) Configurar PostgreSQL

- Crie um banco (ex.: `site_atividades`)
- Defina `DATABASE_URL` no `.env`

## 3) Executar migrations

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

## 4) Configurar storage privado

Configurar no `.env`:

- `STORAGE_ENDPOINT`
- `STORAGE_REGION`
- `STORAGE_BUCKET`
- `STORAGE_ACCESS_KEY_ID`
- `STORAGE_SECRET_ACCESS_KEY`
- `STORAGE_FORCE_PATH_STYLE`

Recomendado em desenvolvimento: MinIO com bucket privado.

## 5) Configurar gateway PIX

Configurar no `.env`:

- `PAYMENT_API_KEY`
- `PAYMENT_WEBHOOK_SECRET`

A implementação atual usa `SandboxPixProvider` (modo teste) via camada `PaymentService` para facilitar troca futura de gateway.

## 6) Configurar webhook

Endpoint:

- `POST /api/payments/webhook`

Enviar assinatura no header `x-signature` (HMAC SHA-256 do payload usando `PAYMENT_WEBHOOK_SECRET`).

## 7) Criar primeiro administrador

```bash
npm run create-admin -- admin@exemplo.com SenhaSegura123 "Admin"
```

## 8) Executar aplicação localmente

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 9) Deploy

Checklist:

1. Provisionar PostgreSQL gerenciado
2. Configurar bucket privado S3 compatível
3. Configurar variáveis de ambiente de produção
4. Executar migrations em produção (`prisma migrate deploy`)
5. Publicar em plataforma com suporte a Next.js (Vercel, container, etc.)
6. Configurar URL pública de webhook no gateway PIX
7. Validar fluxo completo: Produto → Checkout PIX → Webhook → Download

## Segurança aplicada

- Autenticação com NextAuth (credenciais + hash bcrypt)
- Autorização por função e proteção de rotas (`/admin`, `/minha-conta`)
- Validação de payloads com Zod
- Rate limiting básico em cadastro
- Preço e total calculados no backend
- Download permitido somente para usuário com pedido `PAID`
- Webhook validado por assinatura
- Segredos via variáveis de ambiente

## Observações

- As telas de gestão administrativa estão estruturadas e conectadas ao banco; fluxos completos de CRUD de upload podem ser expandidos sobre a base atual.
- A integração PIX está desacoplada e pronta para implementação de um provedor real sem refatorar o restante da aplicação.
