import type { Coach, CoachLanguage } from './types'

import brianPortrait from '../../assets/images/Brian.png'
import brianHero from '../../assets/images/brian-hero.webp'
import marcoPortrait from '../../assets/images/Marco.webp'
import meganPortrait from '../../assets/images/Megan.png'
import meganTobinPortrait from '../../assets/images/MeganTobin.png'
import mikaelPortrait from '../../assets/images/Mikael.png'
import markusPortrait from '../../assets/images/Markus.png'
import paoloPortrait from '../../assets/images/Paolo.png'
import jazminePortrait from '../../assets/images/Jazmine.png'
import tobiasPortrait from '../../assets/images/Tobias.png'
import manuelPortrait from '../../assets/images/Manuel.png'
import stefPortrait from '../../assets/images/Stef.png'
import nellPortrait from '../../assets/images/Nell.png'
import andreaPortrait from '../../assets/images/Andrea.png'
import bevanPortrait from '../../assets/images/Bevan.png'
import peterPortrait from '../../assets/images/Peter.png'
import andersonPortrait from '../../assets/images/Anderson.png'
import gordonPortrait from '../../assets/images/Gordon.png'
import maxPortrait from '../../assets/images/Max.png'
import sanderPortrait from '../../assets/images/Sander.png'
// Generic placeholder for coaches without dedicated photography yet.
import placeholderPortrait from '../../assets/images/brian-profile.webp'

// ── Language helpers ──
const EN: CoachLanguage = { code: 'en', flag: '🇬🇧', label: 'English' }
const IT: CoachLanguage = { code: 'it', flag: '🇮🇹', label: 'Italian' }
const DE: CoachLanguage = { code: 'de', flag: '🇩🇪', label: 'German' }
const FR: CoachLanguage = { code: 'fr', flag: '🇫🇷', label: 'French' }
const PT: CoachLanguage = { code: 'pt', flag: '🇵🇹', label: 'Portuguese' }
const ES: CoachLanguage = { code: 'es', flag: '🇪🇸', label: 'Spanish' }
const NL: CoachLanguage = { code: 'nl', flag: '🇳🇱', label: 'Dutch' }
const BG: CoachLanguage = { code: 'bg', flag: '🇧🇬', label: 'Bulgarian' }
const SV: CoachLanguage = { code: 'sv', flag: '🇸🇪', label: 'Swedish' }
const GSW: CoachLanguage = { code: 'gsw', flag: '🇨🇭', label: 'Swiss German' }
const MT: CoachLanguage = { code: 'mt', flag: '🇲🇹', label: 'Maltese' }
const AF: CoachLanguage = { code: 'af', flag: '🇿🇦', label: 'Afrikaans' }

