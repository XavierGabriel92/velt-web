# Despesas e Solicitação de Reembolso

Este documento descreve o fluxo de **despesas** e **solicitação de reembolso** no Velt Web, integrado ao backend (Velt.Api).

## Visão geral

- **Tela de despesas**: `/inicio/despesas` — relatórios de despesas, criação/edição de despesas, anexo de comprovante e **solicitação de reembolso**.
- **Reembolso**: apenas quem é o beneficiário do reembolso da despesa (quem pagou / solicitante) pode abrir uma solicitação de reembolso para ela.

## Domínios no frontend

### `domain/expenses`

- **Tipos** (`api/types.ts`): `ExpenseResponse`, `CreateExpenseRequest`, `UpdateExpenseRequest`, filtros e enums.
- **Hooks de API**: `useExpenses`, `useExpenseById`, `useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`, `useUploadReceipt`, `useAddExpenseToTravelReport`, `useRemoveExpenseFromTravelReport`.
- **Componentes**:
  - `ExpenseFormModal`: criação e edição de despesa (multi-beneficiário, comprovante opcional).
  - `ExpenseReportsList`: lista de relatórios de despesas com expansão in-place; tabela de despesas por relatório com ações (editar, excluir, anexar comprovante, **solicitar reembolso**).
  - `ExpenseCard`, `ExpenseList`, etc.

### `domain/reimbursements`

- **Tipos** (`api/types.ts`): `CreateReimbursementRequestRequest`, `ReimbursementRequestResponse`, `ReimbursementRequestState`.
- **Hooks de API**: `useCreateReimbursementRequest` — envia `POST /api/reimbursements/requests` com `expenseId` e `declaredPaidWithPersonalFunds`.

## Fluxo: Solicitar reembolso

1. Na tela **Relatórios de Despesas** (`/inicio/despesas`), o usuário expande um relatório e vê a tabela de despesas.
2. Para cada despesa, o botão **"Reembolso"** (ícone de cédula) só aparece se o usuário logado for o **beneficiário do reembolso** daquela despesa (`reimburseToUserId ?? emissorId ?? userId`).
3. Ao clicar em **Reembolso**, abre um diálogo:
   - **Título**: "Solicitar reembolso".
   - **Descrição**: resumo da despesa (descrição/categoria e valor).
   - **Checkbox**: "Pagou com recursos próprios?" (`declaredPaidWithPersonalFunds`).
   - **Botões**: Cancelar e Solicitar.
4. Ao confirmar **Solicitar**, o frontend chama `POST /api/reimbursements/requests` com `{ expenseId, declaredPaidWithPersonalFunds }`. O backend valida que o usuário autenticado é o beneficiário do reembolso da despesa e cria a solicitação em estado `Pending`.
5. Após sucesso, é exibido um toast "Solicitação de reembolso enviada." e o diálogo é fechado.

## Backend (referência)

- **Expenses**: `ExpensesController` — CRUD, filtros, `POST /api/expenses/{id}/receipt` para comprovante.
- **Reimbursements**: `ReimbursementsController` — `POST /api/reimbursements/requests` (criar solicitação), `GET /api/reimbursements/requests?expenseId=...`, aprovar/rejeitar, payouts.

Regras de negócio no backend:

- Apenas o usuário que deve receber o reembolso (`EmissorId ?? UserId` na despesa) pode criar uma solicitação de reembolso para ela.
- Despesa `VeltSale` só pode ter reembolso se `Purpose = Reembolso`.

## Arquivos principais

| Área        | Arquivo |
|------------|---------|
| Tipos      | `domain/expenses/api/types.ts`, `domain/reimbursements/api/types.ts` |
| Hook       | `domain/reimbursements/api/use-create-reimbursement-request.ts` |
| UI         | `domain/expenses/components/expense-reports-list.tsx` (botão Reembolso + diálogo) |
| Página     | `app/inicio/despesas/page.tsx` |
