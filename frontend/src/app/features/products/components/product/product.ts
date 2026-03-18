import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Edit2, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product { 
   @Input() product: any;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product.id);
  }
}
