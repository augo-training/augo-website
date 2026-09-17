import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Rise } from './MerciBeat'
import { COPY, TERMINAL_PAIRS, TIMING } from './constants'
import { wait } from './motion'

const ASSISTANT = COPY.prompt.assistant

interface Frame {
    index: number
    question: string
    answer: string
    typing: 'question' | 'answer'
}

interface MerciTerminalProps {
    reduced: boolean
    /** When the panel rises in, from the moment the beat mounts. Typing starts just after. */
    delayMs: number
}

/**
 * Beat 2: a mock of augo's Assistant, answering four questions a coach might
 * actually ask. It takes the real panel's bubbles and augo mark, but none of
 * its chrome: no title, no menu, no window buttons, no athlete chip. On a
 * screen a coach reads in a few seconds the chrome was just noise around the
 * thing that matters, and every question names Sarah out loud anyway, so the
 * chip said nothing the conversation did not.
 *
 * The glow and the contour texture belong to the page, not to this panel, so
 * the warmth spans the whole screen and the panel sits in it.
 *
 * The message area is a flex-sized window anchored to the bottom, so a long
 * answer scrolls up as it types, exactly as a real chat does. That is both more
 * faithful and the only way the tall pace-table answer fits on a phone.
 *
 * Nothing here is interactive: the header glyphs and the input bar are
 * decoration, hidden from screen readers. The exchange itself is announced once
 * per pair through a polite live region, never character by character.
 */
