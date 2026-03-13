import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SEOHead from '../seo/SEOHead'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <>
      <SEOHead page="notFound" path="/404" />
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <h1 className="font-mono font-bold text-[64px] sm:text-[96px] leading-[100%] text-white mb-4">
          404
        </h1>
        <h2 className="font-mono font-bold text-[24px] sm:text-[32px] leading-[130%] text-white mb-4">
          {t('notFound.title')}
        </h2>
        <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[150%] text-[#969EA7] mb-10 max-w-[500px]">
          {t('notFound.message')}
        </p>
        <Link
          to={`/${lang}`}
          className="btn-gradient inline-block font-mono text-sm font-extrabold tracking-[2px] uppercase text-white px-8 py-4 rounded-lg transition-all duration-200"
        >
          {t('notFound.backHome')}
        </Link>
      </section>
    </>
  )
}
