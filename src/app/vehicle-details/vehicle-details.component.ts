import { Component } from '@angular/core';
import { VehicleDetails } from '../shared/models/vehicle-details.model';

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

  ngOnInit() {
    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-',' ');
    this.vehicleType = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleType')));
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
