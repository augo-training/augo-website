# Human Edge Initiative — Marketing Brief

A reference for writing marketing assets (emails, social posts, ads, partner pitches) tied to the Human Edge Initiative. All copy below is verbatim from the live page unless marked **(synthesis)**.

Live page: `/humanedge`
Source: `src/pages/HumanEdge.tsx`, `src/components/humanEdge/*`, `src/i18n/locales/en.json` (`humanEdge.*`)

---

## At a glance

- **Program:** The Human Edge Initiative
- **Proposition:** One serious marathoner paired with a world-class human coach for one year of free, high-performance coaching, aimed at a PB.
- **Status:** Open
- **Application deadline:** May 31
- **PB attempt window:** Spring 2027
- **Selection size:** One athlete
- **Program value → cost:** $2,400 USD → Free (for the selected athlete)

---

## The offer

| Item | Detail |
|---|---|
| Duration | 12 months of coaching |
| Format | 1:1, personalized to your training |
| Cadence | Direct, ongoing access to Brian |
| Story | Year-long documentary of your progression |
| Program value | $2,400 USD |
| Price for selected athlete | Free |

---

## Audience — Who this is for

Lead: *"This isn't for first-timers. It's for one runner who wants to chase their limits and reach breakthrough performance."*

**Selection criteria (verbatim):**

| Label | Statement |
|---|---|
| Experience | 3+ marathons completed |
| Ambition | Chasing a real PB, not another finisher's medal |
| Timeline | Spring 2027 PB attempt |
| History | Self-coached, relying on standard plans and AI |
| Coaching | Have never worked with a human coach |
| Signal | Can feel the ceiling but can't break it |
| Mindset | Ready to document the journey, wins and messy parts |

**Explicit exclusions (synthesis):** beginners, athletes training only to finish, athletes currently working with a human coach.

---

## Positioning pillars

1. **Optimization has limits.** Plateaus aren't a willpower problem; they're a ceiling problem.
2. **Peak performance is interpreted, not calculated.** A great coach reads what the data can't.
3. **Probability, not guarantee.** A coach doesn't promise a PB — they change the odds.
4. **One athlete. One shot.** Scarcity is real. The program selects a single runner.
5. **Moments over motivation.** The story is the decision points, not the hype.
6. **Human edge ≠ anti-AI.** Plans and algorithms give structure. Humans make the calls that pattern-matching can't.

---

## Brand voice

**Tone:** sophisticated, data-aware, candid, no hype. Speaks to athletes who are already smart about training and skeptical of marketing.

**Signature phrasings (verbatim, ready to reuse):**

- "One athlete. One coach. One shot at a new PB."
- "Plateaus don't happen because you're not trying hard enough. They happen because optimization has limits."
- "This is where human coaches come in."
- "Real top coaching. In real conditions. With real stakes."
- "Because peak performance is interpreted, not calculated."
- "That's the human edge."
- "Not motivation. Moments. The choices that change outcomes."
- "A coach does not guarantee a personal best. But they change your probability of achieving one."
- "This initiative exists to show how."
- "If you've hit a plateau, this is your chance to go beyond it."

**Things we don't say (synthesis):**

- No "transform your running" / "unlock your potential" / generic hype
- No guarantees ("guaranteed PB", "we'll get you there")
- No anti-data or anti-AI framing — humans complement, not replace
- No participation-trophy language ("finisher's medal" is used as the *anti-pattern*)
- Avoid "journey" as throwaway — when used, anchor it to decisions and documentation

---

## Key messaging blocks (verbatim)

### Hero stack
- **Eyebrow:** The Human Edge Initiative
- **Headline (3 lines):** One athlete. / One coach. / One shot at a new PB.
- **Body (4 lines):** You've trained hard. / You've followed the plans. / You've trusted the data. / And still, you feel stuck.
- **Tagline:** Plateaus don't happen because you're not trying hard enough. They happen because optimization has limits.
- **Sub-tagline:** This is where human coaches come in.
- **Primary CTA:** Apply now
- **Deadline line:** Applications close May 31

