import type { Coach } from '../../data/coaches/types'

interface Props {
    coach: Coach
}

export default function CoachTestimonial({ coach }: Props) {
    const testimonial = coach.testimonials?.[0]
    if (!testimonial) return null

    return (
        <section
            aria-labelledby="testimonial-title"
            className="w-full py-20 sm:py-28 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
                <span
                    id="testimonial-title"
                    className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55"
                >
                    From an athlete
                </span>
                <blockquote className="font-satoshi font-medium text-[28px] sm:text-[40px] md:text-[48px] leading-[115%] tracking-[-0.02em] text-white">
                    <span aria-hidden="true" className="text-white/55">"</span>
                    {testimonial.quote}
                    <span aria-hidden="true" className="text-white/55">"</span>
                </blockquote>
                <footer className="flex items-baseline gap-4 flex-wrap mt-4 pt-6 border-t border-white/[0.08]">
                    <cite className="font-mono text-[12px] sm:text-[13px] tracking-[2.5px] uppercase text-white/85 not-italic">
                        {testimonial.author}
                    </cite>
                    {testimonial.result && (
                        <>
                            <span className="text-white/25 font-mono text-[12px]">·</span>
                            <span className="font-mono text-[12px] sm:text-[13px] tracking-[1.5px] uppercase text-white/85">
                                {testimonial.result}
                            </span>
                        </>
                    )}
                </footer>
            </div>
        </section>
    )
}
