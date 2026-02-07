import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Users } from '../models/users.model';
import { HistoryLines } from '../models/history-lines.model';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import { VehicleDetails } from '../models/vehicle-details.model';

@Injectable()
export class DbFunctionService {

    // Initialize Supabase
    //private supabase: SupabaseClient

    private workerUrl = 'https://your-worker.yourdomain.workers.dev';

    constructor(private http: HttpClient) {
        //this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    async getVehicleDetailsFromDb() {

        // const data = await this.supabase.from('vehicleDetails').select('*').order('Id', { ascending: false }).limit(1); 
        // return data["data"];

        return this.http
            .get<{ data: any[]; error: any }>(`${this.workerUrl}/vehicle-details`)
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error)
                return res.data
            })
    }

    // async postVehicleDetailsToDb(vehicleDetails: VehicleDetails) {

    //     const data = await this.supabase.from('materialLines')
    //         .insert({
    //             VehicleName: vehicleDetails.VehicleName,
    //             VehicleType: vehicleDetails.VehicleType,

    //             KilometersSum: vehicleDetails.KilometersSum,
    //             KteoExpiryDate: vehicleDetails.KteoExpiryDate,
    //             InsuranceExpiryDate: vehicleDetails.InsuranceExpiryDate,
    //             LastServiceDate: vehicleDetails.LastServiceDate,
    //             CarTiresReplacementDate: vehicleDetails.CarTiresReplacementDate,
    //             CarExhaustExpiryDate: vehicleDetails.CarExhaustExpiryDate,
    //             FuelAdditionCost: vehicleDetails.FuelAdditionCost,
    //             FuelAdditionDate: vehicleDetails.FuelAdditionDate,

    //             LastUpdatedAt: vehicleDetails.LastUpdatedAt,
    //             LastUpdatedBy: vehicleDetails.LastUpdatedBy,

    //             Photo: vehicleDetails.Photo,
    //             RegistrationCertificate: vehicleDetails.RegistrationCertificate,
    //         }).select();

    //     return data;
    // }


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



