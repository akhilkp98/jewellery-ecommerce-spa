import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Gem, Search, ShoppingBag, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.html',
})
export class Header {

  // Icons
  readonly Gem = Gem;
  readonly Search = Search;
  readonly ShoppingBag = ShoppingBag;
  readonly Menu = Menu;
  readonly X = X;

  isMenuOpen = false;

  navItems = ['collections', 'rings', 'necklaces', 'bracelets', 'earrings'];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleNavClick(event: Event, section: string) {
    event.preventDefault();
    this.isMenuOpen = false;

    const el = document.getElementById(section);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  handleSearch() {
    console.log('Search clicked');
  }

  handleCart() {
    console.log('Cart clicked');
  }
}