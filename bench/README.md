# loops-bench

Same spec, many runtimes, raced head to head. Each implementation under
`../impl/` (plus the reference `../src`) is measured on the dimensions that
matter for a scheduler CLI.

## Dimensions

| # | Metric | Why |
|---|---|---|
| 1 | Cold start (boot → first tick) | cron wakes constantly; startup cost compounds |
| 2 | Parse + compile a 1M-loop `loops.yaml` | load-time ceiling |
| 3 | Schedule scan throughput (matches/sec @ 1M) | the per-minute hot path |
| 4 | Spawn fan-out (N concurrent commands → done) | the real first wall |
| 5 | Binary size + install friction | runtime dep? static? |
| 6 | RSS at idle and under load | fits-on-a-small-VPS test |

## Fairness

Every implementation passes `../tests/vectors/` first. A build that is faster
but wrong does not count.

## Run

```bash
bench/gen-loopsfile.sh 1000000 > /tmp/big-loops.yaml   # generate the stress file
bench/run.sh                                            # race all built impls
```

## Status

Harness skeleton. `run.sh` discovers built impls, runs each dimension, prints a
table. Generators and per-dimension drivers are TODO.
