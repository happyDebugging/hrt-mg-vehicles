import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ManageUsersService {

    private workerUrl = environment.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) {}

    private getHeaders(): HttpHeaders {
        const session = this.authService.getSession();
        const bearerToken = session?.access_token || '';
        return new HttpHeaders({
            'Authorization': `Bearer ${bearerToken}`
        });
    }

    async getUsers(): Promise<any[]> {
        const url = `${this.workerUrl}/admin/users`;

        return this.http
            .get<{ data: any[]; error: any }>(url, { headers: this.getHeaders() })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    async createUser(email: string, firstName: string, lastName: string, permissions: string, vehicleDriven: string): Promise<any> {
        const url = `${this.workerUrl}/admin/users`;
        const body = { email, firstName, lastName, permissions, vehicleDriven };

        return this.http
            .post<{ data: any; error: any }>(url, body, { headers: this.getHeaders() })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    async updateUser(userId: string, email: string, firstName: string, lastName: string, permissions: string, vehicleDriven: string): Promise<any> {
        const url = `${this.workerUrl}/admin/users`;
        const body = { userId, email, firstName, lastName, permissions, vehicleDriven };

        return this.http
            .put<{ data: any; error: any }>(url, body, { headers: this.getHeaders() })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if (res.error) throw new Error(res.error.message || res.error);
                return res.data;
            });
    }

    async deleteUser(userId: string): Promise<any> {
        const url = `${this.workerUrl}/admin/users?userId=${encodeURIComponent(userId)}`;

        return this.http
            .delete<{ success: boolean; error: any }>(url, { headers: this.getHeaders() })
            .toPromise()
            .then(res => {
                if (!res) throw new Error('No response from server');
                if ((res as any).error) throw new Error((res as any).error);
                return res;
            });
    }
}



