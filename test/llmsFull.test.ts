import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import en from '../src/i18n/locales/en.json'
import { renderLlmsFull } from '../scripts/generate-llms-full'

describe('llms-full.txt', () => {
    const text = renderLlmsFull(en.features)

    it('covers every feature on the Features page', () => {
        const items = [...en.features.coach.items, ...en.features.athlete.items, en.features.migration.item]
        for (const item of items) {
            expect(text).toContain(`### ${item.title}`)
            expect(text).toContain(item.lead)
        }
    })

    it('matches the committed public copy', () => {
        // The build regenerates it; this catches copy edits committed without a rebuild.
        expect(readFileSync(join(__dirname, '../public/llms-full.txt'), 'utf8')).toBe(text)
    })
})
