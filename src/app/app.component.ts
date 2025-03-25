import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">{{ title }}</div>
      <div class="navbar-menu">
        <ng-container *ngIf="currentUser; else authButtons">
          <span class="user-email">{{ currentUser.email }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </ng-container>
        <ng-template #authButtons>
          <a routerLink="/login" class="nav-link">Login</a>
          <a routerLink="/signup" class="nav-link">Sign Up</a>
        </ng-template>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-link {
      color: #007bff;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-link:hover {
      background-color: #f8f9fa;
    }

    .user-email {
      color: #666;
      margin-right: 1rem;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .main-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'Premium Todo List';
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async logout() {
    await this.authService.signOut();
  }
}
