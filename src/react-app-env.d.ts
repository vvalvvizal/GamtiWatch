interface ProcessEnv {
  readonly REACT_APP_VAPID_KEY: string;
}

interface Process {
  env: ProcessEnv;
}

declare var process: Process;
