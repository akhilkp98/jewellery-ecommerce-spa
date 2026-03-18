import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, X, Save, Plus } from 'lucide-angular';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit, OnChanges {

  readonly X = X;
  readonly Save = Save;
  readonly Plus = Plus;

  @Input() product: any = null;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  productForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.product && this.productForm) {
      this.productForm.patchValue({
        name: this.product.name,
        category: this.product.category,
        metalType: this.product.metalType,
        weight: this.product.weight || '',
        currentMetalPrice: this.product.currentMetalPrice || '',
        makingCharges: this.product.makingCharges,
        shippingCharges: this.product.shippingCharges || '',
        tax: this.product.tax || 'GST (5%)',
        image: this.product.image,
        availability: this.product.availability !== undefined ? this.product.availability : true
      });
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 ,.-]+$/)]],
      category: [this.product?.category || 'rings', Validators.required],
      metalType: [this.product?.metalType || 'gold', Validators.required],
      weight: [this.product?.weight || '', [Validators.required, Validators.min(0.01), Validators.max(1000), Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
      currentMetalPrice: [this.product?.currentMetalPrice || '', [Validators.required, Validators.min(0.01)]],
      makingCharges: [this.product?.makingCharges || '', [Validators.required, Validators.min(0)]],
      shippingCharges: [this.product?.shippingCharges || '', [Validators.required, Validators.min(0)]],
      tax: [this.product?.tax || 'GST (5%)', Validators.required],
      image: [this.product?.image || '', [Validators.required, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/)]],
      availability: [this.product?.availability !== false]
    });
  }

  get calculatedPrice(): number {
    if (!this.productForm) return 0;
    const value = this.productForm.value;
    const weight = Number(value.weight) || 0;
    const metalPrice = Number(value.currentMetalPrice) || 0;
    const makingCharges = Number(value.makingCharges) || 0;
    const shippingCharges = Number(value.shippingCharges) || 0;
    
    let taxPercent = 0;
    if (value.tax === 'GST (3%)') taxPercent = 3;
    if (value.tax === 'GST (5%)') taxPercent = 5;
    if (value.tax === 'GST (12%)') taxPercent = 12;
    
    const basePrice = weight * metalPrice;
    const taxValue = basePrice * (taxPercent / 100);
    return basePrice + makingCharges + shippingCharges + taxValue;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const v = this.productForm.value;
      const data = {
        ...v,
        price: this.calculatedPrice,
        weight: parseFloat(v.weight) || 0,
        currentMetalPrice: parseFloat(v.currentMetalPrice) || 0,
        makingCharges: parseFloat(v.makingCharges) || 0,
        shippingCharges: parseFloat(v.shippingCharges) || 0
      };
      this.submitForm.emit(data);
    } else {
      this.productForm.markAllAsTouched();
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

  // Getters for template validation
  get f() { return this.productForm.controls; }
}
