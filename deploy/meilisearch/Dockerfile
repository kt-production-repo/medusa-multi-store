# Meilisearch search engine — standalone Dokploy Application service.
#
# Meilisearch is NOT a native Dokploy Database (those are Postgres, MySQL,
# MariaDB, MongoDB, Redis/libsql). Run it as an Application built from this
# file. It only talks to the backends over the internal network, so it needs
# no public domain.
#
# MEILI_MASTER_KEY is passed as a runtime-only environment variable in the
# Dokploy UI (see env/meilisearch.env.example) — never baked into the image.
# The index persists in the Dokploy empty volume mounted at /meili_data.
FROM getmeili/meilisearch:v1.53.0

ENV MEILI_ENV=production \
    MEILI_NO_ANALYTICS=true

EXPOSE 7700