import { parseArgs } from "@std/cli/parse-args";
import { init } from "./init.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["verbose"],
  alias: {
    help: "h",
  },
});

init(Deno.cwd(), flags);