### What is it
- **Title:** What is it?
- **Lead:** The Human Edge Initiative is a performance experiment.
- **Body:** We're selecting one serious marathon runner, someone who has already gone the distance, and pairing them with a world-class human coach for one year of free, high-performance coaching, to maximize the chances of achieving, together, a PB.
- **Callout (3 beats):** Real top coaching. / In real conditions. / With real stakes.

### Why this exists — context blocks
- **Problem:** Most runners hit a ceiling not because they aren't training hard, but because the hardest calls (when to push, when to back off, when to rebuild) are impossible to make alone.
- **Blindspot:** We underestimate when fatigued, overestimate when fresh, and second-guess in the moments that matter most.
- **Limit:** AI optimizes patterns. Plans give structure. Neither replaces what a great coach sees from the outside.

### What a human coach does (5 capabilities)
- **Instinct:** Feels when something is off, even when the data looks fine
- **Judgment:** Pushes back when your ideas are wrong, backs you when they're right
- **Pressure:** Reads pressure, doubt, and instinct
- **Uncertainty:** Makes the call when the data won't
- **Unseen:** Sees what's not in the data

Closing line: *"That's the human edge."*

### Final CTA stack
- Status: **Human Edge Initiative · Status · Open** (pulsing green dot)
- Application deadline: **May 31**
- **Note (3 lines):** A coach does not guarantee a personal best. / But they change your probability of achieving one. / This initiative exists to show how.
- **Headline:** Applications are open.
- **Subtitle 1:** One athlete will be selected.
- **Subtitle 2:** If you've hit a plateau, this is your chance to go beyond it.
- **CTA:** Apply now
- Terms link: Read more about the program's terms & conditions here.

---

## Coach — Brian Boisvert

- **Role label:** Head Coach · Great Day For Runners
- **External link:** https://greatdayforrunners.com/
- **Credentials:**
  - 2:44 — Marathon PB
  - 18× — Marathoner
  - Level II — RRCA Certified
  - 2× — 50-mile Ultra

Image asset: `src/assets/images/brian-profile.webp`
Alt text: *Portrait of running coach Brian Boisvert, RRCA Level II Coach and 2:44 marathoner.*

---

## CTA / application funnel

**Primary CTA:** "Apply now" (hero + final CTA) → opens email capture modal.

**Email capture modal copy:**
- Title: *"You're almost in"*
- Subtitle: *"Drop your email & we'll share everything you need to know about the program."*
- Submit label: *Submit*
- Backend: MailerLite group (env: `VITE_MAILERLITE_HUMANEDGE_GROUP_ID`)
- On success: smooth-scroll to `#how-to-apply`

**How to Apply — 3 steps:**

| # | Label | Title | Description |
|---|---|---|---|
| 1 | Follow | Follow Augo and Brian | Don't miss the series posts on Instagram. |
| 2 | Comment | Drop "Human Edge" on any series post | That's how we know you want in. |
| 3 | Receive | Get the application in your DMs | We'll send the form with everything you need. |

**External URLs (from `src/components/humanEdge/constants.ts`):**
- @augo Instagram: https://www.instagram.com/augo.training/
- @brian Instagram: https://www.instagram.com/brianboisvert/
- Terms: https://docs.google.com/document/d/1nKTODkTycPrnVSc1LrMTPnB1yZhd265XDZ3o2iTPCWQ/edit?usp=sharing

---

## Documentary angle

**Lead:** *Not motivation. Moments. The choices that change outcomes.*

**Shot list (verbatim, 5 moments):**

1. When the plan needs to change
2. When fatigue doesn't match the data
3. When race strategy becomes critical
4. When doubt shows up
5. When instinct overrides optimization

**Why it matters for marketing:** these five beats are pre-approved content prompts. Each one is a defensible piece of vertical video, carousel, or email subject line that aligns with the brand voice (decision points, not motivation).

---

## FAQ (verbatim, 12 items)

