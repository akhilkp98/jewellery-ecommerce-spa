import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';

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
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  currentImageIndex = 0;

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.product.images?.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.product.images?.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product.id);
  }
}
