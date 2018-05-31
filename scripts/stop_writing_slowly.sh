#!/bin/bash
set -e
kill `lsof | grep FIFO | grep pv | awk '{print $2}'`
