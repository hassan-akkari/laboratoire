# Content Copy Report - laboratoire

Generated: 2026-05-09

Purpose: compact but complete content handoff for another AI or editor. It inventories pages, visible copy sources, locale coverage, and raw structured content.

## Scope

- `apps/docs`: live portfolio, localized in Italian, English, and French.
- `apps/web-react`: local React showcase, no i18n; visible copy is mixed English/Italian.
- `apps/web-next`: local Next.js booking/checkout prototype, English-only.
- `packages/ui`: shared UI primitives; mostly generic labels/stories, not app copy.


## Routes And Pages

### apps/docs

- `/`: portfolio landing with header, hero, problems, services, target clients, process, case studies, why me, tech stack, FAQ, final CTA.
- `/audit`: free website audit landing page.
- `/cv`: localized CV/profile page backed by portfolio content JSON/fallback content.
- `*`: redirects to `/`.

### apps/web-react

- Single Vite SPA route at `/`, no app-level routing beyond the browser basename.

### apps/web-next

- `/`: experience listing.
- `/experiences/[slug]`: detail page.
- `/cart`: quote/cart summary from query params.
- `/checkout`: guarded checkout page and server action.
- `/login`: demo login gate.
- `/confirmation/[orderId]`: order confirmation.
- `/not-found`: fallback page.
- `/api/quote` and `/api/checkout`: route handler responses/errors that can surface to clients.


## Automated Locale Shape Check

- apps/docs/public/data: portfolio-content.it.json vs portfolio-content.json: $.projects[1].impact: array length differs (3 vs 4)
- apps/docs/public/data: portfolio-content.it.json vs portfolio-content.fr.json: $.projects[1].impact: array length differs (3 vs 4)


## Translation And Copy Source Inventory

### apps/docs

- `apps/docs/src/data/*.ts`: live landing and audit page copy, grouped by locale.
- `apps/docs/src/i18n/messages.ts`: navigation, section labels, form labels, CV labels, and system fallback messages.
- `apps/docs/public/data/portfolio-content.json`: English remote/fetchable portfolio content.
- `apps/docs/public/data/portfolio-content.it.json`: Italian remote/fetchable portfolio content.
- `apps/docs/public/data/portfolio-content.fr.json`: French remote/fetchable portfolio content.
- `apps/docs/src/content/portfolioContent.ts`: schema plus English fallback portfolio/CV content.
- `apps/docs/src/components/**/*.tsx` and `apps/docs/src/pages/**/*.tsx`: mostly layout, but contain some fixed UI labels and aria text.

### apps/web-react

- `apps/web-react/src/App.tsx`: main headings and composition.
- `apps/web-react/src/components/**`: card headings, form labels, validation-facing copy.
- `apps/web-react/src/mocks/handlers.ts`: mock API payload text/status.
- `apps/web-react/src/store/api.ts`: API endpoint only, no copy.

### apps/web-next

- `apps/web-next/lib/data.ts`: experience catalogue copy.
- `apps/web-next/app/**/page.tsx`: page headings, form labels, CTAs, empty/error states.
- `apps/web-next/app/layout.tsx`: metadata and global navigation labels.
- `apps/web-next/app/api/**/route.ts`: API error messages.
- `apps/web-next/lib/bookingSchemas.ts`, `pricing.ts`, `orders.ts`, `session.ts`: validation/pricing/order strings that can surface via UI/API.

## Static HTML And Metadata Copy

### apps/docs/index.html

- HTML language: `it`. The shell is Italian-first even though the app can switch locales and defaults to English when no saved locale exists.
- Title: `Hassan Akkari · Sviluppatore freelance per professionisti e piccole attività`
- Description: `Sviluppatore freelance a Roma. Landing page, siti professionali, web app e restyling. Niente template, niente WordPress impacchettato. Online in 1-3 settimane.`
- Keywords: `sviluppatore freelance roma, sviluppatore web freelance, creare landing page professionale, rifare sito web professionista, restyling sito web, sviluppo web app su misura, react developer italia, freelance web developer rome`
- Open Graph title/description are Italian marketing copy. Runtime updates title and description by locale, but static keywords and JSON-LD remain Italian-first.
- JSON-LD describes Hassan as `Freelance Web Developer` and a `ProfessionalService` offering landing pages, full professional sites, custom web apps/MVPs, and restyling.

### apps/web-react/index.html

- HTML language: `en`.
- Title: `web-react`.
- Favicon declares `image/svg+xml` while referencing `/favicon.png`.

### apps/web-next/app/layout.tsx

- HTML language: `en`.
- Metadata title: `Web Next | Booking Checkout Engine`.
- Metadata description: `Production-style Next.js booking and checkout flow with protected routes and pricing rules.`
- Global nav labels: `Listing`, `Cart`, `Checkout`, `Login`.


## High-Level Content Notes

- `apps/docs` has three-language coverage for the active marketing/audit content. Italian appears to be the primary/source voice; English and French are parallel translations.
- `apps/docs/src/i18n/messages.ts` French labels intentionally omit some accents in several places (`Francais`, `A propos`, `Telecharger`, `Experience`, `General`). Other French data files do use accents. Decide whether ASCII-only French labels are intentional.
- `apps/docs/public/data/portfolio-content*.json` mirrors the portfolio/CV shape across languages. The code fallback in `portfolioContent.ts` is English-only; runtime fetches localized JSON when available.
- `apps/web-react` is not localized and reads as a technical showcase/demo. Its visible copy mixes English and Italian while `index.html` declares `lang="en"`.
- `apps/web-next` is not localized and reads as a booking/checkout MVP demo. It includes user-facing demo warnings and API boundary language.

## Audit Findings To Review

### apps/docs

- Locale structure is mostly healthy across active landing/audit data modules. The automated check found one public CV JSON parity difference: project `bootstrap-tailwind-modernization` has 3 impact bullets in Italian and 4 in English/French. Decide whether Italian should gain the fourth bullet or EN/FR should be reduced.
- Static `apps/docs/index.html` is Italian-first and includes Italian JSON-LD/keywords. Runtime locale switching updates title/description/OG title/OG description, but not all static metadata.
- `/audit` SEO lives in `auditContent.ts`, while general home SEO lives in `seoContent.ts` and shell SEO lives in `index.html`; these can drift.
- If localized CV JSON fetch fails, Italian and French can fall back to English fallback copy from `portfolioContent.ts`; Italian only swaps the PDF path.
- French UI labels in `messages.ts` omit accents in several places (for example `Francais`, `A propos`, `Telecharger`, `Experience`) while other French content uses accents.
- `contactForm.schema.ts` contains English validation messages. The form is not in the active home route now, but it is user-facing if the legacy contact form returns.
- Legacy/unused visible-copy components remain: `AboutSection`, `HighlightsSection`, `PortfolioSection`, `RoadmapSection`, `ContactSection`, and `ContactForm`. Their copy should be treated as dormant until rendered again.

### apps/web-react

- No locale system is present. Copy is hardcoded in TSX/schema files.
- The UI mixes English and Italian: English headings/buttons/statuses with Italian descriptions, form labels, validation errors, and next-step text.
- `html lang="en"` conflicts with much of the visible Italian copy.
- `Priorita alta` likely needs the accent: `Priorità alta`.
- `index.html` favicon type is `image/svg+xml` while the path is `/favicon.png`.
- README remains default Vite-style material and does not describe the rendered page; not visible in UI.

### apps/web-next

- No locale system is present. Copy is hardcoded in English.
- Homepage says `app-router`; elsewhere the product/framework term is `App Router`. Standardize casing.
- Login says a `secure cookie`, but the cookie is only marked secure in production. The copy may overstate local behavior.
- Unknown but schema-valid slugs on `/cart` or `/checkout` can throw from pricing instead of showing app-level copy.
- Global not-found text mentions expired confirmation state for every missing route, including unknown experience slugs.
- Checkout preview omits `Tax`, while cart and confirmation include it.
- Confirmation displays raw payment enum values such as `card` or `wallet` instead of display labels `Card` / `Wallet`.


## Full Structured Content - apps/docs data modules

### apps/docs/src/data/auditContent.ts


```json
{
  "auditContent": {
    "it": {
      "seoTitle": "Audit gratuito del tuo sito · Hassan Akkari",
      "seoDescription": "Il tuo sito perde clienti senza saperlo. In 24h ti dico cosa non funziona — gratis, senza impegno, senza call vendita mascherata.",
      "badge": "Lead magnet — gratuito",
      "hero": {
        "title": "Il tuo sito perde clienti senza saperlo. In 24h ti dico perché — gratis.",
        "subtitle": "Mandami l'URL del tuo sito su WhatsApp. Entro 24 ore lavorative ricevi un'analisi su 5 punti chiave, le 3 cose da sistemare subito, e una stima di costi/priorità. Niente call vendita mascherata: leggi il report e fai quello che vuoi.",
        "primaryCtaLabel": "Voglio l'audit gratuito",
        "primaryCtaHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20vorrei%20l'audit%20gratuito%20del%20mio%20sito.%20URL%3A%20",
        "secondaryCtaLabel": "Mandami una mail",
        "secondaryCtaHref": "mailto:hassan.akkari01@gmail.com?subject=Audit+gratuito+del+mio+sito&body=Ciao+Hassan%2C+vorrei+l%27audit+gratuito+del+mio+sito.%0A%0AURL+del+sito%3A+%0ANote%3A+",
        "guarantee": [
          "✓ Risposta entro 24h lavorative",
          "✓ Zero impegno, zero call vendita mascherata",
          "✓ Niente upselling automatico"
        ]
      },
      "checkpoints": {
        "label": "Cosa controllo",
        "title": "I 5 punti che fanno scappare un visitatore senza che tu lo sappia.",
        "items": [
          {
            "id": "first-impression",
            "title": "Design e prima impressione",
            "description": "I primi 3 secondi decidono se il visitatore resta o se ne va. Capiamo cosa comunica davvero il tuo sito al primo sguardo."
          },
          {
            "id": "mobile",
            "title": "Mobile experience",
            "description": "Il 60-70% del tuo traffico arriva da telefono. Verifico responsive, leggibilità, dita-su-bottone e tutto quello che oggi sta rompendo l'esperienza."
          },
          {
            "id": "performance",
            "title": "Performance e velocità",
            "description": "Core Web Vitals reali (LCP, CLS, INP). Ogni secondo di caricamento in più ti costa visitatori e posizionamento Google."
          },
          {
            "id": "seo",
            "title": "SEO tecnica base",
            "description": "Title, meta description, struttura semantica, sitemap, dati strutturati. Il minimo sindacale che spesso manca anche su siti rifatti da poco."
          },
          {
            "id": "conversion",
            "title": "CTA e flussi di conversione",
            "description": "Cosa devi fare per essere contattato? Quanti tap servono? Il visitatore capisce in 5 secondi cosa offri e come prenotare? Spesso è qui che si perdono i contatti."
          }
        ]
      },
      "deliverable": {
        "label": "Cosa ricevi",
        "title": "Un report concreto, leggibile in 10 minuti.",
        "items": [
          "Video registrato di 4-6 minuti dove ti porto in giro per il sito e ti faccio vedere i problemi",
          "Lista delle 3 cose più urgenti da sistemare subito",
          "Indicazione di costi e priorità (cosa fare prima, cosa può aspettare)",
          "Call gratuita di 20 minuti opzionale, se vuoi approfondire"
        ]
      },
      "process": {
        "label": "Come funziona",
        "title": "Tre step. Niente moduli infiniti.",
        "steps": [
          {
            "id": "send-url",
            "number": "01",
            "title": "Mi mandi l'URL su WhatsApp",
            "description": "Un messaggio con il link del tuo sito (e una riga su cosa fai, se ti va). Tutto qui, niente form, niente registrazione."
          },
          {
            "id": "analyze",
            "number": "02",
            "title": "Analizzo entro 24h lavorative",
            "description": "Verifico i 5 punti, faccio screenshot, registro il video. Se mi serve qualche dettaglio in più ti chiedo."
          },
          {
            "id": "deliver",
            "number": "03",
            "title": "Ti mando il report",
            "description": "Video + checklist via WhatsApp o email. Lo guardi, decidi tu se sistemare in autonomia, con qualcun altro o con me. Nessuna pressione."
          }
        ]
      },
      "faq": {
        "label": "Domande frequenti",
        "title": "Risposte alle domande sensate.",
        "items": [
          {
            "id": "really-free",
            "question": "È davvero gratis? Dov'è la fregatura?",
            "answer": "È davvero gratis. La fregatura non c'è. Faccio audit perché spesso uno o due dei problemi che trovo sono perfetti per uno dei miei pacchetti — ma non te lo vendo a forza. Se decidi di sistemare con qualcun altro, o di farlo tu, mi va benissimo. È marketing onesto."
          },
          {
            "id": "no-website",
            "question": "E se non ho ancora un sito?",
            "answer": "Allora salta l'audit e scrivimi direttamente: parliamo di cosa serve davvero alla tua attività. La prima call è comunque gratuita."
          },
          {
            "id": "wp",
            "question": "Ho un sito WordPress: lo guardi lo stesso?",
            "answer": "Sì. WordPress, Wix, Squarespace, Shopify, custom — non importa la tecnologia. L'audit valuta cosa vede il visitatore, non come è costruito sotto."
          },
          {
            "id": "obligation",
            "question": "Sono obbligato a comprare qualcosa dopo?",
            "answer": "No. Mai. Se anche dopo l'audit decidi che non sei pronto a sistemare nulla, va benissimo. Sei libero di tornare quando ti serve."
          },
          {
            "id": "speed",
            "question": "Davvero in 24 ore?",
            "answer": "24h lavorative dal momento in cui ricevo l'URL. Se mando l'audit di venerdì sera, può arrivare lunedì. Se sono in vacanza te lo dico subito e ti do una data realistica."
          }
        ]
      },
      "finalCta": {
        "title": "Pronto a vedere cosa il tuo sito non ti sta dicendo?",
        "subtitle": "Mandami l'URL ora. Tra 24 ore hai più chiarezza di quanta ne hai oggi — comunque vada.",
        "primaryLabel": "Mandami il mio URL su WhatsApp",
        "primaryHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20vorrei%20l'audit%20gratuito%20del%20mio%20sito.%20URL%3A%20",
        "secondaryLabel": "Preferisco via email",
        "secondaryHref": "mailto:hassan.akkari01@gmail.com?subject=Audit+gratuito+del+mio+sito&body=Ciao+Hassan%2C+vorrei+l%27audit+gratuito+del+mio+sito.%0A%0AURL+del+sito%3A+%0ANote%3A+"
      },
      "backToHome": "← Torna alla homepage"
    },
    "en": {
      "seoTitle": "Free site audit · Hassan Akkari",
      "seoDescription": "Your site is losing customers without you knowing. In 24h I'll tell you why — free, no commitment, no disguised sales call.",
      "badge": "Lead magnet — free",
      "hero": {
        "title": "Your site is losing customers without you knowing. I'll tell you why in 24h — free.",
        "subtitle": "Send me your site URL on WhatsApp. Within 24 business hours you receive a 5-point analysis, the 3 things to fix immediately, and a cost/priority estimate. No disguised sales call: read the report and do whatever you want with it.",
        "primaryCtaLabel": "I want the free audit",
        "primaryCtaHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I'd%20like%20the%20free%20audit%20of%20my%20site.%20URL%3A%20",
        "secondaryCtaLabel": "Send me an email",
        "secondaryCtaHref": "mailto:hassan.akkari01@gmail.com?subject=Free+audit+of+my+site&body=Hi+Hassan%2C+I%27d+like+the+free+audit+of+my+site.%0A%0ASite+URL%3A+%0ANotes%3A+",
        "guarantee": [
          "✓ Reply within 24 business hours",
          "✓ No commitment, no disguised sales call",
          "✓ No automatic upselling"
        ]
      },
      "checkpoints": {
        "label": "What I check",
        "title": "The 5 things that drive your visitors away without you noticing.",
        "items": [
          {
            "id": "first-impression",
            "title": "Design and first impression",
            "description": "The first 3 seconds decide if the visitor stays or leaves. We figure out what your site is actually saying at first glance."
          },
          {
            "id": "mobile",
            "title": "Mobile experience",
            "description": "60-70% of your traffic comes from phones. I check responsive, readability, finger-on-button, and everything currently breaking the experience."
          },
          {
            "id": "performance",
            "title": "Performance and speed",
            "description": "Real Core Web Vitals (LCP, CLS, INP). Every extra second of load time costs you visitors and Google ranking."
          },
          {
            "id": "seo",
            "title": "Basic technical SEO",
            "description": "Title, meta description, semantic structure, sitemap, structured data. The minimum that's often missing even on recently rebuilt sites."
          },
          {
            "id": "conversion",
            "title": "CTAs and conversion flows",
            "description": "What does the visitor do to contact you? How many taps? Do they understand within 5 seconds what you offer and how to book? This is usually where leads die."
          }
        ]
      },
      "deliverable": {
        "label": "What you get",
        "title": "A concrete report, readable in 10 minutes.",
        "items": [
          "A 4-6 minute recorded video walking through your site and pointing out the issues",
          "Top 3 most urgent things to fix right away",
          "Cost and priority guidance (what to do first, what can wait)",
          "Optional 20-minute free call if you want to dig deeper"
        ]
      },
      "process": {
        "label": "How it works",
        "title": "Three steps. No endless forms.",
        "steps": [
          {
            "id": "send-url",
            "number": "01",
            "title": "You send me the URL on WhatsApp",
            "description": "One message with your site link (and a line on what you do, if you want). That's it — no form, no signup."
          },
          {
            "id": "analyze",
            "number": "02",
            "title": "I analyse within 24 business hours",
            "description": "I check the 5 points, take screenshots, record the video. If I need extra detail, I'll ask."
          },
          {
            "id": "deliver",
            "number": "03",
            "title": "I send you the report",
            "description": "Video + checklist via WhatsApp or email. You watch it and decide whether to fix things yourself, with someone else, or with me. No pressure."
          }
        ]
      },
      "faq": {
        "label": "Frequently asked questions",
        "title": "Answers to the sensible questions.",
        "items": [
          {
            "id": "really-free",
            "question": "Is it really free? Where's the catch?",
            "answer": "It really is free. There's no catch. I run audits because often one or two issues I find fit one of my packages perfectly — but I don't push them. If you decide to fix things with someone else, or yourself, that's fine by me. It's honest marketing."
          },
          {
            "id": "no-website",
            "question": "What if I don't have a site yet?",
            "answer": "Skip the audit and message me directly: we'll talk about what your business actually needs. The first call is free anyway."
          },
          {
            "id": "wp",
            "question": "I have a WordPress site — will you look at it?",
            "answer": "Yes. WordPress, Wix, Squarespace, Shopify, custom — the technology doesn't matter. The audit looks at what visitors see, not how it's built underneath."
          },
          {
            "id": "obligation",
            "question": "Am I forced to buy something afterwards?",
            "answer": "No. Never. If after the audit you decide you're not ready to fix anything, that's fine. You can come back when you need to."
          },
          {
            "id": "speed",
            "question": "Really 24 hours?",
            "answer": "24 business hours from when I receive the URL. If you send the audit on a Friday evening, it might land on Monday. If I'm on holiday I'll tell you immediately and give you a realistic date."
          }
        ]
      },
      "finalCta": {
        "title": "Ready to see what your site isn't telling you?",
        "subtitle": "Send me the URL now. In 24 hours you'll have more clarity than you do today — whatever you decide to do with it.",
        "primaryLabel": "Send my URL on WhatsApp",
        "primaryHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I'd%20like%20the%20free%20audit%20of%20my%20site.%20URL%3A%20",
        "secondaryLabel": "I prefer email",
        "secondaryHref": "mailto:hassan.akkari01@gmail.com?subject=Free+audit+of+my+site&body=Hi+Hassan%2C+I%27d+like+the+free+audit+of+my+site.%0A%0ASite+URL%3A+%0ANotes%3A+"
      },
      "backToHome": "← Back to homepage"
    },
    "fr": {
      "seoTitle": "Audit gratuit de votre site · Hassan Akkari",
      "seoDescription": "Votre site perd des clients sans que vous le sachiez. En 24h je vous dis pourquoi — gratuit, sans engagement, sans appel commercial déguisé.",
      "badge": "Lead magnet — gratuit",
      "hero": {
        "title": "Votre site perd des clients sans que vous le sachiez. Je vous dis pourquoi en 24h — gratuit.",
        "subtitle": "Envoyez-moi l'URL de votre site sur WhatsApp. Sous 24h ouvrées vous recevez une analyse en 5 points, les 3 choses à corriger tout de suite, et une estimation des coûts et priorités. Pas d'appel commercial déguisé : lisez le rapport et faites-en ce que vous voulez.",
        "primaryCtaLabel": "Je veux l'audit gratuit",
        "primaryCtaHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20je%20voudrais%20l'audit%20gratuit%20de%20mon%20site.%20URL%20%3A%20",
        "secondaryCtaLabel": "Envoyez-moi un mail",
        "secondaryCtaHref": "mailto:hassan.akkari01@gmail.com?subject=Audit+gratuit+de+mon+site&body=Bonjour+Hassan%2C+je+voudrais+l%27audit+gratuit+de+mon+site.%0A%0AURL+du+site+%3A+%0ANotes+%3A+",
        "guarantee": [
          "✓ Réponse sous 24h ouvrées",
          "✓ Zéro engagement, zéro appel commercial déguisé",
          "✓ Pas d'upselling automatique"
        ]
      },
      "checkpoints": {
        "label": "Ce que je vérifie",
        "title": "Les 5 points qui font fuir un visiteur sans que vous le sachiez.",
        "items": [
          {
            "id": "first-impression",
            "title": "Design et première impression",
            "description": "Les 3 premières secondes décident si le visiteur reste ou part. On comprend ce que votre site dit vraiment au premier coup d'œil."
          },
          {
            "id": "mobile",
            "title": "Expérience mobile",
            "description": "60-70% de votre trafic vient du mobile. Je vérifie le responsive, la lisibilité, les boutons tappables et tout ce qui casse l'expérience aujourd'hui."
          },
          {
            "id": "performance",
            "title": "Performance et vitesse",
            "description": "Core Web Vitals réels (LCP, CLS, INP). Chaque seconde de chargement en plus vous coûte des visiteurs et du positionnement Google."
          },
          {
            "id": "seo",
            "title": "SEO technique de base",
            "description": "Title, meta description, structure sémantique, sitemap, données structurées. Le minimum souvent absent même sur des sites refaits récemment."
          },
          {
            "id": "conversion",
            "title": "CTA et parcours de conversion",
            "description": "Que doit faire le visiteur pour vous contacter ? Combien de taps ? Comprend-il en 5 secondes ce que vous offrez et comment réserver ? C'est souvent là qu'on perd les contacts."
          }
        ]
      },
      "deliverable": {
        "label": "Ce que vous recevez",
        "title": "Un rapport concret, lisible en 10 minutes.",
        "items": [
          "Une vidéo enregistrée de 4-6 minutes où je passe sur votre site et pointe les problèmes",
          "Top 3 des choses les plus urgentes à corriger tout de suite",
          "Indication des coûts et des priorités (quoi faire d'abord, quoi peut attendre)",
          "Appel gratuit de 20 min en option, si vous voulez approfondir"
        ]
      },
      "process": {
        "label": "Comment ça marche",
        "title": "Trois étapes. Pas de formulaires interminables.",
        "steps": [
          {
            "id": "send-url",
            "number": "01",
            "title": "Vous m'envoyez l'URL sur WhatsApp",
            "description": "Un message avec le lien de votre site (et une ligne sur votre activité, si vous voulez). C'est tout — pas de formulaire, pas d'inscription."
          },
          {
            "id": "analyze",
            "number": "02",
            "title": "J'analyse sous 24h ouvrées",
            "description": "Je vérifie les 5 points, je fais des captures, j'enregistre la vidéo. Si j'ai besoin de plus de détails, je vous demande."
          },
          {
            "id": "deliver",
            "number": "03",
            "title": "Je vous envoie le rapport",
            "description": "Vidéo + checklist par WhatsApp ou email. Vous regardez, vous décidez si vous corrigez seul, avec quelqu'un d'autre ou avec moi. Aucune pression."
          }
        ]
      },
      "faq": {
        "label": "Questions fréquentes",
        "title": "Réponses aux questions sensées.",
        "items": [
          {
            "id": "really-free",
            "question": "C'est vraiment gratuit ? Où est l'arnaque ?",
            "answer": "C'est vraiment gratuit. Il n'y a pas d'arnaque. Je fais des audits parce que souvent un ou deux des problèmes que je trouve correspondent parfaitement à un de mes forfaits — mais je ne vous le force pas. Si vous décidez de corriger avec quelqu'un d'autre, ou seul, ça me va. C'est du marketing honnête."
          },
          {
            "id": "no-website",
            "question": "Et si je n'ai pas encore de site ?",
            "answer": "Sautez l'audit et écrivez-moi directement : on parle de ce dont votre activité a vraiment besoin. Le premier appel est gratuit de toute façon."
          },
          {
            "id": "wp",
            "question": "J'ai un site WordPress — vous le regardez quand même ?",
            "answer": "Oui. WordPress, Wix, Squarespace, Shopify, custom — la techno n'a pas d'importance. L'audit regarde ce que voit le visiteur, pas comment c'est construit dessous."
          },
          {
            "id": "obligation",
            "question": "Suis-je obligé d'acheter quelque chose après ?",
            "answer": "Non. Jamais. Si après l'audit vous décidez que vous n'êtes pas prêt à corriger quoi que ce soit, c'est ok. Vous pouvez revenir quand vous en aurez besoin."
          },
          {
            "id": "speed",
            "question": "Vraiment 24h ?",
            "answer": "24h ouvrées à partir de la réception de l'URL. Si vous envoyez l'audit un vendredi soir, il peut arriver lundi. Si je suis en vacances, je vous le dis tout de suite et je vous donne une date réaliste."
          }
        ]
      },
      "finalCta": {
        "title": "Prêt à voir ce que votre site ne vous dit pas ?",
        "subtitle": "Envoyez l'URL maintenant. Dans 24 heures vous y verrez plus clair qu'aujourd'hui — quelle que soit votre décision.",
        "primaryLabel": "Envoyer mon URL sur WhatsApp",
        "primaryHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20je%20voudrais%20l'audit%20gratuit%20de%20mon%20site.%20URL%20%3A%20",
        "secondaryLabel": "Je préfère par email",
        "secondaryHref": "mailto:hassan.akkari01@gmail.com?subject=Audit+gratuit+de+mon+site&body=Bonjour+Hassan%2C+je+voudrais+l%27audit+gratuit+de+mon+site.%0A%0AURL+du+site+%3A+%0ANotes+%3A+"
      },
      "backToHome": "← Retour à l'accueil"
    }
  }
}
```

