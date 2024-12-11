import { Component } from '@angular/core';
import { UsuariosService as AuthService } from './services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,CommonModule,MatCardModule,MatInputModule,
    MatButtonModule,MatFormFieldModule,RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Login Angular REPL';
  email: string = '';
  password: string = '';
  error: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}  
  async login() {
    try {
      const success = await firstValueFrom(this.authService.login(this.email, this.password));
      if (!success) this.error = true;
      else {
        this.router.navigate(['/dashboard']); 
        this.email = '';
        this.password = '';
        this.error = false;
      };
    } catch (err) {
      this.error = true;
    }
  }
  get isIndex() {return this.router.url == '/'}
}