#!/bin/bash
# Bluetooth menu (bluetoothctl), launched in a terminal from the waybar bluetooth module.

bluetoothctl power on >/dev/null

echo "Bluetooth (bluetoothctl)"
echo
echo "Scanning for 4s..."
bluetoothctl --timeout 4 scan on >/dev/null 2>&1

echo
echo "Paired devices:"
bluetoothctl devices Paired
echo
echo "Discovered devices:"
bluetoothctl devices

echo
echo "Commands:"
echo "  scan on / scan off"
echo "  pair <MAC>"
echo "  trust <MAC>"
echo "  connect <MAC>"
echo "  disconnect <MAC>"
echo "  exit"
echo

exec bluetoothctl
