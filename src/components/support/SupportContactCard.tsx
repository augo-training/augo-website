import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface Props {
  /** 'quiet' sits under confident results; 'prominent' when we couldn't answer. */
  variant?: 'quiet' | 'prominent'
}

/**
 * The escape hatch to a human.
 *
 * Rendered unconditionally in every tier rather than as a fallback branch, so
 * there is no code path that can leave someone with no way forward.
 *
 * Links to the contact section rather than embedding the form: that form is
 * gated behind cookie consent, and someone who declined cookies would otherwise
 * hit "Cookies Required" at exactly the moment they need help most.
 */
export default function SupportContactCard({ variant = 'quiet' }: Props) {
  const { t } = useTranslation()

  if (variant === 'quiet') {
    return (
      <p className="mt-10 text-text-muted text-[15px]">
        {t('support.contact.quiet')}{' '}
        <Link to="/en#contact" className="text-white underline underline-offset-4 hover:text-white/80">
          {t('support.contact.quietLink')}
        </Link>
      </p>
    )
  }

  return (
    <div className="mt-10 rounded-2xl border border-white/[0.12] bg-[#151515] p-6">
      <h2 className="font-satoshi font-bold text-[20px] text-white">
        {t('support.contact.title')}
      </h2>
      <p className="mt-2 text-text-muted text-[15px] leading-[165%]">
        {t('support.contact.body')}
      </p>
      <Link
        to="/en#contact"
        className="mt-5 inline-flex items-center rounded-xl bg-white text-dark font-satoshi font-medium text-[15px] px-5 py-2.5 hover:bg-white/90 transition-colors"
      >
        {t('support.contact.cta')}
      </Link>
    </div>
  )
}
