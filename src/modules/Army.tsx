export interface Army {
    ArmyID: number
    NameArmy: string
    StatusArmy: string
    ImageArmyUrl: string
    classNameArmy: string
    MinPlainSpeed: number
    MaxPlainSpeed: number
    MinMountSpeed: number
    MaxMountSpeed: number
    MinForestSpeed: number
    MaxForestSpeed: number
    MinRiverSpeed: number
    MaxRiverSpeed: number
    MinDesertSpeed: number
    MaxDesertSpeed: number
}

export interface ArmyResult {
    armies: Army[]
}