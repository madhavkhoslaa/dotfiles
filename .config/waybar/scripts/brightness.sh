#!/bin/bash
# Adjust brightness in 5% steps, clamped to [MIN, 100].
# 0% is normalized up to MIN so the laptop panel never goes fully dark --
# except when an external monitor is connected, since then the laptop
# panel isn't necessarily what's being looked at, so 0% is allowed.

LAPTOP="eDP-1"
STEP=5
MIN=5

if hyprctl monitors all -j 2>/dev/null \
    | jq -e --arg l "$LAPTOP" '[.[] | select(.name != $l)] | length > 0' >/dev/null 2>&1; then
    MIN=0
fi

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