### apps/docs/src/data/caseStudies.ts


```json
{
  "caseStudiesContent": {
    "it": {
      "sectionLabel": "Progetti e case study",
      "title": "Cose che ho costruito davvero, raccontate per intero.",
      "subtitle": "Su alcuni progetti ho NDA: ti racconto problema, soluzione e risultato senza tirare fuori screenshot riservati.",
      "labels": {
        "problem": "Problema",
        "solution": "Cosa ho fatto",
        "result": "Risultato",
        "stack": "Stack",
        "proves": "Cosa dimostra"
      },
      "caseStudies": [
        {
          "id": "sibylla-network",
          "title": "Sibylla Network — UI standards e flussi core",
          "context": "Prodotto enterprise complesso con team distribuito e moduli multipli. Codebase legacy con regole UI sparpagliate.",
          "problem": "Componenti duplicati, convenzioni diverse tra moduli, regressioni frequenti al rilascio. Ogni nuova feature costava più del previsto.",
          "solution": [
            "Introdotto standard UI condivisi (classi, stili, naming) riusati dal team",
            "Refactoring di flussi core (booking, catalogo, checkout) in React + Redux Toolkit",
            "Pattern riutilizzabili che hanno reso più prevedibile la consegna"
          ],
          "stack": [
            "React",
            "TypeScript",
            "Redux Toolkit",
            "REST APIs",
            "Tailwind CSS"
          ],
          "result": [
            "UI più coerente tra moduli",
            "Meno regressioni al rilascio",
            "Meno tempo perso a discutere convenzioni durante le PR"
          ],
          "proves": "So portare ordine in codebase grandi e già in produzione, senza riscriverle da zero."
        },
        {
          "id": "bootstrap-tailwind",
          "title": "Migrazione Bootstrap → Tailwind",
          "context": "Applicazione web costruita su Bootstrap + componenti vendor con anni di patch addosso. Layout incoerenti tra pagine simili.",
          "problem": "Cambiare uno stile rompeva pagine in posti imprevisti. Velocità di iterazione bassa, ogni piccola modifica richiedeva controlli manuali su decine di schermate.",
          "solution": [
            "Audit dei componenti realmente usati e di quelli morti",
            "Migrazione progressiva pagina-per-pagina, senza freezare la roadmap",
            "Costruito un set di pattern Tailwind riutilizzabili (card, form, layout, button)"
          ],
          "stack": [
            "Tailwind CSS",
            "Component refactor",
            "UI standards",
            "CSS architecture"
          ],
          "result": [
            "Layout coerenti tra pagine simili",
            "Iterazione UI più veloce per il team",
            "Dipendenze vendor ridotte e più controllo sul design system"
          ],
          "proves": "Posso modernizzare un sito esistente senza buttare via tutto il lavoro fatto prima."
        },
        {
          "id": "booking-checkout",
          "title": "Booking + checkout MVP (Next.js)",
          "context": "Progetto interno di laboratorio per validare un flusso di prenotazione/pagamento end-to-end con regole di prezzo reali.",
          "problem": "Serviva un riferimento concreto per mostrare come gestisco un flusso che mescola listing, dettaglio, carrello, checkout, gate di accesso e regole di sconto.",
          "solution": [
            "Architettura Next.js App Router con Server Actions e Route Handlers",
            "Motore di prezzo con promo code, fasce a persona / minimo gruppo, IVA e service fee",
            "Gate di accesso al checkout con redirect puliti e idempotenza ordini",
            "Validazione con Zod e test su pricing/sessione/ordini"
          ],
          "stack": [
            "Next.js",
            "TypeScript",
            "Server Actions",
            "Zod",
            "Vitest"
          ],
          "result": [
            "Flusso completo navigabile in locale dal browse al checkout",
            "Codice testato sui punti critici (pricing, idempotency, redirect)",
            "Base riutilizzabile per progetti reali di prenotazione/booking"
          ],
          "proves": "So gestire flussi tecnici complessi (pagamenti, regole di prezzo, sessioni) con codice pulito e testato, non solo siti vetrina."
        }
      ]
    },
    "en": {
      "sectionLabel": "Projects & case studies",
      "title": "Things I actually built, told end to end.",
      "subtitle": "Some projects are under NDA: I'll walk you through problem, solution and outcome without leaking confidential screenshots.",
      "labels": {
        "problem": "Problem",
        "solution": "What I did",
        "result": "Result",
        "stack": "Stack",
        "proves": "What it proves"
      },
      "caseStudies": [
        {
          "id": "sibylla-network",
          "title": "Sibylla Network — UI standards and core flows",
          "context": "Complex enterprise product with a distributed team and multiple modules. Legacy codebase with scattered UI rules.",
          "problem": "Duplicated components, different conventions across modules, frequent release regressions. Every new feature cost more than expected.",
          "solution": [
            "Introduced shared UI standards (classes, styles, naming) reused by the team",
            "Refactored core flows (booking, catalog, checkout) in React + Redux Toolkit",
            "Reusable patterns that made delivery more predictable"
          ],
          "stack": [
            "React",
            "TypeScript",
            "Redux Toolkit",
            "REST APIs",
            "Tailwind CSS"
          ],
          "result": [
            "More consistent UI across modules",
            "Fewer release regressions",
            "Less time wasted debating conventions on PRs"
          ],
          "proves": "I can bring order to large, in-production codebases without rewriting them from scratch."
        },
        {
          "id": "bootstrap-tailwind",
          "title": "Bootstrap → Tailwind migration",
          "context": "Web app built on Bootstrap + vendor components with years of patches on top. Inconsistent layouts across similar pages.",
          "problem": "Changing one style broke pages in unrelated places. Low iteration speed — every tiny change required manual checks across dozens of screens.",
          "solution": [
            "Audit of which components were actually used vs dead",
            "Progressive page-by-page migration without freezing the roadmap",
            "Built a set of reusable Tailwind patterns (card, form, layout, button)"
          ],
          "stack": [
            "Tailwind CSS",
            "Component refactor",
            "UI standards",
            "CSS architecture"
          ],
          "result": [
            "Consistent layouts across similar pages",
            "Faster UI iteration for the team",
            "Reduced vendor dependencies and more control over the design system"
          ],
          "proves": "I can modernise an existing site without throwing away the work already done."
        },
        {
          "id": "booking-checkout",
          "title": "Booking + checkout MVP (Next.js)",
          "context": "Internal lab project to validate an end-to-end booking/payment flow with real pricing rules.",
          "problem": "I needed a concrete reference to show how I handle a flow mixing listing, detail, cart, checkout, access gate, and discount rules.",
          "solution": [
            "Next.js App Router architecture with Server Actions and Route Handlers",
            "Pricing engine with promo codes, per-person / minimum-group tiers, VAT, and service fee",
            "Access gate on checkout with clean redirects and order idempotency",
            "Zod validation and tests on pricing/session/orders"
          ],
          "stack": [
            "Next.js",
            "TypeScript",
            "Server Actions",
            "Zod",
            "Vitest"
          ],
          "result": [
            "Full flow navigable locally from browse to checkout",
            "Code tested on critical points (pricing, idempotency, redirect)",
            "Reusable base for real booking projects"
          ],
          "proves": "I can handle complex technical flows (payments, pricing rules, sessions) with clean and tested code — not just brochure sites."
        }
      ]
    },
    "fr": {
      "sectionLabel": "Projets & case studies",
      "title": "Des choses que j'ai vraiment construites, racontées de bout en bout.",
      "subtitle": "Certains projets sont sous NDA : je vous explique problème, solution et résultat sans sortir de captures confidentielles.",
      "labels": {
        "problem": "Problème",
        "solution": "Ce que j'ai fait",
        "result": "Résultat",
        "stack": "Stack",
        "proves": "Ce que ça prouve"
      },
      "caseStudies": [
        {
          "id": "sibylla-network",
          "title": "Sibylla Network — standards UI et flux core",
          "context": "Produit enterprise complexe avec équipe distribuée et modules multiples. Codebase legacy avec règles UI dispersées.",
          "problem": "Composants dupliqués, conventions différentes entre modules, régressions fréquentes en release. Chaque nouvelle feature coûtait plus que prévu.",
          "solution": [
            "Introduit des standards UI partagés (classes, styles, naming) réutilisés par l'équipe",
            "Refactor des flux core (booking, catalogue, checkout) en React + Redux Toolkit",
            "Patterns réutilisables qui ont rendu la livraison plus prévisible"
          ],
          "stack": [
            "React",
            "TypeScript",
            "Redux Toolkit",
            "REST APIs",
            "Tailwind CSS"
          ],
          "result": [
            "UI plus cohérente entre modules",
            "Moins de régressions en release",
            "Moins de temps perdu à débattre des conventions en PR"
          ],
          "proves": "Je sais mettre de l'ordre dans des codebases grands et déjà en production, sans tout réécrire."
        },
        {
          "id": "bootstrap-tailwind",
          "title": "Migration Bootstrap → Tailwind",
          "context": "Application web construite sur Bootstrap + composants vendor avec des années de patches. Layouts incohérents entre pages similaires.",
          "problem": "Changer un style cassait des pages à des endroits inattendus. Vitesse d'itération basse, chaque petite modif demandait des checks manuels sur des dizaines d'écrans.",
          "solution": [
            "Audit des composants réellement utilisés vs morts",
            "Migration progressive page par page sans freezer la roadmap",
            "Set de patterns Tailwind réutilisables (card, form, layout, button)"
          ],
          "stack": [
            "Tailwind CSS",
            "Component refactor",
            "UI standards",
            "CSS architecture"
          ],
          "result": [
            "Layouts cohérents entre pages similaires",
            "Itération UI plus rapide pour l'équipe",
            "Dépendances vendor réduites et plus de contrôle sur le design system"
          ],
          "proves": "Je peux moderniser un site existant sans jeter le travail déjà fait."
        },
        {
          "id": "booking-checkout",
          "title": "Booking + checkout MVP (Next.js)",
          "context": "Projet labo interne pour valider un flux réservation/paiement end-to-end avec de vraies règles de prix.",
          "problem": "Il me fallait une référence concrète pour montrer comment je gère un flux mêlant listing, détail, panier, checkout, gate d'accès et règles de remise.",
          "solution": [
            "Architecture Next.js App Router avec Server Actions et Route Handlers",
            "Moteur de prix avec promo codes, tarifs par personne / minimum groupe, TVA et frais de service",
            "Gate d'accès au checkout avec redirects propres et idempotence des commandes",
            "Validation Zod et tests sur pricing/session/orders"
          ],
          "stack": [
            "Next.js",
            "TypeScript",
            "Server Actions",
            "Zod",
            "Vitest"
          ],
          "result": [
            "Flux complet navigable en local du browse au checkout",
            "Code testé sur les points critiques (pricing, idempotence, redirect)",
            "Base réutilisable pour de vrais projets de réservation"
          ],
          "proves": "Je gère des flux techniques complexes (paiements, règles de prix, sessions) avec du code propre et testé — pas juste des sites vitrine."
        }
      ]
    }
  }
}
```

### apps/docs/src/data/faqs.ts


