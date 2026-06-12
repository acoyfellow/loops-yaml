# Design

A loop is a schedule plus a command. The runner reads `loops.yaml`, runs commands on their cron, and shows you what ran. That is the whole tool.

## What it does not do

`loops` has no concept of:

- read-only vs read-write,
- receipts or output formats,
- models or prompts,
- tokens, credentials, or scopes,
- what counts as success beyond the command's exit code.

Those are properties of the command you write, not of the scheduler. A loop that reviews merge requests and a loop that backs up a folder are the same shape to `loops`: a cron line and a command.

## Why the line is drawn there

Keeping the runner unopinionated means:

- any command works — a script, a binary, a deploy, a one-liner;
- patterns like "read-only" or "write a receipt" are implemented in the command and shown by example, not enforced by the tool;
- the tool stays small enough to read in one sitting.

If you want a loop to be read-only, give its command a read-scoped token and a single output directory. The runner does not need to know.

## On-demand and scheduled are the same loop

`schedule` only decides whether `watch` starts a loop on its own. `loops run <name>` always works, with or without a schedule. The cron is just "who pressed go."

## State

Each run writes a timestamped log and updates `latest.json` under `~/.loops/<name>/`. `list` reads `latest.json`; `logs` reads the log. There is no database and no daemon state beyond these files.

## Surviving reboots

The runner does not install itself as a service. `loops watch` is a normal foreground process. To keep it alive across reboots, wrap it in launchd (macOS) or a systemd user service (Linux). Delegating persistence to the OS keeps the tool to one job.
