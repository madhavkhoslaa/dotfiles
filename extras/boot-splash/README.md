# Boot splash

`splash.bmp` is what shows up as the kernel starts, via systemd-stub's
`--splash` support in the Unified Kernel Image (`bootctl status` needs
"Measured UKI: yes" -- if your setup uses a plain initramfs/kernel
instead of a UKI, this doesn't apply).

Not applied by `install.sh` -- it's a personal touch for this machine,
not something a fresh clone of this repo should silently inherit. To
apply it by hand:

```bash
sudo install -Dm644 extras/boot-splash/splash.bmp /etc/kernel/splash.bmp
sudo sed -i 's|--splash /usr/share/systemd/bootctl/splash-arch.bmp|--splash /etc/kernel/splash.bmp|' /etc/mkinitcpio.d/linux.preset
sudo mkinitcpio -P
```

The `sed` line assumes the stock Arch splash was the previous value --
adjust it if your `default_options` line looks different. Only the
`default` preset is touched; `fallback` is left splash-less on purpose
so there's always a plain recovery boot.

To revert, point `default_options` in `/etc/mkinitcpio.d/linux.preset`
back at `/usr/share/systemd/bootctl/splash-arch.bmp` and re-run
`sudo mkinitcpio -P`.