```json
{
  "faqsContent": {
    "it": {
      "sectionLabel": "Domande frequenti",
      "title": "Le cose che mi chiedono prima di iniziare. Risposte dirette.",
      "outro": {
        "prefix": "Hai un'altra domanda? ",
        "linkLabel": "Scrivimi su WhatsApp",
        "suffix": ", rispondo entro 24h."
      },
      "whatsappMessage": "Ciao Hassan, ho una domanda sul tuo lavoro prima di partire con un progetto.",
      "faqs": [
        {
          "id": "wordpress",
          "question": "Perché non WordPress? Mi avevano detto che costa meno e va bene uguale.",
          "answer": "WordPress va benissimo per un blog o un sito vetrina molto semplice. Ma su qualsiasi cosa un po' personalizzata, finisci a pagare 4-5 plugin a pagamento all'anno, performance scadenti su mobile, e un dev a ore ogni volta che vuoi cambiare qualcosa. Io faccio siti più veloci, più sicuri, e che restano tuoi al 100%."
        },
        {
          "id": "price",
          "question": "Quanto costa davvero un sito?",
          "answer": "Dipende dal tipo. Una landing parte da 600 €, un sito completo da 1.500 €, una web app/MVP da 3.500 €. Sono prezzi indicativi: dopo la prima call ti faccio un preventivo scritto, fisso, senza sorprese."
        },
        {
          "id": "timeline",
          "question": "In quanto tempo è online?",
          "answer": "Una landing in 5-7 giorni. Un sito completo in 2-3 settimane. Una web app/MVP in 4-8 settimane. I tempi partono da quando ho i contenuti (testi, foto, logo). Se non li hai ancora, ne parliamo insieme."
        },
        {
          "id": "content",
          "question": "I testi e le foto chi li mette?",
          "answer": "Possiamo fare a metà strada. Se hai già i testi, li sistemo io insieme a te. Se non li hai, ti faccio una traccia di domande a cui rispondi in chat o in voice, e li riscrivo io. Foto: o le hai tu, o ti consiglio dove prenderle (Unsplash, Pexels) o un fotografo locale."
        },
        {
          "id": "what-after",
          "question": "E dopo che il sito è online, mi lasci da solo?",
          "answer": "No. Resto reperibile su WhatsApp/email per piccoli fix e dubbi. Se vuoi un'evolutiva (sezione nuova, blog, integrazione) ti faccio un preventivo separato. Niente abbonamenti annuali forzati per scrivere due righe."
        },
        {
          "id": "host",
          "question": "L'hosting e il dominio sono inclusi?",
          "answer": "Il dominio (~15 €/anno) e l'hosting (spesso 0 € su Vercel per siti vetrina) li paghi tu, sui tuoi account, così resti sempre proprietario. Io li configuro insieme a te durante il setup. Niente trucchi tipo 'il dominio è mio finché paghi il canone'."
        },
        {
          "id": "seo",
          "question": "Mi farai trovare su Google?",
          "answer": "Faccio SEO tecnica base inclusa: title corretti, meta description, struttura semantica, performance, sitemap, mobile-first. Per posizionarti su query competitive serve lavoro continuativo (contenuti, backlink): se ti serve, ti dico chiaramente cosa fare e quanto costa, anche se non lo faccio io."
        },
        {
          "id": "remote",
          "question": "Lavori solo a Roma o anche fuori?",
          "answer": "Sono a Roma, ma lavoro 100% online con tutta Italia (e all'estero). Call su Meet/WhatsApp, condivisione anteprime via link, scambio file via Drive/Notion. Se sei a Roma e vuoi vederci di persona, si può fare."
        },
        {
          "id": "guarantee",
          "question": "E se non sono soddisfatto del risultato?",
          "answer": "Lavoriamo per step con anteprime continue: se qualcosa non ti convince lo dici subito, non a fine progetto. Sui pacchetti landing/sito sono incluse 2 revisioni di design e 1 di copy. Sulle web app definiamo insieme i milestone, e ognuno è approvato prima di passare al successivo."
        }
      ]
    },
    "en": {
      "sectionLabel": "Frequently asked questions",
      "title": "The things people ask me before starting. Direct answers.",
      "outro": {
        "prefix": "Got another question? ",
        "linkLabel": "Message me on WhatsApp",
        "suffix": ", I reply within 24h."
      },
      "whatsappMessage": "Hi Hassan, I have a question about how you work before kicking off a project.",
      "faqs": [
        {
          "id": "wordpress",
          "question": "Why not WordPress? People told me it's cheaper and just as good.",
          "answer": "WordPress is fine for a simple blog or brochure site. But for anything even slightly customised, you end up paying 4-5 paid plugins a year, poor mobile performance, and a dev by the hour every time you want to change something. My sites are faster, safer, and stay 100% yours."
        },
        {
          "id": "price",
          "question": "How much does a site really cost?",
          "answer": "Depends on the type. A landing page starts at €600, a full site at €1,500, a web app/MVP at €3,500. These are indicative — after our first call I send you a written, fixed quote with no surprises."
        },
        {
          "id": "timeline",
          "question": "How long until it's live?",
          "answer": "A landing in 5-7 days. A full site in 2-3 weeks. A web app/MVP in 4-8 weeks. Timelines start when I have the content (copy, photos, logo). If you don't have them yet, we figure it out together."
        },
        {
          "id": "content",
          "question": "Who provides the copy and photos?",
          "answer": "We meet halfway. If you have the copy, I tidy it up with you. If you don't, I send you a list of questions you answer by text or voice, and I write it for you. Photos: yours, or I recommend where to grab them (Unsplash, Pexels) or a local photographer."
        },
        {
          "id": "what-after",
          "question": "After the site is live, do you leave me alone?",
          "answer": "No. I stay reachable on WhatsApp/email for small fixes and questions. If you want an evolution (new section, blog, integration), I send you a separate quote. No yearly subscription just to change two lines."
        },
        {
          "id": "host",
          "question": "Are hosting and domain included?",
          "answer": "Domain (~€15/year) and hosting (often €0 on Vercel for brochure sites) are paid by you, on your accounts — so you always stay the owner. I help you set them up. No tricks like 'the domain is mine as long as you pay the fee'."
        },
        {
          "id": "seo",
          "question": "Will you get me ranked on Google?",
          "answer": "Basic technical SEO is included: correct titles, meta descriptions, semantic structure, performance, sitemap, mobile-first. To rank on competitive queries you need ongoing work (content, backlinks): if you need it, I'll tell you clearly what it takes and what it costs — even if I'm not the one doing it."
        },
        {
          "id": "remote",
          "question": "Do you only work in Rome?",
          "answer": "I'm based in Rome but I work 100% online with clients across Italy (and abroad). Calls on Meet/WhatsApp, preview links, file sharing via Drive/Notion. If you're in Rome and want to meet in person, we can."
        },
        {
          "id": "guarantee",
          "question": "What if I'm not happy with the result?",
          "answer": "We work step by step with continuous previews: if something doesn't convince you, you tell me right away — not at the end. Landing/site packages include 2 design revisions and 1 copy revision. For web apps we agree on milestones, each approved before moving forward."
        }
      ]
    },
    "fr": {
      "sectionLabel": "Questions fréquentes",
      "title": "Ce qu'on me demande avant de démarrer. Réponses directes.",
      "outro": {
        "prefix": "Une autre question ? ",
        "linkLabel": "Écrivez-moi sur WhatsApp",
        "suffix": ", je réponds sous 24h."
      },
      "whatsappMessage": "Bonjour Hassan, j'ai une question sur votre façon de travailler avant de démarrer un projet.",
      "faqs": [
        {
          "id": "wordpress",
          "question": "Pourquoi pas WordPress ? On m'a dit que c'est moins cher et que ça suffit.",
          "answer": "WordPress convient très bien pour un blog ou un site vitrine très simple. Mais dès que c'est un peu personnalisé, vous finissez par payer 4-5 plugins payants par an, des performances mobiles médiocres, et un dev à l'heure à chaque changement. Mes sites sont plus rapides, plus sûrs, et restent 100% à vous."
        },
        {
          "id": "price",
          "question": "Combien coûte vraiment un site ?",
          "answer": "Ça dépend du type. Une landing à partir de 600 €, un site complet à partir de 1 500 €, une web app/MVP à partir de 3 500 €. Ce sont des prix indicatifs : après le premier appel je vous envoie un devis écrit, fixe, sans surprises."
        },
        {
          "id": "timeline",
          "question": "En combien de temps le site est en ligne ?",
          "answer": "Une landing en 5-7 jours. Un site complet en 2-3 semaines. Une web app/MVP en 4-8 semaines. Les délais démarrent quand j'ai le contenu (textes, photos, logo). Si vous ne l'avez pas encore, on en parle ensemble."
        },
        {
          "id": "content",
          "question": "Qui fournit les textes et les photos ?",
          "answer": "On fait moitié-moitié. Si vous avez les textes, je les retravaille avec vous. Sinon, je vous envoie une liste de questions auxquelles vous répondez par chat ou vocaux, et je les rédige. Photos : les vôtres, ou je vous indique où les prendre (Unsplash, Pexels) ou un photographe local."
        },
        {
          "id": "what-after",
          "question": "Une fois le site en ligne, vous me laissez seul ?",
          "answer": "Non. Je reste joignable sur WhatsApp/email pour les petites corrections et les doutes. Si vous voulez une évolution (nouvelle section, blog, intégration), je vous fais un devis séparé. Pas d'abonnement annuel forcé pour changer deux lignes."
        },
        {
          "id": "host",
          "question": "L'hébergement et le domaine sont inclus ?",
          "answer": "Le domaine (~15 €/an) et l'hébergement (souvent 0 € sur Vercel pour des sites vitrine) sont payés par vous, sur vos comptes — vous restez toujours propriétaire. Je vous accompagne pour la configuration. Pas de combine du genre 'le domaine est à moi tant que tu payes la redevance'."
        },
        {
          "id": "seo",
          "question": "Vous allez me faire trouver sur Google ?",
          "answer": "Le SEO technique de base est inclus : titres corrects, meta descriptions, structure sémantique, performance, sitemap, mobile-first. Pour vous positionner sur des requêtes concurrentielles il faut un travail continu (contenu, backlinks) : si vous en avez besoin, je vous dis clairement ce qu'il faut et combien ça coûte — même si je ne le fais pas moi-même."
        },
        {
          "id": "remote",
          "question": "Vous travaillez seulement à Rome ?",
          "answer": "Je suis à Rome, mais je travaille 100% en ligne partout en Italie (et à l'étranger). Appels sur Meet/WhatsApp, aperçus partagés par lien, fichiers via Drive/Notion. Si vous êtes à Rome et voulez se voir en personne, c'est possible."
        },
        {
          "id": "guarantee",
          "question": "Et si je ne suis pas satisfait du résultat ?",
          "answer": "On travaille par étapes avec des aperçus continus : si quelque chose ne vous convainc pas, vous le dites tout de suite — pas à la fin. Les forfaits landing/site incluent 2 révisions de design et 1 de copy. Pour les web apps, on définit ensemble les milestones, chacun validé avant de passer au suivant."
        }
      ]
    }
  }
}
```

### apps/docs/src/data/finalCtaContent.ts


```json
{
  "finalCtaContent": {
    "it": {
      "title": "Non sai ancora se il tuo sito ti sta costando clienti?",
      "subtitle": "In 24h te lo dico — gratis, senza call vendita mascherata. Mandami l'URL, leggi il report, decidi tu cosa fare. Se non sono io la persona giusta, te lo scrivo dritto.",
      "auditLabel": "Voglio l'audit gratuito",
      "auditHref": "/audit",
      "whatsappLabel": "Scrivimi su WhatsApp",
      "whatsappHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20vorrei%20parlare%20di%20un%20progetto.%20Mi%20puoi%20richiamare%3F",
      "emailLabel": "Mandami una mail",
      "emailHref": "mailto:hassan.akkari01@gmail.com?subject=Richiesta+info&body=Ciao+Hassan%2C+",
      "footnote": "Rispondo entro 24h lavorative — hassan.akkari01@gmail.com — Roma, Italia"
    },
    "en": {
      "title": "Don't know if your site is costing you customers?",
      "subtitle": "In 24h I'll tell you — free, no disguised sales call. Send me the URL, read the report, decide what to do next. If I'm not the right person, I'll tell you straight.",
      "auditLabel": "I want the free audit",
      "auditHref": "/audit",
      "whatsappLabel": "Message me on WhatsApp",
      "whatsappHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I'd%20like%20to%20talk%20about%20a%20project.%20Can%20you%20get%20back%20to%20me%3F",
      "emailLabel": "Send me an email",
      "emailHref": "mailto:hassan.akkari01@gmail.com?subject=Quick+question&body=Hi+Hassan%2C+",
      "footnote": "I reply within 24 business hours — hassan.akkari01@gmail.com — Roma, Italia"
    },
    "fr": {
      "title": "Vous ne savez pas si votre site vous coûte des clients ?",
      "subtitle": "En 24h je vous le dis — gratuit, sans appel commercial déguisé. Envoyez-moi l'URL, lisez le rapport, décidez ensuite. Si je ne suis pas la bonne personne, je vous le dis franchement.",
      "auditLabel": "Je veux l'audit gratuit",
      "auditHref": "/audit",
      "whatsappLabel": "Écrivez-moi sur WhatsApp",
      "whatsappHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20je%20voudrais%20parler%20d'un%20projet.%20Pouvez-vous%20me%20recontacter%20%3F",
      "emailLabel": "Envoyez-moi un mail",
      "emailHref": "mailto:hassan.akkari01@gmail.com?subject=Demande+d%27info&body=Bonjour+Hassan%2C+",
      "footnote": "Je réponds sous 24h ouvrées — hassan.akkari01@gmail.com — Roma, Italia"
    }
  }
}
```

### apps/docs/src/data/heroContent.ts


```json
{
  "heroContent": {
    "it": {
      "badge": "Sviluppatore freelance per professionisti e piccole attività",
      "titleParts": {
        "before": "Creo siti e web app ",
        "accent": "puliti e veloci",
        "after": " che aiutano i professionisti a sembrare più credibili e ricevere più richieste."
      },
      "subtitle": "Aiuto professionisti, studi e piccole attività a trasformare siti vecchi, idee confuse e processi manuali in prodotti digitali chiari, curati e facili da usare.",
      "primaryCtaLabel": "Richiedi un audit gratuito",
      "primaryCtaHref": "/audit",
      "secondaryCtaLabel": "Vedi i case study",
      "secondaryCtaHref": "#case-studies",
      "guaranteeBullets": [
        "✓ Call introduttiva gratuita di 20 minuti",
        "✓ Preventivo scritto entro 48h",
        "✓ Prima versione online in 1–3 settimane"
      ],
      "portraitAlt": "Hassan Akkari, sviluppatore freelance",
      "proofCard": {
        "stats": [
          {
            "id": "experience",
            "value": "5+",
            "label": "anni nella creazione di interfacce web"
          },
          {
            "id": "response",
            "value": "24h",
            "label": "prima risposta tipica"
          },
          {
            "id": "no-tricks",
            "value": "0",
            "label": "call commerciali aggressive"
          }
        ],
        "quote": "Di giorno lavoro su prodotti enterprise. Porto la stessa cura nei progetti freelance selezionati — senza il sovrapprezzo di un'agenzia."
      }
    },
    "en": {
      "badge": "Freelance developer for professionals and small businesses",
      "titleParts": {
        "before": "I build ",
        "accent": "clean, fast",
        "after": " websites and web apps that help professionals look credible and get more enquiries."
      },
      "subtitle": "I help professionals, studios, and small businesses turn outdated websites, unclear ideas, and manual workflows into digital products that feel clear, polished, and easy to use.",
      "primaryCtaLabel": "Get a free audit",
      "primaryCtaHref": "/audit",
      "secondaryCtaLabel": "See case studies",
      "secondaryCtaHref": "#case-studies",
      "guaranteeBullets": [
        "✓ Free 20-minute intro call",
        "✓ Written quote within 48h",
        "✓ First version live in 1–3 weeks"
      ],
      "portraitAlt": "Hassan Akkari, freelance developer",
      "proofCard": {
        "stats": [
          {
            "id": "experience",
            "value": "5+",
            "label": "years building web interfaces"
          },
          {
            "id": "response",
            "value": "24h",
            "label": "typical first reply"
          },
          {
            "id": "no-tricks",
            "value": "0",
            "label": "pushy sales calls"
          }
        ],
        "quote": "I work on enterprise products by day and bring the same care to selected freelance projects — without agency markup."
      }
    },
    "fr": {
      "badge": "Développeur freelance pour professionnels et petites entreprises",
      "titleParts": {
        "before": "Je crée des sites web et des applications ",
        "accent": "rapides et soignés",
        "after": " qui aident les professionnels à paraître plus crédibles et à recevoir plus de demandes."
      },
      "subtitle": "J'aide les professionnels, les studios et les petites entreprises à transformer des sites dépassés, des idées floues et des processus manuels en produits digitaux clairs, soignés et faciles à utiliser.",
      "primaryCtaLabel": "Demander un audit gratuit",
      "primaryCtaHref": "/audit",
      "secondaryCtaLabel": "Voir les cas clients",
      "secondaryCtaHref": "#case-studies",
      "guaranteeBullets": [
        "✓ Appel découverte gratuit de 20 minutes",
        "✓ Devis écrit sous 48h",
        "✓ Première version en ligne en 1–3 semaines"
      ],
      "portraitAlt": "Hassan Akkari, développeur freelance",
      "proofCard": {
        "stats": [
          {
            "id": "experience",
            "value": "5+",
            "label": "ans à créer des interfaces web"
          },
          {
            "id": "response",
            "value": "24h",
            "label": "première réponse habituelle"
          },
          {
            "id": "no-tricks",
            "value": "0",
            "label": "appels commerciaux agressifs"
          }
        ],
        "quote": "Le jour, je travaille sur des produits enterprise. J'apporte le même niveau de soin aux projets freelance sélectionnés — sans la marge d'une agence."
      }
    }
  }
}
```

### apps/docs/src/data/nav.ts


```json
{
  "navContent": {
    "it": {
      "items": [
        {
          "href": "#services",
          "label": "Servizi"
        },
        {
          "href": "#case-studies",
          "label": "Progetti"
        },
        {
          "href": "#process",
          "label": "Come lavoro"
        },
        {
          "href": "#faq",
          "label": "FAQ"
        },
        {
          "href": "#cta",
          "label": "Contatti"
        }
      ],
      "audit": {
        "to": "/audit",
        "label": "Audit gratuito"
      },
      "whatsappLabel": "WhatsApp",
      "openMenuLabel": "Apri menu di navigazione",
      "closeMenuLabel": "Chiudi menu di navigazione"
    },
    "en": {
      "items": [
        {
          "href": "#services",
          "label": "Services"
        },
        {
          "href": "#case-studies",
          "label": "Projects"
        },
        {
          "href": "#process",
          "label": "How I work"
        },
        {
          "href": "#faq",
          "label": "FAQ"
        },
        {
          "href": "#cta",
          "label": "Contact"
        }
      ],
      "audit": {
        "to": "/audit",
        "label": "Free audit"
      },
      "whatsappLabel": "WhatsApp",
      "openMenuLabel": "Open navigation menu",
      "closeMenuLabel": "Close navigation menu"
    },
    "fr": {
      "items": [
        {
          "href": "#services",
          "label": "Services"
        },
        {
          "href": "#case-studies",
          "label": "Projets"
        },
        {
          "href": "#process",
          "label": "Méthode"
        },
        {
          "href": "#faq",
          "label": "FAQ"
        },
        {
          "href": "#cta",
          "label": "Contact"
        }
      ],
      "audit": {
        "to": "/audit",
        "label": "Audit gratuit"
      },
      "whatsappLabel": "WhatsApp",
      "openMenuLabel": "Ouvrir le menu de navigation",
      "closeMenuLabel": "Fermer le menu de navigation"
    }
  }
}
```

