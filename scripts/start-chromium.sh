#!/bin/bash
set -e
URL=$1
echo "start chromium with url $URL"
CURSOR=$2
URL=$URL CURSOR=$CURSOR DISPLAY=:0.0 xinit ./scripts/start-c.sh -- $CURSOR
