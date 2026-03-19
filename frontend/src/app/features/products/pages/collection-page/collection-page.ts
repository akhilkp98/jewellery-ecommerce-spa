import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SlidersHorizontal, Search, Trash2 } from 'lucide-angular';
import { ProductForm } from '../../components/product-form/product-form';
import { Product } from '../../components/product/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ProductForm, Product],
  templateUrl: './collection-page.html',
  styleUrl: './collection-page.css',
})
export class CollectionPage implements OnInit {
  private toastr = inject(ToastrService);

  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Search = Search;
  readonly Trash2 = Trash2;
  showModal = false;
  selectedProduct: any = null;

  showDeleteModal = false;
  productToDelete: string | null = null;
  isSaving = false;

  filters = {
    category: 'all',
    metalType: 'all',
    priceRange: 'all'
  };

  filteredProducts: any[] = [];
  activeSort = 'latest';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.filters, this.activeSort).subscribe({
      next: (data) => {
        this.filteredProducts = data;
        
        // Ensure "latest" sort logic is strictly applied in frontend in case backend hasn't restarted with new logic
        if (this.activeSort === 'latest') {
          this.filteredProducts.sort((a, b) => (b.productId || 0) - (a.productId || 0));
        }
      },
      error: (err) => console.error(err)
    });
  }

  get sortOption() { return this.activeSort; }
  set sortOption(value: string) { this.activeSort = value; }

  sortBy(option: string) {
    this.activeSort = option;
    this.loadProducts();
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
    if (this.isSaving) return;
    this.isSaving = true;

    if (this.selectedProduct?.id) {
      this.productService.updateProduct(this.selectedProduct.id, product).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully', 'Success');
          this.filters = { category: 'all', metalType: 'all', priceRange: 'all' };
          this.activeSort = 'latest';
          this.loadProducts();
          this.showModal = false;
          this.selectedProduct = null;
          this.isSaving = false;
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Update failed! Please check your inputs.', 'Error');
          this.isSaving = false;
        }
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.toastr.success('Product added successfully', 'Success');
          this.filters = { category: 'all', metalType: 'all', priceRange: 'all' };
          this.activeSort = 'latest';
          this.loadProducts();
          this.showModal = false;
          this.selectedProduct = null;
          this.isSaving = false;
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Creation failed! Please check your inputs.', 'Error');
          this.isSaving = false;
        }
      });
    }
  }

  onApply() {
    this.loadProducts();
  }

  onReset() {
    this.filters = { category: 'all', metalType: 'all', priceRange: 'all' };
    this.activeSort = 'latest';
    this.loadProducts();
  }

  confirmDelete(id: string) {
    this.productToDelete = id;
    this.showDeleteModal = true;
  }

  executeDelete() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully', 'Success');
          this.loadProducts();
          this.showDeleteModal = false;
          this.productToDelete = null;
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Deletion failed!', 'Error');
          this.showDeleteModal = false;
          this.productToDelete = null;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }
}
