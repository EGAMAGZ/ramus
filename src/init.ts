import * as colors from "@std/fmt/colors";
import * as path from "@std/path";
import { Spinner } from "@std/cli/unstable-spinner";
import { deleteBranches, getAllBranches, getMainBranch } from "./util/git.ts";
import { promptMultipleSelect } from "@std/cli/unstable-prompt-multiple-select";
import { error, TTY } from "./util/tty.ts";
import {
  HELP_TEXT,
  NO_DELETABLE_BRANCHES_MESSAGE,
  NO_SELECTED_BRANCHES_MESSAGE,
  OPERATION_CANCELLED_MESSAGE,
  UNDETERMINATED_CURRENT_BRANCH_MESSAGE,
} from "./util/constants.ts";

const tty = new TTY();

/**
 * Initializes the application and handles the branch deletion workflow
 * @param cwd Current working directory
 * @param input Command line arguments
 */
export async function init(
  cwd = Deno.cwd(),
  input: (string | number)[],
  showHelp: boolean,
): Promise<void> {
  tty.log();
  tty.log(
    colors.bgRed(
      colors.black(
        `🌳 Ramus - ${colors.italic("Manage your git branches easily.")}`,
      ),
    ),
  );
  tty.log();

  if (showHelp) {
    tty.log(colors.gray(HELP_TEXT));
    return;
  }

  let unresolvedDirectory: string;
  if (input.length !== 1) {
    const userInput = tty.prompt("Repository path: ");
    if (!userInput) {
      error(tty, "Repository path is required.");
    }
    unresolvedDirectory = userInput;
  } else {
    unresolvedDirectory = String(input[0]);
  }

  const repositoryDir = path.resolve(cwd, unresolvedDirectory);

  try {
    const dirs = [...Deno.readDirSync(repositoryDir)];
    const gitDir = dirs.find((d) => d.name === ".git");

    if (!gitDir) {
      error(tty, `Not a git repository: ${repositoryDir}`);
    }

    const branches = await getAllBranches(repositoryDir);
    const mainBranch = await getMainBranch(repositoryDir);

    const currentBranch = branches.find((b) => b.isCurrent);
    if (!currentBranch) {
      error(tty, UNDETERMINATED_CURRENT_BRANCH_MESSAGE);
    }

    const otherBranches = branches
      .filter((b) => !b.isCurrent)
      .map((branch) =>
        branch.name === mainBranch
          ? `${branch.name} (${colors.green("Main branch")})`
          : branch.name
      );

    if (otherBranches.length === 0) {
      error(tty, NO_DELETABLE_BRANCHES_MESSAGE);
    }

    const selectedBranches = promptMultipleSelect(
      `Please select branches to delete (${colors.yellow(`Current: ${currentBranch.name}`)
      })`,
      otherBranches,
    );

    if (!selectedBranches || selectedBranches.length === 0) {
      tty.log(
        colors.yellow(NO_SELECTED_BRANCHES_MESSAGE),
      );
      return;
    }

    const confirmDelete = tty.confirm(
      `Are you sure you want to delete ${selectedBranches.length} branch(es)?`,
    );

    if (!confirmDelete) {
      tty.log(colors.yellow(OPERATION_CANCELLED_MESSAGE));
      return;
    }

    const spinner = new Spinner({ message: "Deleting branches..." });
    spinner.start();

    await deleteBranches(repositoryDir, selectedBranches);

    spinner.stop();
    tty.log(
      colors.green(
        `Successfully deleted ${selectedBranches.length} branch(es).`,
      ),
    );
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}
