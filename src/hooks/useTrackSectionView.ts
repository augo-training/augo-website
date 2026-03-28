import { useEffect, useRef } from 'react'
import { trackSectionViewed } from '../utils/analytics'

export function useTrackSectionView(sectionName: string, page: string) {
    const tracked = useRef(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el || tracked.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !tracked.current) {
                    tracked.current = true
                    trackSectionViewed({ section: sectionName, page })
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [sectionName, page])

    return ref
}
