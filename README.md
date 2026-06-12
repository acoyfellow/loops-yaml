# loops-yaml

Run commands on a cron schedule, or on demand. A loop is a schedule plus a command — nothing else.

```yaml
# loops.yaml
loops:
  review:
    schedule: "0 8 * * *"   # 8am daily; omit for on-demand only
    run: ./scripts/review.sh
```

```bash
loops list            # every loop and its last run
loops run review      # run one now
loops watch           # run scheduled loops forever
loops logs review     # tail the last run
```

`loops` has no opinion about what your command does. Read-only, receipts, models, tokens — all of that lives inside your command, not here.

## Install

```bash
bun add -g loops-yaml   # or run from a clone: bun src/cli.ts
```

Requires [Bun](https://bun.sh).

## Guides

- [Run your first loop](docs/tutorial.md)
- [Schedule, run on demand, and keep loops alive](docs/how-to.md)
- [loops.yaml fields and CLI commands](docs/reference.md)
- [Why a loop is only a schedule and a command](docs/design.md)

## What it does

| Command | Does |
|---|---|
| `loops list` | Lists loops and each one's last run + exit code. |
| `loops run <name>` | Runs one loop now and exits with its exit code. |
| `loops watch` | Wakes each minute and runs loops whose cron matches. |
| `loops logs <name> [n]` | Prints the last n lines of a loop's most recent log. |

Run state and logs live in `~/.loops/<name>/` (override with `LOOPS_STATE_DIR`).

## License

MIT
