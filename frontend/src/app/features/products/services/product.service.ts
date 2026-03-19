import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters?: any, sort?: string): Observable<any[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.category && filters.category !== 'all') params = params.set('category', filters.category);
      if (filters.metalType && filters.metalType !== 'all') params = params.set('metalType', filters.metalType);
      if (filters.priceRange && filters.priceRange !== 'all') params = params.set('priceRange', filters.priceRange);
    }
    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
