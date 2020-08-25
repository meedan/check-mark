#!/bin/bash

# browser extension (at ./build)
npm run generate-extension

# keep running, so we can run commands with `docker-compose exec`
tail -f /dev/null
