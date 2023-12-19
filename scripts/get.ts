import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const year = process.argv.length > 3 ? process.argv[3] : new Date().getFullYear();
const day = process.argv.length > 2 ? process.argv[2] : new Date().getDate();

const templateSrc = path.join(__dirname, `../template/aoc.ts`);
const tgtDir = path.join(__dirname, `../${year}/day${day}`);
const fileName = "input.txt";

if (!existsSync(tgtDir)) {
  mkdirSync(tgtDir, { recursive: true });
}

copyFileSync(templateSrc, path.join(tgtDir, "aoc.ts"));
writeFileSync(path.join(tgtDir, "test_input.txt"), "");

fetch(`https://adventofcode.com/${year}/day/${day}/input`, { headers: { Cookie: `session=${process.env.SESSION_COOKIE}` } })
  .then((res) => res.text().then((text) => text.substring(0, text.lastIndexOf("\n"))))
  .then((text) => writeFileSync(path.join(tgtDir, fileName), text, { flag: "w" }));