### apps/docs/src/data/problems.ts


```json
{
  "problemsContent": {
    "it": {
      "sectionLabel": "Problemi che risolvo",
      "title": "Riconosci uno di questi? Bene, è esattamente per questo che esisto.",
      "problems": [
        {
          "id": "old-site",
          "title": "Hai un sito vecchio che non ti rappresenta più",
          "description": "Lento, brutto sul telefono, copy generico. Lo apri davanti a un cliente e fai brutta figura."
        },
        {
          "id": "no-contacts",
          "title": "Il sito c'è ma non porta contatti",
          "description": "La gente lo apre, non capisce cosa offri, e se ne va. Niente CTA chiare, niente WhatsApp, niente form che funzioni."
        },
        {
          "id": "vague-idea",
          "title": "Hai un'idea per un sito o un'app ma non sai da dove partire",
          "description": "Hai capito che ti serve qualcosa, ma non sai se serve un sito, una landing, una web app o solo Instagram fatto meglio."
        },
        {
          "id": "wordpress-mess",
          "title": "Sei stanco di WordPress impacchettato come 'soluzione su misura'",
          "description": "Plugin che si rompono, template comprati, performance basse e qualcuno che ti chiede 50 € ogni volta che vuoi cambiare un titolo."
        },
        {
          "id": "scattered",
          "title": "La tua presenza online è sparpagliata e poco credibile",
          "description": "Un Instagram, un sito di 10 anni fa, un Facebook fermo. Quando qualcuno ti cerca su Google, non si fida."
        },
        {
          "id": "internal-tool",
          "title": "Gestisci ancora tutto via Excel e WhatsApp",
          "description": "Prenotazioni, clienti, schede, ordini. Funziona, ma ti porta via tempo e ti fa sembrare poco strutturato."
        }
      ]
    },
    "en": {
      "sectionLabel": "Problems I solve",
      "title": "Recognise yourself in any of these? Good — that's exactly why I exist.",
      "problems": [
        {
          "id": "old-site",
          "title": "You have an old site that no longer represents you",
          "description": "Slow, ugly on mobile, generic copy. You open it in front of a client and feel embarrassed."
        },
        {
          "id": "no-contacts",
          "title": "Your site exists but doesn't bring contacts",
          "description": "People open it, don't understand what you offer, and leave. No clear CTAs, no WhatsApp, no form that actually works."
        },
        {
          "id": "vague-idea",
          "title": "You have an idea for a site or an app but don't know where to start",
          "description": "You understand you need something, but can't tell if it's a site, a landing page, a web app, or just better Instagram."
        },
        {
          "id": "wordpress-mess",
          "title": "You're tired of WordPress sold as a 'custom solution'",
          "description": "Plugins that break, bought templates, poor performance, and someone charging you €50 every time you want to change a heading."
        },
        {
          "id": "scattered",
          "title": "Your online presence is scattered and not credible",
          "description": "An Instagram, a 10-year-old site, a stale Facebook. When someone Googles you, they don't trust what they see."
        },
        {
          "id": "internal-tool",
          "title": "You still run everything via Excel and WhatsApp",
          "description": "Bookings, clients, sheets, orders. It works, but it eats your time and makes you look unstructured."
        }
      ]
    },
    "fr": {
      "sectionLabel": "Problèmes que je résous",
      "title": "Vous vous reconnaissez ? Tant mieux — c'est exactement pour ça que j'existe.",
      "problems": [
        {
          "id": "old-site",
          "title": "Vous avez un vieux site qui ne vous représente plus",
          "description": "Lent, moche sur mobile, copy générique. Vous l'ouvrez devant un client et vous êtes gêné(e)."
        },
        {
          "id": "no-contacts",
          "title": "Le site existe mais ne ramène pas de contacts",
          "description": "Les visiteurs l'ouvrent, ne comprennent pas ce que vous offrez, et repartent. Pas de CTA clairs, pas de WhatsApp, pas de formulaire qui marche."
        },
        {
          "id": "vague-idea",
          "title": "Vous avez une idée de site ou d'app mais vous ne savez pas par où commencer",
          "description": "Vous savez qu'il vous faut quelque chose, mais vous ne savez pas si c'est un site, une landing, une web app ou juste un meilleur Instagram."
        },
        {
          "id": "wordpress-mess",
          "title": "Vous en avez marre de WordPress vendu comme 'solution sur mesure'",
          "description": "Plugins qui cassent, templates achetés, performances faibles, et quelqu'un qui demande 50 € à chaque fois que vous voulez changer un titre."
        },
        {
          "id": "scattered",
          "title": "Votre présence en ligne est dispersée et peu crédible",
          "description": "Un Instagram, un site d'il y a 10 ans, un Facebook abandonné. Quand quelqu'un vous cherche sur Google, il ne fait pas confiance."
        },
        {
          "id": "internal-tool",
          "title": "Vous gérez encore tout par Excel et WhatsApp",
          "description": "Réservations, clients, fiches, commandes. Ça marche, mais ça vous bouffe du temps et vous fait paraître peu structuré(e)."
        }
      ]
    }
  }
}
```

### apps/docs/src/data/processSteps.ts


```json
{
  "processContent": {
    "it": {
      "sectionLabel": "Come lavoro",
      "title": "Quattro step semplici, dalla prima call al sito online.",
      "subtitle": "Niente brief di 40 pagine, niente sparizioni di 3 settimane. Vedi i progressi mentre lavoro.",
      "steps": [
        {
          "id": "discovery",
          "number": "01",
          "title": "Capiamo cosa ti serve davvero",
          "description": "Una call gratuita di 20-30 minuti. Mi racconti il problema, ti faccio le domande giuste. A fine call hai già più chiarezza, anche se non lavoreremo insieme."
        },
        {
          "id": "proposal",
          "number": "02",
          "title": "Proposta chiara, prezzo fisso",
          "description": "Ti mando una proposta scritta: cosa farò, cosa non farò, quanto costa, in quanto tempo. Niente sorprese, niente costi nascosti, niente 'poi vediamo'."
        },
        {
          "id": "build",
          "number": "03",
          "title": "Costruisco e ti tengo aggiornato",
          "description": "Vedi i progressi mentre lavoro. Anteprima online sempre disponibile, feedback rapidi su WhatsApp o email. Non sparisco per 3 settimane."
        },
        {
          "id": "launch",
          "number": "04",
          "title": "Online + supporto post-lancio",
          "description": "Pubblichiamo, controlliamo che tutto funzioni, ti spiego come gestire le piccole modifiche. Per le evolutive ci sono pacchetti dedicati, niente abbonamenti forzati."
        }
      ]
    },
    "en": {
      "sectionLabel": "How I work",
      "title": "Four simple steps, from the first call to the live site.",
      "subtitle": "No 40-page briefs, no 3-week disappearances. You see progress as I work.",
      "steps": [
        {
          "id": "discovery",
          "number": "01",
          "title": "We figure out what you actually need",
          "description": "A 20-30 minute free call. You tell me the problem, I ask the right questions. By the end you already have more clarity, even if we don't work together."
        },
        {
          "id": "proposal",
          "number": "02",
          "title": "Clear proposal, fixed price",
          "description": "I send a written proposal: what I'll do, what I won't, how much it costs, in what time. No surprises, no hidden costs, no 'we'll see later'."
        },
        {
          "id": "build",
          "number": "03",
          "title": "I build and keep you posted",
          "description": "You see progress while I work. Live preview always available, quick feedback on WhatsApp or email. I don't ghost you for 3 weeks."
        },
        {
          "id": "launch",
          "number": "04",
          "title": "Live + post-launch support",
          "description": "We publish, double-check everything works, I show you how to handle small edits. For evolutions there are dedicated packages — no forced subscriptions."
        }
      ]
    },
    "fr": {
      "sectionLabel": "Comment je travaille",
      "title": "Quatre étapes simples, du premier appel au site en ligne.",
      "subtitle": "Pas de briefs de 40 pages, pas de disparitions de 3 semaines. Vous voyez les progrès au fur et à mesure.",
      "steps": [
        {
          "id": "discovery",
          "number": "01",
          "title": "On comprend ce dont vous avez vraiment besoin",
          "description": "Un appel gratuit de 20-30 minutes. Vous me décrivez le problème, je vous pose les bonnes questions. À la fin vous y voyez plus clair, même si on ne travaille pas ensemble."
        },
        {
          "id": "proposal",
          "number": "02",
          "title": "Proposition claire, prix fixe",
          "description": "Je vous envoie un devis écrit : ce que je fais, ce que je ne fais pas, combien ça coûte, en combien de temps. Pas de surprises, pas de coûts cachés, pas de 'on verra plus tard'."
        },
        {
          "id": "build",
          "number": "03",
          "title": "Je construis et je vous tiens au courant",
          "description": "Vous voyez les progrès pendant que je travaille. Aperçu en ligne toujours dispo, retours rapides sur WhatsApp ou email. Je ne disparais pas pendant 3 semaines."
        },
        {
          "id": "launch",
          "number": "04",
          "title": "Mise en ligne + support post-lancement",
          "description": "On publie, on vérifie que tout fonctionne, je vous explique comment gérer les petites modifs. Pour les évolutions il y a des forfaits dédiés — pas d'abonnement forcé."
        }
      ]
    }
  }
}
```

### apps/docs/src/data/seoContent.ts


```json
{
  "seoContent": {
    "it": {
      "title": "Hassan Akkari · Sviluppatore freelance per professionisti e piccole attività",
      "description": "Sviluppatore freelance a Roma. Landing page, siti professionali, web app e restyling. Niente template, niente WordPress impacchettato. Online in 1-3 settimane."
    },
    "en": {
      "title": "Hassan Akkari · Freelance developer for professionals and small businesses",
      "description": "Freelance developer in Rome. Landing pages, professional websites, custom web apps and restyling. No templates, no WordPress in disguise. Live in 1-3 weeks."
    },
    "fr": {
      "title": "Hassan Akkari · Développeur freelance pour professionnels et petites entreprises",
      "description": "Développeur freelance à Rome. Landing pages, sites pros, web apps sur mesure et refontes. Pas de templates, pas de WordPress déguisé. En ligne en 1-3 semaines."
    }
  }
}
```

### apps/docs/src/data/services.ts


```json
{
  "servicesContent": {
    "it": {
      "sectionLabel": "Servizi e pacchetti",
      "title": "Quattro modi concreti per migliorare la tua presenza online.",
      "subtitle": "Prezzi indicativi: dopo la prima call ricevi un preventivo scritto, fisso, senza sorprese.",
      "services": [
        {
          "id": "landing",
          "name": "Landing Page Professionale",
          "tagline": "Una pagina pensata per vendere un servizio o raccogliere contatti. Online in una settimana.",
          "forWho": "Professionisti, freelance e piccole attività che vogliono testare un servizio, una promozione o lanciare una nuova offerta.",
          "includes": [
            "Design su misura, mobile-first",
            "Copy strutturato per la conversione",
            "Form contatti + bottone WhatsApp",
            "SEO base (title, meta, struttura corretta)",
            "Performance ottimizzata su mobile",
            "Setup hosting e dominio insieme a te"
          ],
          "excludes": [
            "Logica di prenotazione complessa",
            "Area clienti / login",
            "E-commerce con catalogo"
          ],
          "priceLabel": "Da 600 €",
          "timeline": "5-7 giorni lavorativi",
          "ctaLabel": "Voglio una landing",
          "ctaHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20mi%20interessa%20una%20landing%20page.%20Mi%20puoi%20dare%20maggiori%20info%3F"
        },
        {
          "id": "site",
          "name": "Sito Professionale Completo",
          "tagline": "Il sito che dà credibilità alla tua attività. Chiaro, veloce, fatto per farti contattare.",
          "forWho": "Studi, professionisti e piccole aziende che hanno un sito vecchio o non ne hanno uno e vogliono apparire seri online.",
          "includes": [
            "Homepage, Chi siamo, Servizi, Contatti, FAQ",
            "Design coerente e responsive su ogni dispositivo",
            "SEO tecnico base + meta tag corretti",
            "Form contatti + WhatsApp + Google Maps",
            "Performance ottimizzata e Core Web Vitals",
            "Affiancamento hosting/dominio"
          ],
          "excludes": [
            "App mobile native",
            "Area clienti / login utente",
            "E-commerce avanzato"
          ],
          "priceLabel": "Da 1.500 €",
          "timeline": "2-3 settimane",
          "badge": "Più richiesto",
          "ctaLabel": "Voglio un sito completo",
          "ctaHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20mi%20serve%20un%20sito%20professionale%20per%20la%20mia%20attivit%C3%A0.%20Possiamo%20parlarne%3F"
        },
        {
          "id": "webapp",
          "name": "Web App / MVP su misura",
          "tagline": "Hai un'idea di app o uno strumento che ti serve in azienda? Ti aiuto a costruirlo da zero.",
          "forWho": "Chi ha un'idea di prodotto digitale, un gestionale interno da rifare o vuole portare online un processo che oggi gira su Excel/WhatsApp.",
          "includes": [
            "Analisi del problema e definizione dell'MVP",
            "Area clienti / login / dashboard",
            "Gestione dati, prenotazioni, contenuti",
            "API REST e integrazioni con servizi esterni",
            "Architettura scalabile (React + TypeScript)",
            "Documentazione e handover finale"
          ],
          "excludes": [
            "Manutenzione continuativa post-lancio (a parte, su contratto)",
            "App native iOS/Android (solo web app responsive)"
          ],
          "priceLabel": "Da 3.500 €",
          "timeline": "4-8 settimane",
          "ctaLabel": "Parliamo del progetto",
          "ctaHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20ho%20un'idea%20per%20una%20web%20app%2FMVP%20e%20vorrei%20capire%20come%20muovermi."
        },
        {
          "id": "restyle",
          "name": "Restyling Sito Esistente",
          "tagline": "Il tuo sito è vecchio, lento o non ti rappresenta più? Lo rimetto a posto senza ricominciare da zero.",
          "forWho": "Chi ha già un sito (anche WordPress) ma sta perdendo contatti per design datato, performance basse o struttura confusa.",
          "includes": [
            "Audit completo: design, UX, performance, SEO base",
            "Rifacimento UI delle pagine principali",
            "Miglioramento velocità e mobile experience",
            "Nuovi CTA e flussi di contatto",
            "Riscrittura sezioni con copy più chiaro",
            "Report finale con cosa è cambiato e perché"
          ],
          "excludes": [
            "Riscrittura completa da zero (è un altro pacchetto)",
            "Migrazione di e-commerce con migliaia di prodotti"
          ],
          "priceLabel": "Da 800 €",
          "timeline": "1-2 settimane",
          "ctaLabel": "Voglio sistemare il mio sito",
          "ctaHref": "https://wa.me/393517872307?text=Ciao%20Hassan%2C%20ho%20un%20sito%20esistente%20e%20vorrei%20migliorarlo.%20Lo%20puoi%20guardare%3F"
        }
      ],
      "secondaryCta": {
        "label": "Non sai quale serve a te? Scrivimi e ne parliamo",
        "href": "mailto:hassan.akkari01@gmail.com?subject=Confronto+pacchetti&body=Ciao+Hassan%2C+non+sono+sicuro+di+quale+pacchetto+faccia+al+caso+mio.+Posso+descriverti+la+mia+situazione%3F"
      }
    },
    "en": {
      "sectionLabel": "Services & packages",
      "title": "Four concrete ways to upgrade your online presence.",
      "subtitle": "Indicative pricing — after our first call you get a written, fixed quote with no surprises.",
      "services": [
        {
          "id": "landing",
          "name": "Professional Landing Page",
          "tagline": "A single page built to sell a service or capture leads. Live in one week.",
          "forWho": "Professionals, freelancers, and small businesses testing a service, a promotion, or a new offer.",
          "includes": [
            "Custom mobile-first design",
            "Copy structured for conversion",
            "Contact form + WhatsApp button",
            "Basic SEO (title, meta, proper structure)",
            "Optimised mobile performance",
            "Hosting and domain setup together"
          ],
          "excludes": [
            "Complex booking logic",
            "Customer area / login",
            "Catalogue-based e-commerce"
          ],
          "priceLabel": "From €600",
          "timeline": "5-7 business days",
          "ctaLabel": "I want a landing page",
          "ctaHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I'm%20interested%20in%20a%20landing%20page.%20Can%20you%20tell%20me%20more%3F"
        },
        {
          "id": "site",
          "name": "Complete Professional Website",
          "tagline": "The website that gives your business credibility. Clear, fast, built to get you contacted.",
          "forWho": "Studios, professionals, and small companies with an old site (or none) who want to look serious online.",
          "includes": [
            "Home, About, Services, Contact, FAQ",
            "Consistent, responsive design on any device",
            "Basic technical SEO + correct meta tags",
            "Contact form + WhatsApp + Google Maps",
            "Optimised performance and Core Web Vitals",
            "Hosting/domain setup support"
          ],
          "excludes": [
            "Native mobile apps",
            "User login / customer area",
            "Advanced e-commerce"
          ],
          "priceLabel": "From €1,500",
          "timeline": "2-3 weeks",
          "badge": "Most requested",
          "ctaLabel": "I want a full website",
          "ctaHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I%20need%20a%20professional%20website%20for%20my%20business.%20Can%20we%20talk%3F"
        },
        {
          "id": "webapp",
          "name": "Custom Web App / MVP",
          "tagline": "Got an app idea or an internal tool you actually need? I help you build it from scratch.",
          "forWho": "Founders with a product idea, teams stuck on Excel/WhatsApp, or anyone who needs to move a process online.",
          "includes": [
            "Problem analysis and MVP definition",
            "Customer area / login / dashboard",
            "Data, booking, and content management",
            "REST APIs and third-party integrations",
            "Scalable architecture (React + TypeScript)",
            "Final documentation and handover"
          ],
          "excludes": [
            "Long-term maintenance (separate retainer)",
            "Native iOS/Android (responsive web only)"
          ],
          "priceLabel": "From €3,500",
          "timeline": "4-8 weeks",
          "ctaLabel": "Let's talk about the project",
          "ctaHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I%20have%20an%20idea%20for%20a%20web%20app%2FMVP%20and%20I'd%20like%20to%20figure%20out%20how%20to%20move%20forward."
        },
        {
          "id": "restyle",
          "name": "Existing Website Restyling",
          "tagline": "Your site is old, slow, or no longer represents you? I fix it without starting over.",
          "forWho": "People who already have a site (even WordPress) but are losing leads to dated design, poor performance, or confused structure.",
          "includes": [
            "Full audit: design, UX, performance, basic SEO",
            "UI rebuild on main pages",
            "Speed and mobile experience improvements",
            "New CTAs and contact flows",
            "Section rewrites with clearer copy",
            "Final report on what changed and why"
          ],
          "excludes": [
            "Full rebuild from scratch (different package)",
            "Migrating e-commerce with thousands of products"
          ],
          "priceLabel": "From €800",
          "timeline": "1-2 weeks",
          "ctaLabel": "I want to fix my site",
          "ctaHref": "https://wa.me/393517872307?text=Hi%20Hassan%2C%20I%20have%20an%20existing%20site%20I'd%20like%20to%20improve.%20Can%20you%20take%20a%20look%3F"
        }
      ],
      "secondaryCta": {
        "label": "Not sure which one fits? Drop me a line and we'll figure it out",
        "href": "mailto:hassan.akkari01@gmail.com?subject=Package+comparison&body=Hi+Hassan%2C+I%27m+not+sure+which+package+fits+my+case.+Can+I+describe+my+situation%3F"
      }
    },
    "fr": {
      "sectionLabel": "Services et forfaits",
      "title": "Quatre façons concrètes d'améliorer votre présence en ligne.",
      "subtitle": "Tarifs indicatifs — après le premier échange vous recevez un devis écrit, fixe, sans surprise.",
      "services": [
        {
          "id": "landing",
          "name": "Landing Page Professionnelle",
          "tagline": "Une page conçue pour vendre un service ou capter des contacts. En ligne en une semaine.",
          "forWho": "Professionnels, freelances et petites structures qui veulent tester un service, une promotion ou une nouvelle offre.",
          "includes": [
            "Design sur mesure, mobile-first",
            "Copy structuré pour la conversion",
            "Formulaire contact + bouton WhatsApp",
            "SEO de base (title, meta, structure correcte)",
            "Performance optimisée sur mobile",
            "Mise en place hébergement et domaine ensemble"
          ],
          "excludes": [
            "Logique de réservation complexe",
            "Espace client / login",
            "E-commerce avec catalogue"
          ],
          "priceLabel": "À partir de 600 €",
          "timeline": "5-7 jours ouvrés",
          "ctaLabel": "Je veux une landing",
          "ctaHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20je%20suis%20int%C3%A9ress%C3%A9(e)%20par%20une%20landing%20page.%20Pouvez-vous%20m'en%20dire%20plus%20%3F"
        },
        {
          "id": "site",
          "name": "Site Professionnel Complet",
          "tagline": "Le site qui donne de la crédibilité à votre activité. Clair, rapide, fait pour générer des contacts.",
          "forWho": "Cabinets, professionnels et petites entreprises avec un site daté (ou sans site) qui veulent paraître sérieux en ligne.",
          "includes": [
            "Accueil, À propos, Services, Contact, FAQ",
            "Design cohérent et responsive sur tout appareil",
            "SEO technique de base + meta tags corrects",
            "Formulaire contact + WhatsApp + Google Maps",
            "Performance optimisée et Core Web Vitals",
            "Accompagnement hébergement/domaine"
          ],
          "excludes": [
            "Apps mobiles natives",
            "Espace client / login utilisateur",
            "E-commerce avancé"
          ],
          "priceLabel": "À partir de 1 500 €",
          "timeline": "2-3 semaines",
          "badge": "Le plus demandé",
          "ctaLabel": "Je veux un site complet",
          "ctaHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20j'ai%20besoin%20d'un%20site%20professionnel%20pour%20mon%20activit%C3%A9.%20On%20peut%20en%20parler%20%3F"
        },
        {
          "id": "webapp",
          "name": "Web App / MVP sur mesure",
          "tagline": "Vous avez une idée d'app ou un outil interne dont vous avez vraiment besoin ? Je vous aide à le construire de zéro.",
          "forWho": "Founders avec une idée de produit, équipes coincées sur Excel/WhatsApp, ou quiconque a besoin de digitaliser un processus.",
          "includes": [
            "Analyse du problème et définition du MVP",
            "Espace client / login / tableau de bord",
            "Gestion données, réservations, contenus",
            "API REST et intégrations tierces",
            "Architecture évolutive (React + TypeScript)",
            "Documentation finale et passation"
          ],
          "excludes": [
            "Maintenance long terme (contrat séparé)",
            "Apps iOS/Android natives (web responsive uniquement)"
          ],
          "priceLabel": "À partir de 3 500 €",
          "timeline": "4-8 semaines",
          "ctaLabel": "Parlons du projet",
          "ctaHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20j'ai%20une%20id%C3%A9e%20de%20web%20app%2FMVP%20et%20j'aimerais%20comprendre%20comment%20avancer."
        },
        {
          "id": "restyle",
          "name": "Refonte de Site Existant",
          "tagline": "Votre site est daté, lent, ne vous représente plus ? Je le remets en forme sans repartir de zéro.",
          "forWho": "Vous avez déjà un site (même WordPress) mais perdez des contacts à cause d'un design dépassé, de performances faibles ou d'une structure confuse.",
          "includes": [
            "Audit complet : design, UX, performance, SEO de base",
            "Refonte UI des pages principales",
            "Amélioration vitesse et expérience mobile",
            "Nouveaux CTA et parcours de contact",
            "Réécriture des sections avec un copy plus clair",
            "Rapport final sur ce qui a changé et pourquoi"
          ],
          "excludes": [
            "Réécriture complète depuis zéro (autre forfait)",
            "Migration e-commerce avec des milliers de produits"
          ],
          "priceLabel": "À partir de 800 €",
          "timeline": "1-2 semaines",
          "ctaLabel": "Je veux remettre mon site à jour",
          "ctaHref": "https://wa.me/393517872307?text=Bonjour%20Hassan%2C%20j'ai%20un%20site%20existant%20que%20j'aimerais%20am%C3%A9liorer.%20Vous%20pouvez%20y%20jeter%20un%20%C5%93il%20%3F"
        }
      ],
      "secondaryCta": {
        "label": "Pas sûr du bon choix ? Écrivez-moi, on en parle",
        "href": "mailto:hassan.akkari01@gmail.com?subject=Comparaison+des+forfaits&body=Bonjour+Hassan%2C+je+ne+suis+pas+s%C3%BBr%28e%29+du+forfait+qui+me+correspond.+Je+peux+d%C3%A9crire+ma+situation+%3F"
      }
    }
  }
}
```

