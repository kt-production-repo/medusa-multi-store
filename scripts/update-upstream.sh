#!/usr/bin/env bash
#
# Pull the latest official Medusa 2 code into apps/ .
#
# Because we never edit anything under apps/, these pulls apply cleanly.
# All of our own code lives outside apps/ and is applied at build time.
#
# Usage:
#   ./scripts/update-upstream.sh            # update both
#   ./scripts/update-upstream.sh backend    # update backend only
#   ./scripts/update-upstream.sh storefront # update storefront only
#
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: working tree is dirty. Commit or stash first." >&2
  exit 1
fi

TARGET="${1:-all}"

pull_subtree() {
  local prefix="$1" name="$2" branch="$3"
  if [ ! -d "$prefix" ]; then
    echo "==> $prefix missing, run scripts/bootstrap.sh first" >&2
    return 1
  fi
  echo "==> pulling $name#$branch into $prefix"
  git fetch -q "$name" "$branch"
  git subtree pull --prefix="$prefix" "$name" "$branch" --squash
}

case "$TARGET" in
  backend)    pull_subtree apps/backend    upstream-backend    master ;;
  storefront) pull_subtree apps/storefront upstream-storefront main   ;;
  all)
    pull_subtree apps/backend    upstream-backend    master
    pull_subtree apps/storefront upstream-storefront main
    ;;
  *) echo "usage: $0 [backend|storefront|all]" >&2; exit 1 ;;
esac

echo
echo "Upstream updated. Review the Medusa release notes for breaking changes:"
echo "  https://github.com/medusajs/medusa/releases"
echo
echo "Then check the marketplace overlay still compiles against the new version:"
echo "  ./scripts/check-overlay.sh"
echo
echo "Finally redeploy backend-server, backend-worker and storefront in Dokploy."
