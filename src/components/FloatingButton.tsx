import floatingButtonImg from '../assets/images/floating_button.png'

export default function FloatingButton() {
    return (
        <a
            href="#join"
            className="fixed bottom-12 right-12 z-50 w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
            aria-label="Join Augo"
        >
            <img
                src={floatingButtonImg}
                alt="Augo App"
                className="w-full h-full object-contain drop-shadow-lg"
            />
        </a>
    )
}
