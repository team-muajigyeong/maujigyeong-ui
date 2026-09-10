import { cp, readdir } from "node:fs/promises";
import path from "node:path";

/** Copy CSS modules alongside compiled components without changing their styles. */
async function copyStyles(directory = "src") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) await copyStyles(source);
    else if (entry.name.endsWith(".css")) await cp(source, path.join("dist", path.relative("src", source)));
  }
}
await copyStyles();
