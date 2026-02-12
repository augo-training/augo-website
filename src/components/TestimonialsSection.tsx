export default function TestimonialsSection() {
    return (
        <section className="min-h-screen w-full flex flex-col justify-center gap-12 py-20 px-8 md:px-16 rounded-3xl"
            style={{
                background: `
                    radial-gradient(ellipse at 0% 100%, #090909 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 0%, #090909 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 60%, #C50017 0%, #8B0000 35%, #561d09ff 60%, #151515 100%)
                `,
            }}
        >
            {/* Headline */}
            <h2 className="font-mono font-bold text-[64px] leading-[130%] text-white max-w-[1200px] mx-auto w-full">
                What coaches
                <br />
                say about augo
            </h2>

            {/* Carousel placeholder */}
            <div className="max-w-[1200px] mx-auto w-full h-[400px] rounded-2xl flex items-center justify-center">
                {/* Carousel will be implemented here */}
            </div>
        </section>
    )
}
