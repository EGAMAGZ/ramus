import { GitError } from "../exceptions.ts";

/**
 * TTY class for handling terminal input/output operations
 */
export class TTY {
  /**
   * Prompts the user for input
   * @param message The message to display
   * @param _default The default value if no input is provided
   * @returns The user input or null if canceled
   */
  prompt(message?: string, _default?: string): string | null {
    return prompt(message, _default);
  }

  /**
   * Asks the user for confirmation
   * @param message The message to display
   * @returns True if confirmed, false otherwise
   */
  confirm(message?: string): boolean {
    return confirm(message);
  }

  /**
   * Logs messages to the console
   * @param args Arguments to log
   */
  log(...args: unknown[]): void {
    console.log(...args);
  }

  /**
   * Logs error messages to the console
   * @param args Arguments to log as errors
   */
  logError(...args: unknown[]): void {
    console.error(...args);
  }
}

/**
 * Displays an error message and throws a GitError
 * @param tty The TTY instance to use for logging
 * @param message The error message to display
 * @throws GitError always
 */
export function error(tty: TTY, message: string): never {
  tty.logError(
    `%cerror%c ${message}`,
    "color: red; font-weight:bold",
    "",
  );
  throw new GitError(message);
}
