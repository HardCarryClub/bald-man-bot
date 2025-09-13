import { parseCommands } from "./node_modules/dressed/dist/server/build/parsers/commands";
import { parseComponents } from "./node_modules/dressed/dist/server/build/parsers/components";
import { parseEvents } from "./node_modules/dressed/dist/server/build/parsers/events";
import type { WalkEntry } from "./node_modules/dressed/dist/types/walk";
import { basename, extname, relative, resolve } from "node:path";
import { existsSync, writeFileSync } from "node:fs";
import { walkFiles } from "walk-it";
import { cwd } from "node:process";
import { hash } from "bun";

const files = await Promise.all(
  ["commands", "components", "events"].map((d) => fetchFiles("bot", d, ["ts"]))
);


for (const group of files) {
  for (let i = group.length - 1; i >= 0; i--) {
    const file = group[i]!;
    const imported = await import(resolve(file.path));
    if (typeof imported.default !== "function") {
      group.splice(i, 1);
      continue;
    }
    // @ts-expect-error
    file.exports = imported;
  }
}

const commands = (await parseCommands(files[0]!))
const components = (await parseComponents(files[1] as never))
const events = (await parseEvents(files[2]!))

const file = `${files.flat().map(f=>`import * as h${f.uid} from "${resolve(f.path)}";`).join("")}
export const commands = [${commands.map(c=>JSON.stringify(c).replace("null",`h${c.uid}`))}]
export const components = [${components.map(c=>JSON.stringify(c).replace("null",`h${c.uid}`))}]
export const events = [${events.map(e=>JSON.stringify(e).replace("null",`h${e.uid}`))}]
${process.argv.includes("-r") ? "import {installCommands} from \"dressed/server\";\ninstallCommands(commands)" : ""}`

writeFileSync("dressed.gen.ts", file)

async function fetchFiles(root: string, dir: string, extensions: string[]): Promise<WalkEntry[]> {
  const dirPath = resolve(root, dir);

  if (!existsSync(dirPath)) {
    console.warn(`${dir.slice(0, 1).toUpperCase() + dir.slice(1)} directory not found`);
    return [];
  }

  const filesArray: WalkEntry[] = [];
  for await (const file of walkFiles(dirPath, {
    filterFile: (f) => extensions.includes(extname(f.name).slice(1)),
  })) {
    const path = relative(cwd(), file.path);
    filesArray.push({
      name: basename(path, extname(path)),
      uid: hash(path).toString(),
      path,
    });
  }

  return filesArray;
}
process.exit(); // Sometimes Bun refuses to exit 🤷‍♂️