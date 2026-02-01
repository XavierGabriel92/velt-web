# Aprovações Pendentes

Este documento descreve a feature de Aprovações Pendentes no dashboard, suas regras de negócio e a integração com a API.

## Visão Geral

A lista de Aprovações Pendentes exibe **TravelItems** em dois contextos distintos, conforme o papel do usuário logado:

1. **awaiting_my_approval**: Itens que o usuário **pode aprovar** (é aprovador direto ou por herança vertical).
2. **my_pending_as_traveler**: Itens onde o usuário **é viajante** e está aguardando aprovação.

## Casos de Uso

### Cenário com 4 usuários (User 1, 2, 3, 4) na mesma empresa

- **User 2** é aprovador direto de **User 1**.
- **User 4** é aprovador direto de **User 2**.
- **User 4** é aprovador de **User 1** por herança vertical.
- **User 4** é aprovador de **User 3**.

| Usuário | O que vê | Ícones | Destaque |
|---------|----------|--------|----------|
| **User 1** | Suas aprovações pendentes, nome do aprovador direto (User 2) | Sino (tooltip com todos os aprovadores) | Não |
| **User 2** (próprios itens) | Suas aprovações, aprovador direto (User 4) | Sino | Não |
| **User 2** (itens de User 1) | Nome de User 1, aprovador direto (ele mesmo) | Check / X | Sim (borda/background) |
| **User 3** | Suas aprovações (se houver) | Sino | Não |
| **User 4** | Itens de todos (User 1, 2, 3) | Check / X | Sim nos que ele é aprovador direto |

### Regras

- Itens **já aprovados** não aparecem na lista.
- Quando o usuário é **viajante**: mostra ícone de **sino** e tooltip com todos os aprovadores (direto + herança vertical).
- Quando o usuário é **aprovador**: mostra botões **Check** (aprovar) e **X** (rejeitar).
- Itens onde o usuário é o **aprovador direto** recebem destaque visual (background/borda).

## API

### Endpoint

```
GET /api/approvals/pending
```

### Parâmetros (query)

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| approverId | string | Não | Se omitido, usa o usuário logado |
| companyId | string | Não | Filtra por empresa |
| includeOwnPending | boolean | Não | Default: true. Inclui itens onde o usuário é viajante |
| page | number | Não | Default: 1 |
| pageSize | number | Não | Default: 20 |

### Resposta

```json
{
  "items": [
    {
      "viewContext": "awaiting_my_approval",
      "travelId": "...",
      "travelItemId": "...",
      "travelerId": "...",
      "travelerName": "João Silva",
      "productType": "Aereo",
      "productName": "Passagem GRU-SSA",
      "price": 1500.00,
      "directApproverId": "...",
      "directApproverName": "Maria Costa",
      "isCurrentUserDirectApprover": true,
      "canApprove": true,
      "pendingSince": "2025-01-15T10:00:00Z",
      ...
    },
    {
      "viewContext": "my_pending_as_traveler",
      "travelerName": "Você",
      "directApproverName": "Maria Costa",
      "allApprovers": [
        { "approverId": "...", "approverName": "Maria Costa", "level": 1 },
        { "approverId": "...", "approverName": "Pedro Lima", "level": 2 }
      ],
      "canApprove": false,
      ...
    }
  ],
  "totalCount": 2,
  "page": 1,
  "pageSize": 10
}
```

## Mapeamento viewContext → UI

| viewContext | Nome exibido | Subtexto | Ícones |
|-------------|--------------|----------|--------|
| awaiting_my_approval | travelerName | "Aprovador: {directApproverName}" | Check, X |
| my_pending_as_traveler | "Sua solicitação" | "Aguardando: {directApproverName}" | Bell (tooltip) |

## Próximos Passos

- [ ] Página dedicada "Ver todas as aprovações" com paginação completa.
- [ ] Funcionalidade de **notificação** ao clicar no sino (notificar aprovador direto).
- [ ] Filtros avançados (tipo de produto, período).
