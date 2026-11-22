// Generates public/llms-full.txt AND dist/llms-full.txt from the Features page copy.
// Runs as part of `npm run build`, next to the sitemap.
//
// llms.txt is the hand-written summary; this is the long form, every feature
// in full, for AI tools that want the detail. It is rendered from the English
// locale file, so it can never drift from what the Features page says.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, BASE_URL } from './routes.ts'

interface Item {
  id: string
  category: string
  title: string
  summary: string
  lead: string
  steps: string[]
  specs: { label: string; value: string }[]
  proof: string
}

// Only the parts of the locale this file reads.
interface FeaturesCopy {
  hero: { title: string }
  coach: { items: Item[] }
  athlete: { items: Item[] }
  migration: { label: string; item: Item }
  devices: { title: string; lead: string; coach: { title: string; body: string }; athlete: { title: string; body: string } }
  integrations: {
    title: string
    lead: string
    how: { title: string; items: { title: string; body: string }[] }
    connect: { title: string; points: string[] }
    table: { historyNote: string }
    more: { title: string; items: { title: string; body: string }[] }
  }
  faq: { title: string; items: { question: string; answer: string }[] }
  guide: { coachHeading: string; athleteHeading: string; howItWorks: string }
}

const PAGE = `${BASE_URL}/en/features/`

function feature(item: Item, guide: FeaturesCopy['guide']): string {
  const lines = [`### ${item.title}`, '', `${item.summary}`, '', item.lead]
  if (item.proof) lines.push('', item.proof)
  lines.push('', `${guide.howItWorks}:`, ...item.steps.map((s, i) => `${i + 1}. ${s}`))
  lines.push('', ...item.specs.map((s) => `- ${s.label}: ${s.value}`))
  lines.push('', `Details: ${PAGE}#${item.id}`)
  return lines.join('\n')
}

export function renderLlmsFull(f: FeaturesCopy): string {
  const out = [
    `# augo features, in full`,
    '',
    `> ${f.hero.title}. The long-form companion to ${BASE_URL}/llms.txt, generated from the Features page (${PAGE}).`,
    '',
    `## ${f.guide.coachHeading}`,
    '',
    ...f.coach.items.map((i) => feature(i, f.guide) + '\n'),
    `## ${f.guide.athleteHeading}`,
    '',
    ...f.athlete.items.map((i) => feature(i, f.guide) + '\n'),
    `## ${f.devices.title}`,
    '',
    f.devices.lead,
    '',
    `- ${f.devices.coach.title}: ${f.devices.coach.body}`,
    `- ${f.devices.athlete.title}: ${f.devices.athlete.body}`,
    '',
    `## ${f.integrations.title}`,
    '',
    f.integrations.lead,
    '',
    `### ${f.integrations.how.title}`,
    '',
    ...f.integrations.how.items.map((i) => `- ${i.title}: ${i.body}`),
    '',
    f.integrations.table.historyNote,
    '',
    `### ${f.integrations.connect.title}`,
    '',
    ...f.integrations.connect.points.map((p) => `- ${p}`),
    '',
    `### ${f.integrations.more.title}`,
    '',
    ...f.integrations.more.items.map((i) => `- ${i.title}: ${i.body}`),
    '',
    `## ${f.migration.label}`,
    '',
    feature(f.migration.item, f.guide),
    '',
    `## ${f.faq.title}`,
    '',
    ...f.faq.items.map((i) => `### ${i.question}\n\n${i.answer}\n`),
  ]
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

async function main() {
  const en = JSON.parse(await readFile(join(ROOT, 'src/i18n/locales/en.json'), 'utf8'))
  const text = renderLlmsFull(en.features)
  await writeFile(join(ROOT, 'public', 'llms-full.txt'), text)
  await mkdir(join(ROOT, 'dist'), { recursive: true })
  await writeFile(join(ROOT, 'dist', 'llms-full.txt'), text)
  console.log(`llms-full.txt: ${text.length} characters`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
