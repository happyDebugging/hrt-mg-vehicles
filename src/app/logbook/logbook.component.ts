import { Component, OnInit } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { VehicleDetails } from '../shared/models/vehicle-details.model';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.css'
})
export class LogbookComponent implements OnInit {
  vehicleDetails: VehicleDetails[] = [];
  boatDetails: VehicleDetails[] = [];
  loading = false;
  error: string | null = null;
  showVehiclesTable = true;
  showBoatsTable = true;

  // Pagination
  page = 1;
  pageSize = 10;
  vehiclePage = 1;
  vehiclePageSize = 10;
  boatPage = 1;
  boatPageSize = 10;

  constructor(private db: DbFunctionService) { }

  ngOnInit() {
    this.fetchVehicleDetails();
  }

  fetchVehicleDetails() {
    this.loading = true;
    this.error = null;
    this.vehicleDetails = [];

    this.db.getVehicleDetailsForLogbook()
      .then((vehicleDetails: any) => {

        console.log('Fetched vehicleDetails:', vehicleDetails);
        this.vehicleDetails = vehicleDetails
          .filter((detail: any) => detail.vehicles.type == 'vehicle')
          .map((detail: any) => ({
            Id: detail.id,
            VehicleType: detail.vehicles.type,
            VehicleName: detail.vehicles.name ? detail.vehicles.name.replace(/-/g, ' ') : '',

            TotalKm: detail.TotalKm,
            StartingKmOfShift: detail.StartingKmOfShift,
            FinalKmOfShift: detail.FinalKmOfShift,

            InitialKilometers: detail.InitialKilometers,
            KilometersSum: detail.KilometersSum,

            LastDrivenAt: detail.LastDrivenAt,

            KteoExpiryDate: detail.KteoExpiryDate,
            InsuranceExpiryDate: detail.InsuranceExpiryDate,
            LastServiceDate: detail.LastServiceDate,
            LastServiceKilometers: detail.LastServiceKilometers,
            LastBoatServiceHours: detail.LastBoatServiceHours,
            NextServiceDate: detail.NextServiceDate,
            NextServiceKilometers: detail.NextServiceKilometers,
            NextBoatServiceHours: detail.NextBoatServiceHours,
            CarTiresReplacementDate: detail.CarTiresReplacementDate,
            CarExhaustExpiryDate: detail.CarExhaustExpiryDate,
            FuelAdditionCost: detail.FuelAdditionCost,
            FuelAdditionLiters: detail.FuelAdditionLiters,
            FuelAdditionDate: detail.FuelAdditionDate,

            EngineAHours: detail.EngineAHours,
            EngineBHours: detail.EngineBHours,
            BoatFuelLevel: detail.BoatFuelLevel,
            BoatOilLevel: detail.BoatOilLevel,
            BoatTotalOperatingHours: detail.BoatTotalOperatingHours,
            DateOfBoatUse: detail.DateOfBoatUse,
            BoatGasAdditionLiters: detail.BoatGasAdditionLiters,
            BoatGasAdditionDate: detail.BoatGasAdditionDate,
            BoatOilAdditionLiters: detail.BoatOilAdditionLiters,
            BoatOilAdditionDate: detail.BoatOilAdditionDate,

            LastUpdatedAt: detail.LastUpdatedAt,
            LastUpdatedBy: detail.LastUpdatedBy,
            LastUpdatedByName: detail.LastUpdatedByName,

            Notes: detail.Notes
          }));

        this.boatDetails = vehicleDetails
          .filter((detail: any) => detail.vehicles.type == 'boat')
          .map((detail: any) => ({
            Id: detail.id,
            VehicleType: detail.vehicles.type,
            VehicleName: detail.vehicles.name ? detail.vehicles.name.replace(/-/g, ' ') : '',

            TotalKm: detail.TotalKm,
            StartingKmOfShift: detail.StartingKmOfShift,
            FinalKmOfShift: detail.FinalKmOfShift,

            InitialKilometers: detail.InitialKilometers,
            KilometersSum: detail.KilometersSum,

            LastDrivenAt: detail.LastDrivenAt,

            KteoExpiryDate: detail.KteoExpiryDate,
            InsuranceExpiryDate: detail.InsuranceExpiryDate,
            LastServiceDate: detail.LastServiceDate,
            LastServiceKilometers: detail.LastServiceKilometers,
            LastBoatServiceHours: detail.LastBoatServiceHours,
            NextServiceDate: detail.NextServiceDate,
            NextServiceKilometers: detail.NextServiceKilometers,
            NextBoatServiceHours: detail.NextBoatServiceHours,
            CarTiresReplacementDate: detail.CarTiresReplacementDate,
            CarExhaustExpiryDate: detail.CarExhaustExpiryDate,
            FuelAdditionCost: detail.FuelAdditionCost,
            FuelAdditionLiters: detail.FuelAdditionLiters,
            FuelAdditionDate: detail.FuelAdditionDate,

            EngineAHours: detail.EngineAHours,
            EngineBHours: detail.EngineBHours,
            BoatFuelLevel: detail.BoatFuelLevel,
            BoatOilLevel: detail.BoatOilLevel,
            BoatTotalOperatingHours: detail.BoatTotalOperatingHours,
            DateOfBoatUse: detail.DateOfBoatUse,
            BoatGasAdditionLiters: detail.BoatGasAdditionLiters,
            BoatGasAdditionDate: detail.BoatGasAdditionDate,
            BoatOilAdditionLiters: detail.BoatOilAdditionLiters,
            BoatOilAdditionDate: detail.BoatOilAdditionDate,

            LastUpdatedAt: detail.LastUpdatedAt,
            LastUpdatedBy: detail.LastUpdatedBy,
            LastUpdatedByName: detail.LastUpdatedByName,

            Notes: detail.Notes
          }));

        this.loading = false;
        this.page = 1; // Reset to first page on new fetch
      })
      .catch(err => {
        this.error = err.message || 'Σφάλμα κατά τη φόρτωση του ιστορικού';
        this.loading = false;
      });
  }

  getTotalPages(): number {
    return Math.ceil(this.vehicleDetails.length / this.pageSize);
  }

  getVehiclesOnly() {
    return this.vehicleDetails.filter(d => d.VehicleType === 'vehicle');
  }
  getBoatsOnly() {
    return this.vehicleDetails.filter(d => d.VehicleType === 'boat');
  }
  getPagedVehicles() {
    const start = (this.vehiclePage - 1) * this.vehiclePageSize;
    return this.getVehiclesOnly().slice(start, start + this.vehiclePageSize);
  }
  getPagedBoats() {
    const start = (this.boatPage - 1) * this.boatPageSize;
    return this.getBoatsOnly().slice(start, start + this.boatPageSize);
  }
  getVehicleTotalPages() {
    return Math.ceil(this.getVehiclesOnly().length / this.vehiclePageSize);
  }
  getBoatTotalPages() {
    return Math.ceil(this.getBoatsOnly().length / this.boatPageSize);
  }

  downloadHistoryLog(vehicleType: string) {

  }

}
