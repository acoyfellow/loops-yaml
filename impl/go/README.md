# loops — Go implementation

A conformant `loops-spec.v0` implementation. Single static binary, no runtime.

## Build

```bash
cd impl/go
go build -o loops .
```

## Run via the dispatcher

```bash
LOOPS_IMPL=go loops list
# or
loops --impl=go watch
```

## Conformance

Must pass the shared vectors in `../../tests/vectors/`:

- `cron.json` — does `<expr>` fire at `<time>`; which exprs are invalid
- `parse.json` — `loops.yaml` → parsed loops, or the expected error

## Status

Stub. Implement `main.go` against [../../SPEC.md](../../SPEC.md):
cron parse/match, the tiny YAML reader, `list`/`run`/`watch`/`logs`, and the
`~/.loops/<name>/` state layout.
