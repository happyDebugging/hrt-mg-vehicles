export class VehicleDetails {
    Id!: any;
    VehicleId!: number;
    VehicleName!: string;
    VehicleType!: string;  //vehicle, boat

    vehiclePlateNumber!: string;
    vesselRegistrationNumber!: string;

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
    LastUpdatedByName!: string;
    
    Photo!: string;
    RegistrationCertificate!: string;
}