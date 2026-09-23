/**
 * The one email check the site's forms need: something before an @, something
 * after it, and a dot in the domain. Deliberately loose. The address is only
 * ever used to send mail, and the mail server is the real validator.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
    return EMAIL_PATTERN.test(value.trim())
}
