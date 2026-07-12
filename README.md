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

## Pi recurring prompts

The included Pi extension runs session-scoped recurring prompts while Pi is open and idle:

```text
/loop every 30s check MR !38955; stop this loop once it merges
/loop list
/loop edit <id> every 5m check MR !38955 and report blockers
/loop stop <id>
/loop clear
```

The agent can create, edit, and stop the same loops with the `loops_task` tool. Editing changes the interval, prompt, limits, expiry, or compaction threshold in place without stopping and recreating the loop. Tasks persist in the Pi session, default to a 24-hour expiry and 100-run cap, never overlap agent turns, and instruct the agent to delete the task when its terminal condition is met.

Because every tick adds to the same session, Pi loops compact at 80% context usage by default. Compaction is part of the due tick: the prompt is held while compaction runs, then that same tick is delivered immediately after compaction succeeds. A failed compaction neither injects into the nearly full context nor increments the run count. Set `compactThreshold` to a fraction between 0 and 1 to override the default.

Because each tick injects its prompt into the same long-lived session, context grows monotonically. To avoid running a session into the model's context ceiling (where the output-token budget underflows and the provider rejects the request), a loop compacts the session before a tick once context usage reaches **80%** of the window. Override per loop with `compactThreshold` (a fraction between 0 and 1 exclusive) via the `loops_task` tool.

Install directly from GitHub, then reload Pi:

```bash
pi install git:github.com/acoyfellow/loops-yaml
```

These prompt loops are intentionally session-scoped. The shell scheduler below remains the durable option for commands that should run after Pi exits.

## OpenCode recurring prompts

The same recurring-prompt model is available as an [OpenCode](https://opencode.ai) plugin. While OpenCode is open and the session is idle, each due loop is delivered as a follow-up prompt; the agent drives loops through the `loops_task` tool:

```text
every 30s check MR !38955; stop this loop once it merges
```

Point OpenCode at the plugin entry in `opencode.json`:

```jsonc
{
  "plugin": ["/ABSOLUTE/PATH/TO/loops-yaml/extensions/opencode/index.ts"]
}
```

See [docs/opencode.md](docs/opencode.md) for install options, the `loops_task` actions, and how delivery works. Tasks persist under `~/.loops-opencode/` and default to a 24-hour expiry and 100-run cap.

## Install

```bash
git clone https://github.com/acoyfellow/loops-yaml
cd loops-yaml && bun install
bun src/cli.ts list
```

Or install straight from the repo:

```bash
bun add -g github:acoyfellow/loops-yaml
```

Requires [Bun](https://bun.sh).

## Guides

- [Run your first loop](docs/tutorial.md)
- [Schedule, run on demand, and keep loops alive](docs/how-to.md)
- [loops.yaml fields and CLI commands](docs/reference.md)
- [Why a loop is only a schedule and a command](docs/design.md)
- [OpenCode recurring prompts](docs/opencode.md)

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
