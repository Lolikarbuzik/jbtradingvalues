//? This script parses the JBTC value list excel
//? DO NOT RUN THE PARSER SCRIPT IF YOU HAVENT INITIALIZED GOOGLE API KEY INSIDE "secrets.json"

import { JBItemDemand, StrToJBDemand, type JBItem } from "../types";
import { writeFileSync } from "node:fs"


const final: JBItem[] = [
    {
        name: "Volt Bike",
        value: 1_000_000,
        demand: JBItemDemand.Mid
    },
    {
        name: "Blackhawk",
        value: 1_000_000,
        demand: JBItemDemand.Mid
    },
    {
        name: "Trailblazer",
        value: 1_000_000,
        demand: JBItemDemand.Mid
    },
    {
        name: "Monster",
        value: 1_000_000,
        demand: JBItemDemand.Low
    },
    {
        name: "Jet",
        value: 1_000_000,
        demand: JBItemDemand.Mid
    },
    {
        name: "Drone",
        value: 1_000_000,
        demand: JBItemDemand.Mid
    }
];

const SHEET_ID: string = "12aPBmrHP5MLwoht9QcBiERPYUmXTJiTbBF43630togE";
const TOKEN: string = process.argv[2];

interface Result {
    values?: string[][]
}

async function parse(range: string, hyper?: boolean, format?: (id: string) => string) {
    const response_text = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${TOKEN}`)).text();
    const result: Result = JSON.parse(response_text);
    const values = result.values;
    values?.forEach(([id, value, duped_value, demand, notes]) => {
        // console.log(id, value, duped_value, demand, notes);
        if (hyper && format) {
            final.push({
                name: id.trim() !== "Hypershift" ? format(id) : "Hypershift",
                value: Number(value.replaceAll(",", "")),
                // duped_value: Number(duped_value.replaceAll(",", "")),
                demand: StrToJBDemand(duped_value),
                notes: demand?.trim().length == 0 ? undefined : demand
            });
        } else {
            final.push({
                name: id,
                value: Number(value.replaceAll(",", "")),
                duped_value: Number(duped_value.replaceAll(",", "")),
                demand: StrToJBDemand(demand),
                notes: notes?.trim().length == 0 ? undefined : notes
            });
        }
    })
    console.log("[JBTC] Completed", range);
}

async function main() {
    if (!TOKEN) {
        console.log("Token wasnt passed as argv[2]");
        return;
    }
    await parse("Value List!C20:G67"); // Vehicles
    await parse("Value List!C71:G120") // Txts/Colors
    await parse("Value List!C124:G183") // Rims
    await parse("Value List!C187:G245") // Spoilers
    await parse("Value List!C249:G267") // Tires/Horns
    await parse("Value List!C249:G267") // Furniture
    await parse("Value List!C249:G267") // Gun Skins

    // Hypers
    await parse("Hyperchromes!C22:F30", true, (n) => `Hyper ${n} Level 5`)
    await parse("Hyperchromes!C34:F41", true, (n) => `Hyper ${n} Level 4`)
    await parse("Hyperchromes!C45:E52", true, (n) => `Hyper ${n} Level 3`)
    await parse("Hyperchromes!C56:E63", true, (n) => `Hyper ${n} Level 2`)
    // No hyper lvl 1s!!
    writeFileSync("cached/jbtc.json", JSON.stringify(final, null, 2));
    console.log("[JBTC] Saved");
}

main();