# PLAYLIST

A minimal Astro video collection with an admin submission portal, inline video previews, favorites, Astro DB, and Cloudflare Workers deployment support.

## Development

Install dependencies and start Astro:

```sh
npm install
npm run dev
```

Development uses Astro DB's persistent file-backed database at `local.db`, configured by
`.env`. The schema is defined in `db/config.ts`, and `npm run dev` pushes the schema before
idempotently populating development data from `db/seed.ts`.

## Turso Production Database

Production uses a remote Turso libSQL database through Astro DB.

1. Create a Turso database and token.
2. Copy `.env.production.example` to `.env.production` for local production builds and schema commands.
3. Set these variables in the Cloudflare build environment and deployed Worker:

```text
ASTRO_DB_REMOTE_URL=libsql://your-database-name.turso.io
ASTRO_DB_APP_TOKEN=your-turso-auth-token
```

4. Push the Astro DB schema to Turso:

```sh
npm run db:push:production
```

`ASTRO_DB_APP_TOKEN` is a secret. Do not commit it or place it in `wrangler.jsonc`.
The production database must receive this schema before the Worker is deployed. Running
`npm run db:push` with the development `.env` only updates `local.db`.

## Cloudflare Workers

The app uses `@astrojs/cloudflare` and is configured in `wrangler.jsonc`. Production builds
configure Astro DB with `mode: 'web'` because Cloudflare Workers cannot use a file-backed
SQLite database.

Build and deploy:

```sh
npm run deploy
```

The production build script uses `astro build --remote`, which connects the generated Worker
to Turso. A production build requires a remote `ASTRO_DB_REMOTE_URL` and will fail instead of
silently falling back to `file:./local.db`. Use `npm run dev` for file-backed local SQLite
development.

To add the Turso token directly to an existing Worker through Wrangler:

```sh
npx wrangler secret put ASTRO_DB_APP_TOKEN
```

Set `ASTRO_DB_REMOTE_URL` as a Cloudflare environment variable, and make sure both values are also available to the platform running `npm run build`.
