
export function init(
  cwd = Deno.cwd(),
  flags: {
    verbose: boolean;
  },
) {
  console.log(cwd);
}
