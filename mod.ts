import { parseArgs } from "@std/cli/parse-args";
import { init } from "./src/init.ts";
import { GitError } from "./src/exceptions.ts";

/**
 * Main entry point for the Ramus CLI tool
 * Parses command line arguments and initializes the application
 */
const flags = parseArgs(Deno.args, {
  boolean: ["help"],
  alias: {
    help: "h",
  },
});

try {
  await init(Deno.cwd(), flags._, flags.help);
} catch (err: unknown) {
  if (err instanceof GitError) {
    Deno.exit(1);
  }
  throw err;
}
