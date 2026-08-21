# SDDM greeter theme

`vroomer-lock` -- a single-file QML greeter styled to match
`.config/hypr/hyprlock.conf`: the same background crop and the same
clock/date stack. No SddmComponents or QtQuick.Controls dependency.

Adds on top of hyprlock's look: a username field that doubles as a
dropdown of local users, and a WM/session dropdown (defaults to
whatever `sessionModel.lastIndex` was last used) -- both styled as a
dark glass card (kitty's black background + the `opacity = 0.7` window
rule in `.config/hypr/rules.lua`, not solid) with a hover highlight on
list rows and a chevron that flips on open. Below that: a Log In /
shutdown / restart / suspend row -- the "standard" greeter
functionality hyprlock itself doesn't need since it's not choosing a
session.

The only bundled asset is `background.*` (a copy of whatever wallpaper
was active via `awww` most recently -- see "Wallpaper sync" below for
how it's kept current automatically once installed).

Not applied by `install.sh` -- like `extras/boot-splash`, this is a
personal touch, not something a fresh clone should silently inherit.

## Try it without installing anything

`sddm-greeter` can run a theme directly out of this directory, in a
window, without touching any system config:

```bash
QT_QPA_PLATFORM=wayland sddm-greeter-qt6 --test-mode --theme extras/sddm-theme
# or, on an X11 session:
sddm-greeter --test-mode --theme extras/sddm-theme
```

Login/shutdown/reboot/suspend are inert in test mode by design.

## Install for real

```bash
sudo cp -r extras/sddm-theme /usr/share/sddm/themes/vroomer-lock
sudo sed -i 's/^Current=.*/Current=vroomer-lock/' /etc/sddm.conf.d/theme.conf
```

Check `/etc/sddm.conf.d/theme.conf` first -- on this machine it points
`Current=` at a theme (`nier-automata`) that's no longer installed,
which is why the greeter has been falling back to a bare default. The
`sed` above assumes that same shape; adjust if your file differs.

To revert, set `Current=` back to a theme that still exists under
`/usr/share/sddm/themes/` (`elarun`, `maldives`, `maya`, `pixie`, or
`dog-samurai` all ship with the `sddm` package).
