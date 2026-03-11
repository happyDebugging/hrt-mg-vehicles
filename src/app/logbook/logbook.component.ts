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
  loading = false;
  error: string | null = null;
  showTable = true;

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
        this.vehicleDetails = vehicleDetails.map((detail: any) => ({
          Id: detail.id,
          VehicleName: detail.VehicleName,

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
      })
      .catch(err => {
        this.error = err.message || 'Σφάλμα κατά τη φόρτωση οχημάτων';
        this.loading = false;
      });
  }
}
