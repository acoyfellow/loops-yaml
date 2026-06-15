# loops-spec.v0

A loop is a schedule plus a command. This is the whole contract. Any
implementation that matches it is a valid `loops`.

The reference implementation is `src/` (TypeScript). Other implementations live
under `impl/<lang>/` and must pass the shared vectors in `tests/`.

## File: `loops.yaml`

Found in the current directory or any parent.

```yaml
loops:
  <name>:
    run: <string>        # required: command, passed to `bash -lc`
    schedule: <cron>     # optional: 5-field cron; absent = on-demand only
    cwd: <string>        # optional: working dir, relative to loops.yaml
```

- The top-level key is `loops`, a map of name → loop.
- A loop accepts exactly three keys: `run`, `schedule`, `cwd`. Any other key is
  an error.
- `run` is required and non-empty. A loop without `run` is an error.
- Indentation is two spaces per level. `#` begins a comment. Scalars may be
  bare or wrapped in single/double quotes; quotes are stripped.
- The loop name is the map key. The command runs with `LOOP_NAME` set to it.

## Cron

Five space-separated fields: `minute hour day-of-month month day-of-week`.

| Field | Range |
|---|---|
| minute | 0–59 |
| hour | 0–23 |
| day of month | 1–31 |
| month | 1–12 |
| day of week | 0–7 (0 and 7 are Sunday) |

Each field supports:
- `*` — every value
- lists — `1,2,3`
- ranges — `1-5`
- steps — `*/5`, `10-20/2`

No seconds. No named months or days. A field that does not parse makes that
loop invalid: it is skipped with a warning, and the rest of the file still
loads (fail-open). A loop fires in a given minute when all five fields match.

## Commands

| Command | Behavior | Exit |
|---|---|---|
| `list` | One line per loop: `name`, schedule (or `on-demand`), last run status. | 0 |
| `run <name>` | Run that loop once via `bash -lc`. | the command's exit code |
| `watch` | Wake aligned to each minute, run every loop whose cron matches. Skip loops with no schedule. One run per loop at a time. | runs until stopped |
| `logs <name> [n]` | Last `n` lines (default 40) of the loop's most recent run. | 0 |

`run` streams the command's stdout/stderr to a per-run log and records start,
finish, and exit code.

## State

Per-loop run state and logs live under `~/.loops/<name>/` (override with
`LOOPS_STATE_DIR`):

- `<timestamp>.log` — one file per run: header, output, exit code.
- `latest.json` — the most recent run record.

## Concurrency

`watch` runs at most `max_concurrent` commands at once (a top-level optional key
in `loops.yaml`, default 8). A loop already running is never started again.

## Flavors

The `loops` command routes to an implementation. The default is the reference
TypeScript impl. Select another with `LOOPS_IMPL=<lang>` or `--impl=<lang>`.
Every flavor passes `tests/` and behaves identically per this spec. Pick the
runtime you want; the spec does not change.
