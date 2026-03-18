import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SlidersHorizontal } from 'lucide-angular';
import { ProductForm } from '../../components/product-form/product-form';
import { Product } from '../../components/product/product';
@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ProductForm, Product],
  templateUrl: './collection-page.html',
  styleUrl: './collection-page.css',
})
export class CollectionPage {

  readonly SlidersHorizontal = SlidersHorizontal;
  showModal = false;
  selectedProduct: any = null;

  // Static filter state
  filters = {
    category: 'all',
    metalType: 'all',
    priceRange: 'all'
  };

    products = [
    {
      id: '1',
      name: 'Diamond Ring',
      category: 'rings',
      metalType: 'gold',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
    },
    {
      id: '2',
      name: 'Silver Necklace',
      category: 'necklaces',
      metalType: 'silver',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638',
    },
    {
      id: '3',
      name: 'Gold Bracelet',
      category: 'bracelets',
      metalType: 'gold',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d',
    }
  ];

  activeSort = '';

  get sortOption() {
    return this.activeSort;
  }

  set sortOption(value: string) {
    this.activeSort = value;
  }

  sortBy(option: string) {
    this.activeSort = option;
    switch (option) {

      case 'priceLow':
        this.products.sort((a: any, b: any) => a.price - b.price);
        break;

      case 'priceHigh':
        this.products.sort((a: any, b: any) => b.price - a.price);
        break;

      case 'nameAsc':
        this.products.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;

      case 'nameDesc':
        this.products.sort((a: any, b: any) => b.name.localeCompare(a.name));
        break;

      default:
        break;
    }
  }

  openAddProduct() {
    this.selectedProduct = null;
    this.showModal = true;
  }

  onEdit(product: any) {
    this.selectedProduct = { ...product };
    this.showModal = true;
  }

  handleSave(product: any) {
    const existingIndex = this.products.findIndex(p => p.id === this.selectedProduct?.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = { ...this.selectedProduct, ...product };
    } else {
      this.products = [
        ...this.products,
        { id: Date.now().toString(), ...product }
      ];
    }
    this.showModal = false;
    this.selectedProduct = null;
  }

  onApply() {
    console.log('Filters:', this.filters);
  }

  onReset() {
    this.filters = {
      category: 'all',
      metalType: 'all',
      priceRange: 'all'
    };
  }

  onDelete(id: string) {
    console.log('Delete clicked:', id);
  }
}
