import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Save, Plus } from 'lucide-angular';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {

  readonly X = X;
  readonly Save = Save;
  readonly Plus = Plus;

  @Input() product: any = null;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    name: '',
    category: 'rings',
    metalType: 'gold',
    weight: '',
    currentMetalPrice: '',
    makingCharges: '',
    shippingCharges: '',
    image: '',
    availability: true,
    tax: 'GST (5%)'
  };

  get calculatedPrice(): number {
    const weight = Number(this.formData.weight) || 0;
    const metalPrice = Number(this.formData.currentMetalPrice) || 0;
    const makingCharges = Number(this.formData.makingCharges) || 0;
    const shippingCharges = Number(this.formData.shippingCharges) || 0;
    
    const basePrice = (weight * metalPrice) + makingCharges + shippingCharges;
    const taxMultiplier = this.formData.tax === 'GST (5%)' ? 0.05 : 0;
    
    return basePrice + (basePrice * taxMultiplier);
  }

  ngOnChanges() {
    if (this.product) {
      this.formData = {
        name: this.product.name,
        category: this.product.category,
        metalType: this.product.metalType,
        weight: this.product.weight || '',
        currentMetalPrice: this.product.currentMetalPrice || '',
        makingCharges: this.product.makingCharges,
        shippingCharges: this.product.shippingCharges || '',
        image: this.product.image,
        availability: this.product.availability !== undefined ? this.product.availability : true,
        tax: this.product.tax || 'GST (5%)'
      };
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      const data = {
        ...this.formData,
        price: this.calculatedPrice,
        weight: parseFloat(this.formData.weight) || 0,
        currentMetalPrice: parseFloat(this.formData.currentMetalPrice) || 0,
        makingCharges: parseFloat(this.formData.makingCharges) || 0,
        shippingCharges: parseFloat(this.formData.shippingCharges) || 0
      };
      this.submitForm.emit(data);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
