import { parseArgs } from "@std/cli/parse-args";
import { init } from "./src/init.ts";
import { GitError } from "./src/exceptions.ts";

const flags = parseArgs(Deno.args);

try {
  init(Deno.cwd(), flags._);
} catch (err) {
  if (err instanceof GitError) {
    Deno.exit(1);
  }
  throw err;
}
