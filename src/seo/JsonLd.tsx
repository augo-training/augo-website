import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'augo',
    url: 'https://augotraining.com',
    logo: 'https://augotraining.com/assets/images/augo_footer_1.svg',
    sameAs: [
      'https://www.instagram.com/augo.training/',
      'https://www.linkedin.com/company/augotraining',
      'https://substack.com/@augotraining',
    ],
    description:
      'The intelligent coaching assistant for endurance sports. Combines coach-athlete communication, workout data and session feedback into one platform.',
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function SoftwareApplicationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'augo',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'iOS, Android, Web',
    description:
      'AI-powered coaching assistant for endurance sports that combines communication, workout data, and session feedback.',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/PreOrder',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function FAQJsonLd() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
