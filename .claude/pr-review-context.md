This is the augo-website project: a React 19 + Vite + TypeScript marketing/content website (yarn) with static prerendering (vite build + prerender + sitemap).

Enforce these project conventions:
- yarn only (no npm/npx)
- TypeScript strict; React 19 hook correctness (exhaustive deps in
  useEffect/useCallback/useMemo)
- Tailwind CSS v4 for styling; avoid inline hardcoded style values
- react-router-dom v7 routing patterns
- i18next for all user-facing copy — no hardcoded UI strings
- Sanitize any HTML rendered via dangerouslySetInnerHTML with DOMPurify (no XSS)
- Don't break the build/prerender pipeline (vite build + scripts/prerender + sitemap)
- No hardcoded secrets or API keys (use import.meta.env)
- Adequate test coverage for new logic (vitest)
