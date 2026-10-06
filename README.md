# corra

Corra — phase-aware protein website with premium Three.js product choreography, GSAP animations and responsive editorial design.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, Three.js, GSAP (ScrollTrigger/SplitText) and Lenis. Deployed on Vercel.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Checks and build

```sh
npm run typecheck
npm run lint
npm run build
```

## Contact form database

`POST /api/contact` stores messages in Postgres (e.g. Neon) using the `DATABASE_URL` environment variable. Without it, the form responds with "could not be saved".

1. Create a Postgres database and set `DATABASE_URL` in the Vercel project (and in `.env.local` for local development).
2. Apply the schema once: `psql "$DATABASE_URL" -f db/migrations/0001_contact_messages.sql`

## Source map

- `app/`: page, layout, shared styles, local fonts and the contact API route.
- `components/corra/`: product experience, WebGL scene, pouch artwork, testimonials and contact UI.
- `components/ui/`: shadcn/ui components.
- `lib/product-world.ts`: lit Three.js pouch geometry and rendering.
- `lib/product-choreography.ts`: coordinated desktop/mobile product motion.
- `lib/motion.ts` and `lib/animation.ts`: GSAP/Lenis setup and section animations.
- `public/images/`: packaging, logo and lifestyle imagery.
- `db/`: contact storage and SQL migration.
