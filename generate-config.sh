#!/bin/bash

# Create the directory if it doesn't exist (just in case)
mkdir -p static/js

# Write the config file using the environment variable
echo "const HYGRAPH_ENDPOINT = '$HYGRAPH_ENDPOINT';" > static/js/config.js

echo "Config file generated successfully!"
