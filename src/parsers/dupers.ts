import parse from "node-html-parser";
import type { JBDuper } from "../types";
import { writeFileSync } from "node:fs"

const JBTR_URL = "https://www.jailbreaktrading.net/dupe-calculator";

const all_dupers: JBDuper[] = [];

async function jbtrading() {
    const body = await (await fetch(JBTR_URL)).text()
    const regex = /unescape\((.*);\)/gm;
    const matches = regex.exec(body);

    const encoded_script = matches?.[1] as string;
    const script = unescape(encoded_script);
    const dupers_regex = /const knownDupers = \[(.*)\]/gm;
    const dupers_matches = dupers_regex.exec(script);

    const dupers = JSON.parse("[" + (dupers_matches?.[1] as string).replaceAll("'", "\"") + "]");
    for (const name of dupers) {
        all_dupers.push({
            name,
            item: undefined
        });
    }
}
async function jbvalues() {
    // they have an api damn
    const duper_names: Record<string, string[]> = JSON.parse(await (await fetch("https://jbvalues.com/api/dupedata")).text());
    const item_data: Record<string, {
        name: string
    }> = JSON.parse(await (await fetch("https://jbvalues.com/api/itemdata")).text());
    for (const duped_items in duper_names) {
        for (const duper of duper_names[duped_items]) {
            const item = item_data[duped_items].name
                .replace("Hyper", "Hyper ")
                .replace("L", "Level ")
                .replace("5", "V")
                .replace("4", "IV")
                .replace("3", "III")
                .replace("2", "II")
                .replace("1", "I");
            all_dupers.push({
                name: duper,
                item
            });
        }
    }
}

async function main() {
    console.log("[DUPES] Running JBTrading...");
    await jbtrading();
    console.log("[DUPES] Finised previous running JBValues...");
    await jbvalues();
    console.log("[DUPES] Finished running all parsers...");

    writeFileSync("cached/dupers.json", JSON.stringify(all_dupers, null, 2));
    console.log("[DUPES] Finished writing to file...");
}

main()