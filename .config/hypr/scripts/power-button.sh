#!/usr/bin/env bash
# Fired from XF86PowerOff press/release (keybinds.lua). logind's own
# HandlePowerKey is set to "ignore" (see /etc/systemd/logind.conf.d/) so the
# physical power button reaches Hyprland as a normal key instead of logind
# poweroff'ing immediately -- this script does the press-vs-hold split:
# a tap locks, holding past HOLD_SECONDS powers off.
set -euo pipefail

PIDFILE="/tmp/power-button.pid"
HOLD_SECONDS=1.5

case "${1:-}" in
    press)
        sleep "$HOLD_SECONDS" &
        sleep_pid=$!
        echo "$sleep_pid" >"$PIDFILE"
        wait "$sleep_pid" 2>/dev/null || true
        # Only power off if release didn't already claim (delete) the
        # pidfile -- that's what distinguishes a held button from a tap.
        if [[ "$(cat "$PIDFILE" 2>/dev/null)" == "$sleep_pid" ]]; then
            rm -f "$PIDFILE"
            systemctl poweroff
        fi
        ;;
    release)
        if [[ -f "$PIDFILE" ]]; then
            sleep_pid="$(cat "$PIDFILE")"
            rm -f "$PIDFILE"
            kill "$sleep_pid" 2>/dev/null || true
            hyprlock &
        fi
        ;;
esac
