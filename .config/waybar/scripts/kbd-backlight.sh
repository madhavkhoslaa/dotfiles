#!/bin/bash
# Waybar custom module: ThinkPad keyboard backlight (tpacpi::kbd_backlight).
# Only 3 discrete levels exist (off/low/high) -- no percentage, so this is a
# click-to-cycle button rather than a scroll-to-adjust slider like the
# screen `backlight` module. Waybar re-runs the status branch on
# SIGRTMIN+9 (poked by the toggle branch below) rather than polling.

DEVICE="tpacpi::kbd_backlight"
ICON=$''  # nf-fa-keyboard_o

status() {
    local level max
    level=$(brightnessctl -d "$DEVICE" g)
    max=$(brightnessctl -d "$DEVICE" m)

    local class label
    case "$level" in
        0) class="off";  label="Off" ;;
        1) class="low";  label="Low" ;;
        *) class="high"; label="High" ;;
    esac

    printf '{"text":"%s","tooltip":"Keyboard backlight: %s\\nClick to cycle","class":"%s","alt":"%s"}\n' \
        "$ICON" "$label" "$class" "$class"
}

toggle() {
    local level max next
    level=$(brightnessctl -d "$DEVICE" g)
    max=$(brightnessctl -d "$DEVICE" m)
    next=$(( (level + 1) % (max + 1) ))
    brightnessctl -d "$DEVICE" set "$next" >/dev/null
    pkill -RTMIN+9 waybar
}

case "$1" in
    toggle) toggle ;;
    *)      status ;;
esac
