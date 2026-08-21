#!/bin/bash
# Wi-Fi menu (iwctl), launched in a terminal from the waybar network module.

DEV=$(iwctl device list 2>/dev/null | awk '/station/ {print $2; exit}')
DEV="${DEV:-wlan0}"

echo "Wi-Fi (iwctl) -- device: $DEV"
echo

iwctl station "$DEV" scan >/dev/null 2>&1
sleep 1

iwctl station "$DEV" get-networks

echo
echo "Commands:"
echo "  station $DEV connect \"SSID\""
echo "  station $DEV disconnect"
echo "  station $DEV show"
echo "  exit"
echo

exec iwctl
