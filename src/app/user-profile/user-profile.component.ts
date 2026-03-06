import { Component, OnInit } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  driverLicenseFile: File | null = null;
  isUploadingFiles = false;
  driverLicenseUploadMessage = '';
  userId = '';
  responsibleForVehicles = '';
  userName = '';
  userEmail = '';
  userPermissions = '';
  isLoadingProfile = true;
  hasDriverLicense = false;
  driverLicenseFileName = '';

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.loadUserProfile();
    this.loadDriverLicense();
  }

  private loadDriverLicense() {
    this.dbFunctionService.listDriverLicenses()
      .then((files: any[]) => {
        if (files && files.length > 0) {
          this.driverLicenseFileName = files[0].name;
          this.hasDriverLicense = true;
        }
      })
      .catch((error: any) => {
        console.error('Failed to check driver license:', error);
      });
  }

  private loadUserProfile() {
    this.isLoadingProfile = true;
    this.dbFunctionService.getUserProfile()
      .then((profile: any) => {
        this.userId = profile.userId;
        this.userName = `${profile.firstName} ${profile.lastName}`;
        this.responsibleForVehicles = profile.vehicleDriven;
      })
      .catch((error: any) => {
        console.error('Failed to load user profile:', error);
      })
      .finally(() => {
        this.isLoadingProfile = false;
      });
  }


  OnDriverLicenseSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.driverLicenseFile = files[0];
    }
  }

  async UploadDriverLicense() {
    this.isUploadingFiles = true;
    this.driverLicenseUploadMessage = '';

    try {
      if (this.driverLicenseFile) {
        const result = await this.dbFunctionService.uploadDriverLicenseToDb(this.userId, this.driverLicenseFile);
        this.driverLicenseUploadMessage = 'Το αρχείο ανέβηκε με επιτυχία!';
        this.driverLicenseFile = null;
        this.driverLicenseFileName = result?.storageName || '';
        this.hasDriverLicense = !!this.driverLicenseFileName;

        // Reset file input
        const driverLicenseInput = document.getElementById('driverLicense') as HTMLInputElement;
        if (driverLicenseInput) driverLicenseInput.value = '';
      } else {
        this.driverLicenseUploadMessage = 'Παρακαλώ επιλέξτε ένα αρχείο για μεταφόρτωση';
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.driverLicenseUploadMessage = 'Σφάλμα κατά την μεταφόρτωση του αρχείου';
    } finally {
      this.isUploadingFiles = false;
    }
  }

  async DownloadDriverLicense() {
    if (!this.hasDriverLicense || !this.driverLicenseFileName) {
      this.driverLicenseUploadMessage = 'Δεν υπάρχει δίπλωμα για λήψη';
      return;
    }

    try {
      const blob = await this.dbFunctionService.downloadDriverLicense(this.driverLicenseFileName);
      const filename = this.driverLicenseFileName.split('/').pop() || 'driver-license';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      this.driverLicenseUploadMessage = 'Σφάλμα κατά τη λήψη του αρχείου';
    }
  }

}
