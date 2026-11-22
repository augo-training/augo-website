import { describe, it, expect } from 'vitest'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'
import { buildFeaturesSearch } from '../src/components/features/pageSearchIndex'
import { supportSearch } from '../src/utils/supportSearch'

const f = en.features
const { index, hits } = buildFeaturesSearch({
    coach: f.coach.items,
    athlete: f.athlete.items,
    migration: f.migration.item,
    devices: {
        title: f.devices.title,
        lead: f.devices.lead,
        text: [f.devices.coach.body, f.devices.athlete.body],
    },
    integrations: {
        title: f.integrations.title,
        lead: f.integrations.lead,
        text: [
            ...f.integrations.how.items.map((i) => i.body),
            ...f.integrations.connect.points,
        ],
    },
    faq: f.faq.items,
})

const top = (query: string, n = 3) =>
    supportSearch(query, index, { limit: n }).results.map((r) => hits[r.slug].hash)

describe('features page search', () => {
    it.each([
        ['whatsapp', '#chat'],
        ['oura', '#recovery'],
        ['hrv', '#recovery'],
        ['do my athletes pay', '#a-free'],
        ['trainingpeaks migration', '#switching'],
        ['ftp', '#zones'],
        ['upload lab results', '#files'],
        ['set zones from a lactate test', '#files'],
        ['strength workouts', '#strength'],
        ['who needs attention today', '#signals'],
        ['mcp', '#connector'],
        ['hammerhead', '#integrations'],
        ['mywhoosh', '#integrations'],
        ['is there a web app for athletes', '#devices'],
        ['does augo work on android', '#devices'],
        ['trainingpeaks history', '#integrations'],
    ])('"%s" finds %s in the top 3', (query, hash) => {
        expect(top(query)).toContain(hash)
    })

    it('finds things despite a typo', () => {
        expect(top('recovry data')).toContain('#recovery')
    })
})

describe('features page search suggestions', () => {
    // The chips under the search box: each one has to land on something real,
    // in every language, or the first thing a visitor clicks shows nothing.
    it.each([['en', en], ['de', de], ['pt', pt]] as const)('every %s suggestion finds a section on the page', (_lang, locale) => {
        const lf = locale.features
        const built = buildFeaturesSearch({
            coach: lf.coach.items,
            athlete: lf.athlete.items,
            migration: lf.migration.item,
            devices: { title: lf.devices.title, lead: lf.devices.lead, text: [lf.devices.coach.body, lf.devices.athlete.body] },
            integrations: {
                title: lf.integrations.title,
                lead: lf.integrations.lead,
                text: [...lf.integrations.how.items.map((i) => i.body), ...lf.integrations.connect.points],
            },
            faq: lf.faq.items,
        })
        for (const suggestion of lf.search.suggestions) {
            const response = supportSearch(suggestion, built.index, { limit: 3 })
            expect(response.results.length, suggestion).toBeGreaterThan(0)
        }
    })

    it.each([
        ['Migration support', '#switching'],
        ['Integrations', '#integrations'],
        ['Claude', '#assistant'],
        ['In-app assistant', '#assistant'],
        ['Strength training', '#strength'],
    ])('"%s" finds %s in the top 3', (query, hash) => {
        expect(top(query)).toContain(hash)
    })
})
