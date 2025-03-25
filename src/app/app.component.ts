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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
