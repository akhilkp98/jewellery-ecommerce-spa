import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Save, Plus } from 'lucide-angular';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, LucideAngularModule,CommonModule],
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
    price: '',
    image: '',
    description: ''
  };

  ngOnChanges() {
    if (this.product) {
      this.formData = {
        name: this.product.name,
        category: this.product.category,
        metalType: this.product.metalType,
        price: this.product.price,
        image: this.product.image,
        description: this.product.description || ''
      };
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      const data = {
        ...this.formData,
        price: parseFloat(this.formData.price)
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
