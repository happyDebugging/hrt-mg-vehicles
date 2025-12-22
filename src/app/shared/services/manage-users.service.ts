// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { Users } from '../models/users.model';
// import { HistoryLines } from '../models/history-lines.model';
// import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'

// @Injectable()
// export class ManageUsersService {

//     // Initialize Supabase
//     private supabase: SupabaseClient

//     constructor(private http: HttpClient) {

//         this.supabase = createClient(environment.supabaseUrl, environment.supabaseServiceRoleKey
//             , {
//                 auth: {
//                     autoRefreshToken: false,
//                     persistSession: false
//                 }
//             }
//         );
//     }


//     async createUser(newUserEmail: string) {
//         const { data, error } = await this.supabase.auth.admin.createUser({
//             email: newUserEmail,
//             password: (Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000).toString(),
//             //user_metadata: { name: 'Yoda' }
//         });

//         return { data, error };
//     }

//     async updateUser(userΙd: string, userEmail: string) {

//         const { data: user, error } = await this.supabase.auth.admin.updateUserById(
//             userΙd,
//             { email: userEmail }
//         )

//         return { data: user, error };
//     }

//     async deleteUser(userΙd: string) {

//         const { data, error } = await this.supabase.auth.admin.deleteUser(
//             userΙd
//         );

//         return { data, error };
//     }

//     async getUsers() {

//         const data = await this.supabase.from('users').select('*');

//         return data["data"];
//     }

//     async inviteUser(userEmail: string) {

//         const data = await this.supabase.auth.admin.inviteUserByEmail(userEmail);

//         return data["data"];
//     }

// }



