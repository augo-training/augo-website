export default function ContactSection() {
    return (
        <section
            className="min-h-screen w-full py-40 px-8 flex items-center rounded-3xl relative overflow-hidden bg-[#090909]"
        >
            {/* Blurred gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse at 0% 50%, #090909 0%, transparent 40%),
                        radial-gradient(ellipse at 100% 50%, #090909 0%, transparent 40%),
                        radial-gradient(ellipse at 0% 0%, #090909 0%, transparent 35%),
                        radial-gradient(ellipse at 0% 100%, #090909 0%, transparent 35%),
                        radial-gradient(ellipse at 100% 0%, #090909 0%, transparent 35%),
                        radial-gradient(ellipse at 30% 100%, #090909 0%, transparent 35%),
                        radial-gradient(ellipse at 50% 0%, #090909 0%, transparent 40%),
                        radial-gradient(ellipse at 80% 100%, #090909 0%, transparent 40%),
                        radial-gradient(ellipse at 40% 50%, #C50017 0%, #FF5514 35%, #BD5A1A 55%, #090909 80%)
                    `,
                    filter: 'blur(40px)',
                }}
            />
            {/* Top and bottom black fade */}
            <div className="absolute inset-x-0 top-0 h-[25%] z-[1]" style={{ background: 'linear-gradient(to bottom, #090909 0%, transparent 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-[25%] z-[1]" style={{ background: 'linear-gradient(to top, #090909 0%, transparent 100%)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[1200px] mx-auto w-full items-center relative z-10">
                {/* Left: Form placeholder */}
                <div className="min-h-[500px] rounded-2xl">
                    {/* Form will be embedded here */}
                </div>

                {/* Right: Text */}
                <div className="flex flex-col gap-6">
                    <h2 className="font-mono font-bold text-[48px] leading-[120%] text-white">
                        Questions?
                        <br />
                        Ideas?
                        <br />
                        Let's talk.
                    </h2>
                    <p className="font-satoshi font-medium text-[18px] leading-[130%] text-white">
                        Whether you're curious about augo, want to share
                        <br className="hidden md:block" />
                        feedback, or just want to connect, we'd love to hear
                        <br className="hidden md:block" />
                        from you.
                    </p>
                </div>
            </div>
        </section>
    )
}
