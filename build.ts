import { categoryExports, importString } from "./node_modules/dressed/dist/server/build/build";
import { rmSync, writeFileSync } from "node:fs";
import { build as bunBuild } from "bun";
import config from "./dressed.config";
import build from "dressed/build";

const register = process.argv.includes("-r");

async function bundle(entry: string, outdir: string) {
  await bunBuild({
    entrypoints: [entry],
    outdir,
    naming: `[dir]/[name].mjs`,
    minify: true,
    target: "bun",
    packages: "external",
  });
}

const { commands, components, events } = await build(config, { bundle });

const categories = [commands, components, events];
const outputContent = `
${register ? 'import { installCommands } from "dressed/server";' : ""}
import config from "../dressed.config.ts";
${[categories.map((c) => c.map((f) => importString(f).replace("../", ""))), categoryExports(categories, "null")]
  .flat(2)
  .join("")}
export { config };
${register ? "\ninstallCommands(commands);" : ""}`.trim();

writeFileSync(".dressed/index.ts", outputContent);
rmSync(".dressed/tmp", { recursive: true, force: true });

process.exit(); // Sometimes Bun refuses to exit 🤷‍♂️
