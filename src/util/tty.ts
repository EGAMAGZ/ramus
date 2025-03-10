import { GitError } from "../exceptions.ts";

export class TTY {
  prompt(message?: string | undefined, _default?: string | undefined): string | null {
    return prompt(message, _default);
  }
  confirm(message?: string | undefined): boolean {
    return confirm(message);
  }
  log(...args: unknown[]) {
    console.log(...args);
  }
  logError(...args: unknown[]) {
    console.error(...args);
  }
}

export function error(tty: TTY, message: string): never {
  tty.logError(`%cerror%c ${message}`, "color: red; font-weight:bold", "");
  throw new GitError();
}

