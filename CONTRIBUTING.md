# Contributing

```bash
bun install
bun test
bun run typecheck
bun run lint
```

The runner stays small and unopinionated: a loop is a schedule plus a command.
Features that add opinions about what a command should do (output formats,
credentials, models, sandboxes) belong in the command, not here.

- Match the existing Biome style (`bun run lint:fix`).
- Add a test for parser or cron changes.
- Keep the README understandable in a few minutes.
