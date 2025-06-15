export class VehicleDetails {
    Id!: any;
    VehicleName!: string;
    VehicleType!: string;  //vehicle, boat

    KilometersSum!: number;
    KteoExpiryDate!: string;
    InsuranceExpiryDate!: string;
    LastServiceDate!: string;
    CarTiresReplacementDate!: string;
    CarExhaustExpiryDate!: string;
    FuelAdditionCost!: number;
    FuelAdditionDate!: string;

    LastUpdatedAt!: string;
    LastUpdatedBy!: string;
    
    Photo!: string;
    RegistrationCertificate!: string;
}