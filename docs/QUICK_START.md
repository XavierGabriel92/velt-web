# 🚀 Guia Rápido - Criando uma Nova Feature

Este é um guia rápido para criar uma nova feature seguindo os padrões do projeto. Para documentação completa, veja [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📁 Estrutura Mínima

```
domain/[feature-name]/
├── components/
│   └── [feature]-form.tsx
├── api/
│   ├── use-[action].ts
│   └── types.ts
```

## 🔄 Checklist Rápido

### 1. Criar Types
```tsx
// domain/[feature]/api/types.ts
export interface CreateRequest {
  name: string
}

export interface CreateResponse {
  id: string
}
```

### 2. Criar Hook de API
```tsx
// domain/[feature]/api/use-create.ts
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
  return useMutation({ mutationFn: create })
}
```

### 3. Criar Componente
```tsx
// domain/[feature]/components/[feature]-form.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useCreate } from "../api/use-create"
import { toast } from "sonner"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

export function FeatureForm() {
  const createMutation = useCreate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success("Sucesso!")
    } catch (error) {
      toast.error("Erro", {
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

### 4. Criar Página
```tsx
// app/[route]/page.tsx
import { FeatureForm } from "@/domain/[feature]/components/[feature]-form"

export default function FeaturePage() {
  return (
    <div className="container mx-auto p-4">
      <FeatureForm />
    </div>
  )
}
```

## ⚠️ Regras Importantes

1. **NUNCA** criar componentes base em `domain/` - sempre em `components/ui/`
2. **SEMPRE** usar componentes base ao invés de criar estilos do zero
3. **SEMPRE** usar `apiRequest` (autenticado) ou `apiRequestWithoutAuth` (público)
4. **SEMPRE** validar formulários com Zod + React Hook Form
5. **SEMPRE** mostrar feedback com `toast` (Sonner)

## 📚 Ver Mais

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentação completa
- Exemplo real: `domain/auth/` - Feature de login implementada

