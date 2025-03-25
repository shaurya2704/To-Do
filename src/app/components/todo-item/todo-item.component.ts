import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Todo } from '../../services/supabase.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<{id: number, updates: Partial<Todo>}>();

  faTrash = faTrash;
  faEdit = faEdit;
  faCheck = faCheck;
  faTimes = faTimes;

  isEditing = false;
  editedTitle = '';
  editedDescription = '';
  editedPriority: 'low' | 'medium' | 'high' = 'medium';

  startEditing(): void {
    this.editedTitle = this.todo.title;
    this.editedDescription = this.todo.description || '';
    this.editedPriority = this.todo.priority;
    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editedTitle.trim()) {
      this.update.emit({
        id: this.todo.id,
        updates: {
          title: this.editedTitle.trim(),
          description: this.editedDescription.trim(),
          priority: this.editedPriority
        }
      });
      this.isEditing = false;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // amber
      case 'low':
        return '#22c55e'; // green
      default:
        return '#6b7280'; // gray
    }
  }
}
