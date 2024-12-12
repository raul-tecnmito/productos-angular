import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserViewComponent } from '../user-view/user-view.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BorrarConfirmacion } from '../borrar-confirmacion/borrar-confirmacion.component';
import { UsuariosService } from '../services/usuarios.service';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'name', 'email', 'image_url', 'actions'];
  dataSource = new MatTableDataSource<User>();

  name = localStorage.getItem('auth.user.name');
  avatar = localStorage.getItem('auth.user.avatar');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService, 
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
      },
      error: (err) => {
        console.error('Error al cargar los usuarios:', err);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  usuarios(): void {
    this.router.navigate(['/usuarios']);
  }

  productos(): void {
    this.router.navigate(['/dashboard']);
  }

  cerrarSesion(): void {
    this.usuariosService.logout().subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          console.log('Error al cerrar sesión');
        }
      },
      error: (err) => {
        console.error('Error al intentar cerrar sesión: ', err);
      },
    });
  }

  openModal(user: User | null = null): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (user) {
          this.userService.updateUser(user.id!, result).subscribe(() => {
            this.loadUsers();
          });
        } else {
          this.userService.createUser(result).subscribe(() => {
            this.loadUsers();
          });
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewUser(user: User): void {
    this.dialog.open(UserViewComponent, {
      width: '500px',
      data: user,
    });
  }

  openBorrar(id: number): void {
    const dialogRef = this.dialog.open(BorrarConfirmacion, {
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(id);
      } else {
        console.log('Usuario canceló la eliminación.');
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
