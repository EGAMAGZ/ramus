import { $, execa, ExecaError } from "execa";
import { GitError } from "../exceptions.ts";

/**
 * Checks if the git command is available in the system PATH.
 * @returns {Promise<boolean>} - Returns true if git is available, false if git is not found.
 * @throws {Error} - Throws an error if an unexpected error occurs while checking for git.
 */
export async function gitCommandExists(): Promise<boolean> {
  try {
    await execa("git --version");
    return true;
  } catch (error) {
    if (error instanceof ExecaError) {
      return false;
    }
    throw error;
  }
}

/**
 * Represents a Git branch with its name and current status
 * @property {string} name - The name of the branch.
 * @property {boolean} isCurrent - Whether the branch is the current branch.
 */
export interface GitBranch {
  name: string;
  isCurrent: boolean;
}

/**
 * Retrieves all branches from the specified git repository.
 * @param directory - The path to the git repository from which to retrieve branches.
 * @returns {Promise<GitBranch[]>} Array of branch objects containing the branch name and current status.
 * @throws {GitError} If the git command fails, with the error message from the git command.
 */
export async function getAllBranches(directory: string): Promise<GitBranch[]> {
  try {
    const { stdout } = await execa({ lines: true })`git -C ${directory} branch`;

    if (!Array.isArray(stdout)) {
      throw new Error("Unexpected output format from git branch command");
    }

    return stdout
      .map((branch) => {
        const trimmedBranch = branch.trim();
        const isCurrent = trimmedBranch.startsWith("* ");
        const name = isCurrent ? trimmedBranch.slice(2) : trimmedBranch;

        return {
          name,
          isCurrent,
        };
      });
  } catch (error) {
    throw new GitError(
      `Failed to get branches: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Deletes the specified git branches in the given directory.
 * @param directory - The path to the git repository where branches should be deleted.
 * @param branches - Array of branch names to delete. Each branch name should be a valid git branch reference.
 * @throws {GitError} If any branch deletion fails, with the error message from the git command.
 */
export async function deleteBranches(
  directory: string,
  branches: string[],
): Promise<void> {
  try {
    for (const branch of branches) {
      await $`git -C ${directory} branch -D ${branch}`;
    }
  } catch (error) {
    throw new GitError(
      `Failed to delete branch: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Retrieves the main branch of the repository
 * @param directory The directory of the git repository
 * @returns Promise<string | null> Main branch name or null if unable to determine
 * @throws GitError if the git command fails
 */
export async function getMainBranch(directory: string): Promise<string | null> {
  try {
    const { stdout } = await execa({
      lines: true,
    })`git -C ${directory} symbolic-ref refs/remotes/origin/HEAD`;

    if (!Array.isArray(stdout)) {
      throw new Error("Unexpected output format from git symbolic-ref command");
    }

    return stdout[0].replace("refs/remotes/origin/", "");
  } catch (error) {
    if (
      error instanceof Error && error.message.includes("not a symbolic ref")
    ) {
      return await getMainBranchFromRemote(directory);
    }
    return null;
  }
}

/**
 * Helper function to get the main branch from the remote
 * @param directory The directory of the git repository
 * @returns Promise<string | null> Main branch name or null if unable to determine
 */
async function getMainBranchFromRemote(
  directory: string,
): Promise<string | null> {
  try {
    const { stdout } = await execa({
      lines: true,
    })`git -C ${directory} remote show origin`;
    const mainBranchMatch = stdout.join("\n").match(/HEAD branch: (.+)/);
    return mainBranchMatch ? mainBranchMatch[1] : null;
  } catch (_error) {
    return null;
  }
}