### apps/docs/src/data/site.ts


```json
{
  "SITE": {
    "name": "Hassan Akkari",
    "email": "hassan.akkari01@gmail.com",
    "whatsappNumber": "393517872307",
    "calendlyUrl": "",
    "github": "https://github.com/Dark-lIl-Demon",
    "linkedin": "https://www.linkedin.com/in/hassan-akkari",
    "location": "Roma, Italia"
  }
}
```

### apps/docs/src/data/targetClients.ts


```json
{
  "targetClientsContent": {
    "it": {
      "sectionLabel": "Per chi lavoro",
      "title": "Lavoro con persone vere, non con buyer persona.",
      "subtitle": "Se ti riconosci in una di queste categorie probabilmente posso aiutarti. Se sei nel dubbio, scrivimi e te lo dico io con onestà.",
      "clients": [
        {
          "id": "professionals",
          "label": "Professionisti e consulenti",
          "description": "Commercialisti, avvocati, consulenti, architetti che vogliono un sito serio, veloce e che dia subito fiducia."
        },
        {
          "id": "fitness",
          "label": "Personal trainer e palestre",
          "description": "Landing per pacchetti, schede online, prenotazioni lezioni, app gestione clienti."
        },
        {
          "id": "studios",
          "label": "Studi e piccole strutture",
          "description": "Studi medici, centri estetici, scuole, associazioni: presenza online chiara con orari, servizi e prenotazione."
        },
        {
          "id": "small-business",
          "label": "Piccole attività locali",
          "description": "Ristoranti, b&b, negozi, artigiani: sito mobile-first che porti chiamate, prenotazioni e visite reali."
        },
        {
          "id": "founders",
          "label": "Founder con un'idea di prodotto",
          "description": "Hai un'idea di app, gestionale o servizio digitale? Ti aiuto a partire dall'MVP senza buttare via tempo e budget."
        },
        {
          "id": "freelancers",
          "label": "Altri freelance",
          "description": "Personal brand, portfolio, landing per i tuoi servizi. Un sito che ti faccia sembrare il professionista che sei."
        }
      ]
    },
    "en": {
      "sectionLabel": "Who I work with",
      "title": "I work with real people, not buyer personas.",
      "subtitle": "If you recognise yourself in one of these, I can probably help. If you're not sure, drop me a line and I'll tell you honestly.",
      "clients": [
        {
          "id": "professionals",
          "label": "Professionals & consultants",
          "description": "Accountants, lawyers, consultants, architects who want a serious, fast site that builds trust on the spot."
        },
        {
          "id": "fitness",
          "label": "Personal trainers & gyms",
          "description": "Landings for packages, online plans, class booking, client management apps."
        },
        {
          "id": "studios",
          "label": "Studios & small practices",
          "description": "Clinics, beauty studios, schools, associations: clear online presence with hours, services, and booking."
        },
        {
          "id": "small-business",
          "label": "Small local businesses",
          "description": "Restaurants, B&Bs, shops, craftsmen: a mobile-first site that drives real calls, bookings, and visits."
        },
        {
          "id": "founders",
          "label": "Founders with a product idea",
          "description": "Got an app idea, internal tool, or digital service? I help you start from the MVP without burning time and budget."
        },
        {
          "id": "freelancers",
          "label": "Other freelancers",
          "description": "Personal brand, portfolio, landings for your services. A site that makes you look like the professional you are."
        }
      ]
    },
    "fr": {
      "sectionLabel": "Pour qui je travaille",
      "title": "Je travaille avec de vraies personnes, pas avec des buyer personas.",
      "subtitle": "Si vous vous reconnaissez dans l'une de ces catégories, je peux probablement vous aider. Sinon, écrivez-moi et je vous le dirai honnêtement.",
      "clients": [
        {
          "id": "professionals",
          "label": "Professionnels & consultants",
          "description": "Experts-comptables, avocats, consultants, architectes : un site sérieux, rapide, qui inspire confiance dès la première seconde."
        },
        {
          "id": "fitness",
          "label": "Coachs sportifs & salles de sport",
          "description": "Landings pour des forfaits, plans en ligne, réservation de cours, apps de gestion clients."
        },
        {
          "id": "studios",
          "label": "Cabinets & petites structures",
          "description": "Cabinets médicaux, instituts de beauté, écoles, associations : présence en ligne claire avec horaires, services et réservation."
        },
        {
          "id": "small-business",
          "label": "Petites activités locales",
          "description": "Restaurants, B&B, boutiques, artisans : site mobile-first qui ramène appels, réservations et visites réelles."
        },
        {
          "id": "founders",
          "label": "Founders avec une idée produit",
          "description": "Une idée d'app, d'outil interne ou de service digital ? Je vous aide à partir du MVP sans gaspiller temps et budget."
        },
        {
          "id": "freelancers",
          "label": "Autres freelances",
          "description": "Marque personnelle, portfolio, landings pour vos services. Un site qui vous fait passer pour le pro que vous êtes."
        }
      ]
    }
  }
}
```

### apps/docs/src/data/techStack.ts


```json
{
  "techStackContent": {
    "it": {
      "sectionLabel": "Tecnologie",
      "title": "Stack moderno, scelto in base al progetto. Non al gusto del momento.",
      "note": "Lo stack lo scelgo io in base al progetto: per una landing 'semplice' non ti faccio pagare una web app full-stack, e per una web app non ti propongo WordPress.",
      "categories": [
        {
          "id": "frontend",
          "title": "Frontend moderno",
          "description": "Quello che vede il cliente: veloce, responsive, facile da modificare in futuro.",
          "items": [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Vite",
            "Framer Motion"
          ]
        },
        {
          "id": "backend",
          "title": "Backend e integrazioni",
          "description": "Quello che fa funzionare le cose: API, form, autenticazione, gestione dati.",
          "items": [
            "Node.js",
            "REST APIs",
            "ASP.NET / C#",
            "SQL Server",
            "Server Actions",
            "Zod"
          ]
        },
        {
          "id": "quality",
          "title": "Qualità e delivery",
          "description": "Quello che fa la differenza: codice testato, performance reali, manutenzione semplice.",
          "items": [
            "Vitest / Playwright",
            "ESLint / strict TypeScript",
            "Component-first architecture",
            "Mobile-first / accessibilità base",
            "CI lint+typecheck+test",
            "Vercel / OVH deploy"
          ]
        }
      ]
    },
    "en": {
      "sectionLabel": "Tech stack",
      "title": "A modern stack, chosen for your project. Not for the latest hype.",
      "note": "I pick the stack based on your project: for a 'simple' landing I won't bill you a full-stack web app, and for a web app I won't pitch you WordPress.",
      "categories": [
        {
          "id": "frontend",
          "title": "Modern frontend",
          "description": "What the client sees: fast, responsive, easy to update later.",
          "items": [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Vite",
            "Framer Motion"
          ]
        },
        {
          "id": "backend",
          "title": "Backend & integrations",
          "description": "What makes things actually work: APIs, forms, auth, data handling.",
          "items": [
            "Node.js",
            "REST APIs",
            "ASP.NET / C#",
            "SQL Server",
            "Server Actions",
            "Zod"
          ]
        },
        {
          "id": "quality",
          "title": "Quality & delivery",
          "description": "What makes the difference: tested code, real performance, easy maintenance.",
          "items": [
            "Vitest / Playwright",
            "ESLint / strict TypeScript",
            "Component-first architecture",
            "Mobile-first / basic accessibility",
            "CI lint+typecheck+test",
            "Vercel / OVH deploy"
          ]
        }
      ]
    },
    "fr": {
      "sectionLabel": "Technologies",
      "title": "Stack moderne, choisi pour votre projet. Pas pour la mode du moment.",
      "note": "Je choisis le stack selon le projet : pour une landing 'simple' je ne vous facture pas une web app full-stack, et pour une web app je ne vous propose pas WordPress.",
      "categories": [
        {
          "id": "frontend",
          "title": "Frontend moderne",
          "description": "Ce que voit le client : rapide, responsive, facile à modifier plus tard.",
          "items": [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Vite",
            "Framer Motion"
          ]
        },
        {
          "id": "backend",
          "title": "Backend et intégrations",
          "description": "Ce qui fait fonctionner les choses : API, formulaires, authentification, gestion des données.",
          "items": [
            "Node.js",
            "REST APIs",
            "ASP.NET / C#",
            "SQL Server",
            "Server Actions",
            "Zod"
          ]
        },
        {
          "id": "quality",
          "title": "Qualité et delivery",
          "description": "Ce qui fait la différence : code testé, vraies performances, maintenance simple.",
          "items": [
            "Vitest / Playwright",
            "ESLint / strict TypeScript",
            "Architecture component-first",
            "Mobile-first / accessibilité de base",
            "CI lint+typecheck+test",
            "Vercel / OVH deploy"
          ]
        }
      ]
    }
  }
}
```

### apps/docs/src/data/whyMe.ts


```json
{
  "whyMeContent": {
    "it": {
      "sectionLabel": "Perché lavorare con me",
      "title": "Differenza tra una scelta su misura e un sito-pacco di un'agenzia.",
      "reasons": [
        {
          "id": "single-contact",
          "title": "Un solo interlocutore, dall'idea al sito online",
          "description": "Niente passaggi di consegna tra account, designer e dev di un'agenzia. Parli con me, decidi con me, ricevi il lavoro da me."
        },
        {
          "id": "real-experience",
          "title": "Esperienza reale su prodotti in produzione",
          "description": "Lavoro tutti i giorni su un prodotto enterprise con utenti reali. So cosa rompe un flusso di booking, un checkout o un form di contatto. Non imparo sul tuo budget."
        },
        {
          "id": "no-template",
          "title": "Codice mio, non template ricomprati",
          "description": "React, TypeScript e Tailwind. Il sito che ricevi è davvero su misura: cambi un titolo o aggiungi una sezione senza dover ricomprare un plugin."
        },
        {
          "id": "transparent-pricing",
          "title": "Prezzi chiari, scope chiaro",
          "description": "Ti dico in anticipo cosa è dentro e cosa è fuori. Non triplichiamo il preventivo a metà progetto, e non spariamo cifre per vedere se attacchi."
        },
        {
          "id": "fast-real",
          "title": "Tempi realistici, non promesse",
          "description": "Una landing in una settimana. Un sito in 2-3 settimane. Una web app MVP in 1-2 mesi. Se non riesco nei tempi, te lo dico subito, non a fine progetto."
        },
        {
          "id": "post-launch",
          "title": "Non sparisco dopo il lancio",
          "description": "Resto reperibile su WhatsApp/email per fix e dubbi. Se vuoi un'evolutiva o una nuova sezione, ti faccio un preventivo separato e onesto."
        }
      ]
    },
    "en": {
      "sectionLabel": "Why work with me",
      "title": "The difference between a tailored choice and an off-the-shelf agency site.",
      "reasons": [
        {
          "id": "single-contact",
          "title": "One person from idea to live site",
          "description": "No handoffs between agency account managers, designers and devs. You talk to me, decide with me, get the work from me."
        },
        {
          "id": "real-experience",
          "title": "Real experience on production products",
          "description": "I work daily on an enterprise product with real users. I know what breaks a booking flow, a checkout, or a contact form. I don't learn on your budget."
        },
        {
          "id": "no-template",
          "title": "My code, not bought templates",
          "description": "React, TypeScript, and Tailwind. The site you receive is genuinely custom: you can change a heading or add a section without buying yet another plugin."
        },
        {
          "id": "transparent-pricing",
          "title": "Clear pricing, clear scope",
          "description": "I tell you upfront what's in and what's out. We don't triple the quote mid-project, and I don't throw out numbers just to see if you bite."
        },
        {
          "id": "fast-real",
          "title": "Realistic timelines, not promises",
          "description": "A landing in a week. A site in 2-3 weeks. A web app MVP in 1-2 months. If I can't make it on time, I tell you immediately — not at the end."
        },
        {
          "id": "post-launch",
          "title": "I don't disappear after launch",
          "description": "I stay reachable on WhatsApp/email for fixes and questions. If you want an upgrade or a new section, I send you a separate honest quote."
        }
      ]
    },
    "fr": {
      "sectionLabel": "Pourquoi travailler avec moi",
      "title": "La différence entre un choix sur mesure et un site-paquet d'agence.",
      "reasons": [
        {
          "id": "single-contact",
          "title": "Un seul interlocuteur, de l'idée au site en ligne",
          "description": "Pas de passages entre commercial, designer et dev d'une agence. Vous parlez avec moi, décidez avec moi, recevez le travail de moi."
        },
        {
          "id": "real-experience",
          "title": "Expérience réelle sur des produits en production",
          "description": "Je travaille tous les jours sur un produit enterprise avec de vrais utilisateurs. Je sais ce qui casse un flow de booking, un checkout ou un formulaire. Je n'apprends pas sur votre budget."
        },
        {
          "id": "no-template",
          "title": "Mon code, pas des templates achetés",
          "description": "React, TypeScript et Tailwind. Le site que vous recevez est vraiment sur mesure : vous changez un titre ou ajoutez une section sans devoir racheter un plugin."
        },
        {
          "id": "transparent-pricing",
          "title": "Prix clair, scope clair",
          "description": "Je vous dis à l'avance ce qui est inclus et ce qui ne l'est pas. On ne triple pas le devis en cours de projet, et je ne lance pas des chiffres pour voir si vous mordez."
        },
        {
          "id": "fast-real",
          "title": "Délais réalistes, pas des promesses",
          "description": "Une landing en une semaine. Un site en 2-3 semaines. Un MVP en 1-2 mois. Si je ne peux pas tenir les délais, je vous le dis tout de suite — pas à la fin."
        },
        {
          "id": "post-launch",
          "title": "Je ne disparais pas après le lancement",
          "description": "Je reste joignable sur WhatsApp/email pour les corrections et les doutes. Si vous voulez une évolution ou une nouvelle section, je vous fais un devis séparé et honnête."
        }
      ]
    }
  }
}
```


