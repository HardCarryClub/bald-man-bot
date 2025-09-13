import { rmSync, writeFileSync } from "node:fs";
import { build as bunBuild } from "bun";
import config from "./dressed.config";
import { resolve } from "node:path";
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

const outputContent = `
${register ? `import { ${register ? "installCommands" : ""} } from "dressed/server";` : ""}
import config from "./dressed.config.mjs";${[commands, components, events]
  .flat()
  .map((v) => `\nimport * as h${v.uid} from "${resolve(v.path)}";`)
  .join("")}

export const commands = [ ${commands.map((c) => JSON.stringify(c).replace("null", `h${c.uid}`))} ];
export const components = [ ${components.map((c) =>
  JSON.stringify(c).replace("null", `h${c.uid}`)
)} ];
export const events = [ ${events.map((e) => JSON.stringify(e).replace("null", `h${e.uid}`))} ];
export { config };
${register ? "\ninstallCommands(commands);" : ""}`.trim();
const jsContent = `export * from "./index.mjs";`;
const typeContent = `
import type { CommandData, ComponentData, EventData, ServerConfig } from "dressed/server";

export declare const commands: CommandData[];
export declare const components: ComponentData[];
export declare const events: EventData[];
export declare const config: ServerConfig;`;

writeFileSync(".dressed/tmp/index.ts", outputContent);
await bundle(".dressed/tmp/index.ts", ".dressed");
writeFileSync(".dressed/index.js", jsContent);
writeFileSync(".dressed/index.d.ts", typeContent);
rmSync(".dressed/tmp", { recursive: true, force: true });

process.exit(); // Sometimes Bun refuses to exit 🤷‍♂️
