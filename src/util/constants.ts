export const HELP_TEXT = `@egamagz/ramus

Manage git branches for a project, allowing you to delete multiple branches in a single batch.

To manage git branches in the './foobar' subdirectory:
    deno run -A jsr:@egamagz/ramus ./foobar

To manage git branches in the current directory:
    deno run -A jsr:@egamagz/ramus .

USAGE:
    deno run -A jsr:@egamagz/ramus [DIRECTORY]`;

export const UNDETERMINATED_CURRENT_BRANCH_MESSAGE = "Could not determine current branch.";
export const NO_DELETABLE_BRANCHES_MESSAGE = "No other branches to delete.";
export const NO_SELECTED_BRANCHES_MESSAGE = "No branches selected to delete. Exiting...";

export const OPERATION_CANCELLED_MESSAGE = "Operation cancelled.";