import { copyFile, copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const year = new Date().getFullYear();
const day = new Date().getDate();

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
