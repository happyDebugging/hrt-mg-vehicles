import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-lines',
  templateUrl: './vehicle-lines.component.html',
  styleUrl: './vehicle-lines.component.css'
})
export class VehicleLinesComponent {

  ngOnInit() {

  }

  SetVehicleTypeAndModel(vehicleModel: string) {
    sessionStorage.setItem('vehicleToPreview', vehicleModel);
  }

}
