---
slug: hyprland-super-key
title: Chasing a Dead Super Key Across Two Keyboards
category: Linux
date: August 24, 2026
readTime: 5 min read
excerpt: How a single unresponsive key turned into a two-day detour through keybind configs, layout groups, and a keyboard’s hidden mode switch.
---

I recently moved from a Turkish-layout laptop keyboard to an external English (US) one, and for about two days afterward my Super key did absolutely nothing. No app launcher, no window shortcuts, nothing. On Hyprland that key is load-bearing, so this was more than a minor annoyance.

## Where I started looking

My first assumption was a hardware fault, since I'd just swapped keyboards. I ran `hyprctl` to check whether the compositor was even receiving the keypress, and confirmed it was — the event showed up, but nothing bound to it fired. That ruled out the keyboard being physically dead and pointed me back toward configuration.

## The actual causes were two, not one

It turned out I was debugging two separate problems and kept fixing half of the issue, then getting confused when nothing changed.

1. A misconfigured keybind line in my HyprFlux config was quietly consuming `SUPER` as a modifier before it could reach the binds I actually wanted to trigger.
2. The external keyboard itself has a hardware `Code` key that toggles which physical key sends the Super/Windows scancode at all — completely independent of anything Hyprland or Linux could see.

> Half of debugging a window manager is remembering the bug might not be in the window manager at all.

## Fixing the keybind layer

The relevant file was `UserConfigs/UserKeybinds.conf`. Once I found the conflicting line and removed it, the standard binds started working again:

```conf — UserKeybinds.conf
bind = SUPER, RETURN, exec, kitty
bind = SUPER, Q, killactive
bind = SUPER, SPACE, exec, wofi --show drun
```

## Fixing the layout itself

Separately, I wanted both US and Turkish layouts available without hunting through settings, so I set up a two-layout group with an Alt+Shift toggle in `UserSettings.conf`:

```conf — UserSettings.conf
input {
  kb_layout = us,tr
  kb_options = grp:alt_shift_toggle
}
```

Once both pieces were in place, the difference was obvious:

| Layer | Before | After |
| ----- | ------ | ----- |
| Hardware toggle | Super key silently disabled | Correct key sends the scancode |
| Keybind config | Conflicting bind swallowed SUPER | Binds fire as expected |
| Layout switch | Manual, buried in settings | Alt+Shift toggles US/TR instantly |

Nothing here was exotic once I saw it clearly — but it's a good reminder that a "dead key" can be dead for reasons stacked on top of each other, and fixing one layer won't always show its effect until the other layer is fixed too.