## Full Structured Content - apps/docs messages


```json
{
  "messages": {
    "en": {
      "nav": {
        "home": "Home",
        "about": "About me",
        "highlights": "Highlights",
        "projects": "Featured projects",
        "roadmap": "Next builds",
        "contact": "Contact",
        "cv": "CV",
        "downloadCv": "Download CV"
      },
      "locale": {
        "label": "Language",
        "en": "English",
        "it": "Italiano",
        "fr": "Francais"
      },
      "header": {
        "greetingPrefix": "Hi, I'm",
        "headlineSuffix": "I build connected web products",
        "quickProfile": "Quick profile",
        "viewProjects": "View projects",
        "emailMe": "Email me"
      },
      "about": {
        "title": "About me",
        "now": "Now",
        "philosophy": "Tech philosophy",
        "howIWork": "How I work",
        "techStack": "Tech Stack",
        "experience": "Experience",
        "education": "Education",
        "general": "General",
        "daily": "Daily",
        "comfortable": "Comfortable",
        "exploring": "Exploring"
      },
      "highlights": {
        "title": "Impact highlights",
        "subtitle": "Concrete ways I help teams ship faster and keep code quality stable."
      },
      "portfolio": {
        "title": "Featured projects",
        "subtitle": "Selected work with stack details and impact-oriented outcomes.",
        "requestCaseStudy": "Ask for additional details"
      },
      "roadmap": {
        "title": "Next builds",
        "subtitle": "Two mini side projects I build in my spare time to experiment beyond the static portfolio.",
        "recruiterSignals": "What I am exploring",
        "mvpScope": "MVP scope",
        "targetApp": "Target app",
        "cta": "If you want, I can share what I am building now"
      },
      "contact": {
        "title": "Contact me",
        "note": "Phone number shared by email request.",
        "emailMe": "Email me",
        "github": "GitHub",
        "linkedin": "LinkedIn",
        "bookCall": "Book a call",
        "downloadCv": "Open CV page",
        "formName": "Your name",
        "formEmail": "Your email",
        "formMessage": "Your message",
        "formSubmit": "Send",
        "formSuccess": "Thanks! I will get back to you."
      },
      "cv": {
        "title": "Curriculum Vitae",
        "subtitle": "Localized profile view with print-ready layout and quick export options.",
        "backToSite": "Back to portfolio",
        "print": "Print",
        "downloadOriginal": "Download original PDF",
        "summary": "Professional summary",
        "impact": "Impact highlights",
        "stack": "Tech stack",
        "experience": "Experience",
        "education": "Education",
        "general": "Additional information",
        "contact": "Contact"
      },
      "system": {
        "githubUnavailable": "GitHub stats unavailable right now. Showing local profile data.",
        "fallbackData": "Remote profile data unavailable. Fallback data is active.",
        "refreshing": "Refreshing profile data..."
      }
    },
    "it": {
      "nav": {
        "home": "Home",
        "about": "Chi sono",
        "highlights": "Risultati",
        "projects": "Progetti in evidenza",
        "roadmap": "Prossimi build",
        "contact": "Contatti",
        "cv": "CV",
        "downloadCv": "Scarica CV"
      },
      "locale": {
        "label": "Lingua",
        "en": "English",
        "it": "Italiano",
        "fr": "Francais"
      },
      "header": {
        "greetingPrefix": "Ciao, sono",
        "headlineSuffix": "Sviluppo prodotti web connessi e scalabili",
        "quickProfile": "Profilo rapido",
        "viewProjects": "Vedi progetti",
        "emailMe": "Scrivimi"
      },
      "about": {
        "title": "Chi sono",
        "now": "Adesso",
        "philosophy": "Filosofia tecnica",
        "howIWork": "Come lavoro",
        "techStack": "Stack tecnico",
        "experience": "Esperienza",
        "education": "Formazione",
        "general": "Generale",
        "daily": "Quotidiano",
        "comfortable": "Confortevole",
        "exploring": "In esplorazione"
      },
      "highlights": {
        "title": "Impatto",
        "subtitle": "Risultati concreti con cui aiuto i team a consegnare piu velocemente e con qualita stabile."
      },
      "portfolio": {
        "title": "Progetti in evidenza",
        "subtitle": "Selezione di lavori con stack e risultati misurabili.",
        "requestCaseStudy": "Per maggiori dettagli scrivimi"
      },
      "roadmap": {
        "title": "Prossimi build",
        "subtitle": "Due mini progetti personali che porto avanti nel tempo libero, per sperimentare oltre il portfolio statico.",
        "recruiterSignals": "Cosa sto sperimentando",
        "mvpScope": "Scope MVP",
        "targetApp": "App target",
        "cta": "Se ti va, ti racconto cosa sto buildando ora"
      },
      "contact": {
        "title": "Contattami",
        "note": "Numero di telefono condiviso su richiesta via email.",
        "emailMe": "Scrivimi",
        "github": "GitHub",
        "linkedin": "LinkedIn",
        "bookCall": "Prenota call",
        "downloadCv": "Apri pagina CV",
        "formName": "Nome",
        "formEmail": "Email",
        "formMessage": "Messaggio",
        "formSubmit": "Invia",
        "formSuccess": "Grazie! Ti rispondo presto."
      },
      "cv": {
        "title": "Curriculum Vitae",
        "subtitle": "Vista profilo localizzata, pronta per la stampa e con opzioni rapide di esportazione.",
        "backToSite": "Torna al portfolio",
        "print": "Stampa",
        "downloadOriginal": "Scarica PDF originale",
        "summary": "Profilo professionale",
        "impact": "Risultati",
        "stack": "Stack tecnico",
        "experience": "Esperienza",
        "education": "Formazione",
        "general": "Informazioni aggiuntive",
        "contact": "Contatti"
      },
      "system": {
        "githubUnavailable": "Statistiche GitHub non disponibili ora. Mostro i dati locali del profilo.",
        "fallbackData": "Dati profilo remoti non disponibili. Uso i dati di fallback.",
        "refreshing": "Aggiornamento dati profilo..."
      }
    },
    "fr": {
      "nav": {
        "home": "Accueil",
        "about": "A propos",
        "highlights": "Impact",
        "projects": "Projets a la une",
        "roadmap": "Prochains builds",
        "contact": "Contact",
        "cv": "CV",
        "downloadCv": "Telecharger CV"
      },
      "locale": {
        "label": "Langue",
        "en": "English",
        "it": "Italiano",
        "fr": "Francais"
      },
      "header": {
        "greetingPrefix": "Bonjour, je suis",
        "headlineSuffix": "Je construis des produits web connectes",
        "quickProfile": "Profil rapide",
        "viewProjects": "Voir projets",
        "emailMe": "Ecrivez-moi"
      },
      "about": {
        "title": "A propos",
        "now": "Actuellement",
        "philosophy": "Philosophie technique",
        "howIWork": "Comment je travaille",
        "techStack": "Stack technique",
        "experience": "Experience",
        "education": "Formation",
        "general": "General",
        "daily": "Quotidien",
        "comfortable": "A l'aise",
        "exploring": "Exploration"
      },
      "highlights": {
        "title": "Points d'impact",
        "subtitle": "Actions concretes qui aident les equipes a livrer plus vite avec une qualite stable."
      },
      "portfolio": {
        "title": "Projets a la une",
        "subtitle": "Selection de travaux avec details techniques et resultats orientes impact.",
        "requestCaseStudy": "Demander plus de details"
      },
      "roadmap": {
        "title": "Prochains builds",
        "subtitle": "Deux mini projets perso que je fais sur mon temps libre pour experimenter au-dela du portfolio statique.",
        "recruiterSignals": "Ce que j'explore",
        "mvpScope": "Scope MVP",
        "targetApp": "App cible",
        "cta": "Si vous voulez, je peux partager ce que je build en ce moment"
      },
      "contact": {
        "title": "Contactez-moi",
        "note": "Numero partage sur demande par email.",
        "emailMe": "Ecrivez-moi",
        "github": "GitHub",
        "linkedin": "LinkedIn",
        "bookCall": "Reserver un appel",
        "downloadCv": "Ouvrir page CV",
        "formName": "Votre nom",
        "formEmail": "Votre email",
        "formMessage": "Votre message",
        "formSubmit": "Envoyer",
        "formSuccess": "Merci! Je vous reponds rapidement."
      },
      "cv": {
        "title": "Curriculum Vitae",
        "subtitle": "Vue profile localisee, optimisee pour l'impression et l'export rapide.",
        "backToSite": "Retour portfolio",
        "print": "Imprimer",
        "downloadOriginal": "Telecharger PDF original",
        "summary": "Resume professionnel",
        "impact": "Impact",
        "stack": "Stack technique",
        "experience": "Experience",
        "education": "Formation",
        "general": "Informations supplementaires",
        "contact": "Contact"
      },
      "system": {
        "githubUnavailable": "Statistiques GitHub indisponibles. Affichage des donnees locales.",
        "fallbackData": "Donnees distantes indisponibles. Utilisation des donnees de secours.",
        "refreshing": "Actualisation des donnees profil..."
      }
    }
  }
}
```


## Full Structured Content - apps/docs fallback portfolio/CV


```json
{
  "fallbackPortfolioContent": {
    "profile": {
      "name": "Hassan Akkari",
      "role": "Frontend-focused Software Developer",
      "focus": "UI standards, reusable components, core flows (React/TS/RTK).",
      "location": "Rome, Italy",
      "metric": "Frontend engineer - UI architecture & delivery",
      "about": [
        "I have worked on Sibylla in a fast-moving environment: if you do not create order, the project creates friction. I started on Platform building solid foundations (jQuery/HTML/CSS) and reusable UI standards; today on Network I work more structurally with React + Redux Toolkit on core flows.",
        "I solve the problem, then make it hard to repeat: standards, reuse, structure.",
        "I reduce team friction: clear conventions and reusable components.",
        "When needed, I connect FE/BE: APIs, MVC, queries, and debugging.",
        "I am happy to share approach and impact; some internal details stay out."
      ],
      "now": "Currently on Sibylla Network: improving delivery with reusable patterns and cleaner architecture. I cannot show internals, but I can clearly explain what I built and why it helped.",
      "philosophy": "Standardize first, then accelerate. Clean code helps the whole team ship faster.",
      "githubUsername": "Dark-lIl-Demon"
    },
    "contact": {
      "email": "hassan.akkari01@gmail.com",
      "resumePath": "pdf/CV-ENG-102025.pdf",
      "github": "https://github.com/Dark-lIl-Demon",
      "linkedin": "https://www.linkedin.com/in/hassan-akkari",
      "instagram": "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
      "facebook": "https://www.facebook.com/hassan.akkari.714"
    },
    "highlights": [
      "UI standards (classes/styles)\nBefore: conventions were scattered and duplicated across modules.\nAfter: shared standards reused over time by the team.\nResult: fewer regressions and faster maintenance.",
      "Network reusable patterns (React + Redux Toolkit)\nBefore: logic was distributed and hard to scale.\nAfter: patterns and flows became more predictable.\nResult: more stable delivery on core flows.",
      "UI consistency (Bootstrap -> Tailwind where applicable)\nBefore: inconsistent layouts and similar-but-different components.\nAfter: more consistent standards and composition.\nResult: faster iterations on core flows.",
      "Debugging edge cases and complex bugs\nBefore: long blockers and fragmented diagnosis.\nAfter: quick isolation, targeted fixes, prevention where possible.\nResult: team unblocked without slowing release."
    ],
    "stack": {
      "daily": [
        "React (TSX)",
        "Redux Toolkit",
        "TypeScript",
        "JavaScript",
        "jQuery",
        "HTML5/CSS3",
        "Tailwind CSS"
      ],
      "comfortable": [
        "ASP.NET MVC",
        "C#",
        "SQL Server",
        "REST APIs",
        "UI standardization",
        "Cross-domain feature delivery"
      ],
      "exploring": [
        "Angular",
        "GraphQL",
        "Design tokens and component governance"
      ]
    },
    "experience": [
      {
        "company": "Sibylla (Platform and Network)",
        "location": "Italy",
        "role": "Frontend Developer (Platform Foundations and Network Delivery)",
        "start": "Current",
        "end": "Present",
        "bullets": [
          "Started on Sibylla Platform, strengthening frontend fundamentals with jQuery, HTML, and CSS.",
          "Introduced reusable class and style standards that became shared conventions and are still used.",
          "Now on Sibylla Network, lead implementation across booking, catalog, and checkout with scalable React and Redux Toolkit patterns."
        ]
      },
      {
        "company": "BetterTogether",
        "location": "Rome, Italy",
        "role": "Junior Developer Intern",
        "start": "Oct 2022",
        "end": "Jun 2023",
        "bullets": [
          "Built and maintained internal web features with focus on forms and data validation.",
          "Integrated front-end workflows with .NET services and SQL Server data.",
          "Contributed bug fixes and refactors on critical business flows before release."
        ]
      }
    ],
    "education": [
      {
        "school": "Uxbridge College",
        "location": "London, UK",
        "qualification": "Diploma in Computer Science",
        "start": "Sep 2019",
        "end": "Jun 2021",
        "focus": "Software foundations, data concepts, and web development basics."
      }
    ],
    "general": [
      {
        "title": "Languages",
        "items": [
          "Italian",
          "English",
          "Arabic (Darija)"
        ]
      },
      {
        "title": "Collaboration",
        "items": [
          "Code reviews",
          "Team handoff",
          "Agile iteration"
        ]
      },
      {
        "title": "Tooling",
        "items": [
          "GitHub",
          "CI basics",
          "Figma handoff"
        ]
      }
    ],
    "projects": [
      {
        "id": "sibylla-network-ui-system",
        "title": "Sibylla Network - My Frontend Journey",
        "summary": "I started on Platform building solid foundations and reusable standards. On Network I brought a more structural approach with React and Redux Toolkit, with focus on UI consistency and predictable delivery.",
        "image": "image/enterprise-nda-placeholder.svg",
        "stack": [
          "React",
          "TypeScript",
          "Redux Toolkit",
          "REST APIs",
          "Tailwind CSS"
        ],
        "impact": [
          "Problem: fragmented UI and duplicated rules across modules.",
          "Intervention: standards + reusable patterns on core flows.",
          "Result: stronger UI consistency and fewer release regressions."
        ],
        "links": [
          {
            "label": "Live product",
            "href": "https://sibyllanetwork.com",
            "kind": "live"
          },
          {
            "label": "Want to know what I built?",
            "href": "#contact",
            "kind": "caseStudy"
          }
        ]
      },
      {
        "id": "bootstrap-tailwind-modernization",
        "title": "Bootstrap to Tailwind Modernization",
        "summary": "Migration from Bootstrap and vendor UI packages to a Tailwind workflow focused on consistency, speed, and maintainability.",
        "image": "image/LaBrochure.png",
        "stack": [
          "Tailwind CSS",
          "Component refactor",
          "UI standards",
          "Frontend architecture"
        ],
        "impact": [
          "More consistent UI standards across modules and components.",
          "Reduced vendor dependency and fragmented UI behaviour.",
          "Improved layout and component iteration speed for the team.",
          "Created reusable utility patterns that scale better across modules."
        ],
        "links": [
          {
            "label": "Case Study",
            "href": "#contact",
            "kind": "caseStudy"
          },
          {
            "label": "GitHub",
            "href": "https://github.com/Dark-lIl-Demon",
            "kind": "github"
          }
        ]
      }
    ],
    "roadmap": [
      {
        "id": "next-booking-checkout-engine",
        "title": "Next.js Booking and Checkout Engine",
        "summary": "Production-style booking flow: search, detail, cart, checkout, and confirmation with resilient API boundaries.",
        "status": "Planned MVP",
        "targetApp": "apps/web-next",
        "stack": [
          "Next.js App Router",
          "TypeScript",
          "Server Actions and Route Handlers",
          "Zod",
          "Playwright"
        ],
        "recruiterSignals": [
          "I use this build to practice SSR and caching between listing and detail pages.",
          "I experiment with a login gate on checkout and clean redirect handling.",
          "I use it to sharpen pricing rules and promo logic with unit tests."
        ],
        "mvpScope": [
          "Build listing to detail to cart to checkout user flow.",
          "Implement price rules engine plus promo code breakdown.",
          "Add login gate for checkout and mock payment confirmation.",
          "Ship deploy-ready preview with CI lint, typecheck, and tests."
        ]
      },
      {
        "id": "angular-experiences-admin-console",
        "title": "Angular Experiences Admin Console",
        "summary": "Enterprise-focused admin panel for creating, reviewing, and publishing experiences with roles and audit visibility.",
        "status": "Planned MVP",
        "targetApp": "apps/admin-angular",
        "stack": [
          "Angular",
          "RxJS",
          "Reactive Forms",
          "Angular Router Guards",
          "Jest or Karma"
        ],
        "recruiterSignals": [
          "I use it to practice modular enterprise-style feature boundaries.",
          "I experiment with form-heavy flows and robust validation patterns.",
          "I test role-based access with a draft-to-published workflow."
        ],
        "mvpScope": [
          "Create admin roles: viewer, editor, admin with route guards.",
          "Build experience wizard with conditional fields and validation.",
          "Add review workflow: draft, review, published with audit trail.",
          "Implement filterable table plus CSV export and test coverage."
        ]
      }
    ]
  }
}
```


## Full Structured Content - apps/docs public portfolio JSON

### apps/docs/public/data/portfolio-content.fr.json


