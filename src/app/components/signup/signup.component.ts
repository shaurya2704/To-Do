import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="signup-container">
      <h2>Sign Up</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            [(ngModel)]="email"
            name="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            [(ngModel)]="password"
            name="password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
        <button type="submit" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Sign Up' }}
        </button>
      </form>
      <p>
        Already have an account?
        <a routerLink="/login">Login</a>
      </p>
    </div>
  `,
  styles: [`
    .signup-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background: white;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
    }

    .error {
      color: red;
      margin-bottom: 1rem;
    }

    p {
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    const result = await this.authService.signUp(this.email, this.password);
    
    if (result.success) {
      this.router.navigate(['/todos']);
    } else {
      this.error = result.error || 'An error occurred during sign up';
    }

    this.loading = false;
  }
} 