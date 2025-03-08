import * as path from "@std/path";

export function init(
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

  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}
