import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent {

  vehicleToPreview = '';
  vehicleName = '';

  kilometersSum = 0;
  kteoExpiryDate = '';
  insuranceExpiryDate = '';
  lastServiceDate = '';
  carTiresReplacementDate = '';
  carExhaustExpiryDate = '';
  fuelAdditionCost = 0;
  fuelAdditionDate = '';

  ngOnInit() {
    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-',' ');
  }

}