export default function MerciTerminal({ reduced, delayMs }: MerciTerminalProps) {
    const [frame, setFrame] = useState<Frame>({
        index: 0,
        question: '',
        answer: '',
        typing: 'question',
    })
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            // Reduced motion: no rise to wait for, so the first pair shows at once.
            await wait(reduced ? 0 : delayMs + 300)
            for (let index = 0; !cancelled; index = (index + 1) % TERMINAL_PAIRS.length) {
                const { question, answer } = TERMINAL_PAIRS[index]

                if (reduced) {
                    setFrame({ index, question, answer, typing: 'answer' })
                    await wait(TIMING.answerHoldMs + 2000)
                    continue
                }

                for (let n = 0; n <= question.length && !cancelled; n++) {
                    setFrame({ index, question: question.slice(0, n), answer: '', typing: 'question' })
                    await wait(TIMING.questionCharMs)
                }
                if (cancelled) return
                await wait(TIMING.answerPauseMs)
                for (let n = 1; n <= answer.length && !cancelled; n++) {
                    setFrame({ index, question, answer: answer.slice(0, n), typing: 'answer' })
                    await wait(TIMING.answerCharMs)
                }
                await wait(TIMING.answerHoldMs)
            }
        }

        void run()
        return () => {
            cancelled = true
        }
    }, [reduced, delayMs])

    // Keep the newest line in view as it types, the way a chat sticks to the bottom.
    useLayoutEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [frame])

    const spoken = TERMINAL_PAIRS[frame.index]
    const isTable = spoken.table === true

    return (
        <Rise delayMs={delayMs} className="mt-6 w-full max-w-[560px] sm:mt-10">
            {/* A plain dark surface. The glow and the topo now live on the page
                behind this beat, so the panel reads as a window onto them
                rather than as a lit box on a dark page. */}
            <div className="merci-chat relative flex w-full flex-col overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#0b0b0b]/85 backdrop-blur-[2px]">
                <div className="relative flex flex-col">
                    <p className="sr-only" aria-live="polite">
                        {`${spoken.question} ${spoken.answer}`}
                    </p>

                    <div
                        ref={scrollRef}
                        aria-hidden="true"
                        className="merci-chat-log flex flex-col justify-end gap-2 overflow-hidden px-4 pt-4 sm:px-5 sm:pt-5"
                    >
                        {frame.question && (
                            <p className="ml-auto max-w-[82%] rounded-[14px] rounded-br-[5px] bg-white/[0.14] px-3 py-2 font-satoshi text-[12.5px] leading-[1.4] text-white sm:text-[13.5px]">
                                {frame.question}
                                {frame.typing === 'question' && <span className="merci-caret" />}
                            </p>
                        )}
                        {(frame.answer || frame.typing === 'answer') && (
                            <div className="mr-auto flex w-full gap-2">
                                <span className="mt-[3px] grid h-5 w-5 flex-none place-items-center rounded-[6px] bg-white/10 text-white">
                                    <AugoMark />
                                </span>
                                <div className="min-w-0 rounded-[14px] rounded-bl-[5px] bg-black/35 px-3 py-2 text-white/85">
                                    {isTable ? (
                                        /* pre-wrap, not pre: the column rows are short enough
                                           to hold their alignment, while the paragraph under
                                           the table wraps instead of running off the edge. */
                                        <pre className="whitespace-pre-wrap break-words font-mono text-[9.5px] leading-[1.45] min-[400px]:text-[10.5px] sm:text-[11px]">
                                            {frame.answer}
                                            {frame.typing === 'answer' && (
                                                <span className="merci-caret" />
                                            )}
                                        </pre>
                                    ) : (
                                        /* pre-line keeps the line breaks in a numbered list
                                           while still wrapping each line. */
                                        <p className="whitespace-pre-line font-satoshi text-[12.5px] leading-[1.45] sm:text-[13px]">
                                            {frame.answer}
                                            {frame.typing === 'answer' && (
                                                <span className="merci-caret" />
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        aria-hidden="true"
                        className="mx-4 mb-3.5 mt-3 flex items-center gap-2 rounded-[12px] bg-white/[0.07] py-2 pl-3.5 pr-2 sm:mx-5 sm:mb-4"
                    >
                        <span className="font-satoshi text-[12.5px] text-white/35">
                            {ASSISTANT.placeholder}
                        </span>
                        <span className="ml-auto grid h-7 w-7 flex-none place-items-center rounded-[9px] bg-white/[0.14] text-white/80">
                            <Glyph d="M3.5 8h9M8.5 4l4 4-4 4" />
                        </span>
                    </div>
                </div>
            </div>
        </Rise>
    )
}

/** A stroked 16x16 glyph. Only the composer's send arrow uses it now. */
function Glyph({ d }: { d: string }) {
    return (
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    )
}

/**
 * The augo mark. Inlined rather than used as an <img> because the shipped
 * augo_a_icon.svg is filled #090909 for light backgrounds and would be
 * invisible here; currentColor lets it take the bubble's colour.
 */
function AugoMark() {
    return (
        <svg viewBox="0 0 17 20" className="h-[11px] w-[9px]" fill="currentColor" aria-hidden="true">
            <path d="M11.5761 5.14454V0H4.41782H1.27148L1.27148 5.14454H6.42378H11.5761Z" />
            <path d="M16.7285 7.58007V5.14423H11.5762V7.58007H7.6605C5.1874 7.58007 3.29136 8.08919 1.97543 9.1059C0.657966 10.1241 0 11.5814 0 13.4791C0 15.2397 0.555684 16.6345 1.66553 17.6634C2.77537 18.6923 4.28212 19.2075 6.18275 19.2075C7.87728 19.2075 9.23443 18.7898 10.2527 17.956C10.9641 17.3722 11.4282 16.6467 11.6419 15.7778H11.7472V18.8645H16.7285V7.58007ZM11.5762 12.5188C11.5762 13.3877 11.2495 14.0919 10.5977 14.6285C9.9443 15.1666 9.11535 15.4348 8.1078 15.4348C7.19183 15.4348 6.46975 15.2123 5.94307 14.7657C5.41639 14.319 5.15382 13.7078 5.15382 12.9304C5.15382 12.1987 5.39349 11.6103 5.8759 11.1637C6.35678 10.7171 6.98574 10.4946 7.76584 10.4946H11.5793V12.5188H11.5762Z" />
        </svg>
    )
}
