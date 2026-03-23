import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, X, Save, Plus, UploadCloud } from 'lucide-angular';
import { ConfigService, Category, MetalType, Tax } from '../../../../core/services/config.service';
import { ToastrService } from 'ngx-toastr';

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
  readonly UploadCloud = UploadCloud;

  @Input() product: any = null;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  configService = inject(ConfigService);
  private toastr = inject(ToastrService);
  productForm!: FormGroup;
  selectedFiles: { file: File, previewUrl: string }[] = [];
  existingImages: { id?: string, url: string }[] = [];
  deletedImageIds: string[] = [];
  isDragging = false;

  categories: Category[] = [];
  metalTypes: MetalType[] = [];
  taxes: Tax[] = [];

  ngOnInit() {
    this.initForm();
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.configService.getCategories().subscribe(res => this.categories = res);
    this.configService.getMetalTypes().subscribe(res => {
      this.metalTypes = res;
      // If adding new product, set the default metal price
      if (!this.product && this.productForm) {
        const defaultMetal = this.metalTypes.find(m => m.name === this.productForm.get('metalType')?.value);
        if (defaultMetal) {
          this.productForm.patchValue({ currentMetalPrice: defaultMetal.pricePerGram });
        }
      }
    });
    this.configService.getTaxes().subscribe(res => this.taxes = res.filter(t => t.isActive));
  }

  ngOnChanges() {
    if (this.product) {
      // Form might not be initialized yet during first ngOnChanges
      if (this.productForm) {
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

      this.existingImages = this.product.images ? [...this.product.images] : [];
      if (this.existingImages.length === 0 && this.product.image) {
        this.existingImages = [{ url: this.product.image }];
      }
      this.deletedImageIds = [];
      this.selectedFiles = [];
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
      image: [this.product?.image || ''],
      availability: [this.product?.availability !== false]
    });

    // Sync metal price when metalType changes
    this.productForm.get('metalType')?.valueChanges.subscribe(val => {
      const metal = this.metalTypes.find(m => m.name === val);
      if (metal) {
        this.productForm.patchValue({ currentMetalPrice: metal.pricePerGram });
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.handleFiles(event.target.files);
    }
    event.target.value = '';
  }

  private handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const validFiles = files.filter(f => {
       if (!ALLOWED_TYPES.includes(f.type)) {
           this.toastr.error(`${f.name} has invalid format. Only JPG, PNG, WEBP allowed.`, 'Format Error');
           return false;
       }
       if (f.size > MAX_SIZE) {
           this.toastr.error(`${f.name} exceeds 5MB limit.`, 'Size Limits');
           return false;
       }
       return true;
    });

    validFiles.forEach(file => {
      this.selectedFiles.push({
        file,
        previewUrl: URL.createObjectURL(file)
      });
    });
  }

  removeFile(index: number) {
    URL.revokeObjectURL(this.selectedFiles[index].previewUrl); // Prevent memory leak
    this.selectedFiles.splice(index, 1);
  }

  removeExistingImage(index: number) {
    const img = this.existingImages[index];
    if (img.id) {
       this.deletedImageIds.push(img.id);
    }
    this.existingImages.splice(index, 1);
  }

  get calculatedPrice(): number {
    if (!this.productForm) return 0;
    const value = this.productForm.value;
    const weight = Number(value.weight) || 0;
    const metalPrice = Number(value.currentMetalPrice) || 0;
    const makingCharges = Number(value.makingCharges) || 0;
    const shippingCharges = Number(value.shippingCharges) || 0;
    
    let taxPercent = 0;
    const selectedTax = this.taxes.find(t => t.name === value.tax);
    if (selectedTax) taxPercent = selectedTax.rate;
    
    const basePrice = weight * metalPrice;
    const taxableAmount = basePrice + makingCharges;
    const taxValue = taxableAmount * (taxPercent / 100);
    return taxableAmount + shippingCharges + taxValue;
  }

  get priceBreakdown() {
    if (!this.productForm) return null;
    const value = this.productForm.value;
    const weight = Number(value.weight) || 0;
    const metalPrice = Number(value.currentMetalPrice) || 0;
    const makingCharges = Number(value.makingCharges) || 0;
    const shippingCharges = Number(value.shippingCharges) || 0;
    
    let taxPercent = 0;
    const selectedTax = this.taxes.find(t => t.name === value.tax);
    if (selectedTax) taxPercent = selectedTax.rate;
    
    const metalTotal = weight * metalPrice;
    const taxableAmount = metalTotal + makingCharges;
    const taxAmount = taxableAmount * (taxPercent / 100);
    
    return {
      metalTotal,
      makingCharges,
      taxableAmount,
      taxAmount,
      shippingCharges,
      total: taxableAmount + taxAmount + shippingCharges
    };
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    
    const v = this.productForm.value;
    const formData = new FormData();
    
    formData.append('name', v.name);
    formData.append('category', v.category);
    formData.append('metalType', v.metalType);
    formData.append('weight', v.weight.toString());
    formData.append('currentMetalPrice', v.currentMetalPrice.toString());
    formData.append('makingCharges', v.makingCharges.toString());
    formData.append('shippingCharges', v.shippingCharges.toString());
    formData.append('tax', v.tax);
    formData.append('availability', v.availability.toString());
    
    this.selectedFiles.forEach(item => {
      formData.append('images', item.file);
    });

    if (this.deletedImageIds.length > 0) {
      formData.append('deletedImageIds', JSON.stringify(this.deletedImageIds));
    }

    if (this.selectedFiles.length === 0 && this.existingImages.length === 0 && v.image) {
       formData.append('image', v.image);
    }

    this.submitForm.emit(formData);
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
