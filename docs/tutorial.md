# Run your first loop

## 1. Create `loops.yaml`

In any directory:

```yaml
loops:
  hello:
    run: echo "hello at $(date)"
```

## 2. Run it

```bash
loops run hello
```

The command runs once. Its output is saved to a log, and the exit code is recorded.

## 3. See it

```bash
loops list
loops logs hello
```

`list` shows the last run and exit code. `logs` prints the output.

## 4. Put it on a schedule

Add a cron line:

```yaml
loops:
  hello:
    schedule: "*/5 * * * *"
    run: echo "hello at $(date)"
```

Then leave the scheduler running:

```bash
loops watch
```

It wakes every minute and runs `hello` whenever the cron matches. `loops run hello` still works at any time.

## 5. Point a loop at real work

The command can be anything — a script, a binary, a deploy:

```yaml
loops:
  review:
    schedule: "0 8 * * *"
    run: ./scripts/review.sh
    cwd: ../review-loop-lab
```

`cwd` sets the working directory. The loop exports `LOOP_NAME` to the command.
