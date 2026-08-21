import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FloatingButton from '../components/FloatingButton'
import VideoModal from '../components/VideoModal'
import { useFilmGate } from '../hooks/useFilmGate'
import { trackVideoOpened, trackVideoClosed } from '../utils/analytics'
import { FilmContext, type FilmContextValue } from './FilmContext'

interface FilmProviderProps {
    children: ReactNode
}

/**
 * Site-wide film experience: the floating "a" button on every page plus the
 * shared VideoModal, all gated behind the first-name + email capture. On the
 * home page the button stays hidden until the visitor scrolls past the hero.
 */
export function FilmProvider({ children }: FilmProviderProps) {
    const { lang } = useParams<{ lang: string }>()
    const location = useLocation()
    const gateFilm = useFilmGate()

    const [videoOpen, setVideoOpen] = useState(false)
    const [videoOpenedAt, setVideoOpenedAt] = useState<number | null>(null)
    const [pastHero, setPastHero] = useState(false)

    const page = location.pathname.replace(`/${lang}`, '') || '/'
    const isHome = page === '/'

    // On home, reveal the floating button only once the visitor scrolls past the hero
    useEffect(() => {
        if (!isHome) return
        const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [isHome])

    const openVideo = useCallback(
        (trigger: string) => {
            setVideoOpen(true)
            setVideoOpenedAt(Date.now())
            trackVideoOpened({ trigger, page })
        },
        [page],
    )

    const closeVideo = useCallback(() => {
        setVideoOpen(false)
        const duration = videoOpenedAt ? Math.round((Date.now() - videoOpenedAt) / 1000) : 0
        trackVideoClosed({ page, watch_duration_seconds: duration })
        setVideoOpenedAt(null)
    }, [page, videoOpenedAt])

    const requestFilm = useCallback(
        (trigger: string) => gateFilm(() => openVideo(trigger)),
        [gateFilm, openVideo],
    )

    // Close the film when navigating to another page (state adjustment during render)
    const [prevPath, setPrevPath] = useState(location.pathname)
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname)
        if (videoOpen) {
            setVideoOpen(false)
            setVideoOpenedAt(null)
        }
    }

    const value = useMemo<FilmContextValue>(() => ({ requestFilm }), [requestFilm])

    return (
        <FilmContext.Provider value={value}>
            {children}
            <FloatingButton
                visible={isHome ? pastHero : true}
                entranceDelayMs={isHome ? 200 : 2000}
                onClick={() => requestFilm('floating_button')}
            />
            <VideoModal isOpen={videoOpen} onClose={closeVideo} />
        </FilmContext.Provider>
    )
}
