import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  marca: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'http://localhost:8000/api/productos';

  constructor(private httpClient: HttpClient) {}

  /**
   * Obtener la lista de productos desde la API.
   */
  getProductList(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }

  /**
   * Obtener un producto específico por ID.
   */
  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear un nuevo producto.
   */
  addProduct(data: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, data);
  }

  /**
   * Actualizar un producto existente por ID.
   */
  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar un producto por ID.
   */
  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
