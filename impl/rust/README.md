# loops — Rust implementation

A conformant `loops-spec.v0` implementation. Single static binary, minimal deps.

## Build

```bash
cd impl/rust
cargo build --release
cp target/release/loops ./loops
```

## Run via the dispatcher

```bash
LOOPS_IMPL=rust loops list
# or
loops --impl=rust watch
```

## Conformance

Must pass the shared vectors in `../../tests/vectors/`:

- `cron.json` — does `<expr>` fire at `<time>`; which exprs are invalid
- `parse.json` — `loops.yaml` → parsed loops, or the expected error

## Status

Stub. Implement `src/main.rs` against [../../SPEC.md](../../SPEC.md):
cron parse/match, the tiny YAML reader, `list`/`run`/`watch`/`logs`, and the
`~/.loops/<name>/` state layout.
