import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Gem, Search, ShoppingBag, Menu, X, LogOut } from 'lucide-angular';
import { AuthService } from '../../../core/auth/services/auth.service';

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
  readonly LogOut = LogOut;

  authService = inject(AuthService);

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

  showLogoutModal = false;

  confirmLogout() {
    this.showLogoutModal = true;
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  executeLogout() {
    this.authService.logout();
    this.showLogoutModal = false;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}