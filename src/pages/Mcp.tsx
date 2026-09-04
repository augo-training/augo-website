import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { FAQJsonLd, McpHowToJsonLd, McpBreadcrumbJsonLd } from '../seo/JsonLd'
import McpHero from '../components/mcp/McpHero'
import McpTableOfContents from '../components/mcp/McpTableOfContents'
import McpSpecSection from '../components/mcp/McpSpecSection'
import McpSetupSection from '../components/mcp/McpSetupSection'
import McpPrompts from '../components/mcp/McpPrompts'
import McpFaq from '../components/mcp/McpFaq'
import McpCta from '../components/mcp/McpCta'
import { SECTION_IDS } from '../components/mcp/constants'

/**
 * Setup guide for connecting augo's MCP server to Claude or ChatGPT.
 *
 * Deliberately no GSAP: prerender drives a real browser, so entrance animations
 * bake `opacity: 0` into the static HTML. A docs page has nothing to fade in.
 */
export default function Mcp() {
    const location = useLocation()

    // ScrollToTop fires on every pathname change and races the browser's native
    // hash scroll, so a deep link like /en/mcp#chatgpt lands at the top without
    // this. Same fix as Find.tsx.
    useEffect(() => {
        if (location.hash) {
            requestAnimationFrame(() => {
                const el = document.querySelector(location.hash)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            })
        }
    }, [location.hash])

    return (
        <>
            <SEOHead page="mcp" path="/mcp" ogImagePath="/mcp-og.jpg" />
            <McpHowToJsonLd platform="claude" />
            <McpHowToJsonLd platform="chatgpt" />
            <FAQJsonLd i18nKey="mcp.faq.items" />
            <McpBreadcrumbJsonLd />
            <Navbar />
            <McpTableOfContents />
            <main>
                <McpHero />
                <McpSetupSection
                    id={SECTION_IDS.claude}
                    i18nKey="mcp.claude"
                    bg="bg-dark-800"
                    copyAtIndex={2}
                />
                <McpSetupSection
                    id={SECTION_IDS.chatgpt}
                    i18nKey="mcp.chatgpt"
                    bg="bg-dark"
                    copyAtIndex={3}
                    hasCallout
                />
                <McpPrompts />
                <McpSpecSection id={SECTION_IDS.access} i18nKey="mcp.access" bg="bg-dark" />
                <McpFaq />
                <McpCta />
            </main>
            <Footer />
        </>
    )
}
