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
    const dir = [...Deno.readDirSync(repositoryDir)];
    console.log(repositoryDir);

    const gitDir = dir.find((d) => d.name === ".git");
    console.log(gitDir);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      console.log("Error");
      throw err;
    }
  }
}
