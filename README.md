# Buenos'Cakes Web

Frontend web da Buenos'Cakes, uma loja de confeitaria construída com Next.js App Router. O projeto entrega uma experiência completa de vitrine, catálogo, detalhes de produto, carrinho lateral, autenticação, checkout por etapas, pagamento e área de perfil do cliente.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Integração com backend](#integração-com-backend)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Padrões do projeto](#padrões-do-projeto)
- [Deploy](#deploy)

## Sobre o projeto

O Buenos'Cakes Web é uma aplicação de e-commerce para uma confeitaria. A interface permite que clientes naveguem por produtos, filtrem o catálogo, personalizem itens com tamanhos e recheios, adicionem produtos ao carrinho, façam login, criem conta, avancem pelo checkout e acompanhem dados pessoais, endereços e pedidos no perfil.

A aplicação é focada no frontend, mas já possui uma camada de integração com backend REST, validação de contratos com Zod e rewrites do Next.js para facilitar o consumo da API durante o desenvolvimento.

## Funcionalidades

- Redirecionamento da rota raiz `/` para `/dashboard`.
- Dashboard com hero, categorias em destaque e produtos mais desejados.
- Página institucional "Sobre Nós" com seções de origem, valores e chamada para o catálogo.
- Catálogo de produtos com grid, filtro lateral, cabeçalho e paginação.
- Página de detalhes do produto com galeria, informações, opções de tamanho/recheio e painel de compra.
- Carrinho lateral controlado pelo parâmetro de URL `cart=true`.
- Controle de quantidade, remoção de itens, subtotal, frete e total do carrinho.
- Autenticação com tela de login e cadastro.
- Persistência de sessão no navegador com cookie e localStorage.
- Middleware para proteger rotas privadas e redirecionar usuários autenticados/visitantes.
- Checkout em etapas:
  - dados pessoais;
  - agendamento e local de retirada;
  - escolha de pagamento;
  - revisão e confirmação do pedido.
- Criação de pedido, itens do pedido e pagamento via API.
- Perfil do cliente com dados pessoais, endereços e pedidos recentes.
- Edição/criação/remoção/default de endereços pela camada de API.
- Validação de formulários com React Hook Form e Zod.
- Testes unitários/de componentes com Vitest e Testing Library.
- Testes end-to-end com Cypress.
- CI no GitHub Actions para execução dos testes unitários.

## Stack

- [Next.js 16](https://nextjs.org/) com App Router.
- [React 19](https://react.dev/).
- [TypeScript](https://www.typescriptlang.org/).
- [Tailwind CSS 4](https://tailwindcss.com/).
- [Radix UI](https://www.radix-ui.com/) e componentes no estilo shadcn/ui.
- [Lucide React](https://lucide.dev/) para ícones.
- [TanStack React Query](https://tanstack.com/query) para cache e hidratação de dados.
- [nuqs](https://nuqs.47ng.com/) para estado sincronizado com query string.
- [Axios](https://axios-http.com/) para requisições HTTP.
- [Zod](https://zod.dev/) para validação de entradas e respostas da API.
- [React Hook Form](https://react-hook-form.com/) para formulários.
- [Day.js](https://day.js.org/) para formatação de datas.
- [Motion](https://motion.dev/) para animações.
- [Biome](https://biomejs.dev/) para lint e formatação.
- [Vitest](https://vitest.dev/) para testes unitários.
- [Cypress](https://www.cypress.io/) para testes end-to-end.
- [pnpm](https://pnpm.io/) como gerenciador de pacotes.

## Arquitetura

O projeto usa o App Router do Next.js com grupos de rotas para separar experiências públicas, autenticação e área privada:

- `src/app/(public)/(storefront)`: páginas públicas da loja, como dashboard, produtos e sobre.
- `src/app/(public)/(auth)`: páginas de login e cadastro.
- `src/app/(private)/(account)`: páginas protegidas, como checkout e perfil.
- `src/components/application`: componentes compartilhados da aplicação, como navbar, footer e carrinho.
- `src/components/ui`: componentes base de interface.
- `src/api/backend`: cliente HTTP, schemas e rotas para o backend REST.
- `src/api/products`: camada de view model para produtos usados pelo storefront.
- `src/contexts`: contextos globais, incluindo o carrinho lateral.
- `src/lib`: utilitários de autenticação, navegação, formatação e query client.

A aplicação combina Server Components e Client Components. Páginas como dashboard, catálogo e perfil fazem pré-carregamento de dados no servidor quando necessário, enquanto fluxos interativos como carrinho, formulários e checkout rodam no cliente.

## Rotas da aplicação

| Rota | Tipo | Descrição |
| --- | --- | --- |
| `/` | Pública | Redireciona para `/dashboard`. |
| `/dashboard` | Pública | Página inicial da loja com hero, categorias e produtos populares. |
| `/products` | Pública | Catálogo de produtos com filtros e paginação. |
| `/products/[id]` | Pública | Detalhes de um produto, opções de compra e adição ao carrinho. |
| `/about` | Pública | Página institucional da Buenos'Cakes. |
| `/sign-in` | Autenticação | Login do cliente. |
| `/sign-up` | Autenticação | Cadastro de cliente. |
| `/checkout` | Privada | Dados pessoais e agendamento de retirada. |
| `/checkout/payment` | Privada | Seleção da forma de pagamento. |
| `/checkout/review` | Privada | Revisão e confirmação do pedido. |
| `/profile` | Privada | Perfil do cliente, endereços e pedidos. |

## Integração com backend

O frontend espera um backend REST disponível por padrão em:

```bash
http://localhost:3333
```

No navegador, as chamadas usam o rewrite do Next.js:

```bash
/backend-api/* -> http://localhost:3333/
```

Esse comportamento está configurado em `next.config.ts`.

### Variáveis de ambiente

Crie um arquivo `.env.local` se precisar sobrescrever os valores padrão:

```bash
BACKEND_API_BASE_URL=http://localhost:3333
NEXT_PUBLIC_API_BASE_URL=/backend-api
NEXT_PUBLIC_E2E_STABLE_IMAGES=0
NEXT_DIST_DIR=.next
```

| Variável | Uso | Padrão |
| --- | --- | --- |
| `BACKEND_API_BASE_URL` | URL usada pelo rewrite `/backend-api` no Next.js. | `http://localhost:3333` |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL usada pelo Axios no cliente. | `/backend-api` no browser e `http://localhost:3333` no servidor |
| `NEXT_PUBLIC_E2E_STABLE_IMAGES` | Usa imagem estável nos testes E2E quando `1`. | Não definido |
| `NEXT_DIST_DIR` | Altera o diretório de build do Next.js. | `.next` |

### Endpoints consumidos

Autenticação e usuário:

- `POST /api/users/login`
- `POST /api/users/create`
- `GET /api/users/me`
- `PATCH /api/users/:userId`

Catálogo:

- `GET /api/categories/active`
- `GET /api/products`
- `GET /api/products/active`
- `GET /api/products/popularity`
- `GET /api/products/:productId`
- `GET /api/products/:productId/sizes/active`
- `GET /api/products/:productId/fillings/active`

Endereços:

- `GET /api/users/:userId/addresses`
- `POST /api/addresses/create`
- `PATCH /api/addresses/:addressId`
- `POST /api/addresses/delete/:addressId`
- `POST /api/addresses/:addressId/default`

Pedidos e pagamento:

- `GET /api/users/:userId/orders`
- `GET /api/orders/:orderId`
- `GET /api/orders/:orderId/items`
- `POST /api/orders/create`
- `POST /api/order-items/create`
- `POST /api/payments/checkout`

As respostas da API são validadas com schemas Zod em `src/api/backend/schemas`.

## Como rodar localmente

### Pré-requisitos

- Node.js 20 ou superior.
- pnpm 10 ou superior.
- Backend da Buenos'Cakes rodando em `http://localhost:3333` ou URL equivalente configurada nas variáveis de ambiente.

### Instalação

```bash
pnpm install
```

### Ambiente de desenvolvimento

```bash
pnpm dev
```

Acesse:

```bash
http://localhost:3000
```

O script `pnpm dev` reutiliza uma aplicação já ativa em `localhost:3000` quando encontra uma instância respondendo.

### Build de produção

```bash
pnpm build
pnpm start
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o app em `localhost:3000`, reutilizando uma instância existente se houver. |
| `pnpm dev:web` | Inicia diretamente o Next.js em `localhost:3000`. |
| `pnpm dev:e2e` | Inicia o app para E2E em `localhost:3101`. |
| `pnpm dev:web:e2e` | Inicia diretamente o Next.js para E2E em `localhost:3101`. |
| `pnpm build` | Gera build de produção. |
| `pnpm start` | Inicia o servidor de produção do Next.js. |
| `pnpm lint` | Executa `biome check`. |
| `pnpm format` | Formata o código com Biome. |
| `pnpm test:unit` | Executa testes unitários com Vitest. |
| `pnpm test:unit:watch` | Executa Vitest em modo watch. |
| `pnpm test:e2e` | Executa Cypress em modo headless. |
| `pnpm test:e2e:open` | Abre a interface do Cypress. |
| `pnpm test:e2e:dev` | Sobe o servidor E2E e roda Cypress. |
| `pnpm test:e2e:dev:open` | Sobe o servidor E2E e abre Cypress. |

## Testes

### Unitários e componentes

Os testes ficam junto aos módulos em arquivos `*.spec.ts` e `*.spec.tsx`, principalmente dentro de `src`.

```bash
pnpm test:unit
```

A configuração do Vitest usa:

- ambiente `jsdom`;
- setup em `src/test/setup.tsx`;
- alias `@` apontando para `src`;
- mock de `server-only` para testes.

### End-to-end

Os testes E2E ficam em `cypress/e2e`.

```bash
pnpm test:e2e:dev
```

O Cypress usa:

- base URL `http://localhost:3101`;
- backend esperado em `http://localhost:3333`;
- usuário E2E configurado em `cypress.config.ts`.

Principais fluxos cobertos:

- autenticação;
- navegação;
- dashboard e carrosséis;
- catálogo de produtos;
- detalhes e customização de produto;
- carrinho;
- checkout;
- perfil.

### CI

O workflow `.github/workflows/ci.yml` executa os testes unitários com pnpm no Node.js 20 em pushes e pull requests.

## Estrutura de pastas

```text
.
├── .github/workflows          # Workflows de CI
├── cypress                    # Testes end-to-end e suporte do Cypress
├── src
│   ├── api
│   │   ├── backend            # Cliente REST, rotas e schemas Zod
│   │   └── products           # View models de produtos para o storefront
│   ├── app                    # Rotas do Next.js App Router
│   ├── components
│   │   ├── application        # Componentes globais da aplicação
│   │   └── ui                 # Componentes base de UI
│   ├── contexts               # Contextos React globais
│   ├── lib                    # Helpers e configurações compartilhadas
│   ├── test                   # Setup e utilitários de teste
│   └── types                  # Tipagens auxiliares
├── biome.json                 # Lint e formatação
├── cypress.config.ts          # Configuração do Cypress
├── next.config.ts             # Configuração do Next.js
├── package.json               # Scripts e dependências
├── tsconfig.json              # Configuração TypeScript
└── vitest.config.ts           # Configuração do Vitest
```

## Padrões do projeto

- Componentes e páginas escritos em TypeScript.
- Alias `@` para importações a partir de `src`.
- Formatação com tabs, linha de até 80 caracteres e organização de imports pelo Biome.
- Schemas Zod para validar dados recebidos do backend.
- Componentes de formulário com React Hook Form e `zodResolver`.
- Estado de carrinho centralizado em `CartSheetProvider`.
- Estado de abertura do carrinho sincronizado com a URL via `nuqs`.
- Rotas privadas protegidas por middleware baseado no cookie `buenos-cakes-session`.
- Sessão do cliente persistida também no `localStorage` com:
  - `buenos-cakes:access-token`;
  - `buenos-cakes:user`.

## Deploy

Por ser um projeto Next.js, o deploy pode ser feito em plataformas como Vercel, desde que as variáveis de ambiente apontem para o backend correto.

Antes de publicar, recomenda-se rodar:

```bash
pnpm lint
pnpm test:unit
pnpm build
```

Se o ambiente de produção usar domínio separado para o backend, configure `BACKEND_API_BASE_URL` e/ou `NEXT_PUBLIC_API_BASE_URL` conforme a estratégia de proxy escolhida.
