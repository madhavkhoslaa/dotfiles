#!/bin/bash
# Waybar custom module: shows a monitor glyph only while an external
# display is connected. Waybar re-runs this on SIGRTMIN+8 (poked by
# monitor-watch.py) rather than polling.
LAPTOP="eDP-1"

mon=$(hyprctl monitors all -j | jq -r --arg l "$LAPTOP" '[.[] | select(.name != $l)][0].name // empty')

if [ -n "$mon" ]; then
    printf '{"text":"\xef\x84\x88","tooltip":"External monitor: %s\\nClick to reconfigure","class":"connected","alt":"connected"}\n' "$mon"
else
    printf '{"text":"","tooltip":"","class":"disconnected","alt":"disconnected"}\n'
fi
