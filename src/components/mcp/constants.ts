/**
 * augo's MCP endpoint. Deliberately not in the locale files: it is the one
 * string on this page that has to be byte-exact, and three JSON copies is
 * three chances for a translator to break it.
 */
export const MCP_URL = 'https://api.augotraining.com/mcp'

/** Section ids. The jump list is asserted against these in test/mcpContent.test.ts. */
export const SECTION_IDS = {
    claude: 'claude',
    chatgpt: 'chatgpt',
    prompts: 'prompts',
    access: 'access',
    troubleshooting: 'troubleshooting',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

/**
 * Shared shape for the spec-sheet rows used by three sections on this page.
 * Matches `find.standard.pillars` so the markup idiom stays recognisable.
 */
export interface McpSpecRow {
    label: string
    statement: string
}
