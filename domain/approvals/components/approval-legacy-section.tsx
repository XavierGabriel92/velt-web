"use client"

import { Card, CardContent } from "@/components/ui/card"

/**
 * Seção de itens já aprovados (legado).
 * Atualmente sem endpoint dedicado - exibe mensagem informativa.
 * Futuramente: listar itens com Status "Aprovado", apenas visualização (eye).
 */
export function ApprovalLegacySection() {
  return (
    <Card>
      <CardContent className="py-8 text-center text-muted-foreground">
        <p className="text-sm">
          Histórico de aprovações será exibido aqui em uma versão futura.
        </p>
      </CardContent>
    </Card>
  )
}
