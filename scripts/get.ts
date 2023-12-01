import { writeFileSync } from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const year = new Date().getFullYear();
const day = new Date().getDate();

fetch(`https://adventofcode.com/${year}/day/${day}/input`, { headers: { Cookie: `session=${process.env.SESSION_COOKIE}` } })
  .then((res) => res.text().then((text) => text.substring(0, text.lastIndexOf("\n"))))
  .then((text) => writeFileSync(`./${year}/day${day}/input.txt`, text, { flag: "w" }));
