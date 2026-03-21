import { Component, OnInit } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { VehicleDetails } from '../shared/models/vehicle-details.model';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = vfsFonts;
(pdfMake as any).fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};
import { formatDate } from '@angular/common';
import type { TDocumentDefinition } from 'pdfmake/interfaces';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.css'
})
export class LogbookComponent implements OnInit {
  // Track which boat row was just updated for UI feedback
  lastUpdatedBoatId: number | null = null;
  // Track which vehicle row was just updated for UI feedback
  lastUpdatedVehicleId: number | null = null;
  vehicleDetails: VehicleDetails[] = [];
  selectedVehicleDetail: VehicleDetails | null = null;
  selectedBoatDetail: VehicleDetails | null = null;
  editMode: boolean = false;

  boatDetails: VehicleDetails[] = [];
  loading = false;
  error: string | null = null;
  showVehiclesTable = true;
  showBoatsTable = true;
  deletingVehicleId: number | null = null;

  // Pagination
  page = 1;
  pageSize = 10;
  vehiclePage = 1;
  vehiclePageSize = 10;
  boatPage = 1;
  boatPageSize = 10;

  constructor(private db: DbFunctionService) { }

  ngOnInit() {
    this.fetchVehicleDetails();
  }

  fetchVehicleDetails() {
    this.loading = true;
    this.error = null;
    this.vehicleDetails = [];

    this.db.getVehicleDetailsForLogbook()
      .then((vehicleDetails: any) => {

        console.log('Fetched vehicleDetails:', vehicleDetails);
        this.vehicleDetails = vehicleDetails
          .filter((detail: any) => detail.vehicles.type == 'vehicle')
          .map((detail: any) => ({
            Id: detail.id,
            VehicleType: detail.vehicles.type,
            VehicleName: detail.vehicles.name ? detail.vehicles.name.replace(/-/g, ' ') : '',
            VehicleId: detail.VehicleId,

            TotalKm: detail.TotalKm,
            StartingKmOfShift: detail.StartingKmOfShift,
            FinalKmOfShift: detail.FinalKmOfShift,

            LastDrivenAt: detail.LastDrivenAt,

            KteoExpiryDate: detail.KteoExpiryDate,
            InsuranceExpiryDate: detail.InsuranceExpiryDate,
            LastServiceDate: detail.LastServiceDate,
            LastServiceKilometers: detail.LastServiceKilometers,
            LastBoatServiceHours: detail.LastBoatServiceHours,
            NextServiceDate: detail.NextServiceDate,
            NextServiceKilometers: detail.NextServiceKilometers,
            NextBoatServiceHours: detail.NextBoatServiceHours,
            CarTiresReplacementDate: detail.CarTiresReplacementDate,
            CarExhaustExpiryDate: detail.CarExhaustExpiryDate,
            FuelAdditionCost: detail.FuelAdditionCost,
            FuelAdditionLiters: detail.FuelAdditionLiters,
            FuelAdditionDate: detail.FuelAdditionDate,

            EngineAHours: detail.EngineAHours,
            EngineBHours: detail.EngineBHours,
            BoatFuelLevel: detail.BoatFuelLevel,
            BoatOilLevel: detail.BoatOilLevel,
            BoatTotalOperatingHours: detail.BoatTotalOperatingHours,
            DateOfBoatUse: detail.DateOfBoatUse,
            BoatGasAdditionLiters: detail.BoatGasAdditionLiters,
            BoatGasAdditionDate: detail.BoatGasAdditionDate,
            BoatOilAdditionLiters: detail.BoatOilAdditionLiters,
            BoatOilAdditionDate: detail.BoatOilAdditionDate,

            LastUpdatedAt: detail.LastUpdatedAt,
            LastUpdatedBy: detail.LastUpdatedBy,
            LastUpdatedByName: detail.LastUpdatedByName,

            Notes: detail.Notes
          }));

        this.boatDetails = vehicleDetails
          .filter((detail: any) => detail.vehicles.type == 'boat')
          .map((detail: any) => ({
            Id: detail.id,
            VehicleType: detail.vehicles.type,
            VehicleName: detail.vehicles.name ? detail.vehicles.name.replace(/-/g, ' ') : '',
            VehicleId: detail.VehicleId,

            TotalKm: detail.TotalKm,
            StartingKmOfShift: detail.StartingKmOfShift,
            FinalKmOfShift: detail.FinalKmOfShift,

            LastDrivenAt: detail.LastDrivenAt,

            KteoExpiryDate: detail.KteoExpiryDate,
            InsuranceExpiryDate: detail.InsuranceExpiryDate,
            LastServiceDate: detail.LastServiceDate,
            LastServiceKilometers: detail.LastServiceKilometers,
            LastBoatServiceHours: detail.LastBoatServiceHours,
            NextServiceDate: detail.NextServiceDate,
            NextServiceKilometers: detail.NextServiceKilometers,
            NextBoatServiceHours: detail.NextBoatServiceHours,
            CarTiresReplacementDate: detail.CarTiresReplacementDate,
            CarExhaustExpiryDate: detail.CarExhaustExpiryDate,
            FuelAdditionCost: detail.FuelAdditionCost,
            FuelAdditionLiters: detail.FuelAdditionLiters,
            FuelAdditionDate: detail.FuelAdditionDate,

            EngineAHours: detail.EngineAHours,
            EngineBHours: detail.EngineBHours,
            BoatFuelLevel: detail.BoatFuelLevel,
            BoatOilLevel: detail.BoatOilLevel,
            BoatTotalOperatingHours: detail.BoatTotalOperatingHours,
            DateOfBoatUse: detail.DateOfBoatUse,
            BoatGasAdditionLiters: detail.BoatGasAdditionLiters,
            BoatGasAdditionDate: detail.BoatGasAdditionDate,
            BoatOilAdditionLiters: detail.BoatOilAdditionLiters,
            BoatOilAdditionDate: detail.BoatOilAdditionDate,
            BoatMaintenance: detail.BoatMaintenance,
            BoatBatteries: detail.BoatBatteries,
            BoatCrew: detail.BoatCrew,

            LastUpdatedAt: detail.LastUpdatedAt,
            LastUpdatedBy: detail.LastUpdatedBy,
            LastUpdatedByName: detail.LastUpdatedByName,

            Notes: detail.Notes
          }));

        this.loading = false;
        this.page = 1; // Reset to first page on new fetch
      })
      .catch(err => {
        this.error = err.message || 'Σφάλμα κατά τη φόρτωση του ιστορικού';
        this.loading = false;
      });
  }

