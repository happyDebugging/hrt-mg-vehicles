import { Component } from '@angular/core';
import { VehicleDetails } from '../shared/models/vehicle-details.model';
import { Vehicle } from '../shared/models/vehicle.model';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { LogBook } from '../shared/models/logbook.model';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent {
  showKteoExpiryAlert = false;
  showInsuranceExpiryAlert = false;
  showCarExhaustExpiryAlert = false;
  showNextServiceExpiryAlert = false;
  expiryDatesAlertMessage = '';
  expiryDatesToShowInAlert = '';
  today = new Date(); //new Date('2028-02-11'); //

  vehicleIdToPreview = 0;
  vehicleToPreview = '';
  vehicleName = '';
  vehicleType = '';
  vehiclePhotoUrl = '';

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
  vehicle: Vehicle | null = null;
  vehicleDetailsChanges: LogBook = new LogBook();

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.vehicleIdToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleIdToPreview')));
    this.vehicleToPreview = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleToPreview')));
    this.vehicleName = this.vehicleToPreview.replaceAll('-', ' ');
    this.vehicleType = JSON.parse(JSON.stringify(sessionStorage.getItem('vehicleType')));

    this.GetVehicleDetails();
    this.GetRegistrationCertificate();
  }


  checkKteoExpiryAlert() {
    this.showKteoExpiryAlert = false;
    if (this.vehicleDetails && this.vehicleDetails.KteoExpiryDate) {
      const kteoDate = new Date(this.vehicleDetails.KteoExpiryDate);
      const diffTime = kteoDate.getTime() - this.today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 15) {
        this.showKteoExpiryAlert = true;
        this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `ΚΤΕΟ`;
      }
    }
  }

  checkInsuranceExpiryAlert() {
    this.showInsuranceExpiryAlert = false;
    if (this.vehicleDetails && this.vehicleDetails.InsuranceExpiryDate) {
      const insuranceDate = new Date(this.vehicleDetails.InsuranceExpiryDate);
      const diffTime = insuranceDate.getTime() - this.today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 15) {
        this.showInsuranceExpiryAlert = true;
        if (this.expiryDatesToShowInAlert != '') { this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `, `; }
        this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `Ασφάλειας`;
      }
    }
  }

  checkCarExhaustExpiryAlert() {
    this.showCarExhaustExpiryAlert = false;
    if (this.vehicleDetails && this.vehicleDetails.CarExhaustExpiryDate) {
      const exhaustDate = new Date(this.vehicleDetails.CarExhaustExpiryDate);
      const diffTime = exhaustDate.getTime() - this.today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 15) {
        this.showCarExhaustExpiryAlert = true;
        if (this.expiryDatesToShowInAlert != '') { this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `, `; }
        this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `Καυσαερίων`;
      }
    }
  }

  checkNextServiceExpiryAlert() {
    this.showNextServiceExpiryAlert = false;
    if (this.vehicleDetails && this.vehicleDetails.NextServiceDate) {
      const nextServiceDate = new Date(this.vehicleDetails.NextServiceDate);
      const diffTime = nextServiceDate.getTime() - this.today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 15) {
        this.showNextServiceExpiryAlert = true;
        if (this.expiryDatesToShowInAlert != '') { this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `, `; }
        this.expiryDatesToShowInAlert = this.expiryDatesToShowInAlert + `Επόμενης Συντήρησης`;
      }
    }
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
    this.vehicle = null;

    this.dbFunctionService.getVehicleDetailsRaw(this.vehicleIdToPreview)
      .then(
        (res: any) => {
          if (res.vehiclePhotoUrl) {
            this.vehiclePhotoUrl = res.vehiclePhotoUrl;
          }

          const data = res.data;
          console.log('Raw vehicle details response:', res);

          // If no vehicleDetails row exists, use initialKilometers from vehicle
          if (!data || data.length === 0) {
            if (res.vehicle && res.vehicle.initialKilometers !== undefined) {
              this.vehicleDetails.TotalKm = res.vehicle.initialKilometers;
              console.log('No vehicle details found, using initial kilometers from vehicle:', this.vehicleDetails.TotalKm);
            } else if (this.vehicle && this.vehicle.initialKilometers !== undefined) {
              this.vehicleDetails.TotalKm = this.vehicle.initialKilometers;
              console.log('No vehicle details found, using initial kilometers from vehicle object:', this.vehicleDetails.TotalKm);
            } else {
              this.vehicleDetails.TotalKm = 0;
              console.log('No vehicle details or initial kilometers found, defaulting to 0');
            }
            return;
          }

          if (data && data.length > 0) {
            console.log('Vehicle details data:', data);
            // VehicleDetails fields
            this.vehicleDetails.VehicleName = data[0].VehicleName;
            this.vehicleDetails.VehicleType = data[0].VehicleType;
            if ((data[0].TotalKm == null || data[0].TotalKm == undefined || data[0].TotalKm == 0) && data[0].vehicles && data[0].vehicles.initialKilometers !== undefined) {
              this.vehicleDetails.TotalKm = data[0].vehicles.initialKilometers;
            } else {
              this.vehicleDetails.TotalKm = data[0].FinalKmOfShift;//data[0].TotalKm + data[0].FinalKmOfShift;
            }
            this.vehicleDetails.StartingKmOfShift = data[0].FinalKmOfShift; data[0].StartingKmOfShift;
            this.vehicleDetails.FinalKmOfShift = 0;//data[0].FinalKmOfShift;
            this.vehicleDetails.LastDrivenAt = data[0].LastDrivenAt;
            this.vehicleDetails.KteoExpiryDate = data[0].KteoExpiryDate;
            this.vehicleDetails.InsuranceExpiryDate = data[0].InsuranceExpiryDate;
            this.vehicleDetails.LastServiceDate = data[0].LastServiceDate;
            this.vehicleDetails.LastServiceKilometers = data[0].LastServiceKilometers;
            this.vehicleDetails.LastBoatServiceHours = data[0].LastBoatServiceHours;
            this.vehicleDetails.NextServiceDate = data[0].NextServiceDate;
            this.vehicleDetails.NextBoatServiceHours = data[0].NextBoatServiceHours;
            this.vehicleDetails.NextServiceKilometers = data[0].NextServiceKilometers;
            this.vehicleDetails.CarTiresReplacementDate = data[0].CarTiresReplacementDate;
            this.vehicleDetails.CarExhaustExpiryDate = data[0].CarExhaustExpiryDate;
            this.vehicleDetails.FuelAdditionCost = data[0].FuelAdditionCost;
            this.vehicleDetails.FuelAdditionLiters = data[0].FuelAdditionLiters;
            this.vehicleDetails.FuelAdditionDate = data[0].FuelAdditionDate;
            this.vehicleDetails.EngineAHours = data[0].EngineAHours;
            this.vehicleDetails.EngineBHours = data[0].EngineBHours;
            this.vehicleDetails.BoatFuelLevel = data[0].BoatFuelLevel;
            this.vehicleDetails.BoatOilLevel = data[0].BoatOilLevel;
            this.vehicleDetails.BoatTotalOperatingHours = data[0].BoatTotalOperatingHours;
            this.vehicleDetails.DateOfBoatUse = data[0].DateOfBoatUse;
            this.vehicleDetails.BoatGasAdditionLiters = data[0].BoatGasAdditionLiters;
            this.vehicleDetails.BoatGasAdditionDate = data[0].BoatGasAdditionDate;
            this.vehicleDetails.BoatOilAdditionLiters = data[0].BoatOilAdditionLiters;
            this.vehicleDetails.BoatOilAdditionDate = data[0].BoatOilAdditionDate;
            this.vehicleDetails.LastUpdatedAt = data[0].LastUpdatedAt;
            this.vehicleDetails.LastUpdatedBy = data[0].LastUpdatedBy;
            this.vehicleDetails.LastUpdatedByName = data[0].LastUpdatedByName;
            this.vehicleDetails.Notes = data[0].Notes;

            // Vehicle fields
            if (data[0].vehicles) {
              this.vehicle = {
                id: data[0].vehicles.id,
                name: data[0].vehicles.name,
                type: data[0].vehicles.type,
                vehiclePlateNumber: data[0].vehicles.vehiclePlateNumber,
                vesselRegistrationNumber: data[0].vehicles.vesselRegistrationNumber,
                vehicleImageName: data[0].vehicles.vehicleImageName,
                initialKilometers: data[0].vehicles.initialKilometers
              };
            }
          }

          this.checkKteoExpiryAlert();
          this.checkInsuranceExpiryAlert();
          this.checkCarExhaustExpiryAlert();
          this.checkNextServiceExpiryAlert();

          this.expiryDatesAlertMessage = `Προσοχή: Η ημερομηνία λήξης ${this.expiryDatesToShowInAlert} είναι σε λιγότερο από 15 ημέρες!`;

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
    if (!this.vehicleDetails.FinalKmOfShift && this.vehicleDetails.FinalKmOfShift !== 0) {
      this.invalidFields.add('FinalKmOfShift');
    }
    if (this.vehicleDetails.FinalKmOfShift && isNaN(Number(this.vehicleDetails.FinalKmOfShift))) {
      this.invalidFields.add('FinalKmOfShift');
    }
    if (this.vehicleDetails.FuelAdditionCost && isNaN(Number(this.vehicleDetails.FuelAdditionCost))) {
      this.invalidFields.add('FuelAdditionCost');
    }
    if (this.vehicleDetails.FuelAdditionLiters && isNaN(Number(this.vehicleDetails.FuelAdditionLiters))) {
      this.invalidFields.add('FuelAdditionLiters');
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

          this.SaveVehicleDetailsChangesToLogbook();
        },
        err => {
          console.log(err);
          this.isSaveButtonClicked = false;
          this.saveMessage = 'Σφάλμα κατά την αποθήκευση. Παρακαλώ δοκιμάστε ξανά.';
          this.saveMessageType = 'danger';
        }
      );
  }

  SaveVehicleDetailsChangesToLogbook() {
    this.dbFunctionService.postvehicleDetailsChangesToDb(this.vehicleDetailsChanges)
      .then(
        (res: any) => {
          this.isSaveSuccessfull = true;
          this.saveMessage = 'Το ιστορικό αποθηκεύτηκε με επιτυχία!';
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

  CalculateBoatTotalOperatingHours() {
    this.vehicleDetails.BoatTotalOperatingHours = (Number(this.vehicleDetails.EngineAHours) || 0) + (Number(this.vehicleDetails.EngineBHours) || 0);
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
