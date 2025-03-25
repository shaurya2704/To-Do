import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { SupabaseService, Todo } from '../../services/supabase.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  faPlus = faPlus;
  faFilter = faFilter;
  faSort = faSort;

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';
  showAddForm = false;
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  filterPriority: 'all' | 'low' | 'medium' | 'high' = 'all';
  sortBy: 'date' | 'priority' = 'date';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.supabaseService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.applyFilters();
    });
  }

  async addTodo(): Promise<void> {
    if (this.newTodoTitle.trim()) {
      try {
        await this.supabaseService.addTodo(
          this.newTodoTitle.trim(),
          this.newTodoDescription.trim(),
          this.newTodoPriority
        );
        this.resetForm();
      } catch (error) {
        console.error('Error adding todo:', error);
        // You might want to show an error message to the user here
      }
    }
  }

  resetForm(): void {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoPriority = 'medium';
    this.showAddForm = false;
  }

  async toggleTodo(id: number): Promise<void> {
    try {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        await this.supabaseService.toggleTodo(id, !todo.completed);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      // You might want to show an error message to the user here
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await this.supabaseService.deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      // You might want to show an error message to the user here
    }
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
    try {
      await this.supabaseService.updateTodo(id, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
      // You might want to show an error message to the user here
    }
  }

  applyFilters(): void {
    this.filteredTodos = this.todos
      .filter(todo => {
        if (this.filterStatus === 'active') return !todo.completed;
        if (this.filterStatus === 'completed') return todo.completed;
        return true;
      })
      .filter(todo => {
        if (this.filterPriority === 'all') return true;
        return todo.priority === this.filterPriority;
      })
      .sort((a, b) => {
        if (this.sortBy === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }
}
