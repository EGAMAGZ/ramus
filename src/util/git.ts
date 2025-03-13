import { $, execa } from "execa";
import { GitError } from "../exceptions.ts";

/**
 * Represents a Git branch with its name and current status
 */
export interface GitBranch {
  name: string;
  isCurrent: boolean;
}

/**
 * Retrieves all branches from the git repository
 * @returns Promise<GitBranch[]> Array of branch objects
 * @throws GitError if the git command fails
 */
export async function getAllBranches(): Promise<GitBranch[]> {
  try {
    const { stdout } = await execa({ lines: true })`git branch`;

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
 * Deletes the specified git branches
 * @param branches Array of branch names to delete
 * @throws GitError if any branch deletion fails
 */
export async function deleteBranches(branches: string[]): Promise<void> {
  try {
    for (const branch of branches) {
      await $`git branch -D ${branch}`;
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
 * @returns Promise<string> Main branch name
 * @throws GitError if the git command fails
 */
export async function getMainBranch(): Promise<string> {
  try {
    const { stdout } = await execa({
      lines: true,
    })`git symbolic-ref refs/remotes/origin/HEAD`;

    if (!Array.isArray(stdout)) {
      throw new Error("Unexpected output format from git symbolic-ref command");
    }

    return stdout[0].replace("refs/remotes/origin/", "");
  } catch (error) {
    if (
      error instanceof Error && error.message.includes("not a symbolic ref")
    ) {
      const { stdout } = await execa({ lines: true })`git remote show origin`;
      const mainBranchMatch = stdout.join("\n").match(/HEAD branch: (.+)/);
      if (mainBranchMatch) {
        return mainBranchMatch[1];
      }
    }
    throw new GitError(
      `Failed to get main branch: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
