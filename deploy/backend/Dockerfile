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
# package.json) into .medusa/server. Per Medusa's deployment guide the deps
# there are installed with npm — the root yarn 4 lockfile does not describe
# this generated manifest, so yarn must not be used here.
RUN cd .medusa/server && npm install --omit=dev --no-audit --no-fund

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