  async deleteVehiclesHistory(id: number, type: 'vehicle' | 'boat' = 'vehicle') {
    this.deletingVehicleId = id;
    console.log('Deleting history with ID:', id);
    try {
      await this.db.deleteVehicleDetailsFromDb(id);
      if (type === 'vehicle') {
        this.vehicleDetails = this.vehicleDetails.filter(v => v.Id !== id);
      } else if (type === 'boat') {
        this.boatDetails = this.boatDetails.filter(b => b.Id !== id);
      }
    } catch (err: any) {
      this.error = err.message || 'Σφάλμα κατά τη διαγραφή.';
    } finally {
      this.deletingVehicleId = null;
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.vehicleDetails.length / this.pageSize);
  }

  getVehiclesOnly() {
    return this.vehicleDetails.filter(d => d.VehicleType === 'vehicle');
  }
  getBoatsOnly() {
    return this.vehicleDetails.filter(d => d.VehicleType === 'boat');
  }
  getPagedVehicles() {
    const start = (this.vehiclePage - 1) * this.vehiclePageSize;
    return this.getVehiclesOnly().slice(start, start + this.vehiclePageSize);
  }
  getPagedBoats() {
    const start = (this.boatPage - 1) * this.boatPageSize;
    return this.getBoatsOnly().slice(start, start + this.boatPageSize);
  }
  getVehicleTotalPages() {
    return Math.ceil(this.getVehiclesOnly().length / this.vehiclePageSize);
  }
  getBoatTotalPages() {
    return Math.ceil(this.getBoatsOnly().length / this.boatPageSize);
  }

  editVehicleLineHistory(id: number, type: 'vehicle' | 'boat') {
    if (type === 'vehicle') {
      const detail = this.vehicleDetails.find(v => v.Id === id);
      if (detail) {
        this.selectedVehicleDetail = { ...detail };
        this.selectedBoatDetail = null;
        this.editMode = true;
      }
    } else if (type === 'boat') {
      const detail = this.boatDetails.find(b => b.Id === id);
      if (detail) {
        this.selectedBoatDetail = { ...detail };
        this.selectedVehicleDetail = null;
        this.editMode = true;
      }
    }
  }

