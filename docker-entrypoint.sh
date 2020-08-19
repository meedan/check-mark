#!/bin/bash

# browser extension (at ./build)
npm run generate-extension

# copy generated files
mkdir -p dist && cp build.zip dist/

# keep running, so we can run commands with `docker-compose exec`
tail -f /dev/null
