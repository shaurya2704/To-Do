import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCrown, 
  faStar, 
  faCheckCircle,
  faClock,
  faSignInAlt as faSignIn,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-todo-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss']
})
export class TodoHeaderComponent {
  @Input() completedTasks: number = 0;
  @Input() pendingTasks: number = 0;
  @Input() priorityTasks: number = 0;
  @Output() login = new EventEmitter<void>();
  @Output() signup = new EventEmitter<void>();

  faCrown = faCrown;
  faStar = faStar;
  faCheckCircle = faCheckCircle;
  faClock = faClock;
  faSignIn = faSignIn;
  faUserPlus = faUserPlus;

  private isProcessing = false;

  async onLogin(): Promise<void> {
    if (this.isProcessing) return;
    
    try {
      this.isProcessing = true;
      // Add a small delay to ensure any existing locks are released
      await new Promise(resolve => setTimeout(resolve, 100));
      this.login.emit();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async onSignup(): Promise<void> {
    if (this.isProcessing) return;
    
    try {
      this.isProcessing = true;
      // Add a small delay to ensure any existing locks are released
      await new Promise(resolve => setTimeout(resolve, 100));
      this.signup.emit();
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
