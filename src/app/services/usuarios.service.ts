import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  email: string;
  name: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly API_BASE_URL = 'http://localhost:8000/api';
  private readonly LOGIN_ENDPOINT = `${this.API_BASE_URL}/login`;
  private readonly LOGOUT_ENDPOINT = `${this.API_BASE_URL}/logout`;

  constructor(private httpClient: HttpClient) {}

  /**
   * Iniciar sesión y almacenar información del usuario en localStorage.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   */
  login(email: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.httpClient.post<{ token: string; user: Usuario }>(this.LOGIN_ENDPOINT, { email, password }).subscribe({
        next: (response) => {
          const { token, user } = response;

          localStorage.setItem('auth.token', token);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('auth.user.id', user.id.toString());
          localStorage.setItem('auth.user.email', user.email);
          localStorage.setItem('auth.user.name', user.name);
          if (user.image_url) localStorage.setItem('auth.user.avatar', user.image_url);

          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          observer.next(false);
          console.log(err);
          observer.complete();
        },
      });
    });
  }

  /**
   * Cerrar sesión: llamar al logout en la API y limpiar los datos del localStorage.
   */
  logout(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const token = localStorage.getItem('auth.token');
      if (!token) {
        observer.next(false);
        observer.complete();
        return;
      }

      this.httpClient.post(this.LOGOUT_ENDPOINT, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          this.clearAuthData();
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('Error en el logout: ', err);
          this.clearAuthData();
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  /**
   * Limpiar todos los datos de autenticación del localStorage.
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth.token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('auth.user.id');
    localStorage.removeItem('auth.user.email');
    localStorage.removeItem('auth.user.name');
    localStorage.removeItem('auth.user.role');
    localStorage.removeItem('auth.user.avatar');
  }
}