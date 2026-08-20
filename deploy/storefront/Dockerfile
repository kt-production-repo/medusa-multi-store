# Next.js storefront for the Medusa 2 multi-vendor store — Dokploy.
#
# Upstream code (apps/storefront) is copied in untouched.
# Build context = repository root.

# ---------------------------------------------------------------- deps
FROM node:20-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat curl tini git

COPY apps/storefront/package.json apps/storefront/yarn.lock ./

# nextjs-starter-medusa declares packageManager yarn@4.12.0 but ships no
# .yarn/releases, so corepack fetches it.
RUN corepack enable && \
    corepack prepare yarn@4.12.0 --activate && \
    yarn config set nodeLinker node-modules && \
    yarn install --network-timeout 600000

# ---------------------------------------------------------------- builder
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.12.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY apps/storefront/ ./

# Our additive storefront overlay (search UI, etc.). Copied AFTER upstream so it
# lays on top without mutating apps/storefront — same pattern as the backend
# Dockerfile. Paths here do not exist upstream (see scripts/check-overlay.sh).
#
# CACHEBUST: bump this value to force Docker to invalidate the overlay layer
# and everything downstream (build + runtime). Without this, BuildKit may
# serve a stale cached image even when overlay files change.
ARG CACHEBUST=1
COPY overlay/storefront/src/ ./src/
COPY overlay/storefront/tailwind.config.js ./tailwind.config.js

# check-env-variables.js hard-exits the build if the publishable key is
# absent, and NEXT_PUBLIC_* values are inlined into the client bundle.
# Both therefore must arrive as build args, not runtime env.
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=gb
ARG NEXT_PUBLIC_STRIPE_KEY=

ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY} \
    MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL} \
    NEXT_PUBLIC_DEFAULT_REGION=${NEXT_PUBLIC_DEFAULT_REGION} \
    NEXT_PUBLIC_STRIPE_KEY=${NEXT_PUBLIC_STRIPE_KEY} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN yarn build

# ---------------------------------------------------------------- runtime
FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache tini curl && \
    addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/check-env-variables.js ./check-env-variables.js

USER nextjs

# next.config.js calls checkEnvVariables() at module load, and `next start`
# loads next.config.js too — not just `next build`. So the publishable key
# must be present at RUNTIME as well, or the process exits on boot and
# Traefik reports 502 Bad Gateway.
#
# ARG values do not survive into this stage (it is a fresh FROM), so the
# build args are re-declared here and baked in as defaults. Dokploy runtime
# environment variables still override these.
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=gb

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8000 \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY} \
    MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL} \
    NEXT_PUBLIC_DEFAULT_REGION=${NEXT_PUBLIC_DEFAULT_REGION}

EXPOSE 8000

# Upstream "start" script is `next start -p 8000`.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node_modules/.bin/next", "start", "-p", "8000"]
