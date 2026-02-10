import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Users } from '../models/users.model';
import { HistoryLines } from '../models/history-lines.model';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import { VehicleDetails } from '../models/vehicle-details.model';
import { AuthService } from '../../auth/auth.service';

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


    // async getRegistrationCertificateFromDb(registrationCertificate: string) {

    //     const data = await this.supabase.storage.from('hrt-mg-vehicles-storage').getPublicUrl(registrationCertificate);

    //     return data["data"];
    // }

    // async postRegistrationCertificateToDb(registrationCertificate: File) {

    //     //console.log(registrationCertificate)
    //     // const data = await this.supabase.storage.from('hrt-mg-vehicles-storage')
    //     //     .upload(materialImage + '.jpg', registrationCertificate[0], { cacheControl: '3600', upsert: false, contentType: 'image/jpeg' });
    //     const data = await this.supabase.storage.from('hrt-mg-vehicles-storage')
    //         .upload(`pdfs/${registrationCertificate.name}`, registrationCertificate);

    //     //if (error) throw error;
    //     console.log('Upload successful:', data);

    //     return data["data"];
    // }



    // // async deleteMaterialPhotoFromDb(materialImage: string) {
    // //     let options: any = {
    // //         headers: { "Access-Control-Allow-Origin": "*" },
    // //         observe: 'response'
    // //     }
    // //     console.log(materialImage + '.jpg')
    // //     const { error } = await this.supabase.storage.from('hrt-mg-warehouse-photo-storage')
    // //         .remove([materialImage + '.jpg']);

    // //     return { error };
    // // }


    // // async addNewUserToDb(userΙd: string, newUserFirstName: string, newUserLastName: string, newUserEmail: string, newUserPermissions: string) {

    // //     const data = await this.supabase.from('users')
    // //         .insert({
    // //             UserId: userΙd,
    // //             FirstName: newUserFirstName,
    // //             LastName: newUserLastName,
    // //             Email: newUserEmail,
    // //             Permissions: newUserPermissions,
    // //             HasChangedPassword: false
    // //         }).select();

    // //     return data;
    // // }

    // // async updateUserToDb(userΙd: string, userFirstName: string, userLastName: string, userEmail: string, userPermissions: string) {

    // //     const data = await this.supabase.from('users')
    // //         .update({
    // //             UserId: userΙd,
    // //             FirstName: userFirstName,
    // //             LastName: userLastName,
    // //             Email: userEmail,
    // //             Permissions: userPermissions,
    // //             HasChangedPassword: false
    // //         }).eq('UserId', userΙd);

    // //     return data;
    // // }

    // // async deleteUserFromDb(userΙd: string) {

    // //     const { data, error } = await this.supabase.from('users')
    // //         .delete().eq('UserId', userΙd);

    // //     return { data, error };
    // // }

    // // async getUserDetailsFromDb(userEmail: string) {
    // //     let options: any = {
    // //         headers: { "Access-Control-Allow-Origin": "*" },
    // //         observe: 'response'
    // //     }
    // //     //return this.http.get<Users>(environment.databaseURL + environment.usersTable + '.json');
    // //     const data = await this.supabase.from('users').select('*').eq('Email', userEmail);

    // //     return data["data"];
    // // }

    // // async updateUserDetailsToDb(user: Users) {
    // //     let options: any = {
    // //         headers: { "Access-Control-Allow-Origin": "*" },
    // //         observe: 'response'
    // //     }
    // //     //return this.http.put(environment.databaseURL + environment.usersTable + '/' + user.UserId + '.json', user, options);
    // //     const data = await this.supabase.from('users').update({
    // //         UserId: user.UserId,
    // //         FirstName: user.FirstName,
    // //         LastName: user.LastName,
    // //         Email: user.Email,
    // //         Permissions: user.Permissions,
    // //         HasChangedPassword: user.HasChangedPassword
    // //     }).eq('Email', user.Email);

    // //     return data;
    // // }


    // // async geHistoryLinesFromDb(pageNumber: number, itemsPerPage: number) {
    // //     let options: any = {
    // //         headers: { "Access-Control-Allow-Origin": "*" },
    // //         observe: 'response'
    // //     }
    // //     //return this.http.get<HistoryLines>(environment.databaseURL + environment.historyLinesTable + '.json');
    // //     const data = await this.supabase.from('history').select('*', { count: 'exact' })
    // //         .order('Id', { ascending: false })
    // //         .range((pageNumber - 1) * itemsPerPage,
    // //             pageNumber * itemsPerPage - 1);

    // //     return data["data"];
    // // }

    // // async postHistoryLinesToDb(historyLine: HistoryLines) {
    // //     let options: any = {
    // //         headers: { "Access-Control-Allow-Origin": "*" },
    // //         observe: 'response'
    // //     }
    // //     //return this.http.post(environment.databaseURL + environment.historyLinesTable + '.json', historyLine, options);
    // //     const data = await this.supabase.from('history')
    // //         .insert({
    // //             Date: historyLine.Date,
    // //             ActionType: historyLine.ActionType,
    // //             MaterialName: historyLine.MaterialName,
    // //             SerialNumber: historyLine.SerialNumber,
    // //             Responsible: historyLine.Responsible
    // //         }).select();

    // //     return data;
    // // }

}



