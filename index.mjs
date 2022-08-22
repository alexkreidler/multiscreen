import { program } from "commander";

import { parse } from "csv-parse";
import { createReadStream, promises } from "fs";
const { mkdir, writeFile } = promises;

import playwright, { devices } from "playwright";
import { snakeCase } from "snake-case";

const parseAndRun = async (input, outputDir) => {
  await mkdir(outputDir, { recursive: true });
  // Initialise the parser by generating random records
  const parser = createReadStream(input)
    .on("error", (err) => {
      console.error(err);
    })
    .pipe(parse());

  // Setup
  const browser = await playwright.chromium.launch();

  let count = 0;
  // Iterate through each records
  for await (const record of parser) {
    const url = record[0];
    const dimensions = record[1].split("*").map((s) => parseInt(s))

    try {
      const context = await browser.newContext({screen:{width:dimensions[0],height:dimensions[1]}});
      const page = await context.newPage();

      // Need to wait till idle to prevent loading spinnner appearing on ArcGis sites and to fully load all images
      await page.goto(url, { timeout: 5000,waitUntil: "networkidle" });
      const image = await page.screenshot();
      await writeFile(outputDir + "/" + snakeCase(url), image);
      console.log("wrote", url);

      await context.close();
    } catch (e) {
      console.error("error with url", url, e);
    }
  }

  // Teardown
  await browser.close();
};

program
  .name("multiscreen")
  .description("CLI to take screenshots of multiple URLs")
  .version("1.0.0")
  .argument(
    "[file]",
    "provides the list of urls and optionally the screenshot configuration for each",
    "urls.txt"
  )
  .action((file) => {
    parseAndRun(file, "./screenshots");
  });

program.parse();

// const options = program.opts();

// console.log(program.arg, options);
