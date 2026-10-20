import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { coaches, hasPortrait } from '../data/coaches'
import type { Coach } from '../data/coaches/types'
import { EXPERT_SERVICE_LABEL, GENDER_LABEL } from '../data/coaches/types'
import { BASE_URL } from './seoConstants'
import { getCanonicalUrl } from './seoConfig'
import type { SupportedLanguage } from '../i18n'
import { getPricingTier } from '../config/pricingConfig'
import { buildMcpHowTo, type McpSchemaStep } from './mcpSchema'
import { MCP_URL } from '../components/mcp/constants'
import {
  ADVISOR_LINKS,
  COPY as COACH_COURSE_COPY,
  COACH_COURSE_PATH,
  COURSE_KEYWORDS,
  COURSE_NAME,
  COURSE_UPDATED,
} from '../components/coachCourse/constants'
import { COPY as RACING_TEAM_COPY, RACING_TEAM_URL } from '../components/racingTeam/constants'

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'augo',
    url: 'https://www.augotraining.com',
    logo: 'https://www.augotraining.com/assets/images/augo_footer_1.svg',
    sameAs: [
      'https://www.instagram.com/augo.training/',
      'https://www.linkedin.com/company/augotraining',
      'https://substack.com/@augotraining',
    ],
    description:
      'The intelligent coaching platform for endurance sports. Combines coach-athlete communication, workout data and session feedback into one place.',
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

// ── Irreplaceable Endurance Coach course ────────────────────────────────────
// The free 5-day email course on /en/irreplaceable-endurance-coach. Built from
// the page's own copy, so the schema and the page cannot drift apart. English
// only, like the page.
export function CoachCourseJsonLd() {
  const url = `${BASE_URL}/en${COACH_COURSE_PATH}/`
  const provider = { '@type': 'Organization', name: 'augo', url: BASE_URL }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: COURSE_NAME,
    headline: COACH_COURSE_COPY.title,
    description: COACH_COURSE_COPY.subtitle,
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    educationalLevel: 'Professional',
    audience: { '@type': 'EducationalAudience', educationalRole: 'Endurance coach' },
    provider,
    author: provider,
    // The coaches who advise the augo team on the course, as named on the page.
    contributor: COACH_COURSE_COPY.team.advisors.map((advisor) => ({
      '@type': 'Person',
      name: advisor.name,
      jobTitle: advisor.title,
      ...(ADVISOR_LINKS[advisor.photo] ? { sameAs: ADVISOR_LINKS[advisor.photo] } : {}),
    })),
    about: [
      { '@type': 'Thing', name: 'Endurance coaching' },
      { '@type': 'Thing', name: 'Artificial intelligence in coaching' },
      { '@type': 'Thing', name: 'Scaling a coaching business' },
    ],
    keywords: COURSE_KEYWORDS.join(', '),
    timeRequired: 'P5D',
    dateModified: COURSE_UPDATED,
    teaches: COACH_COURSE_COPY.get.items,
    syllabusSections: COACH_COURSE_COPY.peek.days.map((day, index) => ({
      '@type': 'Syllabus',
      name: `Day ${index + 1}`,
      description: day.text,
    })),
    offers: {
      '@type': 'Offer',
      category: 'Free',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'P5D',
      courseSchedule: { '@type': 'Schedule', repeatFrequency: 'P1D', repeatCount: 5 },
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function SoftwareApplicationJsonLd() {
  // Pinned to the global tier, not a geo lookup: prerendered schema must be deterministic.
  const tier = getPricingTier('US')
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'augo',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'iOS, Android, Web',
    description:
      'AI-powered coaching platform for endurance sports that combines communication, workout data, and session feedback.',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: String(tier.proPrice),
      priceCurrency: tier.currency,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(tier.proPrice),
        priceCurrency: tier.currency,
        unitText: 'athlete',
        billingDuration: 1,
        billingIncrement: 1,
        billingPeriod: 'P1M',
      },
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

  // Fixed global tier, not a geo lookup: prerendered schema must be deterministic
  const tier = getPricingTier('US')
  const price = `${tier.symbol}${tier.proPrice}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item, index) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${i18nKey}.${index}.answer`, { price }),
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

const HUMAN_EDGE_URL = 'https://www.augotraining.com/en/humanedge/'

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
      url: 'https://www.augotraining.com',
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
        item: 'https://www.augotraining.com/en/',
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

// ── Racing Team structured data ─────────────────────────────────────────────

/**
 * Breadcrumb plus the page's FAQ. The FAQ reads the page's own COPY rather
 * than i18n (the page is English-only), which is why FAQJsonLd is not reused.
 */
export function RacingTeamJsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'augo', item: `${BASE_URL}/en/` },
      { '@type': 'ListItem', position: 2, name: 'augo Racing Team 2027', item: RACING_TEAM_URL },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: RACING_TEAM_COPY.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </Helmet>
  )
}

