//? This script parses the JBTC value list excel
//? DO NOT RUN THE PARSER SCRIPT IF YOU HAVENT INITIALIZED GOOGLE API KEY INSIDE "secrets.json"

import { JBItemCategory, JBItemDemand, StrToJBDemand, type JBItem } from "../types";
import { writeFileSync } from "node:fs"


const final: JBItem[] = [
    {
        name: "Volt Bike",
        value: 1_000_000,
        demand: JBItemDemand.Mid,
        category: JBItemCategory.Vehicle
    },
    {
        name: "Blackhawk",
        value: 1_000_000,
        demand: JBItemDemand.Mid,
        category: JBItemCategory.Vehicle
    },
    {
        name: "Trailblazer",
        value: 1_000_000,
        demand: JBItemDemand.Mid,
        category: JBItemCategory.Vehicle
    },
    {
        name: "Monster",
        value: 1_000_000,
        demand: JBItemDemand.Low,
        category: JBItemCategory.Vehicle
    },
    {
        name: "Jet",
        value: 1_000_000,
        demand: JBItemDemand.Mid,
        category: JBItemCategory.Vehicle
    },
    {
        name: "Drone",
        value: 1_000_000,
        demand: JBItemDemand.Mid,
        category: JBItemCategory.Vehicle
    },
];

const SHEET_ID: string = "12aPBmrHP5MLwoht9QcBiERPYUmXTJiTbBF43630togE";
const TOKEN: string = process.argv[2];

interface Result {
    values?: string[][]
}

async function parse(range: string, hyper: boolean, category: JBItemCategory, format?: (id: string) => string) {
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
                notes: demand?.trim().length == 0 ? undefined : demand,
                category
            });
        } else {
            if (id.includes("Drift")) {
                category = JBItemCategory.DriftParticle;
            }
            final.push({
                name: id,
                value: Number(value.replaceAll(",", "")),
                duped_value: Number(duped_value.replaceAll(",", "")),
                demand: StrToJBDemand(demand),
                notes: notes?.trim().length == 0 ? undefined : notes,
                category
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
    await parse("Value List!C20:G69", false, JBItemCategory.Vehicle); // Vehicles
    await parse("Value List!C73:G123", false, JBItemCategory.Texture) // Txts/Colors
    await parse("Value List!C127:G186", false, JBItemCategory.Rim) // Rims
    await parse("Value List!C190:G249", false, JBItemCategory.Spoiler) // Spoilers
    await parse("Value List!C253:G272", false, JBItemCategory.Tires) // Tires/Horns
    await parse("Value List!C276:G313", false, JBItemCategory.Furniture) // Furniture
    await parse("Value List!C317:G328", false, JBItemCategory.GunTexture) // Gun Skins / drifts

    // Hypers
    await parse("Hyperchromes!C22:F30", true, JBItemCategory.Hyperchrome, (n) => `Hyper ${n} Level 5`)
    await parse("Hyperchromes!C34:F41", true, JBItemCategory.Hyperchrome, (n) => `Hyper ${n} Level 4`)
    await parse("Hyperchromes!C45:E52", true, JBItemCategory.Hyperchrome, (n) => `Hyper ${n} Level 3`)
    await parse("Hyperchromes!C56:E63", true, JBItemCategory.Hyperchrome, (n) => `Hyper ${n} Level 2`)
    // No hyper lvl 1s!!
    writeFileSync("cached/jbtc.json", JSON.stringify(final, null, 2));
    console.log("[JBTC] Saved");
}

main();