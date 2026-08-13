#!/bin/sh
#
# Shared entrypoint for both backend Dokploy services.
#
# MEDUSA_WORKER_MODE=server -> runs migrations, then serves API + Admin
# MEDUSA_WORKER_MODE=worker -> waits for migrations, then runs background jobs
#
# Only the server instance migrates, so the two services can never race
# each other on the same database.
#
set -e

MODE="${MEDUSA_WORKER_MODE:-shared}"

# Never fall back to the well-known "supersecret" in production: that would
# silently ship predictable auth secrets. Local dev keeps the config fallback.
if [ "${NODE_ENV:-production}" != "development" ]; then
  if [ -z "${JWT_SECRET:-}" ] || [ -z "${COOKIE_SECRET:-}" ]; then
    echo "[medusa] JWT_SECRET and COOKIE_SECRET must be set" >&2
    exit 1
  fi
fi

echo "[medusa] worker mode: $MODE"

wait_for_db() {
  echo "[medusa] waiting for database..."
  i=0
  until node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL });
c.connect().then(() => c.end()).catch(() => process.exit(1));
" 2>/dev/null; do
    i=$((i + 1))
    if [ "$i" -ge 60 ]; then
      echo "[medusa] database unreachable after 60 attempts, giving up" >&2
      exit 1
    fi
    sleep 2
  done
  echo "[medusa] database is up"
}

wait_for_db

case "$MODE" in
  worker)
    # Give the server instance a head start so migrations land first.
    echo "[medusa] worker: waiting ${WORKER_START_DELAY:-20}s for migrations"
    sleep "${WORKER_START_DELAY:-20}"
    ;;
  *)
    echo "[medusa] running migrations + syncing links"
    npx medusa db:migrate

    if [ "${MEDUSA_SEED:-false}" = "true" ]; then
      echo "[medusa] seeding (MEDUSA_SEED=true)"
      # `medusa build` compiles src/scripts/seed.ts to .js, but older/newer
      # builds have shipped it at either path. Try both rather than guessing.
      if [ -f ./src/scripts/seed.js ]; then
        npx medusa exec ./src/scripts/seed.js || \
          echo "[medusa] seed failed, continuing"
      elif [ -f ./src/scripts/seed.ts ]; then
        npx medusa exec ./src/scripts/seed.ts || \
          echo "[medusa] seed failed, continuing"
      else
        echo "[medusa] no seed script found, skipping"
      fi
    fi

    if [ -n "${MEDUSA_ADMIN_EMAIL:-}" ] && [ -n "${MEDUSA_ADMIN_PASSWORD:-}" ]; then
      echo "[medusa] ensuring admin user ${MEDUSA_ADMIN_EMAIL}"
      npx medusa user -e "$MEDUSA_ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD" || \
        echo "[medusa] admin user already exists, continuing"
    fi
    ;;
esac

echo "[medusa] starting"
exec npx medusa start
