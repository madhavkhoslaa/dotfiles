#!/usr/bin/env python3
"""Curses Wi-Fi picker backed by nmcli. Up/Down select, Enter connects
(saved networks connect straight away with no prompt; new secured
networks prompt for a passphrase), p toggles the radio on/off, q quits.

This machine runs NetworkManager with iwd as its backend (see
/etc/NetworkManager/conf.d/wifi_backend.conf) and NetworkManager actively
owns wlan0 (`nmcli device status` shows it "connected", not
"unmanaged"). Talking to iwctl directly -- as this script used to --
races NetworkManager's own connection state machine for the device:
`journalctl -u iwd` shows manual iwctl connect attempts getting
cancelled or failing auth (connect-failed, status: 1) moments before
NetworkManager's own autoconnect succeeds using the very same stored
password. Driving nmcli instead goes through the manager that actually
owns the device, which is what fixes "I type the password and it just
doesn't connect".
"""

import curses
import subprocess
import sys


def run(*args, timeout=15):
    return subprocess.run(
        ["nmcli", *args], capture_output=True, text=True, timeout=timeout
    )


def split_fields(line):
    # nmcli -t escapes ':' and '\' as '\:' and '\\' inside field values.
    fields = []
    cur = []
    i = 0
    while i < len(line):
        c = line[i]
        if c == "\\" and i + 1 < len(line):
            cur.append(line[i + 1])
            i += 2
            continue
        if c == ":":
            fields.append("".join(cur))
            cur = []
            i += 1
            continue
        cur.append(c)
        i += 1
    fields.append("".join(cur))
    return fields


def get_device():
    out = run("-t", "-f", "DEVICE,TYPE", "device").stdout
    for line in out.splitlines():
        fields = split_fields(line)
        if len(fields) >= 2 and fields[1] == "wifi":
            return fields[0]
    return "wlan0"


def get_power():
    out = run("radio", "wifi").stdout.strip().lower()
    return out.startswith("enabled")


def toggle_power(stdscr):
    new_state = "off" if get_power() else "on"
    status_line(stdscr, f"Turning Wi-Fi {new_state}...")
    run("radio", "wifi", new_state, timeout=10)
    if new_state == "on":
        scan()


def scan():
    run("device", "wifi", "rescan", timeout=10)


def get_saved_ssids():
    out = run("-t", "-f", "NAME,TYPE", "connection", "show").stdout
    saved = set()
    for line in out.splitlines():
        if not line.strip():
            continue
        fields = split_fields(line)
        if len(fields) >= 2 and fields[1] == "802-11-wireless":
            saved.add(fields[0])
    return saved


def get_networks(device):
    out = run(
        "-t", "-f", "SSID,SECURITY,SIGNAL,IN-USE",
        "device", "wifi", "list", "ifname", device,
    ).stdout
    saved = get_saved_ssids()

    networks = []
    seen = set()
    for line in out.splitlines():
        if not line.strip():
            continue
        fields = split_fields(line)
        if len(fields) < 4:
            continue
        ssid, security, signal, in_use = fields[0], fields[1], fields[2], fields[3]
        if not ssid or ssid in seen:
            continue
        seen.add(ssid)
        networks.append(
            {
                "ssid": ssid,
                "security": security,
                "signal": signal,
                "connected": in_use.strip() == "*",
                "saved": ssid in saved,
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
        # Keep the cursor tracking the end of what's typed instead of
        # wherever the last addnstr() left it (previously the help line).
        win.move(2, min(2 + len(password), box_w - 3))
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


def describe_failure(err, had_password):
    # NetworkManager's actual message for a wrong Wi-Fi password is
    # "Secrets were required, but not provided" -- true-sounding but
    # misleading, since a password *was* given; it means the handshake
    # never completed so NM falls back to asking for secrets again.
    # Surface that plainly instead of the confusing raw text.
    if had_password and (
        "secrets were required" in err.lower() or "802-11-wireless-security" in err.lower()
    ):
        return "Wrong password."
    return f"Failed: {err[:70]}" if err else "Failed: unknown error."


def connect(stdscr, device, net):
    had_password = False
    try:
        if net["saved"]:
            # Already has a stored profile -- nmcli uses it directly, no
            # need to (and no point re-)prompt for a password.
            status_line(stdscr, f"Connecting to {net['ssid']} (saved)...")
            result = run("connection", "up", "id", net["ssid"], timeout=30)
        elif net["security"] and net["security"] != "--":
            password = password_modal(stdscr, net["ssid"])
            if password is None:
                return
            had_password = True
            status_line(stdscr, f"Connecting to {net['ssid']}...")
            result = run(
                "device", "wifi", "connect", net["ssid"],
                "password", password, "ifname", device, timeout=30,
            )
            if result.returncode != 0:
                # nmcli leaves behind a profile with the bad password on
                # failure; drop it so the next attempt isn't silently stuck
                # reusing the wrong credential.
                run("connection", "delete", net["ssid"], timeout=10)
        else:
            status_line(stdscr, f"Connecting to {net['ssid']}...")
            result = run(
                "device", "wifi", "connect", net["ssid"], "ifname", device, timeout=30
            )
    except subprocess.TimeoutExpired:
        status_line(stdscr, f"Timed out connecting to {net['ssid']}. Press any key.")
        stdscr.getch()
        return

    if result.returncode == 0:
        status_line(stdscr, f"Connected to {net['ssid']}. Press any key.")
    else:
        err = (result.stderr or result.stdout or "").strip()
        status_line(stdscr, f"{describe_failure(err, had_password)} Press any key.")
    stdscr.getch()


HELP = "Up/Down: select   Enter: connect   *: saved   p: toggle wifi   q: quit"


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
        saved = "*" if net["saved"] else " "
        label = f"{marker}{saved} {net['ssid']:<32} {net['security']:<8} {net['signal']}"
        attr = curses.A_REVERSE if i == selected else curses.A_NORMAL
        stdscr.addnstr(row, 2, label, w - 3, attr)

    stdscr.addnstr(h - 1, 0, HELP.ljust(w - 1), w - 1, curses.A_REVERSE)
    stdscr.refresh()


def main(stdscr):
    curses.curs_set(0)
    stdscr.keypad(True)

    device = get_device()
    powered = get_power()
    networks = []
    if powered:
        status_line(stdscr, "Scanning...")
        scan()
        networks = get_networks(device)

    selected = 0
    while True:
        draw(stdscr, device, networks, selected, powered)
        ch = stdscr.getch()

        if ch in (ord("q"), ord("Q")):
            break
        elif ch in (ord("p"), ord("P")):
            toggle_power(stdscr)
            powered = get_power()
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