  saveVehicleLineHistory() {
    if (this.selectedVehicleDetail) {
      const vehiclePayload = { ...this.selectedVehicleDetail };
      vehiclePayload.VehicleId = this.selectedVehicleDetail.VehicleId;

      delete (vehiclePayload as any).VehicleType;
      delete (vehiclePayload as any).VehicleName;

      this.db.updateVehicleDetailsInDb(vehiclePayload)
        .then(() => {
          const idx = this.vehicleDetails.findIndex(v => v.Id === this.selectedVehicleDetail!.Id);
          if (idx !== -1 && this.selectedVehicleDetail) {
            this.vehicleDetails[idx] = Object.assign(new VehicleDetails(), this.selectedVehicleDetail, { Id: this.selectedVehicleDetail.Id });
          }
          // Set feedback state for updated row
          this.lastUpdatedVehicleId = this.selectedVehicleDetail?.Id || null;
          setTimeout(() => {
            this.lastUpdatedVehicleId = null;
          }, 4000);
          this.editMode = false;
          this.selectedVehicleDetail = null;
        })
        .catch(err => {
          this.error = err.message || 'Σφάλμα κατά την αποθήκευση.';
        });
    } else if (this.selectedBoatDetail) {
      const boatPayload = { ...this.selectedBoatDetail };
      boatPayload.VehicleId = this.selectedBoatDetail.VehicleId;

      delete (boatPayload as any).VehicleType;
      delete (boatPayload as any).VehicleName;

      this.db.updateVehicleDetailsInDb(boatPayload)
        .then(() => {
          const idx = this.boatDetails.findIndex(b => b.Id === this.selectedBoatDetail!.Id);
          if (idx !== -1 && this.selectedBoatDetail) {
            this.boatDetails[idx] = Object.assign(new VehicleDetails(), this.selectedBoatDetail, { Id: this.selectedBoatDetail.Id });
          }
          // Set feedback state for updated boat row
          this.lastUpdatedBoatId = this.selectedBoatDetail?.Id || null;
          setTimeout(() => {
            this.lastUpdatedBoatId = null;
          }, 4000);
          this.editMode = false;
          this.selectedBoatDetail = null;
        })
        .catch(err => {
          this.error = err.message || 'Σφάλμα κατά την αποθήκευση.';
        });
    }

  }

  cancelEditVehicleLineHistory() {
    this.editMode = false;
    this.selectedVehicleDetail = null;
    this.selectedBoatDetail = null;
  }

