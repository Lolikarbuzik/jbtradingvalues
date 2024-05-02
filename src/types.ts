export enum JBItemDemand {
    None = "None",
    VeryLow = "VeryLow",
    Low = "Low",
    Mid = "Mid",
    Decent = "Decent",
    High = "High",
    VeryHigh = "VeryHigh"
}

export enum JBItemCategory {
    Vehicle = "Vehicle",
    Color = "Color",
    Tires = "Tires",
    Hyperchrome = "Hyperchrome",
    Texture = "Texture",
    GunTexture = "GunTexture",
    VehicleHorn = "VehicleHorn",
    Spoiler = "Spoiler",
    Rim = "Rim",
    Furniture = "Furniture",
    DriftParticle = "DriftParticle",
    Unknown = "Unknown",
}

export interface JBDuper {
    name: String;
    item?: String
}

export interface JBItem {
    name: string;
    value: number;
    demand: JBItemDemand,
    duped_value?: number;
    notes?: string,
    og?: string;
    category: JBI
}

export function StrToJBDemand(str: string): JBItemDemand {
    switch (str.toLowerCase()) {
        case "extremely low":
            return JBItemDemand.VeryLow;
        case "below average":
            return JBItemDemand.Mid;
        case "very low":
            return JBItemDemand.VeryLow;
        case "low":
            return JBItemDemand.Low;
        case "lecent":
            return JBItemDemand.Decent;
        case "mainly average":
            return JBItemDemand.Decent;
        case "above average":
            return JBItemDemand.Decent;
        case "decent":
            return JBItemDemand.Decent;
        case "mid":
            return JBItemDemand.Mid;
        case "high":
            return JBItemDemand.High;
        case "very high":
            return JBItemDemand.VeryHigh
        case "close to none":
            return JBItemDemand.VeryLow;
        case "unavailable item":
            return JBItemDemand.None;
        default:
            console.error(`Error parsing demand: ${str}`);
            return JBItemDemand.None;
    }
}