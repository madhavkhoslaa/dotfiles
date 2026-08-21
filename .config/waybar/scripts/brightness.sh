#!/bin/bash
# Adjust brightness in 5% steps, clamped to [MIN, 100].
# 0% is normalized up to MIN so the screen never scrolls fully dark.

STEP=5
MIN=5

current=$(brightnessctl -m | cut -d, -f4 | tr -d '%')
(( current < MIN )) && current=MIN

case "$1" in
    up)
        target=$(( current + STEP ))
        (( target > 100 )) && target=100
        ;;
    down)
        target=$(( current - STEP ))
        (( target < MIN )) && target=$MIN
        ;;
    *)
        echo "Usage: $0 {up|down}" >&2
        exit 1
        ;;
esac

brightnessctl set "${target}%" >/dev/null
