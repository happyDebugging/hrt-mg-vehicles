export class VehicleDetails {
    Id!: any;
    VehicleId!: number;
    VehicleName!: string;
    VehicleType!: string;  //vehicle, boat

    TotalKm!: number;
    StartingKmOfShift!: number;
    FinalKmOfShift!: number;

    InitialKilometers!: number;
    KilometersSum!: number;

    LastDrivenAt!: string;
    
    KteoExpiryDate!: string;
    InsuranceExpiryDate!: string;
    LastServiceDate!: string;
    LastServiceKilometers!: number;
    LastBoatServiceHours!: number;
    NextServiceDate!: string;
    NextServiceKilometers!: number;
    NextBoatServiceHours!: number;
    CarTiresReplacementDate!: string;
    CarExhaustExpiryDate!: string;
    FuelAdditionCost!: number;
    FuelAdditionLiters!: number;
    FuelAdditionDate!: string;

    EngineAHours!: number;
    EngineBHours!: number;
    BoatFuelLevel!: string;
    BoatOilLevel!: string;
    BoatTotalOperatingHours!: number;
    DateOfBoatUse!: string;
    BoatGasAdditionLiters!: number;
    BoatGasAdditionDate!: string;
    BoatOilAdditionLiters!: number;
    BoatOilAdditionDate!: string;
    BoatCrew!: string;
    BoatMaintenance!: string;
    BoatBatteries!: string;

    LastUpdatedAt!: string;
    LastUpdatedBy!: string;
    LastUpdatedByName!: string;
    
    Photo!: string;
    RegistrationCertificate!: string;

    Notes!: string;
}