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

check() {
  local overlay_dir="$1" upstream_dir="$2"
  [ -d "$overlay_dir" ] || return 0
  if [ ! -d "$upstream_dir" ]; then
    echo "SKIP  $upstream_dir not present (run scripts/bootstrap.sh)"
    return 0
  fi
  while IFS= read -r f; do
    rel="${f#"$overlay_dir"/}"
    if [ -e "$upstream_dir/$rel" ]; then
      echo "COLLISION  overlay/$rel would overwrite upstream $upstream_dir/$rel"
      fail=1
    else
      echo "ok         $rel"
    fi
  done < <(find "$overlay_dir" -type f | sort)
}

echo "== backend src overlay =="
check overlay/backend/src apps/backend/src

echo
echo "== intentional replacements (these MUST collide) =="
for f in medusa-config.ts; do
  if [ -e "apps/backend/$f" ]; then
    echo "ok         overlay/backend/$f replaces apps/backend/$f (by design)"
  fi
done

echo
if [ "$fail" -ne 0 ]; then
  echo "RESULT: collisions found. Rename the overlay file or adopt upstream's." >&2
  exit 1
fi
echo "RESULT: overlay is additive-only."
