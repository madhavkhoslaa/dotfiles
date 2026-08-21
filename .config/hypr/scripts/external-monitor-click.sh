#!/bin/bash
# Waybar on-click for the external-monitor module: re-open the
# mirror/extend picker for whatever's currently plugged in.
LAPTOP="eDP-1"

mon=$(hyprctl monitors all -j | jq -r --arg l "$LAPTOP" '[.[] | select(.name != $l)][0].name // empty')

[ -n "$mon" ] && ~/.config/hypr/scripts/monitor-popup.sh added "$mon"