```json
{
  "profile": {
    "name": "Hassan Akkari",
    "role": "Software Developer oriente frontend",
    "focus": "Standards UI, composants reutilisables, flux coeur (React/TS/RTK).",
    "location": "Rome, Italie",
    "metric": "Ingenieur frontend - architecture UI et execution",
    "about": [
      "J'ai travaille sur Sibylla dans un contexte qui change vite: sans ordre, le projet cree de la friction. J'ai commence sur Platform en construisant des bases solides (jQuery/HTML/CSS) et des standards UI reutilisables; aujourd'hui sur Network je travaille de facon plus structurelle avec React + Redux Toolkit sur les flux coeur.",
      "Je resous le probleme, puis je le rends difficile a reproduire: standards, reutilisation, structure.",
      "Je reduis la friction d'equipe: conventions claires et composants reutilisables.",
      "Quand il faut, je connecte FE/BE: API, MVC, requetes et debugging.",
      "Je partage volontiers l'approche et l'impact; certains details internes restent hors scope."
    ],
    "now": "Actuellement sur Sibylla Network: j'ameliore la delivery avec des patterns reutilisables et une architecture plus propre. Je ne peux pas montrer les details internes, mais je peux expliquer clairement ce que j'ai construit.",
    "philosophy": "Je standardise d'abord, puis j'accelere. Quand le code est propre, l'equipe va plus vite.",
    "githubUsername": "Dark-lIl-Demon"
  },
  "contact": {
    "email": "hassan.akkari01@gmail.com",
    "resumePath": "pdf/CV-ENG-102025.pdf",
    "github": "https://github.com/Dark-lIl-Demon",
    "linkedin": "https://www.linkedin.com/in/hassan-akkari",
    "instagram": "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
    "facebook": "https://www.facebook.com/hassan.akkari.714"
  },
  "highlights": [
    "Standards UI (classes/styles)\nAvant: conventions eparpillees et duplications entre modules.\nApres: standards partages reutilises dans le temps par l'equipe.\nResultat: moins de regressions et maintenance plus rapide.",
    "Network: patterns reutilisables (React + Redux Toolkit)\nAvant: logiques distribuees et difficiles a scaler.\nApres: patterns et flux plus previsibles.\nResultat: livraison plus stable sur les flux coeur.",
    "Coherence UI (Bootstrap -> Tailwind quand applicable)\nAvant: layouts incoherents et composants similaires mais differents.\nApres: standards et composition plus consistants.\nResultat: iterations plus rapides sur les flux principaux.",
    "Debugging des cas limites et bugs complexes\nAvant: blocages longs et diagnostic fragmente.\nApres: isolation rapide, correction ciblee, prevention quand possible.\nResultat: equipe debloquee sans ralentir la livraison."
  ],
  "stack": {
    "daily": [
      "React (TSX)",
      "Redux Toolkit",
      "TypeScript",
      "JavaScript",
      "jQuery",
      "HTML5/CSS3",
      "Tailwind CSS"
    ],
    "comfortable": [
      "ASP.NET MVC",
      "C#",
      "SQL Server",
      "REST APIs",
      "UI standardization",
      "Cross-domain feature delivery"
    ],
    "exploring": [
      "Angular",
      "GraphQL",
      "Design tokens et gouvernance composants"
    ]
  },
  "experience": [
    {
      "company": "Sibylla (Platform et Network)",
      "location": "Italie",
      "role": "Frontend Developer - evolution dans le projet",
      "start": "Actuel",
      "end": "En cours",
      "bullets": [
        "J'ai commence sur Platform pour consolider les bases en jQuery, HTML et CSS.",
        "J'ai introduit des standards reutilisables de classes et styles, encore utilises par l'equipe.",
        "Maintenant sur Network, je pilote implementation booking, catalogue et checkout avec des patterns React et Redux Toolkit scalables."
      ]
    },
    {
      "company": "BetterTogether",
      "location": "Rome, Italie",
      "role": "Junior Developer Intern",
      "start": "Oct 2022",
      "end": "Juin 2023",
      "bullets": [
        "Developpement et maintenance de fonctionnalites internes avec focus formulaires et validation.",
        "Integration des flux frontend avec services .NET et donnees SQL Server.",
        "Corrections et refactors sur des workflows critiques avant livraison."
      ]
    }
  ],
  "education": [
    {
      "school": "Uxbridge College",
      "location": "Londres, UK",
      "qualification": "Diploma in Computer Science",
      "start": "Sept 2019",
      "end": "Juin 2021",
      "focus": "Fondations logicielles, concepts data et bases du developpement web."
    }
  ],
  "general": [
    {
      "title": "Langues",
      "items": [
        "Italien",
        "Anglais",
        "Arabe (Darija)"
      ]
    },
    {
      "title": "Collaboration",
      "items": [
        "Code reviews",
        "Handoff equipe",
        "Iteration agile"
      ]
    },
    {
      "title": "Tooling",
      "items": [
        "GitHub",
        "CI basics",
        "Figma handoff"
      ]
    }
  ],
  "projects": [
    {
      "id": "sibylla-network-ui-system",
      "title": "Sibylla Network - Mon parcours frontend",
      "summary": "J'ai commence sur Platform en creant des bases solides et des standards reutilisables. Sur Network j'ai apporte une approche plus structurelle avec React et Redux Toolkit, avec un focus sur la coherence UI et une livraison previsible.",
      "image": "image/enterprise-nda-placeholder.svg",
      "stack": [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS"
      ],
      "impact": [
        "Probleme: UI fragmentee et regles dupliquees entre modules.",
        "Intervention: standards + patterns reutilisables sur les flux coeur.",
        "Resultat: meilleure coherence UI et moins de regressions en livraison."
      ],
      "links": [
        {
          "label": "Produit live",
          "href": "https://sibyllanetwork.com",
          "kind": "live"
        },
        {
          "label": "Vous voulez savoir ce que j'ai construit?",
          "href": "#contact",
          "kind": "caseStudy"
        }
      ]
    },
    {
      "id": "bootstrap-tailwind-modernization",
      "title": "Bootstrap to Tailwind Modernization",
      "summary": "Migration de Bootstrap et packages vendor vers un workflow Tailwind axe coherence, vitesse et maintenance.",
      "image": "image/LaBrochure.png",
      "stack": [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "Frontend architecture"
      ],
      "impact": [
        "Standards UI plus coherents entre modules et composants.",
        "Reduction de la dependance vendor et des comportements UI fragmentes.",
        "Vitesse d'iteration amelioree sur layouts et composants.",
        "Creation de patterns utilitaires reutilisables et plus scalables entre modules."
      ],
      "links": [
        {
          "label": "Case Study",
          "href": "#contact",
          "kind": "caseStudy"
        },
        {
          "label": "GitHub",
          "href": "https://github.com/Dark-lIl-Demon",
          "kind": "github"
        }
      ]
    }
  ],
  "roadmap": [
    {
      "id": "next-booking-checkout-engine",
      "title": "Next.js Booking and Checkout Engine",
      "summary": "Flux booking style production: recherche, detail, panier, checkout et confirmation avec limites API robustes.",
      "status": "MVP planifie",
      "targetApp": "apps/web-next",
      "stack": [
        "Next.js App Router",
        "TypeScript",
        "Server Actions et Route Handlers",
        "Zod",
        "Playwright"
      ],
      "recruiterSignals": [
        "Je l'utilise pour pratiquer SSR et caching entre listing et detail.",
        "J'experimente un login gate sur checkout avec redirection propre.",
        "Je m'entraine sur regles de prix et logique promo avec tests unitaires."
      ],
      "mvpScope": [
        "Construire le flux listing -> detail -> cart -> checkout.",
        "Implementer moteur de prix et decomposition promo code.",
        "Ajouter gate login sur checkout et confirmation paiement simulee.",
        "Publier une preview deploy-ready avec CI lint, typecheck et tests."
      ]
    },
    {
      "id": "angular-experiences-admin-console",
      "title": "Angular Experiences Admin Console",
      "summary": "Console admin orientee enterprise pour creer, reviser et publier des experiences avec roles et audit visibles.",
      "status": "MVP planifie",
      "targetApp": "apps/admin-angular",
      "stack": [
        "Angular",
        "RxJS",
        "Reactive Forms",
        "Angular Router Guards",
        "Jest ou Karma"
      ],
      "recruiterSignals": [
        "Je l'utilise pour pratiquer une structure enterprise a features modulaires.",
        "J'experimente des workflows formulaires complexes et validations robustes.",
        "Je teste les acces par role avec un cycle draft-to-published."
      ],
      "mvpScope": [
        "Creer roles admin: viewer, editor, admin avec route guards.",
        "Construire wizard experience avec champs conditionnels et validations.",
        "Ajouter workflow review: draft, review, published avec audit trail.",
        "Implementer table filtrable avec export CSV et couverture de tests."
      ]
    }
  ]
}
```

### apps/docs/public/data/portfolio-content.it.json


```json
{
  "profile": {
    "name": "Hassan Akkari",
    "role": "Software Developer orientato al frontend",
    "focus": "Standard UI, componenti riutilizzabili, flussi core (React/TS/RTK).",
    "location": "Roma, Italia",
    "metric": "Frontend engineer - UI architecture & delivery",
    "about": [
      "Ho lavorato su Sibylla in un contesto dove le cose cambiano in fretta: se non metti ordine, il progetto ti mangia. Ho iniziato su Platform costruendo basi solide (jQuery/HTML/CSS) e standard UI riutilizzabili; oggi su Network lavoro in modo piu strutturale con React + Redux Toolkit sui flussi core.",
      "Risolvo il problema, poi lo rendo difficile da ripetere: standard, riuso, struttura.",
      "Riduco attrito nel team: convenzioni chiare e componenti riutilizzabili.",
      "Quando serve collego FE/BE: API, MVC, query e debugging.",
      "Condivido volentieri approccio e impatto; alcuni dettagli interni restano fuori."
    ],
    "now": "Attualmente su Sibylla Network: sto rendendo la delivery piu prevedibile con pattern React/Redux Toolkit riutilizzabili e maggiore coerenza UI.",
    "philosophy": "Prima risolvo il problema, poi faccio in modo che non torni.",
    "githubUsername": "Dark-lIl-Demon"
  },
  "contact": {
    "email": "hassan.akkari01@gmail.com",
    "resumePath": "pdf/CV-ITA-102025.pdf",
    "github": "https://github.com/Dark-lIl-Demon",
    "linkedin": "https://www.linkedin.com/in/hassan-akkari",
    "instagram": "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
    "facebook": "https://www.facebook.com/hassan.akkari.714"
  },
  "highlights": [
    "Standard UI (classi/stili)\nPrima: convenzioni sparse e duplicazioni tra moduli.\nDopo: standard condivisi riusati nel tempo dal team.\nRisultato: meno regressioni e manutenzione piu veloce.",
    "Network: pattern riusabili (React + Redux Toolkit)\nPrima: logiche distribuite e difficili da scalare.\nDopo: pattern e flussi piu prevedibili.\nRisultato: delivery piu stabile sui core flow.",
    "Coerenza UI (Bootstrap -> Tailwind dove applicabile)\nPrima: layout incoerenti e componenti simili ma diversi.\nDopo: standard e composizione piu consistenti.\nRisultato: iterazioni piu rapide sui flussi principali.",
    "Debugging su edge case e bug complessi\nPrima: blocchi lunghi e diagnosi frammentata.\nDopo: isolamento rapido, fix mirato, prevenzione dove possibile.\nRisultato: team sbloccato senza rallentare la release."
  ],
  "stack": {
    "daily": [
      "React (TSX)",
      "Redux Toolkit",
      "TypeScript",
      "JavaScript",
      "jQuery",
      "HTML5/CSS3",
      "Tailwind CSS"
    ],
    "comfortable": [
      "ASP.NET MVC",
      "C#",
      "SQL Server",
      "REST APIs",
      "UI standardization",
      "Cross-domain feature delivery"
    ],
    "exploring": [
      "Angular",
      "GraphQL",
      "Design tokens e governance componenti"
    ]
  },
  "experience": [
    {
      "company": "Sibylla (Platform e Network)",
      "location": "Italia",
      "role": "Frontend Developer - cresciuto con il progetto",
      "start": "Attuale",
      "end": "In corso",
      "bullets": [
        "Ho iniziato su Platform: consolidato basi con jQuery, HTML e CSS, poi introdotto standard di classi e stili ancora usati.",
        "Passato su Network: lavoro piu strutturale con React + Redux Toolkit e pattern riusabili sui flussi booking, catalogo e checkout.",
        "Ho migliorato coerenza UI e ridotto frammentazione (Bootstrap -> Tailwind dove applicabile), mantenendo una delivery stabile."
      ]
    },
    {
      "company": "BetterTogether",
      "location": "Roma, Italia",
      "role": "Junior Developer Intern",
      "start": "Ott 2022",
      "end": "Giu 2023",
      "bullets": [
        "Sviluppo e manutenzione di feature interne con attenzione a form e validazione dati.",
        "Integrazione flussi frontend con servizi .NET e dati SQL Server.",
        "Fix e refactor su workflow critici prima del rilascio."
      ]
    }
  ],
  "education": [
    {
      "school": "Uxbridge College",
      "location": "Londra, UK",
      "qualification": "Diploma in Computer Science",
      "start": "Set 2019",
      "end": "Giu 2021",
      "focus": "Fondamenti software, concetti dati e basi di sviluppo web."
    }
  ],
  "general": [
    {
      "title": "Lingue",
      "items": [
        "Italiano",
        "Inglese",
        "Arabo (Darija)"
      ]
    },
    {
      "title": "Collaborazione",
      "items": [
        "Code review",
        "Handoff di team",
        "Iterazione agile"
      ]
    },
    {
      "title": "Tooling",
      "items": [
        "GitHub",
        "CI basics",
        "Figma handoff"
      ]
    }
  ],
  "projects": [
    {
      "id": "sibylla-network-ui-system",
      "title": "Sibylla Network - Il mio percorso frontend",
      "summary": "Ho iniziato su Platform creando basi solide e standard riutilizzabili. Su Network ho portato un approccio piu strutturale con React e Redux Toolkit, con focus su coerenza UI e delivery prevedibile.",
      "image": "image/enterprise-nda-placeholder.svg",
      "stack": [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS"
      ],
      "impact": [
        "Problema: UI frammentata e regole replicate tra moduli.",
        "Intervento: standard + pattern riusabili sui flussi core.",
        "Risultato: maggiore coerenza UI e meno regressioni in rilascio."
      ],
      "links": [
        {
          "label": "Sito live",
          "href": "https://sibyllanetwork.com",
          "kind": "live"
        },
        {
          "label": "Vuoi sapere cosa ho costruito?",
          "href": "#contact",
          "kind": "caseStudy"
        }
      ]
    },
    {
      "id": "bootstrap-tailwind-modernization",
      "title": "Bootstrap to Tailwind Modernization",
      "summary": "Migrazione da Bootstrap e pacchetti vendor a workflow Tailwind orientato a consistenza, velocita e manutenzione.",
      "image": "image/LaBrochure.png",
      "stack": [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "Frontend architecture"
      ],
      "impact": [
        "Standard UI piu coerenti tra moduli e componenti.",
        "Ridotta dipendenza da vendor e meno comportamento UI frammentato.",
        "Iterazioni su layout e componenti piu rapide nei flussi principali."
      ],
      "links": [
        {
          "label": "Case Study",
          "href": "#contact",
          "kind": "caseStudy"
        },
        {
          "label": "GitHub",
          "href": "https://github.com/Dark-lIl-Demon",
          "kind": "github"
        }
      ]
    }
  ],
  "roadmap": [
    {
      "id": "next-booking-checkout-engine",
      "title": "Next.js Booking and Checkout Engine",
      "summary": "Flusso booking in stile produzione: ricerca, dettaglio, carrello, checkout e conferma con confini API robusti.",
      "status": "MVP pianificato",
      "targetApp": "apps/web-next",
      "stack": [
        "Next.js App Router",
        "TypeScript",
        "Server Actions e Route Handlers",
        "Zod",
        "Playwright"
      ],
      "recruiterSignals": [
        "Lo uso per allenarmi su SSR e caching tra listing e dettaglio.",
        "Sperimento login gate sul checkout e redirect pulito dopo auth.",
        "Mi esercito su regole prezzo e logica promo con test unit."
      ],
      "mvpScope": [
        "Costruire il flusso listing -> detail -> cart -> checkout.",
        "Implementare price rules engine e breakdown promo code.",
        "Aggiungere login gate sul checkout e conferma pagamento simulata.",
        "Pubblicare preview deploy-ready con CI lint, typecheck e test."
      ]
    },
    {
      "id": "angular-experiences-admin-console",
      "title": "Angular Experiences Admin Console",
      "summary": "Pannello admin orientato enterprise per creare, revisionare e pubblicare esperienze con ruoli e audit chiaro.",
      "status": "MVP pianificato",
      "targetApp": "apps/admin-angular",
      "stack": [
        "Angular",
        "RxJS",
        "Reactive Forms",
        "Angular Router Guards",
        "Jest o Karma"
      ],
      "recruiterSignals": [
        "Lo uso per provare una struttura enterprise a feature modulari.",
        "Sperimento workflow form complessi e validazioni robuste.",
        "Testo accessi per ruolo con ciclo draft-to-published."
      ],
      "mvpScope": [
        "Creare ruoli admin: viewer, editor, admin con route guards.",
        "Costruire wizard esperienza con campi condizionali e validazioni.",
        "Aggiungere workflow review: draft, review, published con audit trail.",
        "Implementare tabella filtrabile con export CSV e test coverage."
      ]
    }
  ]
}
```

### apps/docs/public/data/portfolio-content.json


