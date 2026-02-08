import { Component } from '@angular/core';
import { VehicleDetails } from '../shared/models/vehicle-details.model';
import { DbFunctionService } from '../shared/services/db-functions.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent {

  vehicleToPreview = '';
  vehicleName = '';
  vehicleType = '';

  kilometersSum = 0;
  kteoExpiryDate = '';
  insuranceExpiryDate = '';
  lastServiceDate = '';
  carTiresReplacementDate = '';
  carExhaustExpiryDate = '';
  fuelAdditionCost = 0;
  fuelAdditionDate = '';

  registrationCertificate = '';

  isEditEnabled = false;
  isSaveButtonClicked = false;
  isSaveSuccessfull = false;

  vehicleDetails: VehicleDetails = new VehicleDetails();

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-',' ');
    this.vehicleType = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleType')));

    this.GetVehicleDetails();
  }

    GetVehicleDetails() {
    this.vehicleDetails = new VehicleDetails();

    this.dbFunctionService.getVehicleDetailsFromDb(this.vehicleToPreview)
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)

            this.vehicleDetails.VehicleName = res[0].VehicleName;
            this.vehicleDetails.VehicleType = res[0].VehicleType;
            this.vehicleDetails.KilometersSum = res[0].KilometersSum;
            this.vehicleDetails.KteoExpiryDate = res[0].KteoExpiryDate;
            this.vehicleDetails.InsuranceExpiryDate = res[0].InsuranceExpiryDate;
            this.vehicleDetails.LastServiceDate = res[0].LastServiceDate;
            this.vehicleDetails.CarTiresReplacementDate = res[0].CarTiresReplacementDate;
            this.vehicleDetails.CarExhaustExpiryDate = res[0].CarExhaustExpiryDate;
            this.vehicleDetails.FuelAdditionCost = res[0].FuelAdditionCost;
            this.vehicleDetails.FuelAdditionDate = res[0].FuelAdditionDate;

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  EnableVehicleDetailsEdit() {
    this.isEditEnabled = true;
    sessionStorage.setItem('isEditEnabled', 'true');
  }

  DisableVehicleDetailsEdit() {
    this.isEditEnabled = false;
    sessionStorage.setItem('isEditEnabled', 'false');
  }

}
