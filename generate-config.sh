#!/bin/bash

mkdir -p static/js

echo "const HYGRAPH_ENDPOINT = '$HYGRAPH_ENDPOINT';" > static/js/config.js

echo "Config file generated successfully!"
