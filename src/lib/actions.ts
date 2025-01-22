'use server'

import { revalidatePath } from 'next/cache';
import { TodoCache } from './cache';
import { Todo, TodoFilter } from './types';

const todoCache = new TodoCache();

export async function addTodo(formData: FormData): Promise<Todo> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dueDate = formData.get('dueDate') as string;
  const priority = formData.get('priority') as 'low' | 'medium' | 'high';
  const tags = formData.get('tags') as string;

  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate,
    priority,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    text: title // Using title as text for search functionality
    ,
    date: ''
  };

  await todoCache.set(newTodo);
  revalidatePath('/');
  return newTodo;
}

export async function toggleTodo(id: string): Promise<void> {
  const todo = await todoCache.get(id);
  if (!todo) return;

  const updatedTodo = { ...todo, completed: !todo.completed };
  await todoCache.set(updatedTodo);
  revalidatePath('/');
}

export async function deleteTodo(id: string): Promise<void> {
  await todoCache.delete(id);
  revalidatePath('/');
}

export async function getTodos(filter?: TodoFilter): Promise<Todo[]> {
  let todos = await todoCache.getAll();

  if (filter) {
    todos = todos.filter(todo => {
      // Search term filter
      if (filter.searchTerm && !todo.text.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
        return false;
      }

      // Priority filter
      if (filter.priority && todo.priority !== filter.priority) {
        return false;
      }

      // Completion status filter
      if (filter.completed !== undefined && todo.completed !== filter.completed) {
        return false;
      }

      // Tags filter
      if (filter.tags?.length) {
        const hasMatchingTag = filter.tags.some(tag => 
          todo.tags.some(todoTag => todoTag.toLowerCase() === tag.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      // Date range filter
      if (filter.dateRange) {
        const todoDate = new Date(todo.dueDate || '');
        const start = new Date(filter.dateRange.start);
        const end = new Date(filter.dateRange.end);

        if (isNaN(todoDate.getTime())) return true; // Include todos without due dates
        if (start && todoDate < start) return false;
        if (end && todoDate > end) return false;
      }

      return true;
    });
  }

  return todos;
}
