import type { SupportedLanguage } from '../i18n'
import { BASE_URL } from './seoConstants.ts'

interface PageMeta {
  title: string
  description: string
}

const pageMeta: Record<string, Record<SupportedLanguage, PageMeta>> = {
  home: {
    en: {
      title: 'augo — The Intelligent Coaching Assistant for Endurance Sports',
      description:
        'augo combines coach-athlete communication, workout data and session feedback into one platform. The AI-powered assistant that empowers endurance coaches.',
    },
    de: {
      title: 'augo — Der intelligente Coaching-Assistent für Ausdauersport',
      description:
        'augo kombiniert Coach-Athleten-Kommunikation, Trainingsdaten und Session-Feedback in einer Plattform. Der KI-gestützte Assistent, der Ausdauer-Coaches stärkt.',
    },
    pt: {
      title: 'augo — O Assistente Inteligente de Coaching para Esportes de Endurance',
      description:
        'augo combina comunicação coach-atleta, dados de treino e feedback de sessão em uma plataforma. O assistente com IA que fortalece coaches de endurance.',
    },
  },
  join: {
    en: {
      title: 'Join the Waitlist — augo',
      description:
        'Join the augo waitlist for priority access and special pricing. Be first to experience the intelligent coaching assistant for endurance sports.',
    },
    de: {
      title: 'Warteliste beitreten — augo',
      description:
        'Tritt der augo-Warteliste bei für Prioritätszugang und Sonderpreise. Erlebe als Erste/r den intelligenten Coaching-Assistenten für Ausdauersport.',
    },
    pt: {
      title: 'Entre na Lista de Espera — augo',
      description:
        'Entre na lista de espera da augo para acesso prioritário e preços especiais. Seja o primeiro a experimentar o assistente inteligente de coaching para esportes de endurance.',
    },
  },
  find: {
    en: {
      title: 'Find Your Perfect Coach or Athlete — augo',
      description:
        'Get matched with the perfect endurance coach or athlete. Answer a few questions and augo connects you based on training goals and communication style.',
    },
    de: {
      title: 'Finde deinen perfekten Coach oder Athleten — augo',
      description:
        'Finde den perfekten Ausdauer-Coach oder Athleten. Beantworte ein paar Fragen und augo verbindet dich basierend auf Trainingszielen und Kommunikationsstil.',
    },
    pt: {
      title: 'Encontre o Coach ou Atleta Perfeito — augo',
      description:
        'Encontre o coach ou atleta de endurance perfeito. Responda algumas perguntas e a augo conecta você com base em objetivos de treino e estilo de comunicação.',
    },
  },
  pricing: {
    en: {
      title: 'Pricing | augo — Know What Matters. Coach Better.',
      description:
        'Simple, transparent pricing for endurance coaches. Start free with 2 athletes or upgrade to Unlimited for full access to augo\'s intelligent coaching assistant.',
    },
    de: {
      title: 'Preise | augo — Wissen, was zählt. Besser coachen.',
      description:
        'Einfache, transparente Preise für Ausdauer-Coaches. Kostenlos mit 2 Athleten starten oder auf Unlimited upgraden für vollen Zugang zu augos intelligentem Coaching-Assistenten.',
    },
    pt: {
      title: 'Preços | augo — Saiba o que importa. Treine melhor.',
      description:
        'Preços simples e transparentes para coaches de endurance. Comece grátis com 2 atletas ou faça upgrade para Ilimitado para acesso completo ao assistente inteligente augo.',
    },
  },
  bookDemo: {
    en: {
      title: 'Book a Demo | augo — Thirty Minutes With Our Co-Founder',
      description:
        'Book thirty minutes with Bruna, augo co-founder, CEO and running coach. See augo in action, understand how it works, and ask any questions.',
    },
    de: {
      title: 'Demo buchen | augo — Dreißig Minuten mit unserem Co-Founder',
      description:
        'Buche dreißig Minuten mit Bruna, Co-Founder, CEO und Running Coach bei augo. Sieh augo in Aktion, versteh, wie es funktioniert, und stell alle deine Fragen.',
    },
    pt: {
      title: 'Agende uma Demo | augo — Trinta minutos com nosso co-founder',
      description:
        'Agende trinta minutos com Bruna, co-founder, CEO e running coach da augo. Veja a augo em ação, entenda como funciona e tire todas as suas dúvidas.',
    },
  },
  humanEdge: {
    en: {
      title: 'The Human Edge: 1 Year of Free Human Marathon Coaching | augo',
      description:
        'Applications are now closed. The Human Edge Initiative pairs one experienced marathoner with elite coach Brian Boisvert for a year of free, personalized coaching — join the waitlist for the next program.',
    },
    de: {
      title: 'The Human Edge: 1 Year of Free Human Marathon Coaching | augo',
      description:
        'Applications are now closed. The Human Edge Initiative pairs one experienced marathoner with elite coach Brian Boisvert for a year of free, personalized coaching — join the waitlist for the next program.',
    },
    pt: {
      title: 'The Human Edge: 1 Year of Free Human Marathon Coaching | augo',
      description:
        'Applications are now closed. The Human Edge Initiative pairs one experienced marathoner with elite coach Brian Boisvert for a year of free, personalized coaching — join the waitlist for the next program.',
    },
  },
  // The Ironman Nice landing pages are English-only; their de/pt entries exist
  // to satisfy the type and are never served (SEOHead runs with noAlternates).
  niceAthletes: {
    en: {
      title: 'IRONMAN 70.3 Worlds Nice 2026: Bike Course Guide — augo',
      description:
        'Nice has one of the hardest bike courses in the IM circuit. 5 things to know about the 2026 IRONMAN 70.3 Worlds bike course, from athletes who have raced it.',
    },
    de: {
      title: 'IRONMAN 70.3 Worlds Nice 2026: Bike Course Guide — augo',
      description:
        'Nice has one of the hardest bike courses in the IM circuit. 5 things to know about the 2026 IRONMAN 70.3 Worlds bike course, from athletes who have raced it.',
    },
    pt: {
      title: 'IRONMAN 70.3 Worlds Nice 2026: Bike Course Guide — augo',
      description:
        'Nice has one of the hardest bike courses in the IM circuit. 5 things to know about the 2026 IRONMAN 70.3 Worlds bike course, from athletes who have raced it.',
    },
  },
  niceCoaches: {
    en: {
      title: "IRONMAN 70.3 Worlds Nice 2026: Coach's Race Checklist — augo",
      description:
        "The elite coach's checklist for IRONMAN 70.3 Worlds Nice 2026. 10 things to lock in before your athlete's gun goes off, so nothing slips through on race day.",
    },
    de: {
      title: "IRONMAN 70.3 Worlds Nice 2026: Coach's Race Checklist — augo",
      description:
        "The elite coach's checklist for IRONMAN 70.3 Worlds Nice 2026. 10 things to lock in before your athlete's gun goes off, so nothing slips through on race day.",
    },
    pt: {
      title: "IRONMAN 70.3 Worlds Nice 2026: Coach's Race Checklist — augo",
      description:
        "The elite coach's checklist for IRONMAN 70.3 Worlds Nice 2026. 10 things to lock in before your athlete's gun goes off, so nothing slips through on race day.",
    },
  },
}

export function getPageMeta(page: string, lang: SupportedLanguage): PageMeta {
  return pageMeta[page]?.[lang] ?? pageMeta[page]?.en ?? { title: 'augo', description: '' }
}

export function getCanonicalUrl(lang: SupportedLanguage, path: string): string {
  // Trailing slash matches what GitHub Pages serves with a 200; without it the
  // host 301-redirects /en → /en/, so a no-slash canonical points at a redirect.
  return `${BASE_URL}/${lang}${path === '/' ? '' : path}/`
}

export function getAlternateUrls(path: string): { lang: SupportedLanguage; url: string }[] {
  return (['en', 'de', 'pt'] as SupportedLanguage[]).map((lang) => ({
    lang,
    url: getCanonicalUrl(lang, path),
  }))
}

export { BASE_URL }
