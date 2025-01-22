export interface Todo {
  date: string | number | Date;
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  text: string;
}

export interface TodoFilter {
  searchTerm?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}