## Simple Hyprland Rice

**Full showcase: https://youtu.be/-fGqZo_W268**

Simple Hyprland setup focused on practical keybinds, productivity, and a smooth workflow easy to customize

Feel free to use as inspiration or as a starting point for building your own setup.

![](x.png)
![](lock.png)
![](z.png)
![](ww.png)

Wallpapers: https://wallhaven.cc/user/43pr

## Features

* Waybar
> Change volume with mouse wheel, mute, play/pause, next and blue light filter
* Rofi
> App search, clipboard history and switch opacity
* Hyprlock
* Wlogout
* Custom wallpaper selector
* Wi-Fi menu
> Scan and connect from a curses picker, saved networks reconnect with no password prompt
* Monitor hotplug
> Plug in an external display and pick Mirror or Extend from a popup
* Custom scripts
* Spotify + Spicetify. Theme: text darkthemer

### Wallpaper Selector

[hyprquickpaper](https://github.com/iamsurjog/hyprquickpaper)

> check out the original source it explains how to setup I just made changes to it 

### Wi-Fi Menu

`.config/waybar/scripts/wifi_menu.py` -- click the network icon in Waybar (or run it directly) for a curses network picker. Up/Down to select, Enter to connect, `p` toggles the radio, `q` quits. Networks already saved as a NetworkManager profile are marked `*` and connect straight away with no password prompt; anything else prompts for one.

It's built on `nmcli`, not `iwctl`, on purpose: this setup runs NetworkManager with iwd as its wifi backend, and NetworkManager actively owns the wifi device. Talking to iwctl directly races NetworkManager's own connection handling and causes connects to fail even with the right password. Going through nmcli avoids that, and works the same whether NetworkManager's backend is iwd or the default wpa_supplicant.

On a wrong password it reports `Wrong password.` rather than NetworkManager's own `Secrets were required, but not provided.`, which reads as if no password was given at all.

### Monitor Hotplug

`.config/hypr/scripts/monitor-watch.py` watches Hyprland's event socket for monitor connect/disconnect and reacts via `monitor-popup.sh`:

* **Connect** -- pops up a Mirror/Extend picker (rofi). Mirror lets you pick which screen drives which; Extend lets you place the new display left/right/above/below the laptop panel.
* **Disconnect** -- the laptop panel becomes the sole leader again, and its brightness is restored to the normal 5% floor if it had been turned all the way down.

Both directions apply changes through Hyprland's `hl.monitor()` Lua eval API (`hyprctl eval`), which merges fields onto a monitor's existing config rather than replacing it -- so mirror state is always explicitly cleared (`mirror = "none"`) before a new layout is applied, and outputs are never repositioned onto the same coordinates while both are still non-mirrored, which is what used to trip the compositor's overlap warning.

`.config/waybar/scripts/brightness.sh` allows the laptop panel brightness down to 0% only while an external monitor is connected (checked live via `hyprctl monitors`); otherwise it's floored at 5% so the panel never goes fully dark when it's your only screen.

### Most used keybinds

> **$mod = Super / Windows key**

| Keybind     | Action                    |
| ----------- | ------------------------- |
| `Super + T` | Open terminal             |
| `Super + D` | Open application launcher |
| `Super + E` | Open file manager         |
| `Super + B` | Open browser              |
| `Super + W` | Open wallpaper selector   |
| `Super + O` | Switch opacity            |
| `Super + V` | Open clipboard history    |
```ini
hl.bind(mainMod .. " + W", hl.dsp.exec_cmd("quickshell -c hyprquickpaper"))
```
```ini
hl.bind(mainMod .. " + O", hl.dsp.exec_cmd(home .. "/.config/hypr/scripts/opacity.sh"))
```
```ini
hl.bind(mainMod .. " + V", hl.dsp.exec_cmd("cliphist list | rofi -dmenu | cliphist decode | wl-copy"))
```
**Window Management and more**
| Keybind         | Action              |
| --------------- | ------------------- |
| `Super + Q`     | Close active window |
| `Super + F`     | Toggle fullscreen   |
| `Super + Space` | Toggle floating     |
| `Super + Tab`   | Lock screen         |
| `Super + Esc`   | Open logout menu    |
```ini
hl.bind(mainMod .. " + Escape", hl.dsp.exec_cmd("wlogout -b 1 -c 20 -r 20 -L 1700 -R 1700 -T 325 -B 325"))
```
**Move/resize window with mouse**
```ini
hl.bind(mainMod .. " + mouse:272", hl.dsp.window.drag(), { mouse = true })
```
```ini
hl.bind(mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })
```
**Toggle Waybar**
```ini
hl.bind(mainMod .. " + SHIFT + W", hl.dsp.exec_cmd("sh -c 'pgrep -x waybar >/dev/null && pkill waybar || nohup waybar >/dev/null 2>&1 &'"))
```

---

### Installed Programs:

```text
Hyprland
Waybar
Rofi
Hyprlock
Wlogout
Quickshell
awww
Grim
Slurp
Cliphist
wl-clipboard
```

---
## Installation
> **Note:** Some paths and applications are specific to my setup. You may need to modify the configuration files to match your system.

**Clone the repository and run the installer:**

```bash
git clone https://github.com/43PR/dotfiles.git
cd dotfiles
chmod +x install.sh
./install.sh
```

### What it does:

The installer will modify your ~/.config directory. 

Existing configuration files that are being replaced will be backed up automatically.

Install the required Arch Linux packages from packages.txt

Back up existing configuration files before replacing them

Copy the dotfiles into ~/.config

Set the required script permissions

Enable NetworkManager and Bluetooth (needed for the Wi-Fi menu and Bluetooth to work at all -- pacman installing the packages doesn't start or enable either service on its own)

Enable the required user services (PipeWire)

After the installation finishes, restart Hyprland or log out and back in.

```bash
hyprctl reload
```

If you encounter any issues, check the relevant configuration files under: ~/.config/

---

* [hyprquickpaper](https://github.com/iamsurjog/hyprquickpaper)
* [samaritan-sddm-theme](https://github.com/omerwk/samaritan-sddm-theme)


