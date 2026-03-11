import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Users } from '../models/users.model';
import { HistoryLines } from '../models/history-lines.model';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import { VehicleDetails } from '../models/vehicle-details.model';
import { Vehicle } from '../models/vehicle.model';
import { AuthService } from '../../auth/auth.service';
import { LogBook } from '../models/logbook.model';

@Injectable()
export class DbFunctionService {

    private workerUrl = environment.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) {}

    async getVehicleDetailsFromDb(vehicleId?: number) {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        let url = `${this.workerUrl}/vehicle-details`;
        if (vehicleId) {
            url += `?VehicleId=${encodeURIComponent(vehicleId.toString())}`;
        }

        return this.http
            .get<{ data: any[]; error: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error)
                return res.data
            })
    }

    async getVehicleDetailsRaw(vehicleId?: number) {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        let url = `${this.workerUrl}/vehicle-details`;
        if (vehicleId) {
            url += `?VehicleId=${encodeURIComponent(vehicleId.toString())}`;
        }

        return this.http
            .get<{ data: any[]; error: any; vehiclePhotoUrl: string | null }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error)
                return res
            })
    }

    async postVehicleDetailsToDb(vehicleDetails: VehicleDetails) {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/vehicle-details`;

        return this.http
            .post<{ data: any; error: any }>(url, vehicleDetails, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error)
                return res.data
            })
    }

    async uploadRegistrationCertificateToDb(vehicleId: number, vehicleName: string, file: File) {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('vehicleId', vehicleId.toString());
        formData.append('vehicleName', vehicleName);
        formData.append('filename', file.name);

        const url = `${this.workerUrl}/upload-file`;

        return this.http
            .post<{ data: any; publicUrl: string; error: any }>(url, formData, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error)
                return res.data
            })
    }

    getUserProfile(): Promise<any> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/user-profile`;

        return this.http
            .get<{ data: any; error: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    getVehicles(): Promise<Vehicle[]> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/vehicles`;

        return this.http
            .get<{ data: Vehicle[]; error: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    getRegistrationCertificates(vehicleId: number): Promise<any[]> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/registration-certificates?vehicleId=${encodeURIComponent(vehicleId.toString())}`;

        return this.http
            .get<{ data: any[]; error: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    async downloadFileFromDb(filePath: string) {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/upload-file?path=${encodeURIComponent(filePath)}`;

        return this.http
            .get(url, { headers, responseType: 'blob' })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                return res
            })
    }

    changePassword(newPassword: string, currentPassword?: string, token?: string): Promise<any> {
        const bearerToken = token || this.authService.getSession()?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        });

        const body: any = { newPassword };
        if (currentPassword) {
            body.currentPassword = currentPassword;
        }

        const url = `${this.workerUrl}/change-password`;

        return this.http
            .post<{ message?: string; error?: string }>(url, body, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error);
                return res;
            });
    }

    setInitialPassword(email: string, newPassword: string): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.workerUrl}/set-initial-password`;

        return this.http
            .post<{ message?: string; error?: string }>(url, { email, newPassword }, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error);
                return res;
            })
            .catch(err => {
                const serverMessage = err?.error?.error;
                throw new Error(serverMessage || err?.message || 'Σφάλμα κατά τον ορισμό κωδικού');
            });
    }


    async uploadDriverLicenseToDb(userId: string, file: File, licenseType: 'vehicle' | 'boat') {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('type', licenseType);

        const url = `${this.workerUrl}/driver-license`;

        return this.http
            .post<{ data: any; storageName: string; error: any }>(url, formData, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res;
            });
    }

    listDriverLicenses(licenseType: 'vehicle' | 'boat', userId?: string): Promise<any[]> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        let url = `${this.workerUrl}/driver-license?action=list&type=${licenseType}`;
        if (userId) {
            url += `&userId=${encodeURIComponent(userId)}`;
        }

        return this.http
            .get<{ data: any[]; error: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    downloadDriverLicense(userId: string, fileName: string, licenseType: 'vehicle' | 'boat'): Promise<Blob> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/driver-license?userId=${encodeURIComponent(userId)}&path=${encodeURIComponent(fileName)}&type=${licenseType}`;

        return this.http
            .get(url, { headers, responseType: 'blob' })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                return res;
            });
    }



    addVehicle(name: string, type: string, vehiclePlateNumber?: string, vesselRegistrationNumber?: string, initialKilometers?: number): Promise<any> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        });

        const url = `${this.workerUrl}/vehicles`;
        const body: any = { name, type };
        if (vehiclePlateNumber) body.vehiclePlateNumber = vehiclePlateNumber;
        if (vesselRegistrationNumber) body.vesselRegistrationNumber = vesselRegistrationNumber;
        if (initialKilometers) body.initialKilometers = initialKilometers;
        console.log('Adding vehicle with data:', body);
        return this.http
            .post<{ data: any; error: any }>(url, body, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    deleteVehicle(vehicleId: number): Promise<any> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/vehicles?id=${encodeURIComponent(vehicleId.toString())}`;

        return this.http
            .delete<{ message?: string; error?: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res;
            });
    }

    uploadVehiclePhoto(vehicleName: string, file: File): Promise<any> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('vehicleName', vehicleName);

        const url = `${this.workerUrl}/vehicles`;

        return this.http
            .post<{ data: any; publicUrl: string; error: any }>(url, formData, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res;
            });
    }

    updateVehicle(vehicleData: { id: number; name: string; type: string; vehiclePlateNumber?: string; vesselRegistrationNumber?: string, initialKilometers?: number }): Promise<any> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        });

        const url = `${this.workerUrl}/vehicles`;

        return this.http
            .patch<{ data: any; error: any }>(url, vehicleData, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    replaceVehiclePhoto(vehicleName: string, file: File): Promise<any> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('vehicleName', vehicleName);

        const url = `${this.workerUrl}/vehicles`;

        return this.http
            .patch<{ data: any; publicUrl: string; error: any }>(url, formData, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res;
            });
    }


    async postvehicleDetailsChangesToDb(vehicleDetailsChanges: LogBook) {

        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/logbook`;

        return this.http
            .post<{ data: any; error: any }>(url, vehicleDetailsChanges, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error)
                return res.data
            })
    }

    getVehicleDetailsForLogbook(): Promise<VehicleDetails[]> {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });

        const url = `${this.workerUrl}/logbook`;

        return this.http
            .get<{ data: VehicleDetails[]; error: any }>(url, { headers })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

}



