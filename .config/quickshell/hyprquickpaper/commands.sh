awww img "$1" -t random --transition-duration 1

# Keep the SDDM login background in sync with the desktop wallpaper.
# No-ops until the theme is installed -- see extras/sddm-theme/README.md.
[[ -x /usr/share/sddm/themes/vroomer-lock/sync-wallpaper.sh ]] && \
    /usr/share/sddm/themes/vroomer-lock/sync-wallpaper.sh &
