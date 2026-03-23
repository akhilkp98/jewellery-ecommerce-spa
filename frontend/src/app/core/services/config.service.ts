import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tax {
  id?: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface MetalType {
  id: string;
  name: string;
  pricePerGram: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/config`;

  getTaxes(): Observable<Tax[]> {
    return this.http.get<Tax[]>(`${this.apiUrl}/taxes`);
  }

  createTax(tax: Tax): Observable<Tax> {
    return this.http.post<Tax>(`${this.apiUrl}/taxes`, tax);
  }

  updateTax(id: string, updates: Partial<Tax>): Observable<Tax> {
    return this.http.patch<Tax>(`${this.apiUrl}/taxes/${id}`, updates);
  }

  deleteTax(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taxes/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getMetalTypes(): Observable<MetalType[]> {
    return this.http.get<MetalType[]>(`${this.apiUrl}/metal-types`);
  }
}
