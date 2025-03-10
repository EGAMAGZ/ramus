/**
 * Custom error class for Git-related errors
 */
export class GitError extends Error {
  /**
   * Creates a new GitError instance
   * @param message The error message
   */
  constructor(message = "Git operation failed") {
    super(message);
    this.name = "GitError";
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GitError);
    }
  }
}