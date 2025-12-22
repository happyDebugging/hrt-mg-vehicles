import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { VehicleDetails } from '../shared/models/vehicle-details.model';
import { ApiService } from '../shared/services/api.service';

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

  vehicleDetails: VehicleDetails = {
    Id: '',
    VehicleName: '',
    VehicleType: '',

    KilometersSum: 0,
    KteoExpiryDate: '',
    InsuranceExpiryDate: '',
    LastServiceDate: '',
    CarTiresReplacementDate: '',
    CarExhaustExpiryDate: '',
    FuelAdditionCost: 0,
    FuelAdditionDate: '',

    LastUpdatedAt: '',
    LastUpdatedBy: '',

    Photo: '',
    RegistrationCertificate: ''
  };

  constructor(private dbFunctionService: DbFunctionService, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getUsers().subscribe(console.log); // test supabase connection

    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-', ' ');
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

  selectFile(event: any) {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.dbFunctionService.postRegistrationCertificateToDb(file)
        .then(() => console.log('Upload complete!'))
        .catch(err => console.log('Upload failed: ' + err.message));
    }

  }


  GetVehicleDetails() {
    this.vehicleDetails = {
      Id: '',
      VehicleName: '',
      VehicleType: '',

      KilometersSum: 0,
      KteoExpiryDate: '',
      InsuranceExpiryDate: '',
      LastServiceDate: '',
      CarTiresReplacementDate: '',
      CarExhaustExpiryDate: '',
      FuelAdditionCost: 0,
      FuelAdditionDate: '',

      LastUpdatedAt: '',
      LastUpdatedBy: '',

      Photo: '',
      RegistrationCertificate: ''
    };

    this.dbFunctionService.getVehicleDetailsFromDb()
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)

            for (const data of res) {

              const resObj = new VehicleDetails();

              resObj.Id = data.Id;
              resObj.VehicleName = data.VehicleName;
              resObj.VehicleType = data.VehicleType;

              resObj.KilometersSum = data.KilometersSum;
              resObj.KteoExpiryDate = data.KteoExpiryDate;
              resObj.InsuranceExpiryDate = data.InsuranceExpiryDate;
              resObj.LastServiceDate = data.LastServiceDate;
              resObj.CarTiresReplacementDate = data.CarTiresReplacementDate;
              resObj.CarExhaustExpiryDate = data.CarExhaustExpiryDate;
              resObj.FuelAdditionCost = data.FuelAdditionCost;
              resObj.FuelAdditionDate = data.FuelAdditionDate;

              resObj.LastUpdatedAt = data.LastUpdatedAt;
              resObj.LastUpdatedBy = data.LastUpdatedBy;

              resObj.Photo = data.Photo;
              resObj.RegistrationCertificate = data.RegistrationCertificate;

              this.vehicleDetails = resObj;
            }

          }
        },
        err => {
          console.log(err);
        }
      );
  }
}
