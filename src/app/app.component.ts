import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from '@supabase/supabase-js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCrown, 
  faUser, 
  faSignOutAlt, 
  faChevronDown,
  faBell,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <div class="app-container">
      <nav class="navbar" [class.scrolled]="isScrolled">
        <div class="navbar-content">
          <div class="navbar-brand">
            <fa-icon [icon]="faCrown" class="brand-icon"></fa-icon>
            <span class="brand-text">{{ title }}</span>
          </div>

          <ng-container *ngIf="currentUser">
            <div class="navbar-center">
              <div class="search-bar">
                <fa-icon [icon]="faSearch" class="search-icon"></fa-icon>
                <input type="text" placeholder="Search tasks..." class="search-input">
              </div>
            </div>
          </ng-container>

          <div class="navbar-menu">
            <ng-container *ngIf="currentUser">
              <div class="notification-bell" (click)="toggleNotifications()">
                <fa-icon [icon]="faBell" class="bell-icon"></fa-icon>
                <span class="notification-badge" *ngIf="notificationCount > 0">{{notificationCount}}</span>
                
                <div class="notifications-menu" *ngIf="showNotifications" [@dropdownAnimation]>
                  <div class="dropdown-header">
                    <strong>Notifications</strong>
                  </div>
                  <div class="dropdown-items">
                    <div *ngIf="notifications.length === 0" class="no-notifications">
                      No new notifications
                    </div>
                    <a *ngFor="let notification of notifications" class="notification-item">
                      <span>{{notification.message}}</span>
                      <span class="notification-time">{{notification.time}}</span>
                    </a>
                  </div>
                </div>
              </div>
            </ng-container>

            <ng-container *ngIf="currentUser; else authButtons">
              <div class="user-profile" (click)="toggleDropdown()">
                <div class="avatar">
                  <fa-icon [icon]="faUser"></fa-icon>
                </div>
                <span class="user-email">{{ currentUser.email }}</span>
                <fa-icon [icon]="faChevronDown" class="dropdown-icon"></fa-icon>

                <div class="dropdown-menu" *ngIf="isDropdownOpen" [@dropdownAnimation]>
                  <div class="dropdown-header">
                    <strong>Account Settings</strong>
                  </div>
                  <div class="dropdown-items">
                    <a class="dropdown-item">
                      <span>Profile</span>
                    </a>
                    <a class="dropdown-item">
                      <span>Settings</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item logout" (click)="logout()">
                      <fa-icon [icon]="faSignOutAlt"></fa-icon>
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              </div>
            </ng-container>

            <ng-template #authButtons>
              <div class="auth-buttons">
                <a routerLink="/login" class="btn btn-login">Login</a>
                <a routerLink="/signup" class="btn btn-signup">Sign Up</a>
              </div>
            </ng-template>
          </div>
        </div>
      </nav>

      <main class="main-content" [@fadeAnimation]>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f8f9fd;
    }

    .app-container {
      min-height: 100vh;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      z-index: 1000;

      &.scrolled {
        height: 60px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      }
    }

    .navbar-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .brand-icon {
        font-size: 1.75rem;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.2));
      }

      .brand-text {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(45deg, #2D3436, #000000);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .navbar-center {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 0 2rem;

      .search-bar {
        position: relative;
        width: 100%;
        max-width: 500px;
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1.25rem 0.75rem 2.75rem;
          border: 1px solid #e1e4e8;
          border-radius: 12px;
          background: #f8f9fa;
          font-size: 0.95rem;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: #007bff;
            background: white;
            box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
          }
        }
      }
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .notification-bell {
      position: relative;
      cursor: pointer;
      padding: 0.5rem;

      .bell-icon {
        font-size: 1.25rem;
        color: #666;
        transition: color 0.2s ease;
      }

      .notification-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #dc3545;
        color: white;
        font-size: 0.75rem;
        padding: 0.15rem 0.4rem;
        border-radius: 10px;
        border: 2px solid white;
      }

      &:hover .bell-icon {
        color: #333;
      }
    }

    .user-profile {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f8f9fa;
      }

      .avatar {
        width: 36px;
        height: 36px;
        background: linear-gradient(45deg, #007bff, #00d2ff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .user-email {
        font-size: 0.95rem;
        color: #333;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dropdown-icon {
        font-size: 0.85rem;
        color: #666;
        transition: transform 0.2s ease;
      }

      &:hover .dropdown-icon {
        transform: rotate(180deg);
      }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      min-width: 220px;
      overflow: hidden;

      .dropdown-header {
        padding: 1rem;
        border-bottom: 1px solid #f1f1f1;
        color: #333;
      }

      .dropdown-items {
        padding: 0.5rem 0;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: #333;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
          background: #f8f9fa;
        }

        &.logout {
          color: #dc3545;
        }
      }

      .dropdown-divider {
        height: 1px;
        background: #f1f1f1;
        margin: 0.5rem 0;
      }
    }

    .auth-buttons {
      display: flex;
      gap: 1rem;

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;

        &.btn-login {
          color: #007bff;
          background: rgba(0, 123, 255, 0.1);

          &:hover {
            background: rgba(0, 123, 255, 0.15);
          }
        }

        &.btn-signup {
          color: white;
          background: linear-gradient(45deg, #007bff, #00d2ff);
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
          }
        }
      }
    }

    .main-content {
      padding: 90px 2rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .notifications-menu {
      position: absolute;
      top: 100%;
      right: -100px;
      margin-top: 0.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      min-width: 300px;
      max-width: 400px;
      overflow: hidden;

      .dropdown-header {
        padding: 1rem;
        border-bottom: 1px solid #f1f1f1;
        color: #333;
      }

      .dropdown-items {
        max-height: 300px;
        overflow-y: auto;
      }

      .no-notifications {
        padding: 1rem;
        text-align: center;
        color: #666;
      }

      .notification-item {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-bottom: 1px solid #f1f1f1;
        transition: background-color 0.2s;
        cursor: pointer;

        &:hover {
          background-color: #f8f9fa;
        }

        .notification-time {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.25rem;
        }
      }
    }

    @media (max-width: 768px) {
      .navbar-content {
        padding: 0 1rem;
      }

      .navbar-center {
        display: none;
      }

      .user-email {
        display: none;
      }

      .auth-buttons {
        .btn {
          padding: 0.6rem 1rem;
        }
      }
    }
  `],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Premium Todo List';
  currentUser: User | null = null;
  isDropdownOpen = false;
  isScrolled = false;
  showNotifications = false;
  notificationCount = 2;
  notifications = [
    { message: 'New task assigned to you', time: '5 minutes ago' },
    { message: 'Task "Project Review" is due tomorrow', time: '1 hour ago' }
  ];

  // Icons
  faCrown = faCrown;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faChevronDown = faChevronDown;
  faBell = faBell;
  faSearch = faSearch;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Add scroll listener
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 20;
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-profile')) {
        this.isDropdownOpen = false;
      }
      if (!target.closest('.notification-bell')) {
        this.showNotifications = false;
      }
    });
  }

  toggleDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showNotifications = false; // Close notifications when opening profile
  }

  toggleNotifications(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showNotifications = !this.showNotifications;
    this.isDropdownOpen = false; // Close profile when opening notifications
  }

  async logout() {
    this.isDropdownOpen = false;
    await this.authService.signOut();
  }
}
