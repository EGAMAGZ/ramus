import * as colors from "@std/fmt/colors";
import * as path from "@std/path";
import { Spinner } from "@std/cli/unstable-spinner";
import { deleteBranches, getAllBranches } from "./util/git.ts";
import { promptMultipleSelect } from "@std/cli/unstable-prompt-multiple-select";
import { TTY, error } from "./util/tty.ts";

const tty = new TTY();

export async function init(
  cwd = Deno.cwd(),
  input: (string | number)[],
) {
  let unresolvedDirectory = Deno.args[0];
  tty.log();
  tty.log(
    colors.bgRed(
      colors.black(
        `Ramus - ${colors.italic("Manage your git branches easily.")}`,
      ),
    ),
  );
  tty.log();

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
      error(tty, "Not a git repository.");
    }

    const branches = await getAllBranches();

    const currentBranch = branches.find((b) => b.isCurrent);
    const otherBranches = branches
      .filter((b) => !b.isCurrent)
      .map((b) => b.name);

    if (otherBranches.length === 0) {
      error(tty, "No other branches to delete.");
    }

    const selectedBranches = promptMultipleSelect(
      `Please select branches to delete (${colors.yellow(`Current: ${currentBranch?.name}`)
      })`,
      otherBranches,
    );

    if (!selectedBranches || selectedBranches.length === 0) {
      tty.log(
        colors.yellow("No branches selected to delete. Exiting..."),
      );
      return;
    }

    const spinner = new Spinner({ message: "Deleting branches..." });
    spinner.start();

    await deleteBranches(selectedBranches);
    spinner.stop();
    tty.log(colors.green("Branches deleted successfully."));
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}
