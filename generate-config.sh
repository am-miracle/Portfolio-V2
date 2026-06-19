#!/bin/bash


if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

if [ -z "$HYGRAPH_ENDPOINT" ]; then
  echo "WARNING: HYGRAPH_ENDPOINT is empty. config.js will not have an endpoint." >&2
fi

mkdir -p static/js

echo "const HYGRAPH_ENDPOINT = '$HYGRAPH_ENDPOINT';" > static/js/config.js

echo "Config file generated successfully!"
