import { Component, OnInit } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';

interface LicenseCard {
  type: 'vehicle' | 'boat';
  label: string;
  vehicleNames: string[];       // e.g. ['Toyota HILUX', 'Mitsubishi L200']
  hasLicense: boolean;
  licenseFileName: string;
  selectedFile: File | null;
  isUploading: boolean;
  message: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  userId = '';
  userName = '';
  isLoadingProfile = true;
  licenseCards: LicenseCard[] = [];

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.isLoadingProfile = true;
    this.dbFunctionService.getUserProfile()
      .then((profile: any) => {
        this.userId = profile.userId;
        this.userName = `${profile.firstName} ${profile.lastName}`;
        const vehicles: string[] = profile.vehicleDriven ? profile.vehicleDriven.split('|') : [];
        const vehicleTypes: Record<string, string> = profile.vehicleTypes || {};

        // Group user's vehicles by type
        const grouped: Record<string, string[]> = {};
        for (const v of vehicles) {
          const type = vehicleTypes[v] || 'vehicle'; // fallback to 'vehicle'
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push(v.replace(/-/g, ' '));
        }

        // Build one card per type
        this.licenseCards = [];
        if (grouped['vehicle']) {
          this.licenseCards.push({
            type: 'vehicle',
            label: 'Άδεια Οδήγησης',
            vehicleNames: grouped['vehicle'],
            hasLicense: false,
            licenseFileName: '',
            selectedFile: null,
            isUploading: false,
            message: '',
          });
        }
        if (grouped['boat']) {
          this.licenseCards.push({
            type: 'boat',
            label: 'Δίπλωμα Σκάφους',
            vehicleNames: grouped['boat'],
            hasLicense: false,
            licenseFileName: '',
            selectedFile: null,
            isUploading: false,
            message: '',
          });
        }

        this.loadAllLicenses();
      })
      .catch((error: any) => {
        console.error('Failed to load user profile:', error);
      })
      .finally(() => {
        this.isLoadingProfile = false;
      });
  }

  private loadAllLicenses() {
    for (const card of this.licenseCards) {
      this.dbFunctionService.listDriverLicenses(card.type)
        .then((files: any[]) => {
          if (!files || files.length === 0) return;
          // Take the most recent file (already sorted desc by created_at)
          card.hasLicense = true;
          card.licenseFileName = files[0].name;
        })
        .catch((error: any) => console.error(`Failed to list ${card.type} licenses:`, error));
    }
  }

  onFileSelected(event: any, card: LicenseCard) {
    const files = event.target.files;
    if (files && files.length > 0) {
      card.selectedFile = files[0];
    }
  }

  async uploadLicense(card: LicenseCard) {
    if (!card.selectedFile) {
      card.message = 'Παρακαλώ επιλέξτε ένα αρχείο';
      return;
    }

    card.isUploading = true;
    card.message = '';

    try {
      const result = await this.dbFunctionService.uploadDriverLicenseToDb(this.userId, card.selectedFile, card.type);
      card.message = 'Το αρχείο ανέβηκε με επιτυχία!';
      card.selectedFile = null;
      card.licenseFileName = result?.storageName || '';
      card.hasLicense = !!card.licenseFileName;

      // Reset file input
      const input = document.getElementById('file_' + card.type) as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      card.message = 'Σφάλμα κατά την μεταφόρτωση του αρχείου';
    } finally {
      card.isUploading = false;
    }
  }

  async downloadLicense(card: LicenseCard) {
    if (!card.hasLicense || !card.licenseFileName) {
      card.message = 'Δεν υπάρχει δίπλωμα για λήψη';
      return;
    }

    try {
      const blob = await this.dbFunctionService.downloadDriverLicense(card.licenseFileName, card.type);
      const filename = card.licenseFileName.split('/').pop() || 'license';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      card.message = 'Σφάλμα κατά τη λήψη του αρχείου';
    }
  }

}
