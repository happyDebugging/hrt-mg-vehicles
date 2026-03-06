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
  registrationCertificatePath = '';
  hasRegistrationCertificate = false;

  isEditEnabled = false;
  isSaveButtonClicked = false;
  isSaveSuccessfull = false;

  saveMessage = '';
  saveMessageType: 'success' | 'danger' | '' = '';
  invalidFields: Set<string> = new Set();

  vehicleDetails: VehicleDetails = new VehicleDetails();

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.vehicleIdToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleIdToPreview')));
    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-', ' ');
    this.vehicleType = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleType')));

    this.GetVehicleDetails();
    this.GetRegistrationCertificate();
  }

  GetRegistrationCertificate() {
    this.dbFunctionService.getRegistrationCertificates(this.vehicleIdToPreview)
      .then((certificates: any[]) => {
        if (certificates && certificates.length > 0) {
          const cert = certificates[0];
          this.registrationCertificatePath = `${this.vehicleToPreview}/${cert.CertificateImageName}`;
          this.hasRegistrationCertificate = true;
        }
      })
      .catch((err: any) => {
        console.error('Failed to fetch registration certificate:', err);
      });
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
    this.saveMessage = '';
    this.saveMessageType = '';
    this.invalidFields.clear();

    // Validate required fields
    if (!this.vehicleDetails.KilometersSum && this.vehicleDetails.KilometersSum !== 0) {
      this.invalidFields.add('kilometersSum');
    }
    if (this.vehicleDetails.KilometersSum && isNaN(Number(this.vehicleDetails.KilometersSum))) {
      this.invalidFields.add('kilometersSum');
    }
    if (this.vehicleDetails.FuelAdditionCost && isNaN(Number(this.vehicleDetails.FuelAdditionCost))) {
      this.invalidFields.add('fuelAdditionCost');
    }

    if (this.invalidFields.size > 0) {
      this.saveMessage = 'Παρακαλώ διορθώστε τα πεδία που επισημαίνονται με κόκκινο.';
      this.saveMessageType = 'danger';
      return;
    }

    this.isSaveButtonClicked = true;
    this.vehicleDetails.VehicleId = this.vehicleIdToPreview;

    this.dbFunctionService.postVehicleDetailsToDb(this.vehicleDetails)
      .then(
        (res: any) => {
          this.isSaveSuccessfull = true;
          this.saveMessage = 'Τα στοιχεία αποθηκεύτηκαν με επιτυχία!';
          this.saveMessageType = 'success';
        },
        err => {
          console.log(err);
          this.isSaveButtonClicked = false;
          this.saveMessage = 'Σφάλμα κατά την αποθήκευση. Παρακαλώ δοκιμάστε ξανά.';
          this.saveMessageType = 'danger';
        }
      );
  }

  EnableVehicleDetailsEdit() {
    this.isEditEnabled = true;
    this.saveMessage = '';
    this.saveMessageType = '';
    this.invalidFields.clear();
    this.isSaveButtonClicked = false;
    this.isSaveSuccessfull = false;
    sessionStorage.setItem('isEditEnabled', 'true');
  }

  DisableVehicleDetailsEdit() {
    this.isEditEnabled = false;
    this.saveMessage = '';
    this.saveMessageType = '';
    this.invalidFields.clear();
    this.isSaveButtonClicked = false;
    this.isSaveSuccessfull = false;
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
    if (!this.hasRegistrationCertificate || !this.registrationCertificatePath) {
      this.fileUploadMessage = 'Δεν υπάρχει Άδεια Κυκλοφορίας για λήψη';
      return;
    }

    try {
      const blob = await this.dbFunctionService.downloadFileFromDb(this.registrationCertificatePath);
      const filename = this.registrationCertificatePath.split('/').pop() || 'registration-certificate';
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
