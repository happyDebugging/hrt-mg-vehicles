import { Component } from '@angular/core';
import { VehicleDetails } from '../shared/models/vehicle-details.model';
import { DbFunctionService } from '../shared/services/db-functions.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent {

  vehicleIdToPreview = 0;
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

  registrationCertificateFile: File | null = null;
  isUploadingFiles = false;
  fileUploadMessage = '';

  isEditEnabled = false;
  isSaveButtonClicked = false;
  isSaveSuccessfull = false;

  vehicleDetails: VehicleDetails = new VehicleDetails();

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.vehicleIdToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleIdToPreview')));
    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-', ' ');
    this.vehicleType = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleType')));

    this.GetVehicleDetails();
  }

  GetVehicleDetails() {
    this.vehicleDetails = new VehicleDetails();

    this.dbFunctionService.getVehicleDetailsFromDb(this.vehicleIdToPreview)
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

  SaveVehicleDetails() {

    this.vehicleDetails.VehicleId = this.vehicleIdToPreview;

    this.dbFunctionService.postVehicleDetailsToDb(this.vehicleDetails)
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
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

  OnRegistrationCertificateSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.registrationCertificateFile = files[0];
    }
  }



  async UploadRegistrationCertificate() {
    this.isUploadingFiles = true;
    this.fileUploadMessage = '';

    try {
      if (this.registrationCertificateFile) {
        await this.dbFunctionService.uploadRegistrationCertificateToDb(this.vehicleIdToPreview, this.vehicleToPreview, this.registrationCertificateFile);
        this.fileUploadMessage = 'Το αρχείο ανέβηκε με επιτυχία!';
        this.registrationCertificateFile = null;

        // Reset file input
        const regCertInput = document.getElementById('registrationCertificate') as HTMLInputElement;
        if (regCertInput) regCertInput.value = '';
      } else {
        this.fileUploadMessage = 'Παρακαλώ επιλέξτε ένα αρχείο για μεταφόρτωση';
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.fileUploadMessage = 'Σφάλμα κατά την μεταφόρτωση του αρχείου';
    } finally {
      this.isUploadingFiles = false;
    }
  }

  async DownloadRegistrationCertificate(filePath: string) {
    try {
      const blob = await this.dbFunctionService.downloadFileFromDb(filePath);
      const filename = filePath.split('/').pop() || 'registration-certificate';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      this.fileUploadMessage = 'Σφάλμα κατά τη λήψη του αρχείου';
    }
  }

}
