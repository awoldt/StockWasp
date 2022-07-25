import fs from "fs/promises";
import path from "path";

export default async function getSameAs(ticker: string) {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "..", "..", "/data/sameAsLinks.json"),
      "utf-8"
    );

    const x = JSON.parse(data);
    let link: string | null = null;

    for (let i = 0; i < x.length; ++i) {
      if (x[i].indexOf(ticker.toLocaleLowerCase() + "=") !== -1) {
        link = x[i].split("=")[1];
        break;
      }
      continue;
    }

    return link;
  } catch (e) {
    console.log(e);
    console.log("could not get same as links :(");
    return null;
  }
}
