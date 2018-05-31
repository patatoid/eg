#!/bin/bash
set -e
sudo chmod 666 /dev/tty1
unbuffer dmesg | pv -qL 40 > /dev/tty1
