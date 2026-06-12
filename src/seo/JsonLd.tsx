import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { coaches } from '../data/coaches'
import type { Coach } from '../data/coaches/types'
import { GENDER_LABEL } from '../data/coaches/types'
import { BASE_URL } from './seoConstants'

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
      availability: 'https://schema.org/SoldOut',
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

// ── Coach Directory structured data ─────────────────────────────────────────

function coachUrl(coach: Coach, lang: string = 'en'): string {
  return `${BASE_URL}/${lang}/coaches/${coach.slug}`
}

// Person schema for one coach — WITHOUT @context, so it can be embedded inside
// the directory's CollectionPage graph. Standalone callers add @context.
function coachPersonSchema(coach: Coach, lang: string = 'en') {
  const disciplineLabel = coach.disciplines
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
    .join(' & ')

  // Advertise the coaching service so answer engines can field "online
  // <discipline> coach" queries. Pricing is deliberately never published.
  const offer = {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      serviceType: `${disciplineLabel} coaching`,
      areaServed: coach.coachesRemote ? 'Worldwide' : coach.location.country,
    },
  }

  return {
    '@type': 'Person',
    name: coach.name,
    jobTitle: `${disciplineLabel} Coach`,
    ...(coach.gender ? { gender: GENDER_LABEL[coach.gender] } : {}),
    description: coach.bio.short,
    url: coachUrl(coach, lang),
    image: coach.media.portrait,
    knowsAbout: coach.specialties,
    knowsLanguage: coach.languages.map((l) => l.label),
    address: {
      '@type': 'PostalAddress',
      addressLocality: coach.location.city,
      addressCountry: coach.location.countryCode,
    },
    worksFor: { '@type': 'Organization', name: 'augo', url: BASE_URL },
    makesOffer: offer,
    hasCredential: coach.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
    })),
    ...(coach.socials?.website || coach.socials?.instagram
      ? {
          sameAs: [coach.socials?.website, coach.socials?.instagram].filter(
            Boolean,
          ),
        }
      : {}),
  }
}

export function CoachJsonLd({ coach }: { coach: Coach }) {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = { '@context': 'https://schema.org', ...coachPersonSchema(coach, lang) }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function FindJsonLd() {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Find an Endurance Coach — augo',
    description:
      "Browse augo's roster of online running, cycling and triathlon coaches and find one matched to your goals, schedule and communication style.",
    url: `${BASE_URL}/${lang}/find`,
    isPartOf: { '@type': 'WebSite', name: 'augo', url: BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: coaches.length,
      itemListElement: coaches.map((coach, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: coachUrl(coach, lang),
        item: coachPersonSchema(coach, lang),
      })),
    },
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function CoachBreadcrumbJsonLd() {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'augo', item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Find a Coach', item: `${BASE_URL}/${lang}/find` },
    ],
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function CoachProfileBreadcrumbJsonLd({ coach }: { coach: Coach }) {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'augo', item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Find a Coach', item: `${BASE_URL}/${lang}/find` },
      { '@type': 'ListItem', position: 3, name: coach.name, item: coachUrl(coach, lang) },
    ],
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
