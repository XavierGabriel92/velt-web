# Arquitetura do Velt Web

Este documento descreve a arquitetura e padrões de desenvolvimento do projeto Velt Web, servindo como guia para criação de novas features seguindo os mesmos padrões estabelecidos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões de Componentes](#padrões-de-componentes)
- [Gerenciamento de Estado e API](#gerenciamento-de-estado-e-api)
- [Autenticação](#autenticação)
- [Criando uma Nova Feature](#criando-uma-nova-feature)
- [Exemplo Prático: Feature de Login](#exemplo-prático-feature-de-login)
- [Boas Práticas](#boas-práticas)

---

## Visão Geral

O Velt Web é uma aplicação Next.js dividida em duas áreas principais:

1. **Área Deslogada (Auth)**: Páginas públicas que não requerem autenticação
   - Login (`/login`)
   - Reset de senha (`/reset-password`)

2. **Área Logada (Início)**: Páginas protegidas que requerem autenticação
   - Dashboard (`/inicio`)
   - Outras features autenticadas

A arquitetura segue o princípio de **separação de responsabilidades** e **reutilização de componentes**, garantindo consistência visual e comportamental em toda a aplicação.

---

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Estilização**: Tailwind CSS 4
- **Componentes UI**: shadcn/ui (baseado em Radix UI)
- **Formulários**: React Hook Form + Zod
- **Gerenciamento de Estado**: TanStack Query (React Query)
- **Notificações**: Sonner (toast notifications)
- **Ícones**: Lucide React
- **TypeScript**: Para type safety

---

## Estrutura de Pastas

```
velt-web/
├── app/                    # Rotas do Next.js (App Router)
│   ├── (auth)/            # Grupo de rotas deslogadas
│   │   ├── login/
│   │   └── reset-password/
│   ├── inicio/            # Rotas autenticadas
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
│
├── components/             # Componentes reutilizáveis
│   ├── ui/                # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── shared/            # Componentes compartilhados gerais
│       └── logo.tsx
│
├── domain/                # Features organizadas por domínio
│   ├── auth/
│   │   ├── components/    # Componentes específicos do domínio
│   │   │   └── login-form.tsx
│   │   │   └── auth-guard.tsx
│   │   └── api/          # Chamadas de API do domínio
│   │       ├── use-login.ts
│   │       └── types.ts
│   ├── travels/           # Exemplo de outro domínio
│   └── expenses/          # Exemplo de outro domínio
│
└── lib/                   # Utilitários e configurações
    ├── api.ts             # Cliente HTTP configurado
    ├── auth.ts            # Funções de autenticação
    ├── query-client.tsx   # Configuração do TanStack Query
    └── utils.ts           # Funções utilitárias
```

### Responsabilidades das Pastas

#### `app/`
- Contém as rotas do Next.js usando App Router
- Páginas são **thin components** que apenas compõem componentes do `domain/`
- Não deve conter lógica de negócio, apenas layout e composição

#### `components/ui/`
- **Componentes base** do shadcn/ui
- Componentes primitivos e reutilizáveis (Button, Input, Card, etc.)
- Contêm toda a estilização e comportamento base
- **NUNCA** devem ser criados dentro de `domain/`

#### `components/shared/`
- Componentes compartilhados entre múltiplos domínios
- Se um componente é usado por mais de um domínio, deve estar aqui

#### `domain/`
- Organização por **domínio de negócio** (auth, travels, expenses, etc.)
- Cada domínio contém:
  - `components/`: Componentes específicos do domínio
  - `api/`: Hooks e funções de API relacionadas ao domínio
  - `types.ts`: Tipos TypeScript específicos do domínio

#### `lib/`
- Configurações globais e utilitários
- Cliente HTTP (`api.ts`)
- Configuração do TanStack Query (`query-client.tsx`)
- Funções de autenticação (`auth.ts`)

---

## Padrões de Componentes

### Regra Fundamental

> **NUNCA criar componentes base dentro de `domain/`. Sempre criar em `components/ui/` ou `components/shared/`.**

### Hierarquia de Componentes

```
components/ui/ (Base)
    ↓
components/shared/ ou components/auth/ (Compartilhados)
    ↓
domain/[feature]/components/ (Específicos do domínio)
    ↓
app/[route]/page.tsx (Páginas)
```

### Componentes Base (`components/ui/`)

- Sempre optar por usar um componente pronto do Shadcn antes de criar um novo
- São componentes primitivos e reutilizáveis
- Contêm toda a estilização usando Tailwind CSS
- Usam `class-variance-authority` (CVA) para variantes
- Exemplos: `Button`, `Input`, `Card`, `Label`, `Checkbox`

**Características:**
- Estilização completa e consistente
- Suporte a variantes (size, variant, etc.)
- Acessibilidade (ARIA attributes)
- Dark mode support

**Exemplo:**
```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { default: "...", sm: "...", lg: "..." }
    }
  }
)
```

### Componentes de Domínio (`domain/[feature]/components/`)

- Componentes específicos de um domínio de negócio
- **NÃO** criam estilos do zero, apenas compõem componentes base
- Podem adicionar classes Tailwind básicas quando necessário
- Contêm lógica de negócio específica do domínio

**Exemplo:**
```tsx
// domain/auth/components/login-form.tsx
export function LoginForm() {
  // Usa componentes base
  return (
    <Card>
      <CardContent>
        <form>
          <Label>Email</Label>
          <Input {...register("email")} />
          <Button type="submit">Entrar</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Quando Criar um Componente Base?

Crie um componente base (`components/ui/`) quando:
- O componente será usado em múltiplos domínios
- É um componente primitivo (Button, Input, Modal, etc.)
- Precisa de variantes e estilização consistente

Crie um componente de domínio (`domain/[feature]/components/`) quando:
- O componente é específico de um domínio
- Compõe componentes base para criar uma feature específica
- Contém lógica de negócio do domínio

### Critérios para `components/ui/` vs `components/shared/`

Uma distinção importante é saber quando criar um componente em `components/ui/` (componentes primitivos base) versus `components/shared/` (componentes que compõem componentes base e são compartilhados).

#### Use `components/ui/` quando:

- É um componente **primitivo base** (Button, Card, Input, Label, Checkbox, etc.)
- Vem do **shadcn/ui** ou é um componente atômico
- **NÃO compõe** outros componentes da UI
- Precisa de **variantes e estilização base completa**
- É um **building block fundamental** da interface
- Contém toda a estilização e comportamento primitivo

**Exemplos:**
- `Button` - componente primitivo com variantes (default, outline, ghost, etc.)
- `Card` - componente primitivo com sub-componentes (CardHeader, CardContent, etc.)
- `Input` - componente primitivo de entrada de dados
- `Label` - componente primitivo de rótulo

#### Use `components/shared/` quando:

- O componente **compõe componentes base da UI** (usa Card, Button, etc.)
- É **compartilhado entre múltiplos domínios**
- Tem **lógica de composição** mas não é específico de um domínio
- Reutiliza componentes de `components/ui/` para criar padrões comuns
- Não contém lógica de negócio específica de um domínio

**Exemplos:**
- `MetricCard` - compõe `Card` da UI para criar um padrão de card de métricas
- `QuickActionButton` - compõe `Card` + `Button` da UI para criar botões de ação rápida
- `ListWithButton` - compõe `Card` + `Button` da UI para criar listas com CTA
- `DashboardHeader` - compõe múltiplos componentes base para criar o header do dashboard

#### Use `domain/[domain]/components/` quando:

- O componente é **específico de um domínio de negócio**
- Contém **lógica de negócio do domínio**
- **NÃO é compartilhado** entre domínios diferentes
- Usa componentes de `components/ui/` ou `components/shared/` para criar features específicas

**Exemplos:**
- `FlightsMetricCard` - card específico de métricas de voos (usa `MetricCard` de shared)
- `UpcomingTravelsList` - lista específica de viagens (usa `ListWithButton` de shared)
- `LoginForm` - formulário específico de login (usa componentes base da UI)

#### Fluxo de Decisão

```
Precisa criar um novo componente?
│
├─ É um componente primitivo base (Button, Input, Card)?
│  └─ Sim → `components/ui/`
│
├─ Compõe componentes base e é compartilhado entre domínios?
│  └─ Sim → `components/shared/`
│
└─ É específico de um domínio de negócio?
   └─ Sim → `domain/[domain]/components/`
```

#### Exemplos Práticos do Projeto

**`components/ui/button.tsx`**
- Componente primitivo base
- Vem do shadcn/ui
- Não compõe outros componentes
- Tem variantes (default, outline, ghost, etc.)

**`components/shared/metric-card.tsx`**
- Compõe `Card` de `components/ui/`
- Compartilhado entre domínios (travels, expenses, analytics, rewards)
- Não contém lógica de negócio específica
- Apenas composição e padrão visual

**`domain/travels/components/flights-metric-card.tsx`**
- Específico do domínio travels
- Usa `MetricCard` de `components/shared/`
- Contém lógica de negócio (busca métricas de voos)
- Não é compartilhado com outros domínios

---

## Gerenciamento de Estado e API

### TanStack Query

O projeto usa **TanStack Query** para gerenciar estado de servidor, cache e sincronização.

**Configuração:**
- Provider configurado em `app/layout.tsx`
- Cliente singleton para evitar múltiplas instâncias
- Configurado em `lib/query-client.tsx`

### Suspense para Loading States

O projeto usa **Suspense** do React junto com **TanStack Query** para gerenciar estados de loading de forma declarativa e granular.

**Diretrizes:**

1. **Use `useSuspenseQuery` ao invés de `useQuery`** quando o componente será envolvido em um Suspense boundary:
   ```tsx
   // ✅ CORRETO - Com Suspense
   import { useSuspenseQuery } from "@tanstack/react-query"
   
   export function useFlightsMetrics() {
     return useSuspenseQuery({
       queryKey: ["flights-metrics"],
       queryFn: getFlightsMetrics,
     })
   }
   ```

2. **NÃO verifique `isLoading` manualmente** - o Suspense cuida disso:
   ```tsx
   // ❌ ERRADO - Verificação manual de isLoading
   const { data, isLoading } = useQuery(...)
   if (isLoading) return <Loading />
   
   // ✅ CORRETO - Suspense cuida do loading
   const { data } = useSuspenseQuery(...)
   // data sempre está disponível aqui
   ```

3. **Envolva componentes que fazem fetch em Suspense boundaries** na página:
   ```tsx
   import { Suspense } from "react"
   import { MetricCardSkeleton } from "@/components/shared/metric-card-skeleton"
   
   <Suspense fallback={<MetricCardSkeleton title="..." icon={Icon} />}>
     <FlightsMetricCard />
   </Suspense>
   ```

4. **Use componentes skeleton como fallback** - crie skeletons específicos para cada tipo de componente:
   - `MetricCardSkeleton` - para cards de métricas
   - `ListSkeleton` - para listas
   - `QuickActionSkeleton` - para ações rápidas
   - Use o componente `Loading` (`components/ui/loading.tsx`) dentro dos skeletons quando apropriado

5. **Benefícios:**
   - Código mais limpo (sem verificações de `isLoading`)
   - Loading granular por seção
   - Melhor UX com carregamento progressivo
   - Alinhado com padrões do Next.js App Router

**Exemplo Completo:**

```tsx
// domain/travels/api/use-flights-metrics.ts
import { useSuspenseQuery } from "@tanstack/react-query"

export function useFlightsMetrics() {
  return useSuspenseQuery({
    queryKey: ["flights-metrics"],
    queryFn: getFlightsMetrics,
  })
}

// domain/travels/components/flights-metric-card.tsx
export function FlightsMetricCard() {
  const { data } = useFlightsMetrics() // Sem verificação de isLoading
  
  return (
    <MetricCard
      title="Voos este mês"
      value={data.currentMonth.toString()}
      // ...
    />
  )
}

// app/inicio/page.tsx
import { Suspense } from "react"
import { MetricCardSkeleton } from "@/components/shared/metric-card-skeleton"

<Suspense fallback={<MetricCardSkeleton title="Voos este mês" icon={Plane} />}>
  <FlightsMetricCard />
</Suspense>
```

### Cliente HTTP (`lib/api.ts`)

O projeto possui duas funções principais para chamadas de API:

#### `apiRequest<T>(endpoint, options)`
- Para requisições **autenticadas**
- Adiciona automaticamente o token Bearer no header
- Redireciona para `/login` em caso de 401

#### `apiRequestWithoutAuth<T>(endpoint, options)`
- Para requisições **públicas** (login, reset password, etc.)
- Não adiciona token de autenticação

**Exemplo de uso:**
```tsx
// domain/auth/api/use-login.ts
async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return apiRequestWithoutAuth<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}
```

### Criando Hooks de API

Siga este padrão para criar hooks de API:

```tsx
// domain/[feature]/api/use-[action].ts
"use client"

import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { RequestType, ResponseType } from "./types"

async function performAction(data: RequestType): Promise<ResponseType> {
  return apiRequest<ResponseType>("/endpoint", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function useAction() {
  return useMutation({
    mutationFn: performAction,
    // Opcional: onSuccess, onError, etc.
  })
}
```

**Para queries (GET):**
```tsx
import { useQuery } from "@tanstack/react-query"

export function useGetData(id: string) {
  return useQuery({
    queryKey: ["data", id],
    queryFn: () => apiRequest<DataType>(`/endpoint/${id}`),
  })
}
```

---

## Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário faz login usando `useLogin()` hook
2. **Token Storage**: Token salvo em `localStorage` como `auth_token`
3. **User Data**: Dados do usuário salvos em `localStorage` como `auth_user`
4. **Auth Guard**: Componente `AuthGuard` protege rotas autenticadas

### Funções de Autenticação (`lib/auth.ts`)

- `isAuthenticated()`: Verifica se há token e dados do usuário
- `getAuthUser()`: Retorna dados do usuário autenticado
- `clearAuth()`: Remove token, dados do usuário e limpa cache do TanStack Query

### Protegendo Rotas

Use o `AuthGuard` no layout das rotas autenticadas:

```tsx
// app/inicio/layout.tsx
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}
```

---

## Criando uma Nova Feature

### Passo a Passo

#### 1. Criar Estrutura de Pastas

```bash
domain/[feature-name]/
├── components/
│   └── [feature]-form.tsx
├── api/
│   ├── use-[action].ts
│   └── types.ts
```

#### 2. Definir Types (`domain/[feature]/api/types.ts`)

```tsx
export interface CreateRequest {
  name: string
  // outros campos
}

export interface CreateResponse {
  id: string
  // outros campos
}
```

#### 3. Criar Hook de API (`domain/[feature]/api/use-[action].ts`)

```tsx
"use client"

import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { CreateRequest, CreateResponse } from "./types"

async function create(data: CreateRequest): Promise<CreateResponse> {
  return apiRequest<CreateResponse>("/endpoint", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function useCreate() {
  return useMutation({
    mutationFn: create,
  })
}
```

#### 4. Criar Componente (`domain/[feature]/components/[feature]-form.tsx`)

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useCreate } from "../api/use-create"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

type FormData = z.infer<typeof formSchema>

export function FeatureForm() {
  const createMutation = useCreate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success("Criado com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
          <Button type="submit">Criar</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### 5. Criar Página (`app/[route]/page.tsx`)

```tsx
import { FeatureForm } from "@/domain/[feature]/components/[feature]-form"

export default function FeaturePage() {
  return (
    <div className="container mx-auto p-4">
      <h1>Nova Feature</h1>
      <FeatureForm />
    </div>
  )
}
```

---

## Exemplo Prático: Feature de Login

Vamos analisar como a feature de login foi implementada seguindo todos os padrões:

### 1. Estrutura de Pastas

```
domain/auth/
├── components/
│   └── login-form.tsx
└── api/
    ├── use-login.ts
    └── types.ts
```

### 2. Types (`domain/auth/api/types.ts`)

```tsx
export interface LoginRequest {
  documentNumber: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: string
  email: string
  firstName: string
  lastName: string
  globalRoles: string[]
  companies: UserCompanyDto[]
}
```

### 3. Hook de API (`domain/auth/api/use-login.ts`)

```tsx
"use client"

import { useMutation } from "@tanstack/react-query"
import { setToken, apiRequestWithoutAuth } from "@/lib/api"
import { LoginRequest, AuthResponse } from "./types"

async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return apiRequestWithoutAuth<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const data = await login(credentials)
      
      // Salvar token e dados do usuário
      setToken(data.token)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(data))
      }
      
      return data
    },
  })
}
```

**Pontos importantes:**
- Usa `apiRequestWithoutAuth` porque login não requer autenticação
- Salva token e dados do usuário após login bem-sucedido
- Retorna os dados para uso no componente

### 4. Componente (`domain/auth/components/login-form.tsx`)

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useLogin } from "../api/use-login"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  cpf: z.string().min(1, "CPF é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const loginMutation = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync({
        documentNumber: data.cpf,
        password: data.password,
      })

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo, ${response.firstName}!`,
      })

      setTimeout(() => {
        router.push("/inicio")
      }, 500)
    } catch (error) {
      toast.error("Erro ao fazer login", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("cpf")} />
          {errors.cpf && <p>{errors.cpf.message}</p>}
          
          <Input type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
          
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Pontos importantes:**
- Usa `react-hook-form` com `zod` para validação
- Compõe apenas componentes base (`Card`, `Input`, `Button`)
- Usa o hook `useLogin()` para fazer a requisição
- Mostra feedback com `toast` (Sonner)
- Redireciona após sucesso

### 5. Página (`app/(auth)/login/page.tsx`)

```tsx
import { Logo } from "@/components/shared/logo"
import { LoginForm } from "@/domain/auth/components/login-form"

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        <div className="hidden md:flex flex-col gap-6 text-white">
          <Logo />
          <p>Descrição da aplicação...</p>
        </div>
        
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
```

**Pontos importantes:**
- Página é **thin**, apenas compõe componentes
- Layout específico da página (não no componente)
- Usa componente compartilhado `Logo`

---

## Boas Práticas

### ✅ Faça

1. **Sempre use componentes base** de `components/ui/` ao invés de criar estilos do zero
2. **Organize por domínio** em `domain/` ao invés de por tipo de arquivo
3. **Use TypeScript** para type safety em todos os arquivos
4. **Valide formulários** com Zod + React Hook Form
5. **Use TanStack Query** para todas as chamadas de API
6. **Mostre feedback** ao usuário com toasts (Sonner)
7. **Mantenha páginas thin** - lógica deve estar nos componentes de domínio
8. **Documente tipos** em arquivos `types.ts` dentro de cada domínio

### ❌ Evite

1. **NÃO crie componentes base** dentro de `domain/`
2. **NÃO crie estilos inline** ou classes Tailwind complexas nos componentes de domínio
3. **NÃO faça chamadas de API** diretamente com `fetch` - use `apiRequest` ou `apiRequestWithoutAuth`
4. **NÃO coloque lógica de negócio** nas páginas (`app/`)
5. **NÃO duplique código** - se algo é usado em múltiplos lugares, mova para `components/shared/`
6. **NÃO ignore erros** - sempre trate erros e mostre feedback ao usuário

### 🎨 Estilização

- **Use componentes base** para estilização consistente
- **Adicione classes Tailwind básicas** apenas quando necessário (spacing, layout)
- **Use variantes** dos componentes base ao invés de sobrescrever estilos
- **Mantenha consistência** - se algo precisa ser estilizado de forma diferente, considere criar uma variante no componente base

### 🔒 Segurança

- **Sempre valide dados** no frontend (Zod) e confie no backend para validação final
- **Use `apiRequest`** para rotas autenticadas (adiciona token automaticamente)
- **Use `apiRequestWithoutAuth`** apenas para rotas públicas
- **Proteja rotas** com `AuthGuard` no layout

---

## Resumo Rápido

1. **Páginas** (`app/`) = Layout + Composição de componentes
2. **Componentes Base** (`components/ui/`) = Estilização e comportamento primitivo
3. **Componentes de Domínio** (`domain/[feature]/components/`) = Lógica de negócio + Composição
4. **API** (`domain/[feature]/api/`) = Hooks do TanStack Query + Types
5. **Lib** (`lib/`) = Configurações globais e utilitários

**Regra de Ouro**: Se você está criando estilos do zero ou um componente que será usado em múltiplos domínios, ele deve estar em `components/ui/` ou `components/shared/`, nunca em `domain/`.

---

## Conclusão

Esta arquitetura garante:
- ✅ **Consistência** visual e comportamental
- ✅ **Reutilização** de componentes
- ✅ **Manutenibilidade** através de organização clara
- ✅ **Escalabilidade** para adicionar novas features
- ✅ **Type Safety** com TypeScript
- ✅ **Developer Experience** com padrões claros

Siga estes padrões ao criar novas features e o código permanecerá organizado e fácil de manter! 🚀