// ── Coach Directory structured data ─────────────────────────────────────────

// Human-readable discipline nouns for the Service schema; keys are Discipline
// values, which are not all safe to capitalise mechanically.
const SERVICE_LABEL: Record<string, string> = {
  running: 'Running',
  cycling: 'Cycling',
  triathlon: 'Triathlon',
  rowing: 'Rowing',
}

// Every URL below goes through getCanonicalUrl so it carries the trailing slash
// the host serves with a 200 (see seoConfig.ts). Without it each schema URL and
// internal link pointed at a 301, and CollectionPage.url differed from the canonical.
function langUrl(lang: string, path: string): string {
  return getCanonicalUrl(lang as SupportedLanguage, path)
}

function coachUrl(coach: Coach, lang: string = 'en'): string {
  return langUrl(lang, `/coaches/${coach.slug}`)
}

// Schema.org consumers expect absolute image URLs; the Vite asset path is root-relative.
function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${BASE_URL}${path}`
}

// Person schema for one coach — WITHOUT @context, so it can be embedded inside
// the directory's CollectionPage graph. Standalone callers add @context.
function coachPersonSchema(coach: Coach, lang: string = 'en') {
  const disciplineLabel = coach.disciplines
    .map((d) => SERVICE_LABEL[d] ?? d.charAt(0).toUpperCase() + d.slice(1))
    .join(' & ')
  const expertLabels = (coach.expertServices ?? []).map((s) => EXPERT_SERVICE_LABEL[s])

  // Advertise each service so answer engines can field "online <discipline>
  // coach" or "sports physio" queries. Pricing is deliberately never published.
  const areaServed = coach.coachesRemote ? 'Worldwide' : coach.location.country
  const services = [
    ...(disciplineLabel ? [`${disciplineLabel} coaching`] : []),
    ...expertLabels,
  ]
  const offers = services.map((serviceType) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', serviceType, areaServed },
  }))

  return {
    '@type': 'Person',
    name: coach.name,
    jobTitle: disciplineLabel ? `${disciplineLabel} Coach` : expertLabels.join(' & '),
    ...(coach.gender ? { gender: GENDER_LABEL[coach.gender] } : {}),
    description: coach.bio.short,
    url: coachUrl(coach, lang),
    // Coaches without dedicated photography carry a shared placeholder — a real
    // person's face. Publishing it as their Person.image would attribute one
    // coach's likeness to another, so it's omitted rather than substituted.
    ...(hasPortrait(coach) ? { image: absoluteUrl(coach.media.portrait) } : {}),
    knowsAbout: coach.specialties,
    knowsLanguage: coach.languages.map((l) => l.label),
    address: {
      '@type': 'PostalAddress',
      addressLocality: coach.location.city,
      addressCountry: coach.location.countryCode,
    },
    worksFor: { '@type': 'Organization', name: 'augo', url: BASE_URL },
    makesOffer: offers.length === 1 ? offers[0] : offers,
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
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('find.seo.collectionName'),
    description: t('find.seo.collectionDescription'),
    url: langUrl(lang, '/find'),
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
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'augo', item: langUrl(lang, '/') },
      { '@type': 'ListItem', position: 2, name: t('find.seo.breadcrumb'), item: langUrl(lang, '/find') },
    ],
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function CoachProfileBreadcrumbJsonLd({ coach }: { coach: Coach }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'augo', item: langUrl(lang, '/') },
      { '@type': 'ListItem', position: 2, name: t('find.seo.breadcrumb'), item: langUrl(lang, '/find') },
      { '@type': 'ListItem', position: 3, name: coach.name, item: coachUrl(coach, lang) },
    ],
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * One HowTo per connection flow. Google retired HowTo rich results in 2023, so
 * this is for answer engines and general machine readability, not a SERP badge.
 */
export function McpHowToJsonLd({ platform }: { platform: 'claude' | 'chatgpt' }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const steps = t(`mcp.${platform}.steps`, { returnObjects: true }) as McpSchemaStep[]
  const schema = buildMcpHowTo({
    platform,
    toolName: platform === 'claude' ? 'Claude' : 'ChatGPT',
    lang,
    name: t(`mcp.${platform}.title`),
    description: t(`mcp.${platform}.lead`),
    steps,
    baseUrl: BASE_URL,
    mcpUrl: MCP_URL,
  })
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function McpBreadcrumbJsonLd() {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'augo', item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'MCP setup', item: `${BASE_URL}/${lang}/mcp` },
    ],
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
