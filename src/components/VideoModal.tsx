import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
// import modalVideo from '../assets/videos/modal_video.mp4'

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
    const [visible, setVisible] = useState(false)
    const [animating, setAnimating] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [showControls, setShowControls] = useState(true)

    const frameRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(null)

    // Open: mount → trigger enter animation
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            const id = requestAnimationFrame(() => {
                setVisible(true)
                setIsPlaying(true)
                setIsMuted(true)
                setCurrentTime(0)
                requestAnimationFrame(() => setAnimating(true))
            })
            return () => cancelAnimationFrame(id)
        }
    }, [isOpen])

    // Close handler with exit animation
    const handleClose = useCallback(() => {
        setAnimating(false)
        if (videoRef.current) {
            videoRef.current.pause()
        }
        const timeout = setTimeout(() => {
            setVisible(false)
            setShowControls(true)
            document.body.style.overflow = ''
            onClose()
        }, 300)
        return () => clearTimeout(timeout)
    }, [onClose])

    // Escape key
    useEffect(() => {
        if (!visible) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [visible, handleClose])

    // Click outside
    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (frameRef.current && !frameRef.current.contains(e.target as Node)) {
                handleClose()
            }
        },
        [handleClose]
    )

    // Video time update
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const onTimeUpdate = () => setCurrentTime(video.currentTime)
        const onLoadedMeta = () => setDuration(video.duration)
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        video.addEventListener('timeupdate', onTimeUpdate)
        video.addEventListener('loadedmetadata', onLoadedMeta)
        video.addEventListener('play', onPlay)
        video.addEventListener('pause', onPause)
        return () => {
            video.removeEventListener('timeupdate', onTimeUpdate)
            video.removeEventListener('loadedmetadata', onLoadedMeta)
            video.removeEventListener('play', onPlay)
            video.removeEventListener('pause', onPause)
        }
    }, [visible])

    // Auto-hide controls after 3s of inactivity
    const resetControlsTimer = useCallback(() => {
        setShowControls(true)
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
        hideControlsTimer.current = setTimeout(() => {
            if (isPlaying) setShowControls(false)
        }, 3000)
    }, [isPlaying])

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    }, [])

    // Toggle mute
    const toggleMute = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.muted = !video.muted
        setIsMuted(video.muted)
    }, [])

    // Seek
    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        if (!video) return
        const time = parseFloat(e.target.value)
        video.currentTime = time
        setCurrentTime(time)
    }, [])

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    if (!visible) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer transition-opacity duration-400 ease-in-out"
            style={{
                background: 'rgba(9, 9, 9, 0.85)',
                opacity: animating ? 1 : 0,
            }}
            onClick={handleOverlayClick}
        >

            {/* Close button */}
            <button
                onClick={handleClose}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 border-none rounded-full text-white opacity-70 cursor-pointer transition-all duration-150 ease-out hover:opacity-100"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                aria-label="Close video"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Video frame with gradient border */}
            <div
                ref={frameRef}
                className="relative w-[90vw] max-w-[860px] h-[65vh] sm:h-auto sm:aspect-video cursor-default"
                style={{
                    opacity: animating ? 1 : 0,
                    transform: animating ? 'scale(1)' : 'scale(0.9)',
                    transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseMove={resetControlsTimer}
                onMouseEnter={resetControlsTimer}
            >
                {/* Glow emanating from video borders */}
                <div
                    className="absolute -inset-[60px] sm:-inset-[100px] pointer-events-none blur-[40px] sm:blur-[60px] rounded-3xl"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(255,202,30,0.7) 0%, rgba(255,85,20,0.30) 30%, rgba(197,0,23,0.3) 60%, transparent 80%)',
                        animation: 'video-glow-pulse 3s ease-in-out infinite',
                    }}
                />

                {/* Rotating gradient border */}
                <div
                    className="absolute -inset-[3px] rounded-2xl pointer-events-none join-form-border"
                />

                {/* Video + controls container */}
                <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0A0A0A]">
                    {/* <video
                        ref={videoRef}
                        src={modalVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onClick={togglePlay}
                        className="w-full h-full object-cover block cursor-pointer"
                    /> */}

                    {/* Custom controls bar */}
                    <div
                        className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4 py-3 transition-opacity duration-200 ease-out"
                        style={{
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            opacity: showControls ? 1 : 0,
                            pointerEvents: showControls ? 'auto' : 'none',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Play / Pause */}
                        <button
                            onClick={togglePlay}
                            className="flex items-center justify-center w-8 h-8 text-white opacity-90 hover:opacity-100 cursor-pointer bg-transparent border-none"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="6,4 20,12 6,20" />
                                </svg>
                            )}
                        </button>

                        {/* Current time */}
                        <span className="text-white text-xs font-mono opacity-80 min-w-[36px]">
                            {formatTime(currentTime)}
                        </span>

                        {/* Progress bar */}
                        <div className="flex-1 relative h-1 bg-white/20 rounded-full overflow-hidden group cursor-pointer">
                            {/* Filled portion */}
                            <div
                                className="absolute top-0 left-0 h-full rounded-full"
                                style={{
                                    width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #FFCA1E, #FF5514, #C50017)',
                                }}
                            />
                            {/* Seek input (invisible range slider on top) */}
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Duration */}
                        <span className="text-white text-xs font-mono opacity-80 min-w-[36px]">
                            {formatTime(duration)}
                        </span>

                        {/* Mute / Unmute */}
                        <button
                            onClick={toggleMute}
                            className="flex items-center justify-center w-8 h-8 text-white opacity-90 hover:opacity-100 cursor-pointer bg-transparent border-none"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                                    <line x1="23" y1="9" x2="17" y2="15" />
                                    <line x1="17" y1="9" x2="23" y2="15" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
