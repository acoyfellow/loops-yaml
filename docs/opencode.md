# OpenCode recurring prompts

The OpenCode plugin runs session-scoped recurring prompts while OpenCode is
open and the session is idle — the same model as the [Pi extension](../README.md#pi-recurring-prompts),
ported to OpenCode's plugin API.

A loop is an interval plus a prompt. Each due loop is delivered as a follow-up
prompt that drives a new agent turn, and only when the session is idle so loops
never overlap an active turn.

## Install

OpenCode loads plugins from `.opencode/plugin/` (project-local) or
`~/.config/opencode/plugin/` (global), or from the `plugin` array in your
`opencode.json`.

### From a local checkout

```bash
git clone https://github.com/acoyfellow/loops-yaml
cd loops-yaml && bun install
```

Point OpenCode at the plugin entry. In `opencode.json` (project or global):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["/ABSOLUTE/PATH/TO/loops-yaml/extensions/opencode/index.ts"]
}
```

Or drop a one-line re-export into your plugin directory:

```ts
// ~/.config/opencode/plugin/loops.ts
export { LoopsPlugin as default } from "/ABSOLUTE/PATH/TO/loops-yaml/extensions/opencode/index.ts";
```

### From npm

Once published, reference the package export directly:

```jsonc
{
  "plugin": ["@acoyfellow/loops-yaml/opencode"]
}
```

Restart OpenCode after editing the config so the plugin loads.

## Use it

The agent drives loops through the `loops_task` tool. Ask in plain language:

```text
every 30s check MR !38955; stop this loop once it merges
```

The agent calls `loops_task` with `action: "create"`, and once the MR merges it
calls `action: "delete"` to stop the loop. You can also ask it to `list`,
`delete <id>`, or `clear` all loops.

`loops_task` actions:

| Action | Arguments | Does |
|---|---|---|
| `create` | `interval`, `prompt`, `maxRuns?`, `expiresIn?` | Start a recurring prompt. |
| `list` | — | One line per loop: id, interval, next run, run count, prompt. |
| `delete` | `id` | Stop one loop. |
| `clear` | — | Stop every loop. |

Intervals are `30s`, `5m`, `2h`, `1d` (minimum `5s`). Tasks default to a
24-hour expiry (`expiresIn`) and a 100-run cap (`maxRuns`).

## How delivery works

- The plugin tracks the active session and whether a turn is in flight using
  OpenCode's `session.idle` / `session.status` events.
- A 1-second timer wakes, prunes expired loops, and — if the session is idle —
  delivers the single most-due loop as a prompt via the session API.
- A loop is never delivered while a turn is running, so loops and your work
  never overlap.
- Each delivered prompt reminds the agent to call `loops_task` with
  `action: "delete"` once the loop's terminal condition is met.

## State

Tasks persist to disk so they survive a TUI restart:

```
~/.loops-opencode/<project>.json
```

Override the directory with `LOOPS_OPENCODE_STATE_DIR`. Expired or capped loops
are pruned automatically on the next tick.

## Session-scoped by design

Like the Pi extension, these prompt loops only run while OpenCode is open. For
commands that must run after the editor exits, use the durable shell scheduler
(`loops watch`) described in the [README](../README.md) and
[how-to guide](how-to.md).
