#!/usr/bin/env sh
set -e

# Migrate + collect static on every boot; db healthcheck gates this in compose.
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Optional demo seed (idempotent) — populates the board for a one-command demo.
if [ "$SEED_ON_START" = "true" ]; then
  python manage.py seed
fi

# Run whatever CMD was provided (gunicorn by default).
exec "$@"
