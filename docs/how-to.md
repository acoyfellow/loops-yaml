# Common tasks

## Run a loop on demand only

Omit `schedule`:

```yaml
loops:
  deploy:
    run: bun run deploy
```

`loops run deploy` works. `loops watch` ignores it.

## Run a loop on a schedule

Add a 5-field cron expression:

```yaml
loops:
  nightly:
    schedule: "0 2 * * *"   # 02:00 every day
    run: ./nightly.sh
```

Then run the scheduler:

```bash
loops watch
```

## Keep the scheduler alive across reboots (macOS)

Wrap `loops watch` in a launchd LaunchAgent at `~/Library/LaunchAgents/dev.loops.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>dev.loops</string>
  <key>ProgramArguments</key>
  <array>
    <string>/opt/homebrew/bin/bun</string>
    <string>/ABSOLUTE/PATH/TO/loops-yaml/src/cli.ts</string>
    <string>watch</string>
  </array>
  <key>WorkingDirectory</key><string>/ABSOLUTE/PATH/TO/your/project</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/dev.loops.plist
```

## Keep the scheduler alive across reboots (Linux)

Use a systemd user service and enable lingering:

```ini
# ~/.config/systemd/user/loops.service
[Service]
ExecStart=%h/.bun/bin/bun /ABSOLUTE/PATH/loops-yaml/src/cli.ts watch
WorkingDirectory=/ABSOLUTE/PATH/your/project
Restart=always

[Install]
WantedBy=default.target
```

```bash
loginctl enable-linger "$USER"
systemctl --user enable --now loops
```

## Read a loop's output

```bash
loops logs review        # last 40 lines
loops logs review 200    # last 200 lines
```

Logs are kept per run under `~/.loops/<name>/`.

## Change where state is stored

```bash
LOOPS_STATE_DIR=/path/to/state loops run review
```

## Make a loop read-only or capability-scoped

`loops` does not do this — it is intentionally unopinionated. Enforce it inside your command: hand the script a read-scoped token, a single output directory, and nothing else. The loop runs whatever you give it.
