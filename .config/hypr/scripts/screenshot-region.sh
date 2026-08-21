#!/usr/bin/env bash
# Fired from bare PrtSc (keybinds.lua). This key has been observed
# firing more than once per physical press -- flock makes any
# overlapping invocation a no-op instead of stacking duplicate slurp
# selection overlays.
set -euo pipefail

LOCK="/tmp/screenshot-region.lock"
exec 9>"$LOCK"
flock -n 9 || exit 0

grim -g "$(slurp)" "$HOME/Pictures/$(date +%s).png"
