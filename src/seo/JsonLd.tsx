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

export function FAQJsonLd({ i18nKey = 'faq.items' }: { i18nKey?: string } = {}) {
  const { t } = useTranslation()
  const items = t(i18nKey, { returnObjects: true }) as Array<{
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

// ── Human Edge structured data ──────────────────────────────────────────────

const HUMAN_EDGE_URL = 'https://augotraining.com/en/humanedge/'

export function HumanEdgeProgramJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: 'The Human Edge Initiative',
    alternateName: 'The Human Edge',
    description:
      'A one-year, fully-funded human coaching program pairing one experienced marathon runner with elite running coach Brian Boisvert. Designed for runners ready to break a plateau and chase a real personal best.',
    url: HUMAN_EDGE_URL,
    educationalProgramMode: 'online',
    occupationalCategory: 'Athletics',
    educationalLevel: 'Advanced',
    timeToComplete: 'P1Y',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/LimitedAvailability',
    },
    provider: {
      '@type': 'Organization',
      name: 'augo',
      url: 'https://augotraining.com',
    },
    instructor: {
      '@type': 'Person',
      name: 'Brian Boisvert',
      url: 'https://greatdayforrunners.com/',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function HumanEdgeCoachJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brian Boisvert',
    jobTitle: 'Running Coach',
    description:
      'Elite marathon coach: 2:44 marathoner, 18-time marathoner, 2x 50-mile ultramarathoner, RRCA Level II Coach.',
    url: 'https://greatdayforrunners.com/',
    sameAs: [
      'https://www.instagram.com/brianboisvert/',
      'https://greatdayforrunners.com/',
    ],
    knowsAbout: [
      'Marathon training',
      'Endurance coaching',
      'Long-distance running',
      'Ultra marathon',
      'Personal training',
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', name: 'RRCA Level II Coach' },
      { '@type': 'EducationalOccupationalCredential', name: 'Level 3 Personal Trainer' },
      { '@type': 'EducationalOccupationalCredential', name: 'Registered Yoga Teacher (RYT 200)' },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function HumanEdgeHowToJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to apply to The Human Edge Initiative',
    description:
      "Apply to be the one runner selected for a year of free human coaching with Brian Boisvert through augo's Human Edge Initiative.",
    totalTime: 'PT5M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Follow Augo and Brian on Instagram',
        text: 'Follow @augo.training and @brianboisvert on Instagram so you do not miss the Human Edge series posts.',
        url: `${HUMAN_EDGE_URL}#how-to-apply`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Comment "Human Edge"',
        text: 'Comment "Human Edge" on any post in the Human Edge series on Augo or Brian Boisvert\'s Instagram.',
        url: `${HUMAN_EDGE_URL}#how-to-apply`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Receive your application via DM',
        text: 'You will receive the application form via Instagram direct message with full instructions.',
        url: `${HUMAN_EDGE_URL}#how-to-apply`,
      },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function HumanEdgeBreadcrumbJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'augo',
        item: 'https://augotraining.com/en/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'The Human Edge',
        item: HUMAN_EDGE_URL,
      },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
