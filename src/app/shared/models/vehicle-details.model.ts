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
    CarTiresReplacementDate!: string;
    CarExhaustExpiryDate!: string;
    FuelAdditionCost!: number;
    FuelAdditionLiters!: number;
    FuelAdditionDate!: string;

    LastUpdatedAt!: string;
    LastUpdatedBy!: string;
    LastUpdatedByName!: string;
    
    Photo!: string;
    RegistrationCertificate!: string;

    Notes!: string;
}