import { parseArgs } from "@std/cli/parse-args";
import { init } from "./src/init.ts";

const flags = parseArgs(Deno.args, {
  alias: {
    help: "h",
  },
});

try {
  init(Deno.cwd(), flags._);
} catch (err) {
  throw err;
}
