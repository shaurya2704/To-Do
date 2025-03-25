import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private todos = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }

  // Get all todos for the current user
  getTodos(): Observable<Todo[]> {
    this.fetchTodos();
    return this.todos.asObservable();
  }

  // Fetch todos from Supabase for the current user
  private async fetchTodos() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await this.supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.todos.next(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  // Add a new todo
  async addTodo(title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('todos')
        .insert([{ 
          title, 
          description, 
          priority, 
          completed: false,
          user_id: user.id 
        }]);

      if (error) throw error;
      this.fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }

  // Update a todo
  async updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      this.fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // Delete a todo
  async deleteTodo(id: number): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      this.fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // Toggle todo completion
  async toggleTodo(id: number, completed: boolean): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      this.fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw error;
    }
  }
} 