import { describe, it, expect } from 'vitest'
import en from '../src/i18n/locales/en.json'
import { buildFeaturesSearch } from '../src/components/features/pageSearchIndex'
import { supportSearch } from '../src/utils/supportSearch'

const f = en.features
const { index, hits } = buildFeaturesSearch({
    coach: f.coach.items,
    athlete: f.athlete.items,
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
