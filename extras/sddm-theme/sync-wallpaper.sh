#!/usr/bin/env bash
# Copies the currently active awww wallpaper into this installed SDDM theme
# so the login background stays in sync with the desktop. Called from
# .config/quickshell/hyprquickpaper/commands.sh after every wallpaper pick.
#
# No-ops quietly (exit 0) if the theme isn't installed yet, or isn't
# user-writable -- see extras/sddm-theme/README.md for the one-time chown
# that makes the second case unnecessary.

set -euo pipefail

THEME_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ -w "$THEME_DIR" ]] || exit 0

wallpaper=$(awww query 2>/dev/null | sed -n 's/.*currently displaying: image: //p' | head -n1)
[[ -n "$wallpaper" && -f "$wallpaper" ]] || exit 0

ext="${wallpaper##*.}"
rm -f "$THEME_DIR"/background.*
cp "$wallpaper" "$THEME_DIR/background.$ext"
sed -i "s/^background=.*/background=background.$ext/" "$THEME_DIR/theme.conf"
