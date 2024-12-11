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
import { ProductFormComponent } from './product-form.component';
import { Product, ProductService } from '../services/products.service';
import { ProductViewComponent } from './product-view/product-view.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BorrarConfirmacion } from '../borrar-confirmacion/borrar-confirmacion.component';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-product',
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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  name = localStorage.getItem('auth.user.name');
  avatar = localStorage.getItem('auth.user.avatar');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService, 
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductList().subscribe({
      next: (products) => {
        this.dataSource.data = products;
      },
      error: (err) => {
        console.error('Error al cargar los productos:', err);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  openModal(product: Product | null = null): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (product) {
          this.productService.updateProduct(product.id, result).subscribe(() => {
            this.loadProducts();
          });
        } else {
          this.productService.addProduct(result).subscribe(() => {
            this.loadProducts();
          });
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewProduct(product: Product): void {
    this.dialog.open(ProductViewComponent, {
      width: '500px',
      data: product,
    });
  }

  openBorrar(id: number): void {
    const dialogRef = this.dialog.open(BorrarConfirmacion, {
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct(id);
      } else {
        console.log('Usuario canceló la eliminación.');
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
