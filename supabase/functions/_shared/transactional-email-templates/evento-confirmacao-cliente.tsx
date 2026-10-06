import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Font,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  nome?: string
  email?: string
  telefone?: string
  mensagem?: string
}

const Email = ({ nome, mensagem }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head>
      <Font fontFamily="Work Sans" fallbackFontFamily="Arial" webFont={{ url: 'https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2', format: 'woff2' }} fontWeight={400} fontStyle="normal" />
    </Head>
    <Preview>Recebemos o seu pedido. Em breve falamos sobre o seu evento.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Img src="https://boletarotisseria.com.br/__l5e/assets-v1/726bdeea-42b1-4a73-be24-09dc6ed7edbd/boleta-email-logo.png" alt="Boleta Rotisseria" width="180" style={{ display: 'block', margin: '0 auto', height: 'auto' }} />
        </Section>

        <Heading style={title}>Recebemos o seu pedido</Heading>
        <Text style={lead}>
          {nome ? `Obrigado, ${nome}!` : 'Obrigado!'} Sua solicitação chegou
          certinho para a nossa equipe.
        </Text>
        <Text style={lead}>
          Vamos olhar com calma e responder em breve para pensar juntos o
          cardápio e todos os detalhes do seu evento.
        </Text>

        {mensagem ? (
          <Section style={card}>
            <Text style={label}>O que você nos contou</Text>
            <Text style={quote}>{mensagem}</Text>
          </Section>
        ) : null}

        <Text style={lead}>
          Se quiser adiantar algo, é só responder este e-mail ou falar com a
          gente pelo WhatsApp{' '}
          <Link href="https://wa.me/5511998951900" style={link}>
            (11) 99895-1900
          </Link>
          .
        </Text>

        <Text style={signature}>Equipe Boleta</Text>
        <Text style={address}>
          Rua Ferreira de Araújo, 418 – Pinheiros, São Paulo
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Recebemos o seu pedido de orçamento',
  displayName: 'Confirmação para o cliente',
  previewData: {
    nome: 'Ana Souza',
    email: 'ana@exemplo.com.br',
    telefone: '(11) 99999-0000',
    mensagem: 'Jantar para 12 pessoas em 20/11, em Pinheiros.',
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
  margin: '0 0 14px',
  color: '#1a1a1a',
  fontFamily: '"Work Sans", Arial, Helvetica, sans-serif',
  fontSize: '24px',
  fontWeight: '400' as const,
  lineHeight: '1.25',
}

const lead = {
  margin: '0 0 14px',
  color: '#1a1a1a',
  fontSize: '15px',
  lineHeight: '1.6',
}

const card = {
  backgroundColor: '#faf8f2',
  border: '1px solid #ece4d3',
  borderRadius: '4px',
  padding: '18px 22px',
  margin: '4px 0 20px',
}

const label = {
  margin: '0 0 6px',
  color: '#8b8b8b',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}

const quote = {
  margin: '0',
  color: '#1a1a1a',
  fontSize: '14px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}

const link = {
  color: '#1a1a1a',
  textDecoration: 'underline',
}

const signature = {
  margin: '24px 0 2px',
  color: '#1a1a1a',
  fontFamily: '"Work Sans", Arial, Helvetica, sans-serif',
  fontSize: '16px',
}

const address = {
  margin: '0',
  color: '#6f6f6f',
  fontSize: '12px',
  lineHeight: '1.5',
}
