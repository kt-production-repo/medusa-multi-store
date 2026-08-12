# Medusa 2 backend — multi-vendor marketplace, built for Dokploy.
#
# One image, two Dokploy services:
#   backend-server  -> MEDUSA_WORKER_MODE=server, DISABLE_MEDUSA_ADMIN=false
#   backend-worker  -> MEDUSA_WORKER_MODE=worker, DISABLE_MEDUSA_ADMIN=true
#
# Upstream code (apps/backend) is copied in untouched; our marketplace
# overlay is layered on top afterwards. Nothing in the repo is mutated.
#
# Build context = repository root.

# ---------------------------------------------------------------- builder
FROM node:20-alpine AS builder

# WORKDIR must be /server, not /app — avoids Medusa Admin widget resolution
# bugs in Docker. See docs.medusajs.com troubleshooting/medusa-admin.
WORKDIR /server

RUN apk add --no-cache libc6-compat python3 make g++

# 1. Official upstream manifest + yarn 4 runtime, for a cached install layer.
COPY apps/backend/package.json apps/backend/yarn.lock apps/backend/.yarnrc.yml ./
COPY apps/backend/.yarn/releases ./.yarn/releases

RUN yarn install --immutable

# 2. Official upstream source, untouched.
COPY apps/backend/ ./

# 3. Our additive marketplace overlay (src/api, src/links, src/modules,
#    src/workflows) — none of these paths exist upstream.
COPY overlay/backend/src/ ./src/

# 4. Our production medusa-config.ts. This is the ONLY upstream file we
#    replace, and only inside the image.
COPY overlay/backend/medusa-config.ts ./medusa-config.ts

# 5. Meilisearch JS client for our search module. apps/backend/package.json is
#    upstream and read-only, so we add the dependency in-image only. This
#    writes to the image's own package.json/yarn.lock — the repo stays clean.
RUN yarn add meilisearch@0.60.0

# The admin bundle is only needed by the server service. The worker sets
# this to true so the build skips the (slow, memory-hungry) admin bundle.
ARG DISABLE_MEDUSA_ADMIN=false
ENV DISABLE_MEDUSA_ADMIN=${DISABLE_MEDUSA_ADMIN}

# admin.backendUrl is inlined into the admin bundle at build time, so it
# must be supplied as a build arg, not just at runtime.
ARG MEDUSA_BACKEND_URL=
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}

ENV NODE_ENV=production

# Outputs the production app to .medusa/server
RUN yarn build

# `medusa build` emits a self-contained app (with its own generated
# package.json) into .medusa/server, whose dependencies are a SUBSET of the
# ones yarn already installed at /server/node_modules.
#
# Re-downloading that whole tree from npm is what triggers HTTP 429
# (rate limit) on the registry, so instead we reuse the modules yarn
# already fetched. This also preserves the natively-compiled binaries
# (@swc/core, esbuild, msgpackr-extract, protobufjs) so they are not
# rebuilt.
#
# The subsequent npm install only fills genuine gaps; with a warm
# node_modules it is normally a no-op and makes no network calls.
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 600000

RUN cp -a node_modules .medusa/server/node_modules && \
    cd .medusa/server && \
    npm install --omit=dev --no-audit --no-fund --prefer-offline

# ---------------------------------------------------------------- runtime
FROM node:20-alpine AS runtime

WORKDIR /server

RUN apk add --no-cache tini curl && \
    addgroup -g 1001 medusa && \
    adduser -u 1001 -G medusa -s /bin/sh -D medusa

COPY --from=builder --chown=medusa:medusa /server/.medusa/server ./
COPY --chown=medusa:medusa deploy/backend/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

USER medusa

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
