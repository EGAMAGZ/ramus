import { $, execa } from "execa";

export interface GitBranch {
  name: string;
  isCurrent: boolean;
}

export async function getAllBranches() {
  const { stdout } = await execa({ lines: true })`git branch`;
  const branches = (stdout as string[])
    .map((branch) => {
      const trimmedBranch = branch.trim();
      const isCurrent = trimmedBranch.startsWith("* ");
      const name = isCurrent ? trimmedBranch.slice(2) : trimmedBranch;

      return {
        name,
        isCurrent,
      };
    });

  return branches;
}

export async function deleteBranches(branches: string[]) {
  for (const branch of branches) {
    await $`git branch -D ${branch}`;
  }
}
