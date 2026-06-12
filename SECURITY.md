# Security

`loops` runs the commands in your `loops.yaml` through a shell, with your user's
permissions. It adds no sandbox and no privilege boundary.

- Only run a `loops.yaml` you trust. A loop command can do anything you can do.
- The runner does not enforce read-only, token scoping, or network limits.
  Those belong to the command you write.
- Logs under `~/.loops/` capture command output. Do not print secrets in a loop
  command if its logs should stay clean.

To report a vulnerability in the runner itself, open an issue at
https://github.com/acoyfellow/loops-yaml.
