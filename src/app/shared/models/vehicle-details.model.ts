export class VehicleDetails {
    Id!: any;
    VehicleName!: string;
    VehicleType!: string;  //vehicle, boat

    kilometersSum!: number;
    kteoExpiryDate!: string;
    insuranceExpiryDate!: string;
    lastServiceDate!: string;
    carTiresReplacementDate!: string;
    carExhaustExpiryDate!: string;
    fuelAdditionCost!: number;
    fuelAdditionDate!: string;

    CreatedAt!: string;
    CreatedBy!: string;
    LastUpdatedAt!: string;
    LastUpdatedBy!: string;
    Photo!: string;
}