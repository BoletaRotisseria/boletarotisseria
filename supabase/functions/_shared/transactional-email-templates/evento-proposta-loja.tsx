import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Font,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

/** Caixa de entrada que recebe os pedidos de orçamento vindos do site. */
export const EMAIL_LOJA = 'vendas@boletarotisseria.com.br'

interface Props {
  nome?: string
  email?: string
  telefone?: string
  mensagem?: string
  enviadoEm?: string
}

const Email = ({ nome, email, telefone, mensagem, enviadoEm }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head>
      <Font fontFamily="Work Sans" fallbackFontFamily="Arial" webFont={{ url: 'https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2', format: 'woff2' }} fontWeight={400} fontStyle="normal" />
    </Head>
    <Preview>Novo pedido de orçamento recebido pelo site</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Img src="https://boletarotisseria.com.br/__l5e/assets-v1/726bdeea-42b1-4a73-be24-09dc6ed7edbd/boleta-email-logo.png" alt="BOLETA ROTISSERIA" width="180" style={{ display: 'block', margin: '0 auto', height: 'auto', color: '#1a1a1a', fontSize: '18px', letterSpacing: '0.2em', textAlign: 'center' as const }} />
        </Section>

        <Heading style={title}>Novo pedido de orçamento</Heading>
        <Text style={muted}>
          {enviadoEm ? `Recebido em ${enviadoEm}` : 'Recebido agora'} pelo
          formulário da página de Eventos.
        </Text>

        <Section style={card}>
          <Text style={label}>Nome</Text>
          <Text style={field}>
            {nome || '—'}
          </Text>
          <Text style={label}>E-mail</Text>
          <Text style={field}>
            {email || '—'}
          </Text>
          <Text style={label}>Telefone</Text>
          <Text style={field}>
            {telefone || 'não informado'}
          </Text>
          <Text style={label}>Mensagem</Text>
          <Text style={{ ...field, ...message }}>
            {mensagem || '—'}
          </Text>
        </Section>

        <Text style={footer}>
          Responda direto neste e-mail ou pelo WhatsApp (11) 99895-1900.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Novo pedido de orçamento — ${data.nome || 'cliente do site'}`,
  displayName: 'Pedido de orçamento (loja)',
  to: EMAIL_LOJA,
  previewData: {
    nome: 'Ana Souza',
    email: 'ana@exemplo.com.br',
    telefone: '(11) 99999-0000',
    mensagem: 'Jantar para 12 pessoas em 20/11, em Pinheiros.',
    enviadoEm: '06/10/2026 12:55',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Work Sans", Arial, Helvetica, sans-serif',
  margin: '0',
  padding: '0',
}

const container = {
  maxWidth: '560px',
  padding: '0 24px 28px',
}

const brandBar = {
  backgroundColor: '#ffcc00',
  margin: '0 -24px 26px',
  padding: '14px 24px',
}

const title = {
  margin: '0 0 8px',
  color: '#1a1a1a',
  fontFamily: '"Work Sans", Arial, Helvetica, sans-serif',
  fontSize: '24px',
  fontWeight: '400' as const,
  lineHeight: '1.25',
}

const muted = {
  margin: '0 0 22px',
  color: '#6f6f6f',
  fontSize: '13px',
  lineHeight: '1.5',
}

const card = {
  backgroundColor: '#faf8f2',
  border: '1px solid #ece4d3',
  borderRadius: '4px',
  padding: '20px 22px',
}

const field = {
  margin: '0 0 16px',
  color: '#1a1a1a',
  fontSize: '14px',
  lineHeight: '1.55',
}

const message = {
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const label = {
  margin: '0 0 2px',
  color: '#8b8b8b',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

const footer = {
  margin: '20px 0 0',
  color: '#6f6f6f',
  fontSize: '12px',
  lineHeight: '1.5',
}
