#!/bin/bash
set -e
URL=$1
echo "start chromium with url $URL"
URL=$URL DISPLAY=:0.0 xinit ./scripts/start-c.sh -- -nocursor
