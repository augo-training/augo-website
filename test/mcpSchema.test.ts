import { describe, it, expect } from 'vitest'
import { buildMcpHowTo } from '../src/seo/mcpSchema'
import en from '../src/i18n/locales/en.json'

const base = {
    baseUrl: 'https://augotraining.com',
    mcpUrl: 'https://api.augotraining.com/mcp',
    lang: 'en',
}

describe('buildMcpHowTo', () => {
    it('describes the same steps the page renders', () => {
        const steps = en.mcp.claude.steps
        const schema = buildMcpHowTo({
            ...base,
            platform: 'claude',
            toolName: 'Claude',
            name: en.mcp.claude.title,
            description: en.mcp.claude.lead,
            steps,
        })

        expect(schema['@type']).toBe('HowTo')
        expect(schema.step).toHaveLength(steps.length)
        expect(schema.step.map((s) => s.position)).toEqual(steps.map((_, i) => i + 1))
        expect(schema.step[0].name).toBe(steps[0].title)
    })

    it('folds a step note into the step text so nothing is lost to crawlers', () => {
        const steps = [{ title: 'Add it', body: 'Paste the URL.', note: 'Leave the window open.' }]
        const schema = buildMcpHowTo({
            ...base,
            platform: 'claude',
            toolName: 'Claude',
            name: 'x',
            description: 'y',
            steps,
        })
        expect(schema.step[0].text).toBe('Paste the URL. Leave the window open.')
    })

    it('anchors each step at its own deep link', () => {
        const schema = buildMcpHowTo({
            ...base,
            platform: 'chatgpt',
            toolName: 'ChatGPT',
            name: 'x',
            description: 'y',
            steps: en.mcp.chatgpt.steps,
        })
        expect(schema.step[1].url).toBe('https://augotraining.com/en/mcp/#chatgpt-step-2')
    })
})