| Q | A |
|---|---|
| What is The Human Edge? | A one-year experiment pairing one serious runner with a world-class human coach. |
| Who is this for? | Experienced marathoners chasing a real personal best. |
| Who is this not for? | Beginners or anyone training just to finish. |
| What do I get if selected? | One year of free, fully personalized coaching. |
| Is a PB guaranteed? | No, only a higher probability of achieving one. |
| Why human coaching? | Because performance isn't just data. It's judgment. |
| Will my journey be public? | Yes, the full process will be documented. |
| How much time does it take? | A serious, consistent training commitment. |
| How do I apply? | Comment "Human Edge" on one of the Human Edge posts on Augo's or Brian's Instagram and follow the instructions in the DM. |
| How is the athlete selected? | Based on experience, plateau, and readiness to be coached. |
| What if I'm not selected? | You'll be in the loop for future Human Edge programs. |
| What's the goal of this initiative? | To prove what human coaching changes at the edge of performance. |

---

## Visual identity cues (high level)

- Dark, near-black canvas with a subtle grain texture overlay
- Editorial document feel — labels + values, monospace eyebrows, hairline rules
- Hero and Who-For sections anchored by short, atmospheric video (no faces in hero)
- Coach section uses a vertical portrait (4:5) with stat block
- Status badge: pulsing green dot · "Status · Open"
- Massive editorial typography on the closing CTA (up to 160px)
- Single warm brand gradient (red → orange → yellow) reserved for the apply button and accents — used sparingly against the dark surface
- All CTAs use uppercase, tracked, mono labels

---

## Design system — colors

**Core neutrals (CSS custom properties, defined in `src/index.css`):**

| Token | Hex |
|---|---|
| `--color-dark` | `#0A0A0A` |
| `--color-dark-800` | `#111111` |
| `--color-dark-700` | `#1A1A1A` |
| `--color-dark-600` | `#2D2D2D` |
| `--color-dark-400` | `#595959` |
| `--color-dark-200` | `#838383` |
| `--color-text` | `#FFFFFF` |
| `--color-text-muted` | `#969EA7` |

**Brand colors:**

| Token | Hex | Role |
|---|---|---|
| `--color-red` | `#C50017` | Gradient anchor |
| `--color-orange` | `#FF5514` | Gradient mid |
| `--color-yellow` | `#FFCA1E` | Gradient highlight |

**Page-specific colors:**

| Color | Use |
|---|---|
| `#34D399` | Status indicator (pulsing dot) |
| `#151515` | FAQ row background |
| `#1c1c1c` | FAQ row hover background |

**White-alpha scale (used for text + borders on dark):** `white/[0.06]`, `0.08`, `0.10`, `0.15`, `0.30`, `0.35`, `0.40`, `0.55`, `0.85`. Body copy typically sits at `white/85`; secondary at `white/55`; hairlines at `white/[0.06–0.10]`.

---

## Design system — gradients

**`btn-gradient` (primary CTA):**
```
linear-gradient(83.9deg,
  #151515 -4%,
  #C50017 38.22%,
  #FF5514 69.06%,
  #FFCA1E 99.9%)
```
Animated with `gradient-shift` (4s ease-in-out infinite, background-position 0% 50% → 100% 50%). Hover: `brightness-110`. Button geometry: 209 × 48 px, `rounded-lg`, uppercase mono label, `tracking-[2px]`.

**`brand-gradient-text`** (clipped to text):
```
linear-gradient(83.9deg, #C50017 0%, #FF5514 50%, #FFCA1E 100%)
```

**`gradient-glow`:**
```
linear-gradient(24.78deg, #C50017 -23.17%, #FF5514 91.92%, #FFCA1E 108.36%)
```

---

## Design system — typography

**Fonts loaded (`index.html` + Tailwind):**

| Family | Weights | Role |
|---|---|---|
| Inter | 300–900 | Default body |
| Satoshi | 400 / 500 / 700 | Display headlines, body emphasis |
| JetBrains Mono | 400–800 (+ italic) | Eyebrows, labels, CTAs, status |

**Eyebrow / label pattern:** `font-mono`, 12–13px, `tracking-[2.5–3px]`, uppercase, `text-white/55`.

**Headline pattern:** `font-satoshi font-bold`, `leading-[90–100%]`, negative tracking (`-0.03em` to `-0.04em`).

**Responsive type scale on Human Edge:**

