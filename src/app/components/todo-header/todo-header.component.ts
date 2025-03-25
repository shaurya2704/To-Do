import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCrown, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-todo-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss']
})
export class TodoHeaderComponent {
  faCrown = faCrown;
  faStar = faStar;
}
