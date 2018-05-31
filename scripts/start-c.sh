#!/bin/bash
set -e
echo 'chromium browser launch fullscreen $URL'
matchbox-window-manager -use_cursor no&
chromium-browser --kiosk --incognito  $URL
