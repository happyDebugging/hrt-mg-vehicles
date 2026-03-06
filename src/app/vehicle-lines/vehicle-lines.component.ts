import { Component, OnInit } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';

interface VehicleLine {
  id: number;
  name: string;
  type: string;
  displayName: string;
}

@Component({
  selector: 'app-vehicle-lines',
  templateUrl: './vehicle-lines.component.html',
  styleUrl: './vehicle-lines.component.css'
})
export class VehicleLinesComponent implements OnInit {

  vehicleList: VehicleLine[] = [];
  isLoading = true;

  constructor(private dbFunctionService: DbFunctionService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  private async loadVehicles() {
    this.isLoading = true;
    try {
      const [allVehicles, profile] = await Promise.all([
        this.dbFunctionService.getVehicles(),
        this.dbFunctionService.getUserProfile(),
      ]);

      const isAdmin = profile.permissions === 'admin';
      const userVehicles: string[] = profile.vehicleDriven ? profile.vehicleDriven.split('|') : [];

      let filtered = allVehicles;
      if (!isAdmin) {
        filtered = allVehicles.filter((v: any) => userVehicles.includes(v.name));
      }

      this.vehicleList = filtered.map((v: any) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        displayName: v.name.replace(/-/g, ' '),
      }));
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      this.isLoading = false;
    }
  }

  SetVehicleTypeAndModel(vehicleId: number, vehicleModel: string, vehicleType: string) {
    sessionStorage.setItem('vehicleIdToPreview', vehicleId.toString());
    sessionStorage.setItem('vehicleToPreview', vehicleModel);
    sessionStorage.setItem('vehicleType', vehicleType);
  }

}
