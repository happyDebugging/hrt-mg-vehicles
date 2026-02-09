import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-lines',
  templateUrl: './vehicle-lines.component.html',
  styleUrl: './vehicle-lines.component.css'
})
export class VehicleLinesComponent {

  ngOnInit() {

  }

  SetVehicleTypeAndModel(vehicleId:number, vehicleModel: string, vehicleType: string) {
    sessionStorage.setItem('vehicleIdToPreview', vehicleId.toString());
    sessionStorage.setItem('vehicleToPreview', vehicleModel);
    sessionStorage.setItem('vehicleType', vehicleType);
  }

}
