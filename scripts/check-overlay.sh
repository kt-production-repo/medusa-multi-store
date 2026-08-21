#!/usr/bin/env bash
#
# Guard rail: proves the overlay is still purely ADDITIVE.
#
# If upstream ever ships a file at the same path as one of ours, this
# script fails loudly instead of silently overwriting official code.
#
set -euo pipefail

cd "$(dirname "$0")/.."

fail=0

# Paths (relative to overlay dir) that are ALLOWED to collide with upstream.
backend_intentional="medusa-config.ts"
# The storefront overlay is functional-only: vendor portal, Meilisearch search
# and the split-checkout payment button. Everything cosmetic comes from the
# upstream Plasmic base. payment-button is the single intentional replacement
# (routes cart completion through /store/carts/:id/complete-vendor).
storefront_intentional="modules/checkout/components/payment-button/index.tsx"

check() {
  local overlay_dir="$1" upstream_dir="$2" intentional="$3"
  [ -d "$overlay_dir" ] || return 0
  if [ ! -d "$upstream_dir" ]; then
    echo "SKIP  $upstream_dir not present (run scripts/bootstrap.sh)"
    return 0
  fi
  while IFS= read -r f; do
    rel="${f#"$overlay_dir"/}"
    if [ -e "$upstream_dir/$rel" ]; then
      # Skip files that are intentional replacements
      if echo "$intentional" | grep -Fqx "$rel"; then
        echo "ok         $overlay_dir/$rel (intentional replacement)"
      else
        echo "COLLISION  $overlay_dir/$rel would overwrite upstream $upstream_dir/$rel"
        fail=1
      fi
    else
      echo "ok         $overlay_dir/$rel"
    fi
  done < <(find "$overlay_dir" -type f | sort)
}

echo "== backend src overlay =="
check overlay/backend/src apps/backend/src "$backend_intentional"

echo
echo "== storefront src overlay (additive only) =="
check overlay/storefront/src apps/storefront/src "$storefront_intentional"

echo
if [ "$fail" -ne 0 ]; then
  echo "RESULT: collisions found. Rename the overlay file or adopt upstream's." >&2
  exit 1
fi
echo "RESULT: overlay is additive-only."
