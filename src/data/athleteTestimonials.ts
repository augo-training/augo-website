import valerioPhoto from '../assets/images/Valerio.jpg?w=128&h=128&format=webp'
import patrickPhoto from '../assets/images/Patrick.jpg?w=128&h=128&format=webp'
import filipePhoto from '../assets/images/Filipe.png?w=128&h=128&format=webp'
import lucaPhoto from '../assets/images/Luca.jpg?w=128&h=128&format=webp'

export interface AthleteTestimonial {
    quote: string
    /** First name only, as agreed with the athletes. */
    name: string
    photo: string
}

// Ordered so Luca's much longer quote sits alone on the second row of the
// 3-column grid, instead of setting the height of the first row.
export const athleteTestimonials: AthleteTestimonial[] = [
    {
        quote:
            'I’ve been using the augo platform since day zero and I immediately loved it. My communication with my coach is seamless, through a lean interface that’s easy to understand. You’ve created something innovative, intelligent, and incredibly useful for athletes at all levels, even non-professionals.',
        name: 'Valerio',
        photo: valerioPhoto,
    },
    {
        quote:
            'I’ve been on augo for several months now and what I like most is its simplicity. It focuses on the main values to be tracked and gives me an easy way to communicate with my coach — by text, by pictures and by voice. Sometimes less is more, taking away any burden to do it consistently. That’s definitely the case with augo.',
        name: 'Patrick',
        photo: patrickPhoto,
    },
    {
        quote:
            'Communication and training data centralized in one place! Simplifies communication and provides multiple insights for the sessions. Looking forward to the upcoming features and integrations!',
        name: 'Filipe',
        photo: filipePhoto,
    },
    {
        quote:
            'I have used augo for a couple of months following a suggestion from my coach. I find it quite simple to use and intuitive. I like the fact that the platform has essential features only, focusing on athletes’ key feelings and experiences. It avoids overloading the user with data, and the home screen is simple and very friendly. The data on carb intake per session is very relevant and useful. I understand from my coach that augo enables a lot of AI-assisted analytics which improve his ability to follow my training patterns. Overall, I am very satisfied with the platform.',
        name: 'Luca',
        photo: lucaPhoto,
    },
]
