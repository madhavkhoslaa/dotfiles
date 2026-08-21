#!/usr/bin/env python3
"""Curses Wi-Fi picker backed by iwctl. Up/Down select, Enter connects
(prompting for a passphrase when the network is secured), p toggles the
radio on/off, q quits."""

import curses
import re
import subprocess
import sys

ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")


def run(*args, timeout=15):
    return subprocess.run(
        ["iwctl", *args], capture_output=True, text=True, timeout=timeout
    )


def get_device():
    out = run("device", "list").stdout
    for line in out.splitlines():
        line = ANSI_RE.sub("", line)
        parts = line.split()
        if len(parts) >= 5 and parts[-1] == "station":
            return parts[0]
    return "wlan0"


def get_power(device):
    out = ANSI_RE.sub("", run("device", "list").stdout)
    for line in out.splitlines():
        parts = line.split()
        if parts and parts[0] == device and len(parts) > 2:
            return parts[2].lower() == "on"
    return True


def toggle_power(stdscr, device):
    new_state = "off" if get_power(device) else "on"
    status_line(stdscr, f"Turning Wi-Fi {new_state}...")
    run("device", device, "set-property", "Powered", new_state, timeout=10)
    if new_state == "on":
        run("station", device, "scan")


def get_networks(device):
    out = ANSI_RE.sub("", run("station", device, "get-networks").stdout)
    lines = out.splitlines()
    header = next((l for l in lines if "Security" in l and "Signal" in l), None)
    if header is None:
        return []

    sec_idx = header.index("Security")
    sig_idx = header.index("Signal")
    start = lines.index(header) + 2  # skip header + separator

    networks = []
    for line in lines[start:]:
        if not line.strip() or set(line.strip()) == {"-"}:
            continue
        name_field = line[:sec_idx]
        security = line[sec_idx:sig_idx].strip()
        signal = line[sig_idx:].strip()
        connected = name_field.lstrip().startswith(">")
        ssid = name_field.lstrip().lstrip(">").strip()
        if not ssid:
            continue
        networks.append(
            {
                "ssid": ssid,
                "security": security,
                "signal": signal,
                "connected": connected,
            }
        )
    return networks


def password_modal(stdscr, ssid):
    h, w = stdscr.getmaxyx()
    box_w = min(w - 4, 50)
    box_h = 5
    y, x = (h - box_h) // 2, (w - box_w) // 2

    win = curses.newwin(box_h, box_w, y, x)
    win.keypad(True)
    curses.curs_set(1)

    password = ""
    while True:
        win.erase()
        win.border()
        win.addnstr(1, 2, f"Password for {ssid}", box_w - 4)
        win.addnstr(2, 2, "*" * len(password), box_w - 4)
        win.addnstr(3, 2, "Enter=connect  Esc=cancel", box_w - 4)
        win.refresh()

        ch = win.getch()
        if ch in (curses.KEY_ENTER, 10, 13):
            curses.curs_set(0)
            return password
        if ch == 27:  # Esc
            curses.curs_set(0)
            return None
        if ch in (curses.KEY_BACKSPACE, 127, 8):
            password = password[:-1]
        elif 32 <= ch <= 126 and len(password) < 63:
            password += chr(ch)


def status_line(stdscr, text):
    h, w = stdscr.getmaxyx()
    stdscr.addnstr(h - 1, 0, text.ljust(w - 1), w - 1, curses.A_REVERSE)
    stdscr.refresh()


def connect(stdscr, device, net):
    if net["security"] and net["security"].lower() != "open":
        password = password_modal(stdscr, net["ssid"])
        if password is None:
            return
        status_line(stdscr, f"Connecting to {net['ssid']}...")
        result = run("--passphrase", password, "station", device, "connect", net["ssid"], timeout=30)
    else:
        status_line(stdscr, f"Connecting to {net['ssid']}...")
        result = run("station", device, "connect", net["ssid"], timeout=30)

    if result.returncode == 0:
        status_line(stdscr, f"Connected to {net['ssid']}. Press any key.")
    else:
        err = (result.stderr or result.stdout or "unknown error").strip()
        status_line(stdscr, f"Failed: {err[:70]}. Press any key.")
    stdscr.getch()


HELP = "Up/Down: select   Enter: connect   p: toggle wifi   q: quit"


def draw(stdscr, device, networks, selected, powered):
    stdscr.erase()
    h, w = stdscr.getmaxyx()
    state = "on" if powered else "off"
    stdscr.addnstr(0, 0, f"Wi-Fi ({device}) [{state}]", w - 1, curses.A_BOLD)

    if not powered:
        stdscr.addnstr(2, 2, "Wi-Fi is off. Press p to turn on.", w - 3)
    elif not networks:
        stdscr.addnstr(2, 2, "No networks found.", w - 3)
    for i, net in enumerate(networks):
        row = 2 + i
        if row >= h - 1:
            break
        marker = ">" if net["connected"] else " "
        label = f"{marker} {net['ssid']:<32} {net['security']:<8} {net['signal']}"
        attr = curses.A_REVERSE if i == selected else curses.A_NORMAL
        stdscr.addnstr(row, 2, label, w - 3, attr)

    stdscr.addnstr(h - 1, 0, HELP.ljust(w - 1), w - 1, curses.A_REVERSE)
    stdscr.refresh()


def main(stdscr):
    curses.curs_set(0)
    stdscr.keypad(True)

    device = get_device()
    powered = get_power(device)
    networks = []
    if powered:
        status_line(stdscr, "Scanning...")
        run("station", device, "scan")
        networks = get_networks(device)

    selected = 0
    while True:
        draw(stdscr, device, networks, selected, powered)
        ch = stdscr.getch()

        if ch in (ord("q"), ord("Q")):
            break
        elif ch in (ord("p"), ord("P")):
            toggle_power(stdscr, device)
            powered = get_power(device)
            networks = get_networks(device) if powered else []
            selected = min(selected, max(len(networks) - 1, 0))
        elif ch in (curses.KEY_UP, ord("k")) and networks:
            selected = (selected - 1) % len(networks)
        elif ch in (curses.KEY_DOWN, ord("j")) and networks:
            selected = (selected + 1) % len(networks)
        elif ch in (curses.KEY_ENTER, 10, 13) and networks:
            connect(stdscr, device, networks[selected])
            networks = get_networks(device)
            selected = min(selected, max(len(networks) - 1, 0))


if __name__ == "__main__":
    try:
        curses.wrapper(main)
    except KeyboardInterrupt:
        sys.exit(0)
