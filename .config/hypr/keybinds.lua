-- ~/.config/hypr/keybinds.lua
-- Migrated from keybinds.conf
-- Docs: https://wiki.hypr.land/Configuring/Basics/Binds/
--       https://wiki.hypr.land/Configuring/Basics/Dispatchers/

local home = os.getenv("HOME")

-- Launchers
hl.bind(mainMod .. " + T", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + D", hl.dsp.exec_cmd(menu))
hl.bind(mainMod .. " + E", hl.dsp.exec_cmd(fileManager))
hl.bind(mainMod .. " + B", hl.dsp.exec_cmd(browser))

hl.bind(mainMod .. " + Q", hl.dsp.window.close())
hl.bind("SUPER + Tab", hl.dsp.exec_cmd("hyprlock"))
hl.bind(mainMod .. " + GRAVE", hl.dsp.exec_cmd(home .. "/.config/hypr/scripts/wlogout-launch.sh"))
hl.bind(mainMod .. " + W", hl.dsp.exec_cmd("quickshell -n -c hyprquickpaper"))

hl.bind(mainMod .. " + F", hl.dsp.window.fullscreen({ mode = 0 }))

hl.bind(mainMod .. " + O", hl.dsp.exec_cmd(home .. "/.config/hypr/scripts/opacity.sh"))

-- Mouse move/resize window
hl.bind(mainMod .. " + mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind(mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

-- Toggle waybar
hl.bind(mainMod .. " + SHIFT + W", hl.dsp.exec_cmd("sh -c 'pgrep -x waybar >/dev/null && pkill waybar || nohup waybar >/dev/null 2>&1 &'"))

-- Screenshots
hl.bind(mainMod .. " + Delete", hl.dsp.exec_cmd("grim " .. home .. "/Pictures/$(date +%s).png"))
-- Bare PrtSc (not Delete -- that key stays a normal Delete)
hl.bind("Print", hl.dsp.exec_cmd(home .. "/.config/hypr/scripts/screenshot-region.sh"))
hl.bind(mainMod .. " + SHIFT + C", hl.dsp.exec_cmd(
    'grim -g "$(slurp)" - | tee ' .. home .. '/Pictures/Screenshots/$(date +%s).png | wl-copy'
))

-- Clipboard
hl.bind(mainMod .. " + V", hl.dsp.exec_cmd(
    "cliphist list | rofi -dmenu -p '' | cliphist decode | wl-copy"
))

-- Keyboard layout
hl.bind(mainMod .. " + Z", hl.dsp.exec_cmd("hyprctl switchxkblayout current next"))

-- Toggle float window, center and rezise
hl.bind(mainMod .. " + Space", function()
    hl.dispatch(hl.dsp.window.float({ action = "toggle" }))

    local w = hl.get_active_window()
    if w ~= nil and w.floating then
        local mon = hl.get_active_monitor()
        if mon ~= nil then
            local target_w = math.floor(mon.width * 0.7) 
            local target_h = math.floor(mon.height * 0.7)

            -- absolute resize (relative = false), not a delta
            hl.dispatch(hl.dsp.window.resize({ x = target_w, y = target_h, relative = false }))

            local mon_x = mon.x or 0
            local mon_y = mon.y or 0
            local target_x = mon_x + math.floor((mon.width - target_w) / 2)
            local target_y = mon_y + math.floor((mon.height - target_h) / 2)

            -- absolute move to the centered position
            hl.dispatch(hl.dsp.window.move({ x = target_x, y = target_y, relative = false }))
        end
    end
end)

-- VERIFY: exit dispatcher. Docs explicitly say to double check the exit
-- dispatcher call when moving to Lua.
hl.bind(mainMod .. " + SHIFT + E", hl.dsp.exit())

-- Focus (H/J/K/L = left/down/up/right, vim-style, matching your original)
hl.bind(mainMod .. " + H", hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + J", hl.dsp.focus({ direction = "down" }))
hl.bind(mainMod .. " + K", hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + L", hl.dsp.focus({ direction = "right" }))

-- VERIFY: move active window within layout (old `movewindow` dispatcher).
-- Confirmed pattern is hl.dsp.window.move({ workspace = N }) for sending to a
-- workspace (used below) - the direction-swap variant isn't shown in the
-- official example, so double check this fires like the old movewindow did.
hl.bind(mainMod .. " + SHIFT + H", hl.dsp.window.move({ direction = "left" }))
hl.bind(mainMod .. " + SHIFT + J", hl.dsp.window.move({ direction = "down" }))
hl.bind(mainMod .. " + SHIFT + K", hl.dsp.window.move({ direction = "up" }))
hl.bind(mainMod .. " + SHIFT + L", hl.dsp.window.move({ direction = "right" }))

-- VERIFY: resize active window by pixel delta (old `resizeactive`, repeating
-- while held via `binde`). Param names guessed as x/y - confirm with hyprctl eval.
hl.bind(mainMod .. " + CTRL + H", hl.dsp.window.resize({ x = -40, y = 0 }), { repeating = true })
hl.bind(mainMod .. " + CTRL + L", hl.dsp.window.resize({ x = 40, y = 0 }), { repeating = true })
hl.bind(mainMod .. " + CTRL + K", hl.dsp.window.resize({ x = 0, y = -40 }), { repeating = true })
hl.bind(mainMod .. " + CTRL + J", hl.dsp.window.resize({ x = 0, y = 40 }), { repeating = true })

-- Workspaces 1-10, and move-to-workspace with SHIFT (confirmed pattern from
-- the official example config)
for i = 1, 10 do
    local key = i % 10 -- 10 maps to key 0
    hl.bind(mainMod .. " + " .. key, hl.dsp.focus({ workspace = i }))
    hl.bind(mainMod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

-- Media keys (confirmed pattern from the official example config)
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true, repeating = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true, repeating = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"), { locked = true })

hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })
hl.bind("XF86AudioNext", hl.dsp.exec_cmd("playerctl next"), { locked = true })
hl.bind("XF86AudioPrev", hl.dsp.exec_cmd("playerctl previous"), { locked = true })

-- Brightness keys -- reuse the waybar backlight module's script so the
-- floor-clamping behaviour (never fully dark on the laptop panel, see
-- scripts/monitor-popup.sh) stays in one place instead of duplicating a
-- second brightnessctl call with different clamp logic.
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd(home .. "/.config/waybar/scripts/brightness.sh up"), { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd(home .. "/.config/waybar/scripts/brightness.sh down"), { locked = true, repeating = true })

-- External display switch -- reopens the same mirror/extend picker as
-- clicking the waybar external-monitor module.
hl.bind("XF86Display", hl.dsp.exec_cmd(home .. "/.config/hypr/scripts/external-monitor-click.sh"), { locked = true })

-- Wireless radio toggle (airplane-mode key). Bluetooth's own default-off
-- policy is handled at the service level, not here -- see the "Keep
-- bluetoothd running but radio off by default" commit.
hl.bind("XF86WLAN", hl.dsp.exec_cmd("rfkill toggle wifi"), { locked = true })
