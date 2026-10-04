/**
 * Grouped thousands: the separator is language-specific (1,000 in en, 1.000 in
 * de and pt). Whole amounts drop the decimals.
 */
export function formatNumber(value: number, lang: string): string {
    const fractionDigits = value % 1 === 0 ? 0 : 2
    try {
        return new Intl.NumberFormat(lang, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(value)
    } catch {
        return fractionDigits === 0 ? value.toString() : value.toFixed(2)
    }
}

/**
 * The tier's symbol is a prefix in every language, as on the plan cards. The
 * sign goes before the symbol; `signed` adds a plus to positive amounts.
 */
export function formatMoney(value: number, symbol: string, lang: string, options?: { signed?: boolean }): string {
    const sign = value < 0 ? '−' : options?.signed && value > 0 ? '+' : ''
    return `${sign}${symbol}${formatNumber(Math.abs(value), lang)}`
}
