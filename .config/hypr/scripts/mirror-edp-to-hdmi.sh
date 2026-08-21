#!/bin/sh
# Called from kanshi's "docked" profile: kanshi has no native mirror
# directive, and this Hyprland fork only takes runtime config changes via
# `hyprctl eval` (Lua), not `hyprctl keyword` - so this wraps the call in
# a plain script to sidestep kanshi's exec quoting/wordexp mangling.
exec hyprctl eval 'hl.monitor({ output = "eDP-1", mode = "preferred", position = "0x0", scale = 1.0, mirror = "HDMI-A-1" })'
