#!/usr/bin/env python3
"""Curses Bluetooth picker backed by bluetoothctl. Up/Down select, Enter
pairs/trusts/connects (or disconnects if already connected), q quits."""

import curses
import re
import subprocess
import sys

DEVICE_RE = re.compile(r"^Device ([0-9A-Fa-f:]{17}) (.+)$")


def run(*args, timeout=15):
    return subprocess.run(
        ["bluetoothctl", *args],
        capture_output=True,
        text=True,
        timeout=timeout,
        stdin=subprocess.DEVNULL,
    )


def list_macs(*filter_args):
    out = run("devices", *filter_args).stdout
    macs = set()
    for line in out.splitlines():
        m = DEVICE_RE.match(line.strip())
        if m:
            macs.add(m.group(1))
    return macs


def get_devices():
    out = run("devices").stdout
    devices = []
    for line in out.splitlines():
        m = DEVICE_RE.match(line.strip())
        if m:
            devices.append({"mac": m.group(1), "name": m.group(2)})
    if not devices:
        return devices, out.strip()

    paired = list_macs("Paired")
    connected = list_macs("Connected")
    for d in devices:
        d["paired"] = d["mac"] in paired
        d["connected"] = d["mac"] in connected
    return devices, None


def status_line(stdscr, text):
    h, w = stdscr.getmaxyx()
    stdscr.addnstr(h - 1, 0, text.ljust(w - 1), w - 1, curses.A_REVERSE)
    stdscr.refresh()


def toggle_connection(stdscr, dev):
    if dev["connected"]:
        status_line(stdscr, f"Disconnecting {dev['name']}...")
        result = run("disconnect", dev["mac"], timeout=15)
    else:
        if not dev["paired"]:
            status_line(stdscr, f"Pairing with {dev['name']}...")
            run("pair", dev["mac"], timeout=30)
            run("trust", dev["mac"], timeout=15)
        status_line(stdscr, f"Connecting to {dev['name']}...")
        result = run("connect", dev["mac"], timeout=30)

    if result.returncode == 0:
        status_line(stdscr, "Done. Press any key.")
    else:
        err = (result.stderr or result.stdout or "unknown error").strip()
        status_line(stdscr, f"Failed: {err[:70]}. Press any key.")
    stdscr.getch()


HELP = "Up/Down: select   Enter: connect/disconnect   q: quit"


def draw(stdscr, devices, selected, error):
    stdscr.erase()
    h, w = stdscr.getmaxyx()
    stdscr.addnstr(0, 0, "Bluetooth", w - 1, curses.A_BOLD)

    if error:
        stdscr.addnstr(2, 2, error, w - 3)
    elif not devices:
        stdscr.addnstr(2, 2, "No devices found.", w - 3)
    for i, dev in enumerate(devices):
        row = 2 + i
        if row >= h - 1:
            break
        tags = []
        if dev["connected"]:
            tags.append("connected")
        elif dev["paired"]:
            tags.append("paired")
        tag = f" [{', '.join(tags)}]" if tags else ""
        label = f"{dev['name']} ({dev['mac']}){tag}"
        attr = curses.A_REVERSE if i == selected else curses.A_NORMAL
        stdscr.addnstr(row, 2, label, w - 3, attr)

    stdscr.addnstr(h - 1, 0, HELP.ljust(w - 1), w - 1, curses.A_REVERSE)
    stdscr.refresh()


def main(stdscr):
    curses.curs_set(0)
    stdscr.keypad(True)

    status_line(stdscr, "Powering on and scanning...")
    run("power", "on")
    run("--timeout", "4", "scan", "on", timeout=8)

    devices, error = get_devices()
    selected = 0
    while True:
        draw(stdscr, devices, selected, error)
        ch = stdscr.getch()

        if ch in (ord("q"), ord("Q")):
            break
        elif ch in (curses.KEY_UP, ord("k")) and devices:
            selected = (selected - 1) % len(devices)
        elif ch in (curses.KEY_DOWN, ord("j")) and devices:
            selected = (selected + 1) % len(devices)
        elif ch in (curses.KEY_ENTER, 10, 13) and devices:
            toggle_connection(stdscr, devices[selected])
            devices, error = get_devices()
            selected = min(selected, max(len(devices) - 1, 0))


if __name__ == "__main__":
    try:
        curses.wrapper(main)
    except KeyboardInterrupt:
        sys.exit(0)
