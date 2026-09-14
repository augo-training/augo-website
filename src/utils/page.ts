/**
 * The `page` property used across analytics events: the path with the language
 * prefix and any trailing slash removed, so /en/nice-athletes/ and
 * /en/nice-athletes both report as "/nice-athletes". The home page is "/".
 *
 * Kept free of browser globals so it can be unit-tested under Node.
 */
export function normalizePage(pathname: string, lang?: string): string {
    const withoutLang = lang
        ? pathname.replace(`/${lang}`, '')
        : pathname.replace(/^\/(en|de|pt)(?=\/|$)/, '')
    return withoutLang.replace(/\/$/, '') || '/'
}