| Element | Base | sm | md | lg | xl |
|---|---|---|---|---|---|
| Hero H1 | 40 | 56 | 68 | 80 | 88 |
| Hero body | — | 20 | 24–26 | — | — |
| Hero tagline | — | 22–28 | 32 | — | — |
| Section H2 (mono) | 28 | 36 | — | 44 | — |
| Coach name | — | 60 | 72 | 84 | — |
| Stats values | — | 44 | — | 52 | — |
| What-You-Get price | — | 64 | 80 | 96 | — |
| Final CTA H2 | — | 88 | 112 | 140 | 160 |

(All sizes in px; sm = ≥640, md = ≥768, lg = ≥1024, xl = ≥1280.)

**Body type:** `font-satoshi font-medium`, 17–26px, `leading-[140–150%]`, `tracking-[-0.005em]` to `-0.015em`.

---

## Design system — layout & spacing

- **Container:** `max-w-[1100px] mx-auto`, horizontal padding `px-5 sm:px-8`
- **Section padding (default):** `py-20 sm:py-24`
  - Hero override: `pt-32 pb-20 sm:pt-40 sm:pb-24`
  - Final CTA: `py-20 sm:py-28`
- **Media radius:** `rounded-2xl` (videos, portrait); **button radius:** `rounded-lg`
- **Aspect ratios:** Hero video 21:9; Who-For video 4:5; coach portrait 4:5
- **Borders / rings:** hairlines in `border-white/[0.06]`, `0.08`, or `0.10`; hero media uses `ring-1 ring-white/[0.08]`

---

## Design system — effects & motion

- **`texture-grain` overlay:** SVG `fractalNoise` filter, opacity `0.025`, `mix-blend-mode: overlay`, applied via `::before` pseudo-element. Used on most section backgrounds to give the dark canvas a film-grain feel.
- **Media glow:** `drop-shadow(0 0 32px rgba(255,255,255,0.06))` on hero video and key portraits.
- **Animations:**
  - `gradient-shift` 4s ease-in-out infinite (CTA gradient drift)
  - `glow-pulse` 2s ease-in-out infinite (opacity 0.7 → 1 — used on subtle glow elements)
  - Tailwind `animate-pulse` on the green status dot (`#34D399`)
  - Accordion: `transition-[max-height] duration-500 ease-in-out` with paired opacity 350ms
- **Hover:** CTAs use `hover:brightness-110`; FAQ rows shift bg `#151515 → #1c1c1c`; data rows use `hover:bg-white/[0.015]`
- **Motion preferences:** components respect `prefers-reduced-motion` (videos and animated text hide / fall back when reduced).

---

## SEO & schema

- **Page key:** `humanEdge` · path `/humanedge`
- **OG image:** `/humanedge-og.jpg`
- **JSON-LD attached:** FAQ, HumanEdgeProgram, HumanEdgeCoach, HumanEdgeHowTo (3-step), Breadcrumb
- **Title / description:** sourced from `humanEdge.seo.*` in `src/i18n/locales/en.json`

---

## Tracking events

| Event | Where | Notes |
|---|---|---|
| `cta_clicked` | Hero, Final CTA | `cta_text: "Apply now"`, `cta_location: "hero" \| "final_cta"` |
| Social link clicks | How to Apply (Step 1) | @augo and @brian Instagram CTAs |
| Copy "Human Edge" action | How to Apply (Step 2) | Clipboard copy + "Copied!" state |
| `faq_expanded` | FAQ | Fires when an accordion row opens |

---

## Source of truth

| Section | File |
|---|---|
| Page composition + SEO | `src/pages/HumanEdge.tsx` |
| Components | `src/components/humanEdge/*.tsx` |
| External URLs + env keys | `src/components/humanEdge/constants.ts` |
| All copy (12 languages, source `en`) | `src/i18n/locales/en.json` → `humanEdge.*` |
| Colors, fonts, animations, `texture-grain`, `btn-gradient` | `src/index.css` |
| Font loading | `index.html` |
| Media assets | `src/assets/videos/human-edge-*.mp4`, `src/assets/images/human-edge-*.jpg`, `src/assets/images/brian-profile.webp`, `public/humanedge-og.jpg` |