```json
{
  "profile": {
    "name": "Hassan Akkari",
    "role": "Frontend-focused Software Developer",
    "focus": "UI standards, reusable components, core flows (React/TS/RTK).",
    "location": "Rome, Italy",
    "metric": "Frontend engineer - UI architecture & delivery",
    "about": [
      "I have worked on Sibylla in a fast-moving environment: if you do not create order, the project creates friction. I started on Platform building solid foundations (jQuery/HTML/CSS) and reusable UI standards; today on Network I work more structurally with React + Redux Toolkit on core flows.",
      "I solve the problem, then make it hard to repeat: standards, reuse, structure.",
      "I reduce team friction: clear conventions and reusable components.",
      "When needed, I connect FE/BE: APIs, MVC, queries, and debugging.",
      "I am happy to share approach and impact; some internal details stay out."
    ],
    "now": "Currently on Sibylla Network: improving delivery with reusable patterns and cleaner architecture. I cannot show internals, but I can clearly explain what I built and why it helped.",
    "philosophy": "Standardize first, then accelerate. Clean code helps the whole team ship faster.",
    "githubUsername": "Dark-lIl-Demon"
  },
  "contact": {
    "email": "hassan.akkari01@gmail.com",
    "resumePath": "pdf/CV-ENG-102025.pdf",
    "github": "https://github.com/Dark-lIl-Demon",
    "linkedin": "https://www.linkedin.com/in/hassan-akkari",
    "instagram": "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
    "facebook": "https://www.facebook.com/hassan.akkari.714"
  },
  "highlights": [
    "UI standards (classes/styles)\nBefore: conventions were scattered and duplicated across modules.\nAfter: shared standards reused over time by the team.\nResult: fewer regressions and faster maintenance.",
    "Network reusable patterns (React + Redux Toolkit)\nBefore: logic was distributed and hard to scale.\nAfter: patterns and flows became more predictable.\nResult: more stable delivery on core flows.",
    "UI consistency (Bootstrap -> Tailwind where applicable)\nBefore: inconsistent layouts and similar-but-different components.\nAfter: more consistent standards and composition.\nResult: faster iterations on core flows.",
    "Debugging edge cases and complex bugs\nBefore: long blockers and fragmented diagnosis.\nAfter: quick isolation, targeted fixes, prevention where possible.\nResult: team unblocked without slowing release."
  ],
  "stack": {
    "daily": [
      "React (TSX)",
      "Redux Toolkit",
      "TypeScript",
      "JavaScript",
      "jQuery",
      "HTML5/CSS3",
      "Tailwind CSS"
    ],
    "comfortable": [
      "ASP.NET MVC",
      "C#",
      "SQL Server",
      "REST APIs",
      "UI standardization",
      "Cross-domain feature delivery"
    ],
    "exploring": [
      "Angular",
      "GraphQL",
      "Design tokens and component governance"
    ]
  },
  "experience": [
    {
      "company": "Sibylla (Platform and Network)",
      "location": "Italy",
      "role": "Frontend Developer (Platform Foundations and Network Delivery)",
      "start": "Current",
      "end": "Present",
      "bullets": [
        "Started on Sibylla Platform, strengthening frontend fundamentals with jQuery, HTML, and CSS.",
        "Introduced reusable class and style standards that became shared conventions and are still used.",
        "Now on Sibylla Network, lead implementation across booking, catalog, and checkout with scalable React and Redux Toolkit patterns."
      ]
    },
    {
      "company": "BetterTogether",
      "location": "Rome, Italy",
      "role": "Junior Developer Intern",
      "start": "Oct 2022",
      "end": "Jun 2023",
      "bullets": [
        "Built and maintained internal web features with focus on forms and data validation.",
        "Integrated front-end workflows with .NET services and SQL Server data.",
        "Contributed bug fixes and refactors on critical business flows before release."
      ]
    }
  ],
  "education": [
    {
      "school": "Uxbridge College",
      "location": "London, UK",
      "qualification": "Diploma in Computer Science",
      "start": "Sep 2019",
      "end": "Jun 2021",
      "focus": "Software foundations, data concepts, and web development basics."
    }
  ],
  "general": [
    {
      "title": "Languages",
      "items": [
        "Italian",
        "English",
        "Arabic (Darija)"
      ]
    },
    {
      "title": "Collaboration",
      "items": [
        "Code reviews",
        "Team handoff",
        "Agile iteration"
      ]
    },
    {
      "title": "Tooling",
      "items": [
        "GitHub",
        "CI basics",
        "Figma handoff"
      ]
    }
  ],
  "projects": [
    {
      "id": "sibylla-network-ui-system",
      "title": "Sibylla Network - My Frontend Journey",
      "summary": "I started on Platform building solid foundations and reusable standards. On Network I brought a more structural approach with React and Redux Toolkit, with focus on UI consistency and predictable delivery.",
      "image": "image/enterprise-nda-placeholder.svg",
      "stack": [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS"
      ],
      "impact": [
        "Problem: fragmented UI and duplicated rules across modules.",
        "Intervention: standards + reusable patterns on core flows.",
        "Result: stronger UI consistency and fewer release regressions."
      ],
      "links": [
        {
          "label": "Live product",
          "href": "https://sibyllanetwork.com",
          "kind": "live"
        },
        {
          "label": "Want to know what I built?",
          "href": "#contact",
          "kind": "caseStudy"
        }
      ]
    },
    {
      "id": "bootstrap-tailwind-modernization",
      "title": "Bootstrap to Tailwind Modernization",
      "summary": "Migration from Bootstrap and vendor UI packages to a Tailwind workflow focused on consistency, speed, and maintainability.",
      "image": "image/LaBrochure.png",
      "stack": [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "Frontend architecture"
      ],
      "impact": [
        "More consistent UI standards across modules and components.",
        "Reduced vendor dependency and fragmented UI behaviour.",
        "Improved layout and component iteration speed for the team.",
        "Created reusable utility patterns that scale better across modules."
      ],
      "links": [
        {
          "label": "Case Study",
          "href": "#contact",
          "kind": "caseStudy"
        },
        {
          "label": "GitHub",
          "href": "https://github.com/Dark-lIl-Demon",
          "kind": "github"
        }
      ]
    }
  ],
  "roadmap": [
    {
      "id": "next-booking-checkout-engine",
      "title": "Next.js Booking and Checkout Engine",
      "summary": "Production-style booking flow: search, detail, cart, checkout, and confirmation with resilient API boundaries.",
      "status": "Planned MVP",
      "targetApp": "apps/web-next",
      "stack": [
        "Next.js App Router",
        "TypeScript",
        "Server Actions and Route Handlers",
        "Zod",
        "Playwright"
      ],
      "recruiterSignals": [
        "I use this build to practice SSR and caching between listing and detail pages.",
        "I experiment with a login gate on checkout and clean redirect handling.",
        "I use it to sharpen pricing rules and promo logic with unit tests."
      ],
      "mvpScope": [
        "Build listing to detail to cart to checkout user flow.",
        "Implement price rules engine plus promo code breakdown.",
        "Add login gate for checkout and mock payment confirmation.",
        "Ship deploy-ready preview with CI lint, typecheck, and tests."
      ]
    },
    {
      "id": "angular-experiences-admin-console",
      "title": "Angular Experiences Admin Console",
      "summary": "Enterprise-focused admin panel for creating, reviewing, and publishing experiences with roles and audit visibility.",
      "status": "Planned MVP",
      "targetApp": "apps/admin-angular",
      "stack": [
        "Angular",
        "RxJS",
        "Reactive Forms",
        "Angular Router Guards",
        "Jest or Karma"
      ],
      "recruiterSignals": [
        "I use it to practice modular enterprise-style feature boundaries.",
        "I experiment with form-heavy flows and robust validation patterns.",
        "I test role-based access with a draft-to-published workflow."
      ],
      "mvpScope": [
        "Create admin roles: viewer, editor, admin with route guards.",
        "Build experience wizard with conditional fields and validation.",
        "Add review workflow: draft, review, published with audit trail.",
        "Implement filterable table plus CSV export and test coverage."
      ]
    }
  ]
}
```


## Full Structured Content - apps/web-next catalogue


```json
{
  "experiences": [
    {
      "slug": "rome-night-food-tour",
      "title": "Rome Night Food Tour",
      "location": "Rome",
      "durationHours": 3,
      "summary": "A guided evening route across local food spots with live availability and constrained slots.",
      "highlights": [
        "Strong candidate for promo and capacity constraints",
        "Shows rich listing and detail page handling",
        "Useful for dynamic SEO metadata in App Router"
      ],
      "basePrice": 45,
      "priceModel": "per_person"
    },
    {
      "slug": "vatican-fast-track",
      "title": "Vatican Fast Track Entry",
      "location": "Vatican City",
      "durationHours": 2,
      "summary": "Timed-entry product with strict date handling and minimum booking amount.",
      "highlights": [
        "Useful for minimum-price vs per-person rules",
        "Good case for checkout protection and retries",
        "Works well with server-validated pricing requests"
      ],
      "basePrice": 28,
      "minimumGroupPrice": 120,
      "priceModel": "minimum_group"
    },
    {
      "slug": "tiber-boat-sunset",
      "title": "Tiber Boat Sunset Experience",
      "location": "Rome",
      "durationHours": 2,
      "summary": "A mixed family and team booking scenario used to validate grouped pricing paths.",
      "highlights": [
        "Ideal for team promo conditions",
        "Useful to demo cart breakdown clarity",
        "Supports practical accessibility checks on forms"
      ],
      "basePrice": 37,
      "priceModel": "per_person"
    }
  ]
}
```


## Extracted Candidate Visible Strings - apps/docs pages/components

### apps/docs/src/pages/AuditPage.tsx

- L46 [string]: meta[name="description"]
- L71 [jsx-attr:aria-label]: Home
- L72 [jsx-attr:alt]: Laboratoire logo
- L303 [template]: audit-faq-${...}
- L318 [template]: audit-faq-${...}

### apps/docs/src/pages/CvPage.tsx

- L31 [template]: ${...}${...}
- L118 [template]: ${...}-${...}
- L135 [template]: ${...}-${...}

### apps/docs/src/components/layout/Container.tsx

- L9 [template]: container ${...}

### apps/docs/src/components/sections/AboutSection.tsx

- L65 [template]: Updated ${...}
- L98 [template]: ${...}-${...}
- L116 [template]: ${...}-${...}
- L152 [template]: ${...}image/mePNG.png
- L153 [jsx-attr:alt]: Hassan portrait
- L232 [template]: tab-links ${...}

### apps/docs/src/components/sections/ContactForm.tsx

- L12 [string]: formName
- L12 [string]: formEmail
- L12 [string]: formMessage
- L12 [string]: formSubmit
- L12 [string]: formSuccess

### apps/docs/src/components/sections/ContactSection.tsx

- L55 [property:label]: Instagram
- L63 [property:label]: Facebook

### apps/docs/src/components/sections/FAQSection.tsx

- L62 [template]: faq-${...}
- L77 [template]: faq-${...}

### apps/docs/src/components/sections/HeroSection.tsx

- L18 [template]: ${...}image/portrait.png

### apps/docs/src/components/sections/HighlightsSection.tsx

- L52 [template]: ${...}-${...}

### apps/docs/src/components/sections/PortfolioSection.tsx

- L34 [template]: ${...}${...}
- L62 [template]: ${...}${...}
- L63 [template]: ${...} preview
- L78 [template]: ${...}-${...}

### apps/docs/src/components/sections/RoadmapSection.tsx

- L59 [template]: ${...}-${...}
- L67 [template]: ${...}-${...}

### apps/docs/src/components/sections/contactForm.schema.ts

- L4 [string]: Name is too short.
- L5 [string]: Email is not valid.
- L6 [string]: Message should be at least 10 characters.

### apps/docs/src/components/ui/LocaleSwitcher.tsx

- L20 [template]: locale-switcher ${...}
- L29 [template]: locale-switcher__button ${...}
- L30 [string]: locale-switcher__button--active


## Extracted Candidate Visible Strings - apps/web-react

### apps/web-react/src/components/forms/HeroForm.tsx

- L56 [string]: Form validata con Zod.
- L69 [jsx-text]: HeroUI form
- L71 [jsx-text]: Input, select, textarea e toggle con stile uniforme.
- L80 [jsx-attr:placeholder]: Hassan
- L89 [jsx-attr:placeholder]: nome@email.com
- L101 [jsx-attr:placeholder]: Seleziona un ruolo
- L115 [jsx-attr:placeholder]: Scrivi qui...
- L129 [jsx-text]: Newsletter
- L136 [jsx-text]: Priorita alta
- L142 [jsx-text]: Invia
- L153 [jsx-text]: Annulla
- L156 [jsx-text]: Salva bozza

### apps/web-react/src/components/forms/heroForm.schema.ts

- L4 [property:label]: Frontend
- L5 [property:label]: Backend
- L6 [property:label]: Full-stack
- L7 [property:label]: Design
- L11 [string]: Nome troppo corto.
- L12 [string]: Email non valida.
- L13 [string]: Seleziona un ruolo.
- L14 [string]: Minimo 10 caratteri.

### apps/web-react/src/components/layout/PageHeader.tsx

- L17 [jsx-text]: Tailwind + HeroUI base kit
- L20 [jsx-text]: Componenti pronti (bottoni, form, theme) da riusare ovunque.
- L25 [jsx-text]: Switch to
- L27 [jsx-text]: Primary action
- L29 [jsx-text]: Secondary

### apps/web-react/src/components/sections/NextSteps.tsx

- L4 [jsx-text]: Next steps
- L6 [jsx-text]: Importa i componenti Tailwind Plus in `src/components`.
- L7 [jsx-text]: Decidi palette brand definitiva (tokens + HeroUI).
- L8 [jsx-text]: Aggiungi pagine reali e routing.

### apps/web-react/src/components/sections/StatusCard.tsx

- L9 [property:label]: Online
- L10 [property:label]: Offline
- L11 [property:label]: Checking
- L12 [property:label]: Unknown
- L25 [jsx-text]: API status
- L32 [jsx-text]: Endpoint:
- L34 [jsx-text]: MSW attivo solo in dev.

### apps/web-react/src/components/sections/ThemeTokensCard.tsx

- L7 [jsx-text]: Theme tokens
- L10 [jsx-text]: Colori gestiti con CSS variables (light/dark).

### apps/web-react/src/main.tsx

- L23 [string]: serviceWorker
- L26 [string]: 127.0.0.1
- L30 [string]: [MSW] Service Worker non disponibile in questo contesto; mock disabilitati.
- L39 [string]: mockServiceWorker.js
- L41 [string]: [MSW] Mocking abilitato.
- L43 [string]: [MSW] Impossibile avviare i mock:


## Extracted Candidate Visible Strings - apps/web-next pages/api/lib

### apps/web-next/app/api/checkout/route.ts

- L11 [property:error]: Invalid checkout payload
- L21 [property:error]: Experience not found for provided slug

### apps/web-next/app/api/quote/route.ts

- L11 [property:error]: Invalid quote payload
- L21 [property:error]: Experience not found for provided slug

### apps/web-next/app/cart/page.tsx

- L24 [string]: promoCode
- L36 [jsx-text]: Cart
- L38 [jsx-text]: Missing or invalid booking parameters. Open an experience and build a quote first.
- L43 [jsx-text]: Back to listing
- L56 [jsx-text]: Cart summary
- L59 [jsx-text]: hours /
- L60 [jsx-text]: guests /
- L64 [jsx-text]: Subtotal
- L68 [jsx-text]: Discount
- L72 [jsx-text]: Service fee
- L76 [jsx-text]: Tax
- L80 [jsx-text]: Total
- L85 [jsx-text]: Pricing rule:
- L91 [jsx-text]: Proceed
- L93 [jsx-text]: Checkout is protected: if not authenticated you will be redirected to login and then returned here.
- L98 [jsx-text]: Continue to checkout
- L104 [jsx-text]: Edit booking
- L107 [jsx-text]: Back to listing

### apps/web-next/app/checkout/page.tsx

- L25 [string]: promoCode
- L37 [jsx-text]: Checkout
- L38 [jsx-text]: Invalid booking context. Start from an experience page.
- L41 [jsx-text]: Back to listing
- L53 [string]: use server
- L59 [string]: promoCode
- L60 [string]: fullName
- L62 [string]: paymentMethod
- L63 [string]: idempotencyKey
- L77 [jsx-text]: Checkout
- L79 [jsx-text]: Protected route unlocked. Submit once or multiple times: same idempotency key returns the same order.
- L90 [jsx-text]: Full name
- L94 [jsx-attr:placeholder]: Hassan Akkari
- L101 [jsx-text]: Email
- L106 [jsx-attr:placeholder]: you@example.com
- L112 [jsx-text]: Payment method
- L114 [jsx-text]: Card
- L115 [jsx-text]: Wallet
- L121 [jsx-text]: Confirm order
- L124 [jsx-text]: Back to cart
- L131 [jsx-text]: Order preview
- L134 [jsx-text]: guests /
- L138 [jsx-text]: Subtotal
- L142 [jsx-text]: Discount
- L146 [jsx-text]: Service fee
- L150 [jsx-text]: Total
- L155 [jsx-text]: Rule:

### apps/web-next/app/confirmation/[orderId]/page.tsx

- L28 [jsx-text]: Order confirmed
- L30 [jsx-text]: Confirmation ID:
- L33 [jsx-text]: Created at
- L37 [jsx-text]: Customer:
- L38 [jsx-text]: Email:
- L39 [jsx-text]: Experience:
- L41 [jsx-text]: Guests:
- L46 [jsx-text]: Create another booking
- L52 [jsx-text]: Final total
- L55 [jsx-text]: Subtotal
- L59 [jsx-text]: Discount
- L63 [jsx-text]: Service fee
- L67 [jsx-text]: Tax
- L71 [jsx-text]: Total

### apps/web-next/app/experiences/[slug]/page.tsx

- L31 [jsx-text]: Experience detail
- L39 [string]: Minimum group pricing
- L40 [string]: Per-person pricing
- L47 [jsx-text]: Why this route matters
- L54 [jsx-text]: Price input is validated server-side later in cart and checkout to avoid inconsistent totals.
- L60 [jsx-text]: Build quote
- L64 [jsx-text]: Guests
- L76 [jsx-text]: Date
- L87 [jsx-text]: Promo code (optional)
- L96 [jsx-text]: Continue to cart
- L101 [jsx-text]: Back to listing

### apps/web-next/app/layout.tsx

- L9 [property:title]: Web Next | Booking Checkout Engine
- L11 [property:description]: Production-style Next.js booking and checkout flow with protected routes and pricing rules.
- L36 [jsx-text]: Listing
- L38 [jsx-text]: Cart
- L41 [jsx-text]: Checkout
- L44 [jsx-text]: Login

### apps/web-next/app/login/page.tsx

- L24 [string]: use server
- L49 [jsx-text]: Login required
- L51 [jsx-text]: Checkout is protected to show a realistic auth gate and redirect flow.
- L54 [jsx-text]: Demo mode: click continue and we set a short-lived secure cookie for this browser session.
- L60 [jsx-text]: Continue to checkout
- L65 [jsx-text]: Back to listing
- L71 [jsx-text]: Auth behavior
- L73 [jsx-text]: Unauthenticated access to checkout redirects to this page.
- L74 [jsx-text]: After login, user returns to original path via next query param.
- L75 [jsx-text]: Cookie is HTTP-only and expires automatically.

### apps/web-next/app/not-found.tsx

- L6 [jsx-text]: Page not found
- L8 [jsx-text]: The requested route is missing or the confirmation state has expired.
- L12 [jsx-text]: Back to listing

### apps/web-next/app/page.tsx

- L37 [jsx-text]: Booking and Checkout Engine (MVP)
- L39 [jsx-text]: Next.js app-router demo focused on concrete capability proof: protected checkout, server-validated pricing rules, and idempotent order confirmation.
- L43 [jsx-text]: SSR-ready listing + details
- L44 [jsx-text]: Route handler API boundaries
- L45 [jsx-text]: Auth gate + redirect to original route
- L46 [jsx-text]: Price rules engine with unit tests
- L51 [jsx-text]: Experience listing
- L53 [jsx-text]: Search by title, location, or short description. Then open detail and continue to cart.
- L62 [jsx-attr:placeholder]: Search experiences...
- L63 [jsx-attr:aria-label]: Search experiences
- L66 [jsx-text]: Search
- L70 [jsx-text]: Clear
- L86 [string]: minimum group
- L87 [string]: per person
- L92 [jsx-text]: Open detail
- L98 [jsx-text]: Quick cart

### apps/web-next/lib/data.ts

- L18 [property:title]: Rome Night Food Tour
- L19 [property:location]: Rome
- L22 [property:summary]: A guided evening route across local food spots with live availability and constrained slots.
- L24 [array-item]: Strong candidate for promo and capacity constraints
- L25 [array-item]: Shows rich listing and detail page handling
- L26 [array-item]: Useful for dynamic SEO metadata in App Router
- L33 [property:title]: Vatican Fast Track Entry
- L34 [property:location]: Vatican City
- L37 [property:summary]: Timed-entry product with strict date handling and minimum booking amount.
- L39 [array-item]: Useful for minimum-price vs per-person rules
- L40 [array-item]: Good case for checkout protection and retries
- L41 [array-item]: Works well with server-validated pricing requests
- L49 [property:title]: Tiber Boat Sunset Experience
- L50 [property:location]: Rome
- L53 [property:summary]: A mixed family and team booking scenario used to validate grouped pricing paths.
- L55 [array-item]: Ideal for team promo conditions
- L56 [array-item]: Useful to demo cart breakdown clarity
- L57 [array-item]: Supports practical accessibility checks on forms

### apps/web-next/lib/date.ts

- L6 [template]: ${...}-${...}-${...}

### apps/web-next/lib/orders.ts

- L81 [template]: ord_${...}

### apps/web-next/lib/pricing.ts

- L37 [property:label]: NETWORK10 (10%)
- L43 [property:label]: TEAM5 (5%)
- L86 [template]: Experience "${...}" not found
- L125 [string]: Minimum group safeguard
- L126 [string]: Per-person pricing


## Extracted Candidate Visible Strings - packages/ui

This package is a shared UI library, not a page surface. User-facing strings found here are generic component labels only.

### packages/ui/src/components/ThemeToggle.tsx

- `Dark mode`
- `Light mode`

### packages/ui/src/components/heroui/AppButton.stories.tsx

- Storybook title: `HeroUI/AppButton`
- Story button text: `Press me`