  exportHistoryLog(vehicleType: string) {
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      header: function (currentPage: number, pageCount: number) {
        return [
          { text: 'Ιστορικό Οχημάτων ΕΟΔ Μαγνησίας', alignment: 'right', fontSize: 12, color: 'grey', margin: [480, 10, 40, 0] } // Right side text
        ];
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Σελίδα ${currentPage}/${pageCount}`,
          alignment: 'center',
          fontSize: 10,
          color: 'grey',
          margin: [0, 10, 0, 0]
        };
      }
    };

    if (vehicleType === 'vehicle') {
      docDefinition.content = [
        { text: 'Ιστορικό Οχημάτων', style: 'header', fontSize: 15, color: '#154c79', bold: true },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        {
          layout: 'lightHorizontalLines', // optional
          fontSize: 8,
          table: {
            headerRows: 1,
            widths: [30, 30, 30, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30],
            body: [
              ['Ενημερωση', 'Οχημα', 'Οδηγος', 'Συν. Χλμ.', 'Αρχικά Χλμ.', 'Τελικά Χλμ.', 'Ημ/νια Χρησης', 'ΚΤΕΟ', 'Ασφαλεια', 'Service', 'Χλμ. Τελ. Service', 'Επομενο Service', 'Χλμ. Επομενου Service', 'Αλλαγη Ελαστικων', 'Καρτα Καυσαεριων', 'Καυσιμα(€)', 'Καυσιμα(lt)', 'Προσθηκη Καυσιμου', 'Παρατηρησεις'],
              ...this.vehicleDetails.map(item => [
                item.LastUpdatedAt ? `${formatDate(item.LastUpdatedAt, 'dd/MM/yyyy', 'en-US')} - ${formatDate(item.LastUpdatedAt, 'HH:mm', 'en-US')}` : '',
                item.VehicleName,
                item.LastUpdatedByName,
                item.TotalKm,
                item.StartingKmOfShift,
                item.FinalKmOfShift,
                item.LastDrivenAt,
                item.KteoExpiryDate,
                item.InsuranceExpiryDate,
                item.LastServiceDate,
                item.LastServiceKilometers,
                item.NextServiceDate,
                item.NextServiceKilometers,
                item.CarTiresReplacementDate,
                item.CarExhaustExpiryDate,
                item.FuelAdditionCost,
                item.FuelAdditionLiters,
                item.FuelAdditionDate,
                item.Notes
              ])
            ]
          }
        }];
    } else if (vehicleType === 'boat') {
      docDefinition.content = [
        { text: 'Ιστορικό Σκαφών', style: 'header', fontSize: 15, color: '#154c79', bold: true },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        {
          layout: 'lightHorizontalLines', // optional
          fontSize: 8,
          table: {
            headerRows: 1,
            widths: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            fontSize: 8,
            body: [
              ['Ενημερωση', 'Σκαφος', 'Οδηγος', 'Ημ/νια Χρησης', 'Ωρες Μηχ. A', 'Ωρες Μηχ. B', 'Επιπεδο Καυσιμου', 'Επιπεδο Λαδιου', 'Συνολ. Ωρες Λειτουργιας', 'Προσθηκη Καυσιμου(lt)', 'Προσθηκη Καυσιμου', 'Προσθηκη Λαδιου(lt)', 'Προσθηκη Λαδιου', 'Συντηρηση', 'Μπαταρια', 'Πληρωμα', 'Παρατηρησεις'],
              ...this.boatDetails.map(item => [
                item.LastUpdatedAt ? `${formatDate(item.LastUpdatedAt, 'dd/MM/yyyy', 'en-US')} - ${formatDate(item.LastUpdatedAt, 'HH:mm', 'en-US')}` : '',
                item.VehicleName,
                item.LastUpdatedByName,
                item.DateOfBoatUse,
                item.EngineAHours,
                item.EngineBHours,
                item.BoatFuelLevel,
                item.BoatOilLevel,
                item.BoatTotalOperatingHours,
                item.BoatGasAdditionLiters,
                item.BoatGasAdditionDate,
                item.BoatOilAdditionLiters,
                item.BoatOilAdditionDate,
                item.BoatMaintenance,
                item.BoatBatteries,
                item.BoatCrew,
                item.Notes
              ])
            ]
          }
        }];

    }

    pdfMake.createPdf(docDefinition).download('vehicle_log' + '_' + formatDate(Date.now(), 'ddMMyy_hhmmss', 'en_US') + '.pdf');
  }

  printVehicleLineHistory(id: number, vehicleType: string) {
    const docDefinition: any = {
      pageSize: 'A4',
      header: function (currentPage: number, pageCount: number) {
        return [
          { text: 'Ιστορικό Οχημάτων ΕΟΔ Μαγνησίας', alignment: 'right', fontSize: 8, color: 'grey', margin: [380, 10, 40, 0] } // Right side text
        ];
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Σελίδα ${currentPage}/${pageCount}`,
          alignment: 'center',
          fontSize: 10,
          color: 'grey',
          margin: [0, 10, 0, 0]
        };
      }
    };

    if (vehicleType === 'vehicle') {
      docDefinition.content = [
        { text: 'Ιστορικό Οχήματος', style: 'header', fontSize: 15, color: '#154c79', bold: true },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        ...this.vehicleDetails.filter(item => item.Id === id).map(item => ({
          layout: 'lightHorizontalLines',
          fontSize: 11,
          table: {
            widths: ['auto', '*'],
            body: [
              [{ text: 'Τελευταία Ενημέρωση:', bold: true }, item.LastUpdatedAt ? `${formatDate(item.LastUpdatedAt, 'dd/MM/yyyy', 'en-US')} - ${formatDate(item.LastUpdatedAt, 'HH:mm', 'en-US')}` : ''],
              [{ text: 'Όχημα:', bold: true }, item.VehicleName],
              [{ text: 'Οδηγός:', bold: true }, item.LastUpdatedByName],
              [{ text: 'Συνολικά Χλμ.:', bold: true }, item.TotalKm],
              [{ text: 'Αρχικά Χλμ.:', bold: true }, item.StartingKmOfShift],
              [{ text: 'Τελικά Χλμ.:', bold: true }, item.FinalKmOfShift],
              [{ text: 'Ημ/νια Χρήσης:', bold: true }, item.LastDrivenAt ? `${formatDate(item.LastDrivenAt, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Λήξη ΚΤΕΟ:', bold: true }, item.KteoExpiryDate ? `${formatDate(item.KteoExpiryDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Λήξη Ασφάλειας:', bold: true }, item.InsuranceExpiryDate ? `${formatDate(item.InsuranceExpiryDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Service:', bold: true }, item.LastServiceDate ? `${formatDate(item.LastServiceDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Χλμ. Τελευταίου Service:', bold: true }, item.LastServiceKilometers],
              [{ text: 'Επόμενο Service:', bold: true }, item.NextServiceDate ? `${formatDate(item.NextServiceDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Χλμ. Επόμενου Service:', bold: true }, item.NextServiceKilometers],
              [{ text: 'Αλλαγή Ελαστικών:', bold: true }, item.CarTiresReplacementDate ? `${formatDate(item.CarTiresReplacementDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Κάρτα Καυσαερίων:', bold: true }, item.CarExhaustExpiryDate ? `${formatDate(item.CarExhaustExpiryDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Καύσιμα (€):', bold: true }, item.FuelAdditionCost],
              [{ text: 'Καύσιμα (lt):', bold: true }, item.FuelAdditionLiters],
              [{ text: 'Προσθήκη Καυσίμου:', bold: true }, item.FuelAdditionDate ? `${formatDate(item.FuelAdditionDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Παρατηρήσεις:', bold: true }, item.Notes]
            ]
          }
        }))
      ];
    } else if (vehicleType === 'boat') {
      docDefinition.content = [
        { text: 'Ιστορικό Σκάφους', style: 'header', fontSize: 15, color: '#154c79', bold: true },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        ...this.boatDetails.filter(item => item.Id === id).map(item => ({
          layout: 'lightHorizontalLines', // optional
          fontSize: 11,
          table: {
            widths: ['auto', '*'],
            body: [
              [{ text: 'Τελευταία Ενημέρωση:', bold: true }, item.LastUpdatedAt ? `${formatDate(item.LastUpdatedAt, 'dd/MM/yyyy', 'en-US')} - ${formatDate(item.LastUpdatedAt, 'HH:mm', 'en-US')}` : ''],
              [{ text: 'Σκάφος:', bold: true }, item.VehicleName],
              [{ text: 'Οδηγός:', bold: true }, item.LastUpdatedByName],
              [{ text: 'Ημερομηνία Χρήσης:', bold: true }, item.DateOfBoatUse ? `${formatDate(item.DateOfBoatUse, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Ώρες Κινητήρα A:', bold: true }, item.EngineAHours],
              [{ text: 'Ώρες Κινητήρα B:', bold: true }, item.EngineBHours],
              [{ text: 'Επίπεδο Καυσίμου:', bold: true }, item.BoatFuelLevel],
              [{ text: 'Επίπεδο Λαδιού:', bold: true }, item.BoatOilLevel],
              [{ text: 'Συνολικές Ώρες Λειτουργίας:', bold: true }, item.BoatTotalOperatingHours],
              [{ text: 'Προσθήκη Καυσίμου (lt):', bold: true }, item.BoatGasAdditionLiters],
              [{ text: 'Ημερομηνία Προσθήκης Καυσίμου:', bold: true }, item.BoatGasAdditionDate ? `${formatDate(item.BoatGasAdditionDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Προσθήκη Λαδιού (lt):', bold: true }, item.BoatOilAdditionLiters],
              [{ text: 'Ημερομηνία Προσθήκης Λαδιού:', bold: true }, item.BoatOilAdditionDate ? `${formatDate(item.BoatOilAdditionDate, 'dd/MM/yyyy', 'en-US')}` : ''],
              [{ text: 'Συντήρηση:', bold: true }, item.BoatMaintenance],
              [{ text: 'Μπαταρία:', bold: true }, item.BoatBatteries],
              [{ text: 'Πλήρωμα:', bold: true }, item.BoatCrew],
              [{ text: 'Παρατηρήσεις-Αποστολή:', bold: true }, item.Notes]
            ]
          }
        }))
      ];

    }

    pdfMake.createPdf(docDefinition).download('vehicle_log' + '_' + formatDate(Date.now(), 'ddMMyy_hhmmss', 'en_US') + '.pdf');

  }

}
