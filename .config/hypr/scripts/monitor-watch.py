#!/usr/bin/env python3
"""Hotplug daemon: watches Hyprland's event socket for monitor connect/
disconnect and reacts. On connect it opens the mirror/extend picker
(monitor-popup.sh); on disconnect it makes the laptop panel the sole
leader again. Also pokes waybar so the external-monitor indicator updates.
Started once from hyprland.lua's autostart block.
"""
import json
import os
import socket
import subprocess
import time

LAPTOP = "eDP-1"
SCRIPTS_DIR = os.path.expanduser("~/.config/hypr/scripts")
DEBOUNCE_SECONDS = 3
WAYBAR_SIGNAL = "RTMIN+8"


def sock_path():
    runtime = os.environ.get("XDG_RUNTIME_DIR", f"/run/user/{os.getuid()}")
    sig = os.environ["HYPRLAND_INSTANCE_SIGNATURE"]
    return f"{runtime}/hypr/{sig}/.socket2.sock"


def poke_waybar():
    subprocess.run(["pkill", f"-{WAYBAR_SIGNAL}", "waybar"], check=False)


def handle_added(name):
    if name == LAPTOP:
        return
    subprocess.Popen([f"{SCRIPTS_DIR}/monitor-popup.sh", "added", name])
    poke_waybar()


def handle_removed(name):
    if name == LAPTOP:
        return
    subprocess.Popen([f"{SCRIPTS_DIR}/monitor-popup.sh", "removed", name])
    poke_waybar()


def parse_event(line):
    if ">>" not in line:
        return None, None
    event, data = line.split(">>", 1)
    # v2 events carry "id,name,description"; v1 events carry just "name".
    if event.endswith("v2"):
        parts = data.split(",")
        name = parts[1] if len(parts) > 1 else parts[0]
    else:
        name = data
    return event, name


def catch_up_on_start():
    """If an external monitor is already connected when this daemon
    (re)starts, treat it as just-added so the picker still runs."""
    try:
        mons = json.loads(subprocess.check_output(["hyprctl", "monitors", "-j"]))
    except Exception:
        return {}
    last = {}
    for m in mons:
        if m["name"] != LAPTOP:
            handle_added(m["name"])
            last[f"add:{m['name']}"] = time.time()
    return last


def main():
    last = catch_up_on_start()
    while True:
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as s:
                s.connect(sock_path())
                buf = b""
                while True:
                    chunk = s.recv(4096)
                    if not chunk:
                        break
                    buf += chunk
                    while b"\n" in buf:
                        raw, buf = buf.split(b"\n", 1)
                        event, name = parse_event(raw.decode(errors="ignore"))
                        if event is None:
                            continue
                        if event in ("monitoradded", "monitoraddedv2"):
                            key = f"add:{name}"
                        elif event in ("monitorremoved", "monitorremovedv2"):
                            key = f"remove:{name}"
                        else:
                            continue
                        now = time.time()
                        if now - last.get(key, 0) < DEBOUNCE_SECONDS:
                            continue
                        last[key] = now
                        if key.startswith("add:"):
                            handle_added(name)
                        else:
                            handle_removed(name)
        except (FileNotFoundError, ConnectionRefusedError, OSError):
            time.sleep(2)


if __name__ == "__main__":
    main()
