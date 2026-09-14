/**
 * HowTo schema for the /mcp connection flows. Node-safe and pure so it can be
 * unit-tested; JsonLd.tsx is the React wrapper.
 */

export interface McpSchemaStep {
    title: string
    body: string
    note?: string
}

export interface McpHowToInput {
    /** Which assistant this flow is for. Also the on-page anchor. */
    platform: 'claude' | 'chatgpt'
    /** Display name of the assistant. */
    toolName: string
    lang: string
    name: string
    description: string
    steps: McpSchemaStep[]
    baseUrl: string
    mcpUrl: string
}

/**
 * Built from the same i18n array the page renders, so the schema cannot
 * describe a procedure different from the one on screen.
 */
export function buildMcpHowTo(input: McpHowToInput) {
    const pageUrl = `${input.baseUrl}/${input.lang}/mcp/`
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: input.name,
        description: input.description,
        totalTime: 'PT2M',
        inLanguage: input.lang,
        estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
        supply: [{ '@type': 'HowToSupply', name: input.mcpUrl }],
        tool: [{ '@type': 'HowToTool', name: input.toolName }],
        step: input.steps.map((step, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: step.title,
            text: [step.body, step.note].filter(Boolean).join(' '),
            url: `${pageUrl}#${input.platform}-step-${i + 1}`,
        })),
    }
}
