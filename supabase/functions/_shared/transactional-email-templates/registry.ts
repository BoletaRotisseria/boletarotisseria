import type { ComponentType } from 'npm:react@18.3.1'
import { template as eventoPropostaLoja } from './evento-proposta-loja.tsx'
import { template as eventoConfirmacaoCliente } from './evento-confirmacao-cliente.tsx'

export interface TemplateEntry {
  component: ComponentType<Record<string, any>>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient. When set it always wins over the caller-provided recipient. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'evento-proposta-loja': eventoPropostaLoja,
  'evento-confirmacao-cliente': eventoConfirmacaoCliente,
}
