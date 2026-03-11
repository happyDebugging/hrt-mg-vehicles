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
  vehicleDetails: VehicleDetails[] = [];
  boatDetails: VehicleDetails[] = [];
  loading = false;
  error: string | null = null;
  showVehiclesTable = true;
  showBoatsTable = true;

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

            TotalKm: detail.TotalKm,
            StartingKmOfShift: detail.StartingKmOfShift,
            FinalKmOfShift: detail.FinalKmOfShift,

            InitialKilometers: detail.InitialKilometers,
            KilometersSum: detail.KilometersSum,

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

            TotalKm: detail.TotalKm,
            StartingKmOfShift: detail.StartingKmOfShift,
            FinalKmOfShift: detail.FinalKmOfShift,

            InitialKilometers: detail.InitialKilometers,
            KilometersSum: detail.KilometersSum,

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

        this.loading = false;
        this.page = 1; // Reset to first page on new fetch
      })
      .catch(err => {
        this.error = err.message || 'Σφάλμα κατά τη φόρτωση του ιστορικού';
        this.loading = false;
      });
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
                item.LastUpdatedAt,
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
            widths: [40, 40, 40, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 50],
            fontSize: 8,
            body: [
              ['Ενημερωση', 'Σκαφος', 'Οδηγος', 'Ημ/νια Χρησης', 'Ωρες Μηχ. A', 'Ωρες Μηχ. B', 'Επιπεδο Καυσιμου', 'Επιπεδο Λαδιου', 'Συνολ. Ωρες Λειτουργιας', 'Προσθηκη Καυσιμου(lt)', 'Προσθηκη Καυσιμου', 'Προσθηκη Λαδιου(lt)', 'Προσθηκη Λαδιου', 'Παρατηρησεις'],
              ...this.boatDetails.map(item => [
                item.LastUpdatedAt,
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
                item.Notes
              ])
            ]
          }
        }];

    }

    pdfMake.createPdf(docDefinition).download('vehicle_log' + '_' + formatDate(Date.now(), 'ddMMyy_hhmmss', 'en_US') + '.pdf');
  }

}
