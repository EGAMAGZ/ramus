import * as path from "@std/path";
import { getAllBranches } from "./util/git.ts";
import { promptMultipleSelect } from "@std/cli/unstable-prompt-multiple-select";

export async function init(
  cwd = Deno.cwd(),
  input: (string | number)[],
) {
  let unresolvedDirectory = Deno.args[0];

  if (input.length !== 1) {
    const userInput = prompt("Repository path: ");
    if (!userInput) {
      throw new Error();
    }
    unresolvedDirectory = userInput;
  }
  const repositoryDir = path.resolve(cwd, unresolvedDirectory);

  try {
    const dirs = [...Deno.readDirSync(repositoryDir)];

    const gitDir = dirs.find((d) => d.name === ".git");

    if (!gitDir) {
      console.error("Project doesn't have git initialized.");
      throw new Error("Error");
    }

    const branches = await getAllBranches();

    const otherBranches = branches
      .filter((b) => !b.isCurrent)
      .map((b) => b.name);
    const currentBranch = branches
      .find((b) => b.isCurrent);

    if (otherBranches.length === 0) {
      console.log("No other branches to delete.");
      return;
    }

    const selectedBranches = promptMultipleSelect(
      `Please select branches to delete (Current: ${currentBranch?.name})`,
      otherBranches,
    );

    if (selectedBranches?.length === 0) {
      console.log("No branches deleted.");
      return;
    }

    console.log(selectedBranches);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}
