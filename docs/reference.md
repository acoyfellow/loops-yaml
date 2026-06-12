# Reference

## loops.yaml

```yaml
loops:
  <name>:
    run: <command>          # required
    schedule: <cron>        # optional; 5-field cron
    cwd: <path>             # optional; relative to loops.yaml
```

| Field | Required | Meaning |
|---|---|---|
| `run` | yes | Command passed to `bash -lc`. |
| `schedule` | no | 5-field cron. Omit for on-demand only. |
| `cwd` | no | Working directory, relative to the `loops.yaml` location. Defaults to that location. |

The loop name is the map key. The command runs with `LOOP_NAME` set.

`loops.yaml` is found in the current directory or any parent.

## Cron format

Five space-separated fields: `minute hour day-of-month month day-of-week`.

| Field | Range |
|---|---|
| minute | 0–59 |
| hour | 0–23 |
| day of month | 1–31 |
| month | 1–12 |
| day of week | 0–7 (0 and 7 are Sunday) |

Supports `*`, lists (`1,2,3`), ranges (`1-5`), and steps (`*/5`, `10-20/2`). No seconds, no named months or days.

## Commands

| Command | Description | Exit |
|---|---|---|
| `loops list` | Loops and their last run. | 0 |
| `loops run <name>` | Run one loop now. | the loop's exit code |
| `loops watch` | Run scheduled loops forever; wakes each minute. | runs until stopped |
| `loops logs <name> [n]` | Last n lines (default 40) of the most recent log. | 0 |

## State and logs

| Path | Contents |
|---|---|
| `~/.loops/<name>/<timestamp>.log` | One file per run: header, output, exit code. |
| `~/.loops/<name>/latest.json` | Last run record (start, finish, exit code, log path, pid). |

Override the base directory with `LOOPS_STATE_DIR`.

## Scheduler behavior

- Wakes once per minute, aligned to the minute boundary.
- Runs every loop whose cron matches the current minute.
- One run per loop at a time: a loop still running is not started again.
- Loops without `schedule` are never run by `watch`.
