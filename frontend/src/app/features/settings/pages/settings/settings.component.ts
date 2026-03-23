import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService, Tax } from '../../../../core/services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private configService = inject(ConfigService);
  private toastr = inject(ToastrService);

  taxForm: FormGroup;
  isLoading = true;

  constructor() {
    this.taxForm = this.fb.group({
      taxes: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadTaxes();
  }

  get taxes() {
    return this.taxForm.get('taxes') as FormArray;
  }

  loadTaxes() {
    this.configService.getTaxes().subscribe({
      next: (taxes) => {
        this.taxes.clear();
        taxes.forEach(tax => {
          this.taxes.push(this.fb.group({
            id: [tax.id],
            name: [tax.name, Validators.required],
            rate: [tax.rate, [Validators.required, Validators.min(0)]],
            isActive: [tax.isActive]
          }));
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load taxes', 'Error');
        this.isLoading = false;
      }
    });
  }

  addTax() {
    this.taxes.push(this.fb.group({
      id: [null],
      name: ['', Validators.required],
      rate: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    }));
  }

  removeTax(index: number) {
    const taxId = this.taxes.at(index).get('id')?.value;
    if (taxId) {
      this.configService.deleteTax(taxId).subscribe({
        next: () => {
          this.taxes.removeAt(index);
          this.toastr.success('Tax deleted successfully');
        },
        error: () => this.toastr.error('Failed to delete tax (it might be in use)', 'Error')
      });
    } else {
      this.taxes.removeAt(index);
    }
  }

  saveTax(index: number) {
    const taxGroup = this.taxes.at(index);
    if (!taxGroup) return;
    
    const taxData = taxGroup.value;
    if (taxGroup.invalid) {
      this.toastr.warning('Please fill out the tax fields properly.', 'Validation Error');
      return;
    }
    
    if (!taxData.id) {
       this.configService.createTax(taxData).subscribe({
         next: (newTax) => {
           taxGroup.patchValue(newTax);
           this.toastr.success('Tax saved!', 'Success');
         },
         error: () => this.toastr.error('Failed to save tax', 'Error')
       });
    } else {
       this.toastr.info('Tax already saved. Deletion/Re-creation is supported.', 'Info');
    }
  }

  updateTaxDetails(index: number) {
    const taxGroup = this.taxes.at(index);
    if (!taxGroup) return;

    const taxData = taxGroup.value;
    if (taxGroup.invalid) {
      this.toastr.warning('Please fill out the tax fields properly.', 'Validation Error');
      return;
    }

    if (taxData.id) {
      this.configService.updateTax(taxData.id, taxData).subscribe({
        next: () => {
          this.toastr.success('Tax configuration updated successfully', 'Success');
          taxGroup.markAsPristine();
        },
        error: () => this.toastr.error('Failed to update tax configuration', 'Error')
      });
    }
  }
}