export const coaches: Coach[] = [
    {
        slug: 'marco-altini',
        name: 'Marco Altini',
        firstName: 'Marco',
        gender: 'male',
        tagline:
            'Data-driven endurance coach for runners who care about the process — and longevity.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['running'],
        specialties: ['marathon', 'ultra', '50km', '100km', '100mi', 'HRV-guided training'],
        location: { city: 'Brisighella', country: 'Italy', countryCode: 'IT', timezone: 'Europe/Rome' },
        coachesRemote: true,
        languages: [EN, IT],
        credentials: [
            'PhD cum laude in Data Science',
            "Master's cum laude in Human Movement Sciences (high-performance coaching)",
            "Master's cum laude in Computer Science and Engineering",
            'Ultrarunning Coach Certification',
            'Endurance Sports Nutrition Certification',
            'Strength and Conditioning for Endurance Athletes',
            'Cycling Coach Certification',
        ],
        yearsCoaching: 2,
        notableResults: [
            '50+ publications on HRV, training load, injury risk, VO2max',
            'Co-founder of HRV4Training',
            'Practicing ultrarunner',
        ],
        bio: {
            short:
                'Honest, curious, grounded. Marco coaches runners who care about process and long-term health.',
            long: [
                'Marco brings a researcher\'s rigor and an athlete\'s feel: PhD in data science, three master\'s degrees, 50+ publications across HRV, training load, injury risk and VO2max estimation, and a co-founder credit on HRV4Training.',
                'Available 24/7 to his athletes, he coaches from beginner to advanced and is present for the highs and lows being an athlete entails.',
            ],
            philosophy: "Train the human. Use the data — but stay honest with how you feel.",
        },
        media: { portrait: marcoPortrait },
        socials: { website: 'https://marcoaltini.substack.com/p/coachcorner-my-training-philosophy' },
    },
    {
        slug: 'megan-edwards',
        name: 'Megan Edwards',
        firstName: 'Megan',
        gender: 'female',
        tagline:
            'RRCA-certified DPT for recreational runners chasing their first or fastest half / full marathon.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['running'],
        specialties: ['5K', '10K', 'half marathon', 'marathon'],
        location: { city: 'New York', country: 'United States', countryCode: 'US', timezone: 'America/New_York' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['RRCA Certified Coach', 'Doctor of Physical Therapy (DPT)'],
        yearsCoaching: 4,
        bio: {
            short:
                'Megan keeps runners healthy on the way to PRs — DPT-trained, race-goal focused, weekly check-ins.',
            long: [
                'A Doctor of Physical Therapy who specialises in runners and endurance athletes, Megan blends clinical movement assessment with race-focused training plans.',
                "Her sweet spot is recreational runners aged 20–50 pursuing half and full marathons — athletes who want a real plan and a coach who'll keep them off the injury list.",
            ],
            philosophy: "Healthy runners hit goals. Manage the body and the rest follows.",
        },
        media: { portrait: meganPortrait },
    },
    {
        slug: 'brian-boisvert',
        name: 'Brian Boisvert',
        firstName: 'Brian',
        gender: 'male',
        tagline:
            'Warm, motivational coach for runners ready to take training seriously without taking themselves too seriously.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['running'],
        specialties: ['marathon', 'half marathon', 'sustainable training', 'nontraditional schedules'],
        location: { city: 'London', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London' },
        coachesRemote: true,
        languages: [EN],
        credentials: [
            'RRCA Level II Coach',
            'Level 3 Personal Trainer',
            'Registered Yoga Teacher (RYT 200)',
        ],
        yearsCoaching: 6,
        bio: {
            short:
                'Soft, joyful coaching with sharp running results. Brian builds runners for the long arc — and the long run.',
            long: [
                'Brian coaches intermediate runners who already love the sport, run regularly, and are ready to seriously explore what they can do.',
                "His tone is friendly, queer-affirming, funny, and unfailingly motivational — but his work is rigorous. He takes great care to actually get to know each runner before writing a plan.",
                "Especially open to athletes with nontraditional schedules and lifestyles.",
            ],
            philosophy:
                'Self-compassion is the most underrated training tool. Sustainable progress beats heroic blocks.',
        },
        media: { portrait: brianPortrait, hero: brianHero },
        socials: { website: 'https://greatdayforrunners.com' },
    },
    {
        slug: 'manuel-wyss',
        name: 'Manuel Wyss',
        firstName: 'Manuel',
        gender: 'male',
        tagline: '15 years of Swiss-precision triathlon and running coaching, from beginner to pro.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: ['triathlon (short + long)', '10K', 'half marathon', 'marathon', 'swimming'],
        location: { city: 'Salzburg', country: 'Austria', countryCode: 'AT', timezone: 'Europe/Vienna' },
        coachesRemote: true,
        languages: [GSW, DE],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 15,
        bio: {
            short:
                'Fifteen years coaching across triathlon, running and swimming — from beginner up to elite.',
            long: [
                'Manuel works across the full triathlon stack and the run side of it: from a first sprint to long-course racing, from a goal 10K to a marathon.',
                'Available to his athletes 24/7, he coaches from beginner to elite/pro.',
            ],
            philosophy: 'Focused, interested athletes go furthest. Show up, stay curious.',
        },
        media: { portrait: manuelPortrait },
        socials: { website: 'https://team-wyss.ch' },
    },
    {
        slug: 'thierry-bessede',
        name: 'Thierry Bessède',
        firstName: 'Thierry',
        gender: 'male',
        tagline: 'Cycling-first endurance coach for ambitious athletes with stories worth showing up for.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['cycling', 'triathlon', 'running'],
        specialties: ['cycling', 'long-course triathlon', 'half marathon', 'marathon', '5K', '10K'],
        location: { city: 'Founex', country: 'Switzerland', countryCode: 'CH', timezone: 'Europe/Zurich' },
        coachesRemote: true,
        languages: [EN, FR],
        credentials: ['Certified cycling coach', 'Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 9,
        bio: {
            short:
                'Cycling is the passion; coaching young and ambitious athletes is the craft. Trust and the long arc come first.',
            long: [
                "Thierry's first love is cycling, particularly coaching young athletes — but he works across triathlon, road and trail running too.",
                'He gravitates to athletes whose lives are being changed by sport: projects with weight to them, stories worth showing up for.',
                'Sessions matter. The relationship and trust matter more.',
            ],
            philosophy: "Sessions are important. The long-term relationship with the athlete is more important.",
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.jurasports.com' },
    },
    {
        slug: 'momchil-dimitrov',
        name: 'Momchil Dimitrov',
        firstName: 'Momchil',
        gender: 'male',
        tagline:
            'Long-course triathlon coach for busy professionals who need structure, support and an accountability partner.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: ['long-course triathlon', 'half marathon', 'marathon', '50km', 'cycling'],
        location: { city: 'Plovdiv', country: 'Bulgaria', countryCode: 'BG', timezone: 'Europe/Sofia' },
        coachesRemote: true,
        languages: [EN, DE, BG],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 3,
        bio: {
            short:
                'Reliable, community-driven and supportive. Momchil specialises in long-course triathlon and longer-distance running.',
            long: [
                'Momchil works with busy professionals who need structure, accountability and someone in their corner — and who plan to race at long-course triathlon distances or beyond a marathon.',
                'Weekly check-ins, calm communication, community at the centre.',
            ],
            philosophy: "Structure beats willpower. Show up to the plan, and the plan will show up for you.",
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.myendurance.life' },
    },
    {
        slug: 'mikael-eriksson',
        name: 'Mikael Eriksson',
        firstName: 'Mikael',
        gender: 'male',
        tagline:
            'Empathetic, systematic triathlon coach for athletes whose effort matches their ambition.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'triathlon (short + long)',
            '5K',
            '10K',
            'half marathon',
            'marathon',
            'ultra',
            'cycling',
        ],
        location: { city: 'Mafra', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon' },
        coachesRemote: true,
        languages: [EN, PT, SV],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 10,
        bio: {
            short:
                'Curious, empathetic, systematic. Mikael coaches across triathlon, running and cycling — beginner to pro.',
            long: [
                "Mikael's coaching is the marriage of two things he's done for a decade: take a problem apart with a researcher's patience, and stay close to the athlete with a teammate's empathy.",
                'He looks for athletes who are dedicated, consistent, love the sport, communicate well, and whose effort actually matches their ambition.',
                'Communication is bi-weekly calls plus a few text-based check-ins per week — and more when needed.',
            ],
            philosophy: "Pragmatic, systematic, always trying to learn more. Coaching is a feedback loop.",
        },
        media: { portrait: mikaelPortrait },
        socials: { website: 'https://www.scientifictriathlon.com' },
    },
    {
        slug: 'tobi-haumann',
        name: 'Tobi Haumann',
        firstName: 'Tobi',
        gender: 'male',
        tagline:
            'Open, creative triathlon and endurance coach for driven athletes who refuse to lose the fun.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'triathlon (short + long)',
            '5K',
            '10K',
            'half marathon',
            'marathon',
            'ultra',
            'gravel',
        ],
        location: { city: 'Rosenheim', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin' },
        coachesRemote: true,
        languages: [EN, DE],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 15,
        bio: {
            short:
                'Fifteen years of multi-sport coaching with a creative streak. Tobi works with intermediate to pro athletes.',
            long: [
                'Tobi coaches triathlon, road and trail running, cycling, swimming and Nordic skiing — and his roster reflects that range.',
                'He gravitates to athletes who are communicative, driven but not losing the fun, and who have clear goals worth chasing.',
            ],
            philosophy: 'Driven, communicative, clear-goaled — without losing the fun.',
        },
        media: { portrait: tobiasPortrait },
        socials: { website: 'https://scientifictriathlon.com' },
    },
    {
        slug: 'daniel-garcia-sandua',
        name: 'Daniel García Sandúa',
        firstName: 'Daniel',
        gender: 'male',
        tagline:
            'Attentive, hard-working triathlon coach with character — for disciplined athletes who trust the work.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: ['triathlon (short + long)', '5K', '10K', 'half marathon', 'marathon', 'swimming'],
        location: { city: 'Pamplona', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid' },
        coachesRemote: true,
        languages: [EN, ES],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 2,
        bio: {
            short: 'Attentive, friendly, hard-working — and with character.',
            long: [
                'Daniel coaches triathlon, running, cycling and swimming, from intermediate up to elite/pro.',
                'He gravitates to disciplined, hard-working athletes who are self-assured and bring something of their own to the work.',
            ],
            philosophy: 'Disciplined, hard-working, self-assured — bring those and we go far.',
        },
        media: { portrait: placeholderPortrait },
    },
    {
        slug: 'rodrigo-moro-backes',
        name: 'Rodrigo Moro Backes',
        firstName: 'Rodrigo',
        gender: 'male',
        tagline: 'Short-course triathlon coach who treats training as a craft.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: ['sprint triathlon', 'Olympic triathlon', '5K', '10K', 'half marathon', 'marathon'],
        location: { city: 'Belo Horizonte', country: 'Brazil', countryCode: 'BR', timezone: 'America/Sao_Paulo' },
        coachesRemote: true,
        languages: [PT, EN],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 10,
        bio: {
            short: 'Endurance practitioner first, coach second. Rodrigo specialises in short-course triathlon.',
            long: [
                'A decade of coaching, all centred on endurance — Rodrigo trains the way he expects his athletes to.',
                'He looks for athletes with specific goals who enjoy training, take it seriously, and want to keep improving.',
            ],
            philosophy: "Specialise. Take training seriously. Always improve.",
        },
        media: { portrait: placeholderPortrait },
    },
    {
        slug: 'alexander-graf',
        name: 'Alexander Gräf',
        firstName: 'Alexander',
        gender: 'male',
        tagline:
            'Triathlon, swim-technique and HYROX coach blending sports science with calm presence.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'triathlon (short + long)',
            'swim technique',
            'HYROX',
            'VO2 / lactate testing',
            '5K',
            '10K',
            'half marathon',
            'marathon',
        ],
        location: { city: 'Vienna', country: 'Austria', countryCode: 'AT', timezone: 'Europe/Vienna' },
        coachesRemote: true,
        languages: [EN, DE],
        credentials: [
            'Certified triathlon coach',
            'Performance diagnostics (VO2, lactate, thresholds)',
            'Strength training certified',
        ],
        yearsCoaching: 9,
        bio: {
            short:
                'Blends science, physiology and consciousness. Available 24/7 to his athletes.',
            long: [
                'Alexander specialises in swim technique, triathlon performance, HYROX preparation and performance diagnostics — VO2, lactate, thresholds, the whole picture.',
                'He values honesty, awareness, structure and long-term thinking, and looks for athletes who want to understand their body rather than just push it.',
                'Progress, he says, happens through consciousness, patience and intelligent training.',
            ],
            philosophy:
                'Data + feeling, science + structure. Athletes grow physically, mentally and emotionally.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.reworkme.art' },
    },
    {
        slug: 'jazmine-lowther',
        name: 'Jazmine Lowther',
        firstName: 'Jazmine',
        gender: 'female',
        tagline:
            'Professional trail runner coaching a holistic running journey — body, mind and life.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['running', 'cycling'],
        specialties: ['trail running', 'ultra', '50km', '100km', '100mi', '200km+', 'marathon'],
        location: { city: 'Nelson', country: 'Canada', countryCode: 'CA', timezone: 'America/Vancouver' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Certified running coach', 'Strength training certified'],
        yearsCoaching: 5,
        bio: {
            short:
                'Holistic coaching that considers sleep, hormones, family, nutrition and training — not just kilometres.',
            long: [
                "Jazmine is a professional trail runner who coaches the whole athlete. Energy, sleep, mental well-being, hormones, family, relationships, nutrition, training — all of it is on the table.",
                'Strong communication is the spine of her coach-athlete relationships.',
                'She works with people interested in embarking on a holistic health and running journey that connects them back to what they love.',
            ],
            philosophy: 'Run the body and the life. The training plan is just one of many systems.',
        },
        media: { portrait: jazminePortrait },
        socials: { website: 'https://www.jazminelowther.com/' },
    },
    {
        slug: 'nick-dill',
        name: 'Nick Dill',
        firstName: 'Nick',
        gender: 'non-binary',
        tagline:
            'Sports-medicine-informed running coach who adapts week to week — open to every athlete.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['running'],
        specialties: ['10K', 'half marathon', 'marathon', 'injury management'],
        location: { city: 'New York', country: 'United States', countryCode: 'US', timezone: 'America/New_York' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Sports medicine background', 'Certified running coach'],
        yearsCoaching: 2,
        bio: {
            short:
                'Sports-medicine background, week-to-week adjustments, calm guidance through pain or injury.',
            long: [
                "Nick works in sports medicine and views coaching holistically — the plan is a hypothesis revisited every week against how the athlete is actually doing.",
                'Open to all athletes — from beginners to 20+ marathon finishers.',
            ],
            philosophy: 'Adapt to YOUR week, not last week\'s spreadsheet.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://runwithcoachnick.com' },
    },
    {
        slug: 'peter-glassford',
        name: 'Peter Glassford',
        firstName: 'Peter',
        gender: 'male',
        tagline:
            'Off-road and ultra coach for busy adults who care about durability as much as speed.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['cycling', 'running'],
        specialties: ['gravel', 'mountain bike', 'cyclocross', 'trail running', 'half marathon', 'marathon', 'ultra'],
        location: { city: 'Collingwood', country: 'Canada', countryCode: 'CA', timezone: 'America/Toronto' },
        coachesRemote: true,
        languages: [EN],
        credentials: [
            'Kinesiology degree',
            'Certified cycling coach',
            'Strength training certified',
        ],
        yearsCoaching: 20,
        bio: {
            short:
                'Practical, athlete-centred coaching focused on long-term development and durable habits.',
            long: [
                'Peter blends a kinesiology education with two decades of endurance-sport experience to make meaningful, sustainable change.',
                'His sweet spot is off-road events — gravel, MTB, cyclocross — and the busy adults who race them. Cross-training, strength work, and both objective and subjective measures are part of every plan.',
            ],
            philosophy: 'Long-term development and durable habits beat heroic blocks.',
        },
        media: { portrait: peterPortrait },
        socials: { website: 'https://www.consummateathlete.com' },
    },
    {
        slug: 'paolo-gaffurini',
        name: 'Paolo Gaffurini',
        firstName: 'Paolo',
        gender: 'male',
        tagline:
            'Calm, knowledgeable cycling coach for athletes chasing health, performance and fun — in that order.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['cycling'],
        specialties: ['cycling', 'consistency', 'recreational performance'],
        location: { city: 'Brescia', country: 'Italy', countryCode: 'IT', timezone: 'Europe/Rome' },
        coachesRemote: true,
        languages: [EN, IT],
        credentials: ['PhD', 'Certified cycling coach', 'Strength training certified'],
        yearsCoaching: 5,
        bio: {
            short:
                'Training as a gradual process, not an obsession. Paolo blends sport science with calm patience.',
            long: [
                'Paolo treats training as a continuous craft that needs consistency and dedication — but never tips into obsession.',
                'He coaches beginners and intermediate cyclists who want to improve their health and well-being through the bike.',
            ],
            philosophy: 'Health, competition, and fun — those are the three reasons we ride.',
        },
        media: { portrait: paoloPortrait },
        socials: { website: 'https://www.linkedin.com/in/paolo-gaffurini-phd' },
    },
    {
        slug: 'felipe-miranda-pais',
        name: 'Felipe Miranda Pais',
        firstName: 'Felipe',
        gender: 'male',
        tagline:
            'Endurance + bike-fit specialist with 20 years on the road, for advanced and elite athletes.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['cycling', 'running'],
        specialties: ['cycling', 'bike fitting', 'marathon', 'ultra', '50km', '100km', '100mi', 'long-course triathlon'],
        location: { city: 'Belo Horizonte', country: 'Brazil', countryCode: 'BR', timezone: 'America/Sao_Paulo' },
        coachesRemote: true,
        languages: [PT],
        credentials: ['Certified cycling coach', 'Bike fit specialist', 'Strength training certified'],
        yearsCoaching: 20,
        bio: {
            short:
                'Disciplined, engaged, good-humoured. Twenty years of endurance sports and bike fitting under one roof.',
            long: [
                'Felipe specialises in endurance sports and bike fitting — the kind of long-term coach you find once and stay with.',
                'He works with advanced and elite/pro athletes who are dedicated, curious and communicative.',
            ],
            philosophy: 'Discipline + good humour. Both are non-negotiable.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.velotime.com.br' },
    },
    {
        slug: 'jennifer-vollmann',
        name: 'Jennifer Vollmann',
        firstName: 'Jennifer',
        gender: 'female',
        tagline:
            'Ultra-tri and extreme endurance coach blending mindset training with adventurous programming.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'long-course triathlon',
            'ultra-triathlon',
            'marathon',
            'half marathon',
            '50km',
            '100km',
            '100mi',
            '200km+',
        ],
        location: { city: 'Phoenix', country: 'United States', countryCode: 'US', timezone: 'America/Phoenix' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Certified triathlon coach', 'Mindset coach', 'Strength training certified'],
        yearsCoaching: 5,
        bio: {
            short:
                'Open, supportive, mindset-led. Jennifer coaches the long edges — ultra triathlon and extreme running.',
            long: [
                'Jennifer specialises in athletes pushing the boundaries of endurance: ultra triathlon, multi-day events, races that demand as much of the head as the legs.',
                'Her ideal athlete makes endurance part of their life, enjoys year-round support, and is up for incorporating adventure into training.',
            ],
            philosophy:
                'The mind is half the engine. Build it on purpose.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://findingendurance.com' },
    },
    {
        slug: 'michiel-baetens',
        name: 'Michiel Baetens',
        firstName: 'Michiel',
        gender: 'male',
        tagline:
            'Science-driven triathlon and run coach who refuses to make you choose between pleasure and performance.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: ['triathlon (sprint to Ironman)', '800m to ultra-marathon', 'trail running'],
        location: { city: 'Vancouver', country: 'Canada', countryCode: 'CA', timezone: 'America/Vancouver' },
        coachesRemote: true,
        languages: [EN, NL],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 5,
        bio: {
            short:
                'Highly communicative, science-driven. Pleasure and performance — both, at the same time.',
            long: [
                'Michiel coaches intermediate triathletes and runners across the full distance spectrum — from 800m to ultra.',
                'He looks for dedicated, motivated athletes who want a science-based approach without losing the joy of training.',
            ],
            philosophy: 'Pleasure and performance are not a tradeoff. Build for both.',
        },
        media: { portrait: placeholderPortrait },
    },
    {
        slug: 'anderson-de-oliveira-silva',
        name: 'Anderson de Oliveira Silva',
        firstName: 'Anderson',
        gender: 'male',
        tagline:
            'Patient multi-sport coach who reads each athlete\'s season — for triathletes ready to chase new challenges.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: ['long-course triathlon', 'marathon', 'half marathon', '10K', '5K'],
        location: { city: 'Cascais', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon' },
        coachesRemote: true,
        languages: [EN, PT],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 15,
        bio: {
            short:
                'Fifteen years of multi-sport coaching, patience as the headline trait.',
            long: [
                'Anderson coaches across triathlon, running, cycling and swimming — and reads where each athlete actually is in their season.',
                'His sweet spot is intermediate to elite athletes with a base in at least one of run / swim / bike who want to take on bigger challenges and understand patience is part of the deal.',
            ],
            philosophy: 'Patience is the unlock. Improvement compounds when you let it.',
        },
        media: { portrait: andersonPortrait },
    },
    {
        slug: 'gregory-narmont',
        name: 'Gregory Narmont',
        firstName: 'Gregory',
        gender: 'male',
        tagline:
            'Personable, open-minded triathlon and running coach with a decade of life and sport experience.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: [
            'triathlon (short + long)',
            'marathon',
            'half marathon',
            '5K',
            '10K',
            '50km',
            '100km',
        ],
        location: { city: 'Zurich', country: 'Switzerland', countryCode: 'CH', timezone: 'Europe/Zurich' },
        coachesRemote: true,
        languages: [EN, DE, GSW],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 10,
        bio: {
            short:
                'Sympathetic, open-minded, plenty of life and sport experience under the belt.',
            long: [
                'Gregory has coached for a decade across triathlon and running.',
                'He looks for enthusiastic, organised athletes who are open to learning and willing to trust the work without re-litigating it against the latest social media trend.',
            ],
            philosophy: "Stay open. Stay organised. Don't outsource your coach to TikTok.",
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.cooach.ch' },
    },
    {
        slug: 'patrick-hunkeler',
        name: 'Patrick Hunkeler',
        firstName: 'Patrick',
        gender: 'male',
        tagline:
            'Structured, data-informed endurance coach who wants athletes who think for themselves.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: ['triathlon (short + long)', 'marathon', 'half marathon', '10K', '5K', 'aerobic base'],
        location: { city: 'Lucerne', country: 'Switzerland', countryCode: 'CH', timezone: 'Europe/Zurich' },
        coachesRemote: true,
        languages: [EN, GSW, DE],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 4,
        bio: {
            short:
                'Structured, performance-oriented, physiologically precise — and calm with it.',
            long: [
                'Patrick combines physiological precision with calm communication: aerobic foundation, technical stability, measurable progress.',
                'He looks for athletes willing to engage with their own development and actually think about training between sessions.',
            ],
            philosophy: 'Athletes who think for themselves get further. Train the head as well as the legs.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.ph-endurance.ch' },
    },
    {
        slug: 'freddie-webb',
        name: 'Freddie Webb',
        firstName: 'Freddie',
        gender: 'male',
        tagline:
            'Open, honest, grounded — and 26 years deep into coaching across every endurance event.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'triathlon (short + long)',
            'all endurance running distances',
            'cycling',
            'swimming',
            'trail running',
        ],
        location: { city: 'Bath', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 26,
        bio: {
            short:
                'Twenty-six years of endurance coaching. Open, honest, grounded — and ready to learn alongside you.',
            long: [
                'Freddie has been coaching triathlon, running, cycling and swimming for over two decades.',
                'He looks for advanced athletes willing to learn and develop, who treat competitions as benchmarks rather than rigid targets, and who fit training around life rather than the other way around.',
            ],
            philosophy: 'Every challenge is an opportunity to grow. Competition is a benchmark, not a verdict.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.frederickwebb-triathlon.com/' },
    },
    {
        slug: 'david-tilbury-davis',
        name: 'David Tilbury-Davis',
        firstName: 'David',
        gender: 'male',
        tagline:
            'Straight-talking, evidence-led triathlon and cycling coach with decades of pro and amateur results.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'cycling'],
        specialties: ['triathlon (Olympic to Ironman)', 'ultra-triathlon', 'road cycling', 'duathlon', 'mountain biking'],
        location: { city: 'Helsinki', country: 'Finland', countryCode: 'FI', timezone: 'Europe/Helsinki' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 29,
        bio: {
            short: 'Straight-talking, evidence-led, decades of success.',
            long: [
                'David has been coaching for nearly three decades across triathlon, road cycling, duathlon and mountain biking.',
                'He works with highly professionally-minded athletes — pro or amateur — who treat their goals with the same seriousness he brings to the data.',
            ],
            philosophy: 'Evidence first. Sentiment second. Results follow.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.tilburydavis.com' },
    },
    {
        slug: 'marc-unger',
        name: 'Marc Unger',
        firstName: 'Marc',
        gender: 'male',
        tagline:
            '38 years coaching triathlon, running and cycling — direct, helpful, and ready to go the extra mile.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'Ironman',
            'Ironman 70.3',
            'marathon',
            'half marathon',
            'short-course triathlon',
            'cycling',
            'trail running',
        ],
        location: { city: 'Willingshausen', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin' },
        coachesRemote: true,
        languages: [DE, EN],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 38,
        bio: {
            short:
                'Helpful, open, honest, direct — and willing to put in the extra steps when the athlete will too.',
            long: [
                'Marc has coached across triathlon, road and trail running and cycling for nearly four decades.',
                'He works with advanced athletes who value clear dialogue, embrace feedback, and meet his commitment with their own.',
            ],
            philosophy: 'Communication is non-negotiable. Show up willing — I will too.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'http://marcunger.blogspot.com/' },
    },
    {
        slug: 'stef-vanhaeren',
        name: 'Stef Vanhaeren',
        firstName: 'Stef',
        gender: 'male',
        tagline:
            'Parent-coach and endurance specialist for athletes who already know why they train.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['running', 'cycling'],
        specialties: ['400m to 200km', 'trail running', 'cycling', 'road running'],
        location: { city: 'Antwerp', country: 'Belgium', countryCode: 'BE', timezone: 'Europe/Brussels' },
        coachesRemote: true,
        languages: [EN, NL],
        credentials: ['Certified running coach', 'Strength training certified'],
        yearsCoaching: 5,
        bio: {
            short:
                'Passionate, committed, and a parent — Stef gets what a busy life does to a training plan.',
            long: [
                'Stef coaches road and trail running, plus cycling, from 400m up to 200km.',
                'He works with dedicated athletes who already have the motivation — they want someone who can read around the obstacles a real life throws at training.',
            ],
            philosophy: 'You bring motivation. I bring the plan that fits your week.',
        },
        media: { portrait: stefPortrait },
        socials: { website: 'https://forwardcoaching.be' },
    },
    {
        slug: 'david-cagle',
        name: 'David Cagle',
        firstName: 'David',
        gender: 'male',
        tagline:
            'Life coach + endurance coach: holistic coaching for beginners, late starters and older athletes.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: ['half marathon', 'marathon', 'all triathlon distances', 'trail running'],
        location: { city: 'Northwest Arkansas', country: 'United States', countryCode: 'US', timezone: 'America/Chicago' },
        coachesRemote: true,
        languages: [EN],
        credentials: [
            'USA Triathlon Level 1',
            'Precision Nutrition Level 2',
            'ICF ACC',
            'NBC-HWC',
            'ESCI Certified Endurance Coach',
            '80/20 Endurance',
        ],
        yearsCoaching: 5,
        bio: {
            short:
                'Trained life coach who folds endurance and nutrition certifications into one holistic engagement.',
            long: [
                'David specialises in beginners, nontraditional athletes and older athletes — people who deserve a coach who works on the whole life, not just the splits.',
                'He combines endurance coaching, life coaching, and nutrition certifications under one roof.',
            ],
            philosophy: 'Coach the whole person. The performance follows.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.continuumcoaching.info' },
    },
    {
        slug: 'markus-lombardini',
        name: 'Markus Lombardini',
        firstName: 'Markus',
        gender: 'male',
        tagline:
            'Low-volume, high-output triathlon coach — Ironman finish lines on 9.5 hours a week.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: ['sprint to ultra-distance triathlon', '5K to 160km', 'efficient training', 'technique', 'mindset'],
        location: { city: 'Vienna', country: 'Austria', countryCode: 'AT', timezone: 'Europe/Vienna' },
        coachesRemote: true,
        languages: [DE, EN],
        credentials: [
            'Magister in Sports Science',
            'State-certified Triathlon and Swimming Coach',
            'TrainingPeaks Level 2',
            'Oxygen Advantage Instructor',
            'NLP Master',
        ],
        yearsCoaching: 20,
        bio: {
            short:
                "Specialist in 'little effort, big impact'. Twenty years of efficient training, technique and mindset.",
            long: [
                'Markus is built around a low-volume approach — efficient training, sharp technique, the right mindset, minimum waste.',
                'He looks for athletes open to change, open to new solutions, and committed enough to actually try them.',
            ],
            philosophy: 'Maximum impact from minimum effort. Efficiency is a skill.',
        },
        media: { portrait: markusPortrait },
        socials: { website: 'https://mytrainair.at/' },
    },
    {
        slug: 'niki-micallef',
        name: 'Niki Micallef',
        firstName: 'Niki',
        gender: 'male',
        tagline:
            'Backyard Ultra specialist — dedicated, passionate, and hard-working, making athletes smarter about their training.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['running'],
        specialties: ['Backyard Ultras', 'trail running', 'short distance to ultras', 'multi-day events'],
        location: { city: 'Salzburg', country: 'Austria', countryCode: 'AT', timezone: 'Europe/Vienna' },
        coachesRemote: true,
        languages: [EN, IT, MT],
        credentials: ['Certified running coach'],
        bio: {
            short:
                'Dedicated, passionate, and hard-working, with a specialty in Backyard Ultras.',
            long: [
                'Niki specializes in Backyard Ultras and coaches trail running across everything from short distances to ultras and multi-day events.',
                'His goal is to make athletes smarter and more knowledgeable about their own training — and he is available to his athletes 24/7.',
                "He looks for committed intermediate athletes who complete at least half of their prescribed sessions and won't flake.",
            ],
            philosophy: 'Make athletes smarter and more knowledgeable about their training.',
        },
        media: { portrait: nellPortrait },
        socials: { website: 'https://bornonthetrail.substack.com/' },
    },
    {
        slug: 'max-kinzlbauer',
        name: 'Max Kinzlbauer',
        firstName: 'Max',
        gender: 'male',
        tagline:
            'Long-course triathlon coach with a scientific bias and a calm head — for athletes who train daily.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: ['long-course triathlon', 'cycling', 'run training', 'aerobic base'],
        location: { city: 'Salzburg', country: 'Austria', countryCode: 'AT', timezone: 'Europe/Vienna' },
        coachesRemote: true,
        languages: [DE, EN],
        credentials: ['Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 15,
        bio: {
            short:
                'Dedicated, calm, scientifically-driven, focused on the basics that actually move the needle.',
            long: [
                'Max coaches advanced triathletes who train daily and have built the routine to back it up.',
                'He looks for athletes who are inquisitive but respectful, passionate, and bring good compliance to the work.',
            ],
            philosophy: "Do the basics. Do them daily. Do them well.",
        },
        media: { portrait: maxPortrait },
        socials: { website: 'https://max-training.pro' },
    },
    {
        slug: 'andrea-salvisberg',
        name: 'Andrea Salvisberg',
        firstName: 'Andrea',
        gender: 'male',
        tagline:
            'Two-time Olympian and performance-focused triathlon coach — precision, data, honesty.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon'],
        specialties: ['Olympic-distance triathlon', '70.3', 'Ironman', 'race strategy', 'swim coaching'],
        location: { city: 'Baden', country: 'Switzerland', countryCode: 'CH', timezone: 'Europe/Zurich' },
        coachesRemote: true,
        languages: [EN, DE, GSW, FR],
        credentials: ['2x Olympian', 'Certified triathlon coach', 'Strength training certified'],
        yearsCoaching: 8,
        bio: {
            short:
                'Two-time Olympian coaching like one — precision, execution, data-driven, no hype.',
            long: [
                'Andrea uses real-world racing experience and data to optimise training, nutrition and race-day strategy.',
                'He looks for disciplined athletes training 6–12+ hours per week who are focused on systems, numbers and honest feedback rather than just showing up.',
            ],
            philosophy: 'Precision and execution. Hype is for someone else.',
        },
        media: { portrait: andreaPortrait },
        socials: { website: 'https://andreasalvisberg.com' },
    },
    {
        slug: 'dani-treise',
        name: 'Dani Treise',
        firstName: 'Dani',
        gender: 'female',
        tagline:
            'Professional triathlete and working mom — individualized coaching for female endurance athletes and postpartum return-to-sport.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: [
            'triathlon (all distances)',
            'road running',
            'female endurance athletes',
            'postpartum return-to-sport',
        ],
        location: { city: 'Minnetonka', country: 'United States', countryCode: 'US', timezone: 'America/Chicago' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Certified triathlon coach'],
        notableResults: ['Professional triathlete', 'Coach with Matt Hanson Racing'],
        bio: {
            short:
                'Professional triathlete and working mom. Supportive, highly individualized coaching with a focus on female endurance athletes and postpartum return-to-sport.',
            long: [
                "Dani provides a supportive, highly individualized coaching style tailored to fit an athlete's life, with a specialized focus on female endurance athletes and postpartum return-to-sport.",
                'Available 24/7 to her athletes, she coaches advanced athletes who value honest communication and looks for committed, coachable people dedicated to long-term growth and sustainable training.',
            ],
            philosophy: 'Coaching that fits your life — honest communication, sustainable training, long-term growth.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://matthansonracing.com/meet-the-coaches/coach-dani-treise/' },
    },
    {
        slug: 'bevan-mckinnon',
        name: 'Bevan McKinnon',
        firstName: 'Bevan',
        gender: 'male',
        tagline:
            'Twenty years of multi-sport coaching — calm, analytical, empathetic. A coach for the long road.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'triathlon (short to ultra)',
            'all endurance running',
            'cycling',
            'swimming',
            'strength and conditioning',
        ],
        location: { city: 'Taupo', country: 'New Zealand', countryCode: 'NZ', timezone: 'Pacific/Auckland' },
        coachesRemote: true,
        languages: [EN],
        credentials: [
            'IRONMAN University Certified Coach',
            'Triathlon NZ Level 3 Accredited Coach',
            'Bike NZ Coach',
            'NETFIT Strength and Conditioning Coach',
        ],
        yearsCoaching: 20,
        bio: {
            short:
                'Calm, analytical, empathetic — a strong listener combining objective data with athlete feedback.',
            long: [
                'Bevan has coached across triathlon, road and trail running, cycling and swimming for two decades.',
                'He looks for curious athletes eager to understand the training process, communicate honestly, and prioritise sustainable, long-term adaptation.',
            ],
            philosophy: 'Listen first. Use the data. Build for the long arc.',
        },
        media: { portrait: bevanPortrait },
        socials: { website: 'https://www.fitter.co.nz' },
    },
    {
        slug: 'jonathan-melville',
        name: 'Jonathan Melville',
        firstName: 'Jonathan',
        gender: 'male',
        tagline:
            'Human-first then scientific. 28 years of endurance coaching plus a PhD in marathon running.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'sprint to full-distance triathlon',
            '5K',
            '10K',
            'half marathon',
            'marathon',
            'trail running',
            'cycling',
        ],
        location: { city: 'Gijón', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid' },
        coachesRemote: true,
        languages: [EN],
        credentials: [
            'BSc Sports and Exercise Science',
            "Master's in Sports and Health Sciences",
            'PhD candidate (marathon running)',
            'Certified triathlon coach',
        ],
        yearsCoaching: 28,
        bio: {
            short:
                'Athlete, coach and researcher. Human-first then scientific — never the other way around.',
            long: [
                'Jonathan has coached for nearly three decades across triathlon, running and cycling, and is a PhD candidate researching marathon running.',
                'He looks for advanced athletes who understand endurance training takes time, who are not chasing instant results, and bring the right mindset.',
            ],
            philosophy: 'Human first, scientific second. The other order causes burnout and injury.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://www.breakaway-coaching.com' },
    },
    {
        slug: 'megan-tobin',
        name: 'Megan Tobin',
        firstName: 'Megan',
        gender: 'female',
        tagline:
            'Whole-athlete endurance coach blending nutrition, strength and mindset — for long-course and adventure junkies.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'short-course triathlon',
            'long-course triathlon',
            'multi-day events',
            'marathon swimming',
            'trail running',
            'road running',
            'cycling',
        ],
        location: { city: 'Boulder', country: 'United States', countryCode: 'US', timezone: 'America/Denver' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['TrainingPeaks Level 2', 'Strength training certified'],
        bio: {
            short:
                'Coaches the whole athlete — nutrition, strength and mindset — with a focus on women and motivated endurance athletes.',
            long: [
                'Megan is a certified short- and long-course triathlon specialist who coaches the whole athlete, consulting on nutrition, strength and mindset alongside the training plan.',
                'She specialises in coaching women and motivated athletes, and her range runs from multi-day cycling and running events to marathon swimming.',
                'Available 24/7 to her athletes, she works with dedicated endurance athletes of any experience level — particularly long-course and adventure junkies.',
            ],
            philosophy: 'Coach the whole athlete. Nutrition, strength and mindset belong in the plan too.',
        },
        media: { portrait: meganTobinPortrait },
        socials: { website: 'https://www.tmtcoaching.com' },
    },
    {
        slug: 'gordon-crawford',
        name: 'Gordon Crawford',
        firstName: 'Gordon',
        gender: 'male',
        tagline:
            'Engage, enable, educate, empower — six decades of coaching elite athletes to be their best in sport and life.',
        isFoundingCoach: true,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: [
            'olympic-distance triathlon',
            'long-course triathlon',
            'track running',
            'cross country',
            'road running',
            'trail running',
            'swimming',
            'strength training',
        ],
        location: { city: 'Stirling', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London' },
        coachesRemote: true,
        languages: [EN],
        credentials: ['Certified coach', 'Strength training certified'],
        yearsCoaching: 62,
        bio: {
            short:
                'Inspires everyone he coaches to be the best they can be in sport and life — through engaging, enabling, educating and empowering.',
            long: [
                'Gordon has been coaching for over six decades, with one focus: inspiring everyone he coaches to be the best they can be in sport and life.',
                'His coaching rests on four key principles — engage, enable, educate and empower — helping people realise their potential as athletes and as people.',
                'Available 24/7 to his athletes, he works with elite and professional athletes across triathlon, road and trail running, track, cross country and swimming — from Olympic-distance racing to 70.3, T100 and Ironman.',
            ],
            philosophy:
                'Engage, enable, educate and empower — for athletes who invest in the process, work smart and grow.',
        },
        media: { portrait: gordonPortrait },
    },
    {
        slug: 'sander-berk',
        name: 'Sander Berk',
        firstName: 'Sander',
        gender: 'male',
        tagline:
            'Former Olympic triathlete coaching across triathlon, running and cycling — building athletes who outgrow their coach.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running', 'cycling'],
        specialties: [
            'triathlon',
            'road running',
            'trail running',
            'cycling',
            'Paralympic cycling',
            'Paralympic triathlon',
            'strength training',
        ],
        location: { city: 'Geleen', country: 'The Netherlands', countryCode: 'NL', timezone: 'Europe/Amsterdam' },
        coachesRemote: true,
        languages: [EN, DE, FR, NL, AF],
        credentials: [
            'MSc in Human Movement Science',
            'Former Olympic triathlete (Beijing 2008)',
        ],
        notableResults: [
            'Olympic triathlete — Beijing 2008',
            'Coached within the national federations of Luxembourg and the Netherlands since 2010',
        ],
        bio: {
            short:
                'Former Olympic triathlete and Human Movement Science MSc who coaches with athletes, not just for them.',
            long: [
                'Sander is a former Olympic triathlete (Beijing 2008) with an MSc in Human Movement Science, and has worked within the national federations of Luxembourg and the Netherlands since 2010.',
                'He coaches triathlon, road and trail running, cycling, and Paralympic cycling and triathlon — across essentially any distance and discipline — and incorporates strength training and certified coaching practice.',
                "He likes to work with athletes, not just for them: his ideal athlete is a self-sufficient intermediate with a strong work ethic, willing to learn and to share experiences and feelings. 'No news is good news', and he favours doing what works over chasing the latest fad. He is available to his athletes 24/7.",
            ],
            philosophy: 'Work with athletes, not just for them — my goal is to make myself obsolete.',
        },
        media: { portrait: sanderPortrait },
    },
    {
        slug: 'pete-wilby',
        name: 'Pete Wilby',
        firstName: 'Pete',
        gender: 'male',
        tagline:
            'Sports-science-led triathlon and open-water swimming coach — kind, encouraging, and big on trusting the process.',
        isFoundingCoach: false,
        status: 'accepting',
        disciplines: ['triathlon', 'running'],
        specialties: [
            'triathlon (sprint to Ironman)',
            'open-water swimming',
            'swimming',
            'running (short to ultra)',
            'strength training',
        ],
        location: { city: 'Dawlish', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London' },
        coachesRemote: true,
        languages: [EN],
        credentials: [
            'Sports science background (University of Exeter)',
            'British Triathlon Federation (BTF) Level 3 Coach',
            'STA Level 2 Open Water Coach',
            'TrainingPeaks Level 2 Coach',
        ],
        yearsCoaching: 15,
        bio: {
            short:
                'Conscientious, sports-science-led triathlon and open-water swimming coach who aims to be kind and encouraging.',
            long: [
                'Pete is an experienced triathlon and open-water swimming coach with a sports science background from the University of Exeter and over 15 years of coaching.',
                'He coaches triathlon from sprint through to Ironman and running from short distances through to ultra, includes strength training, and typically communicates with his athletes on a weekly basis. He works best with intermediate athletes.',
                'A conscientious planner, he values athletes who are coachable, show grit, and trust the coaching process to work through challenges and weaknesses — staying open to changing their perspective along the way.',
            ],
            philosophy: 'Be kind, be encouraging, and trust the process — coachable athletes with grit go furthest.',
        },
        media: { portrait: placeholderPortrait },
        socials: { website: 'https://petewilbytriathlon.co.uk' },
    },
]
