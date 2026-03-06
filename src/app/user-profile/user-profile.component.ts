import { Component } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  driverLicenseFile: File | null = null;
  isUploadingFiles = false;
  driverLicenseUploadMessage = '';
  userId = '';
  responsibleForVehicles = '';
  userName = '';

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

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
        await this.dbFunctionService.uploadDriverLicenseToDb(this.userId, this.driverLicenseFile);
        this.driverLicenseUploadMessage = 'Το αρχείο ανέβηκε με επιτυχία!';
        this.driverLicenseFile = null;

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

  async DownloadDriverLicense(filePath: string) {
    try {
      const blob = await this.dbFunctionService.downloadFileFromDb(filePath);
      const filename = filePath.split('/').pop() || 'driver-license';
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
