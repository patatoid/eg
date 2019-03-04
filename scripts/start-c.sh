#!/bin/bash
set -e
echo 'chromium browser launch fullscreen $URL'
xset -dpms
xset s off
xset s noblank
matchbox-window-manager -use_cursor no&
chromium-browser --kiosk --incognito  $URL
