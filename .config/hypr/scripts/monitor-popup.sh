#!/bin/bash
# Called by monitor-watch.py on hotplug.
#   monitor-popup.sh added <name>    -> ask Mirror/Extend, apply it
#   monitor-popup.sh removed <name>  -> laptop becomes sole leader again
#
# This Hyprland fork only accepts runtime config changes through
# `hyprctl eval` (Lua), not the standard `hyprctl keyword`.
#
# hl.monitor() *merges* fields instead of replacing the output's config,
# so a `mirror` set on a previous call is NOT cleared just by omitting it
# here, and setting up a new mirror pair while a stale one still exists
# is silently ignored. So: mirror is always passed explicitly ("none" to
# clear it), and both outputs are reset to non-mirrored before applying
# any new layout.
set -euo pipefail

LAPTOP="eDP-1"
LAPTOP_SCALE="1.5"
LOCK="/tmp/monitor-popup.lock"

exec 9>"$LOCK"
flock -n 9 || exit 0

ACTION="${1:?added|removed}"
MON="${2:?monitor name}"

apply() {
    # apply <output> <mode> <position> <scale> <mirror-of|none>
    local out="$1" mode="$2" pos="$3" scale="$4" mirror="$5"
    hyprctl eval "hl.monitor({ output = \"$out\", mode = \"$mode\", position = \"$pos\", scale = $scale, mirror = \"$mirror\" })" >/dev/null
}

# Direct scanout hands a fullscreen client's buffer straight to the KMS
# plane on its source monitor, bypassing the compositor's render pass.
# When that source is being mirrored to a second output, the mirror copy
# ends up sampling a buffer being swapped on the source's own cadence
# instead of a stable composited frame -- this shows up as thin
# horizontal tearing lines on the real (non-mirror) monitor. Disabling
# scanout only while a mirror pair is actually active avoids the
# artifact without paying the scanout-performance cost in extend/single
# layouts, where it can't happen.
set_scanout() {
    hyprctl eval "hl.config({ misc = { no_direct_scanout = $1 } })" >/dev/null
}

notify() {
    notify-send -a "Displays" "$1" "$2" 2>/dev/null || true
}

# Far off-screen parking spot. reset_pair() used to put both LAPTOP and
# MON at 0x0 at once -- two non-mirrored outputs both claiming the same
# position is exactly what trips the compositor's overlap warning, even
# though it's just a transient step on the way to a mirror. Park MON out
# here first so LAPTOP can claim 0x0 alone with no overlapping instant.
PARK="100000x0"

reset_pair() {
    apply "$MON" "preferred" "$PARK" "1" "none"
    apply "$LAPTOP" "preferred" "0x0" "$LAPTOP_SCALE" "none"
    set_scanout false
}

laptop_leader() {
    apply "$LAPTOP" "preferred" "0x0" "$LAPTOP_SCALE" "none"
    set_scanout false
}

# Must match brightness.sh's MIN: that script allows the panel down to 0%
# only while an external monitor is connected. Once it's gone, the panel
# is the only screen again, so bring brightness back up to the normal
# floor rather than leaving it invisible.
MIN_BRIGHTNESS=5

raise_brightness_floor() {
    local current
    current=$(brightnessctl -m 2>/dev/null | cut -d, -f4 | tr -d '%')
    [ -n "$current" ] && (( current < MIN_BRIGHTNESS )) && brightnessctl set "${MIN_BRIGHTNESS}%" >/dev/null
}

if [ "$ACTION" = "removed" ]; then
    laptop_leader
    raise_brightness_floor
    notify "Monitor disconnected" "$LAPTOP is the main display"
    exit 0
fi

# ACTION = added: pick the monitor's native-resolution mode with the
# highest refresh rate it supports.
best_mode=$(hyprctl monitors all -j | jq -r --arg m "$MON" '
  [ .[] | select(.name == $m) | .availableModes[]
    | capture("(?<w>[0-9]+)x(?<h>[0-9]+)@(?<hz>[0-9.]+)Hz")
    | {w: (.w|tonumber), h: (.h|tonumber), hz: (.hz|tonumber)} ]
  | (max_by(.w).w) as $mw
  | map(select(.w == $mw))
  | max_by(.hz)
  | "\(.w)x\(.h)@\(.hz)"
')
[ -z "$best_mode" ] && best_mode="preferred"
mres="${best_mode%%@*}"
mw="${mres%%x*}"
mh="${mres##*x}"

read -r lw lh < <(hyprctl monitors all -j | jq -r --arg m "$LAPTOP" --argjson s "$LAPTOP_SCALE" '
  .[] | select(.name == $m) | "\((.width/$s)|floor) \((.height/$s)|floor)"
')

reset_pair

choice=$(printf "  Mirror\n  Extend" | rofi -dmenu -i -p "$MON connected")

case "$choice" in
    *Mirror*)
        dir=$(printf "Mirror monitor \xe2\x86\x92 laptop\nMirror laptop \xe2\x86\x92 monitor" | rofi -dmenu -i -p "Mirror direction")
        case "$dir" in
            "Mirror monitor → laptop")
                # LAPTOP must give up its 0x0 slot (by becoming the
                # mirror) before MON is moved onto that same position --
                # otherwise both are briefly real, non-mirrored outputs
                # sharing 0x0, which is the overlap the compositor warns
                # about. MON is still parked from reset_pair here.
                apply "$LAPTOP" "preferred" "0x0" "$LAPTOP_SCALE" "$MON"
                apply "$MON" "$best_mode" "0x0" "1" "none"
                set_scanout true
                notify "Mirroring" "Laptop mirrors $MON ($best_mode)"
                ;;
            "Mirror laptop → monitor")
                apply "$LAPTOP" "preferred" "0x0" "$LAPTOP_SCALE" "none"
                apply "$MON" "$best_mode" "0x0" "1" "$LAPTOP"
                set_scanout true
                notify "Mirroring" "$MON mirrors laptop (panel refresh @ $best_mode)"
                ;;
            *) exit 0 ;;
        esac
        ;;
    *Extend*)
        pos=$(printf "Left of laptop\nRight of laptop\nAbove laptop\nBelow laptop" | rofi -dmenu -i -p "Position")
        case "$pos" in
            "Left of laptop")  mx=$(( -mw )); my=0 ;;
            "Right of laptop") mx=$lw; my=0 ;;
            "Above laptop")    mx=0; my=$(( -mh )) ;;
            "Below laptop")    mx=0; my=$lh ;;
            *) exit 0 ;;
        esac
        apply "$MON" "$best_mode" "${mx}x${my}" "1" "none"
        notify "Extended" "$MON: $best_mode, ${pos,,}"
        ;;
    *)
        exit 0
        ;;
esac
