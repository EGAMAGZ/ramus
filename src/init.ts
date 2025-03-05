import * as path from "@std/path";
import { simpleGit } from "simple-git";

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
    const dir = [...Deno.readDirSync(repositoryDir)];

    const gitDir = dir.find((d) => d.name === ".git");
    if (!gitDir) {
      console.error("Project doesn't have git initialized.");
      throw new Error("Error");
    }

    const git = simpleGit(repositoryDir);

    console.log(repositoryDir);
    console.log(gitDir);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      console.log("Error");
      throw err;
    }
  }
}
