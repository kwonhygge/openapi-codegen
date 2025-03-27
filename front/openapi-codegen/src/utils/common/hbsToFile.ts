import fs from "fs";
import Handlebars from "handlebars";
import prettier from "prettier";

export async function hbsToFile<T>(
  templatePath: string,
  outputFilePath: string,
  context: T,
) {
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);

  const result = template(context);

  const formattedResult = await prettier.format(result, {
    parser: "typescript",
  });

  fs.writeFileSync(outputFilePath, formattedResult);
}
