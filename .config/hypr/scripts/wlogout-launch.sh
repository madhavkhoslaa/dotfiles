#!/bin/bash
# Sizes wlogout's button box for whichever monitor is currently focused.
# wlogout only takes absolute pixel margins (no percentages), so the
# values tuned to look right on the 1920x1080 external monitor overflow
# the laptop panel's narrower logical width (1920x1200 @ 1.5x scale =
# 1280x800 logical) and break the layout there.

# Content box (post-margin button area) that looks right on the
# external monitor at the previous fixed -L 744 -R 744 -T 475 -B 475.
CONTENT_W=432
CONTENT_H=130

read -r phys_w phys_h scale < <(hyprctl monitors -j | jq -r '.[] | select(.focused) | "\(.width) \(.height) \(.scale)"')

if [ -n "$phys_w" ] && [ -n "$phys_h" ] && [ -n "$scale" ]; then
    logical_w=$(awk -v w="$phys_w" -v s="$scale" 'BEGIN { printf "%d", w / s }')
    logical_h=$(awk -v h="$phys_h" -v s="$scale" 'BEGIN { printf "%d", h / s }')
    margin_lr=$(( (logical_w - CONTENT_W) / 2 ))
    margin_tb=$(( (logical_h - CONTENT_H) / 2 ))
    [ "$margin_lr" -lt 0 ] && margin_lr=0
    [ "$margin_tb" -lt 0 ] && margin_tb=0
else
    # hyprctl/jq lookup failed - fall back to the external-monitor values.
    margin_lr=744
    margin_tb=475
fi

exec wlogout -b 4 -c 20 -r 20 -L "$margin_lr" -R "$margin_lr" -T "$margin_tb" -B "$margin_tb"
