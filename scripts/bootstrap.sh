#!/usr/bin/env bash
#
# Bootstrap: pull the OFFICIAL Medusa 2 repos into apps/ as git subtrees.
#
# Nothing inside apps/ is ever edited by this project. The marketplace
# (multi-vendor) code and all Dokploy deployment config live in overlay/
# and deploy/, and are merged in at Docker build time only.
#
# That keeps `git subtree pull` conflict-free forever.
#
set -euo pipefail

BACKEND_REMOTE="https://github.com/medusajs/medusa-starter-default.git"
BACKEND_BRANCH="master"
STOREFRONT_REMOTE="https://github.com/smitgadhiya-emp/medusa-plasmic.git"
STOREFRONT_BRANCH="main"

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

if [ ! -d .git ]; then
  echo "==> git init"
  git init -q
  git add -A
  git -c user.email=bootstrap@local -c user.name=bootstrap \
    commit -qm "chore: deployment overlay for Dokploy (multi-vendor Medusa 2)"
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: working tree is dirty. Commit or stash first." >&2
  exit 1
fi

add_subtree() {
  local prefix="$1" name="$2" remote="$3" branch="$4"

  if [ -d "$prefix" ] && [ -n "$(ls -A "$prefix" 2>/dev/null)" ]; then
    echo "==> $prefix already exists, skipping (use scripts/update-upstream.sh)"
    return
  fi

  git remote get-url "$name" >/dev/null 2>&1 || git remote add "$name" "$remote"
  echo "==> fetching $name ($remote#$branch)"
  git fetch -q "$name" "$branch"
  echo "==> git subtree add --prefix=$prefix"
  git subtree add --prefix="$prefix" "$name" "$branch" --squash
}

add_subtree "apps/backend"    upstream-backend    "$BACKEND_REMOTE"    "$BACKEND_BRANCH"
add_subtree "apps/storefront" upstream-storefront "$STOREFRONT_REMOTE" "$STOREFRONT_BRANCH"

echo
echo "Done. Upstream sources are in:"
echo "  $ROOT/apps/backend      (medusa-starter-default @ $BACKEND_BRANCH)"
echo "  $ROOT/apps/storefront   (medusa-plasmic @ $STOREFRONT_BRANCH)"
echo
echo "Next: push this repo to GitHub/GitLab, then create the Dokploy services"
echo "described in README.md."
