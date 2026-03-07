export interface Vehicle {
  id: number;
  name: string;
  type: string; // 'vehicle' or 'boat'
  vehiclePlateNumber?: string;
  vesselRegistrationNumber?: string;
  vehicleImageName?: string;
  initialKilometers?: number;
}
