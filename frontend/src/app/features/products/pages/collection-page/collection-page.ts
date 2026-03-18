import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SlidersHorizontal, Search } from 'lucide-angular';
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
  readonly Search = Search;
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
      weight: 3,
      currentMetalPrice: 7500,
      makingCharges: 3500,
      shippingCharges: 100,
      availability: true,
      tax: 'GST (5%)',
      price: 27405,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
    },
    {
      id: '2',
      name: 'Silver Necklace',
      category: 'necklaces',
      metalType: 'silver',
      weight: 15,
      currentMetalPrice: 900,
      makingCharges: 2500,
      shippingCharges: 150,
      availability: true,
      tax: 'GST (5%)',
      price: 16957,
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638',
    },
    {
      id: '3',
      name: 'Gold Bracelet',
      category: 'bracelets',
      metalType: 'gold',
      weight: 8,
      currentMetalPrice: 7500,
      makingCharges: 4000,
      shippingCharges: 100,
      availability: false,
      tax: 'GST (5%)',
      price: 67305,
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d',
    }
  ];

  filteredProducts = [...this.products];

  activeSort = '';

  get sortOption() { return this.activeSort; }
  set sortOption(value: string) { this.activeSort = value; }

  sortBy(option: string) {
    this.activeSort = option;
    if (option === 'priceLow') this.filteredProducts.sort((a: any, b: any) => a.price - b.price);
    else if (option === 'priceHigh') this.filteredProducts.sort((a: any, b: any) => b.price - a.price);
    else if (option === 'nameAsc') this.filteredProducts.sort((a: any, b: any) => a.name.localeCompare(b.name));
    else if (option === 'nameDesc') this.filteredProducts.sort((a: any, b: any) => b.name.localeCompare(a.name));
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
    this.onApply();
    this.showModal = false;
    this.selectedProduct = null;
  }

  onApply() {
    this.activeSort = '';

    this.filteredProducts = this.products.filter(p => {
      const cMatch = this.filters.category === 'all' || p.category === this.filters.category;
      const mMatch = this.filters.metalType === 'all' || p.metalType === this.filters.metalType;
      
      let pMatch = true;
      if (this.filters.priceRange !== 'all') {
        const [min, max] = this.filters.priceRange.split('-').map(n => parseInt(n, 10));
        pMatch = p.price >= min && p.price <= max;
      }
      return cMatch && mMatch && pMatch;
    });
  }

  onReset() {
    this.filters = { category: 'all', metalType: 'all', priceRange: 'all' };
    this.onApply();
  }

  onDelete(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.onApply();
  }
}
