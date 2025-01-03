import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    createUser(email: string, password: string, username: string, lastName: string, firstName: string, apartmentNumber: string, status: string): Observable<any> {
        const user = {
            email,
            password,
            username,
            user_metadata: {
                lastName,
                firstName,
                apartmentNumber,
                status
            }
        };

        return this.http.post(`${environment.backendUrl}/register-user`, user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 