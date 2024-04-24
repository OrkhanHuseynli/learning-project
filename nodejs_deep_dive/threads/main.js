import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "path";
import OS from "os";

console.log(`OS pool size : ${OS.cpus().length}`);
const args = process.argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let counter = 0;
let start = Date.now();

async function run() {
  const thSize = process.env.UV_THREADPOOL_SIZE;
  console.log(`Thread Pool size : ${thSize}`);
  readFile("heavy_file.json");
  readFile("light_file.json");
  console.log("Which file will be read first?");
}

async function readFile(fileName) {
  const p = path.join(__dirname, fileName);
  fs.readFile(p, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    counter++;
    console.log(`${counter} : File path : ${fileName}`);
    const end = Date.now();
    console.log(`Finished ${fileName} in ${end - start} at ${end}`);
  });
}

function main() {
  run();
}

main();
