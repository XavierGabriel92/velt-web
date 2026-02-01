# Deploy - Velt Web

## Variáveis de Ambiente (Produção)

No Vercel (ou outro host), configure:

```
NEXT_PUBLIC_API_URL=https://api.veltcorp.com.br
```

**Importante:** A URL **não** deve incluir `/api` no final. Os endpoints já incluem o prefixo `/api` no path (ex: `/api/auth/login`, `/api/approvals/pending`).

## Build

```bash
npm run build
```

## Deploy no Vercel

1. Conecte o repositório ao Vercel
2. Configure **NEXT_PUBLIC_API_URL** em Settings → Environment Variables
3. Deploy automático a cada push na branch principal
