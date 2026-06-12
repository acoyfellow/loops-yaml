export interface Loop {
  /** Loop name, taken from the key in loops.yaml. */
  name: string;
  /** Command to run. Passed to the shell. */
  run: string;
  /** Optional cron schedule. Omit for on-demand only. */
  schedule?: string;
  /** Optional working directory. Defaults to the loops.yaml directory. */
  cwd?: string;
}

export interface LoopsFile {
  loops: Record<string, Omit<Loop, 'name'>>;
}

export interface RunRecord {
  name: string;
  startedAt: string;
  finishedAt?: string;
  exitCode?: number;
  logPath: string;
  pid?: number;
}
