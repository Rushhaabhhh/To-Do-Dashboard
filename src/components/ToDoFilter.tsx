'use client';

import { useState } from 'react';
import { Todo, TodoFilter } from '../lib/types';
import TodoItem from './ToDoItem';
import { Search, ListFilter, CheckCircle2 } from 'lucide-react';

interface TodoFilterProps {
  initialTodos: Todo[];
}

export default function TodoFilterComponent({ initialTodos }: TodoFilterProps) {
  const [filter, setFilter] = useState<TodoFilter>({});
  const [filteredTodos, setFilteredTodos] = useState(initialTodos);

  const handleFilterChange = (updates: Partial<TodoFilter>) => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);

    const filtered = initialTodos.filter((todo) => {
      // Search filter
      if (
        newFilter.searchTerm &&
        !(
          todo.title.toLowerCase().includes(newFilter.searchTerm.toLowerCase()) ||
          todo.description?.toLowerCase().includes(newFilter.searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      // Priority filter
      if (newFilter.priority && todo.priority !== newFilter.priority) {
        return false;
      }

      // Completion status filter
      if (newFilter.completed !== undefined && todo.completed !== newFilter.completed) {
        return false;
      }

      return true;
    });

    setFilteredTodos(filtered);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Priority */}
        <div className="relative">
          <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            onChange={(e) => handleFilterChange({ priority: e.target.value as 'low' | 'medium' | 'high' })}
            className="pl-10 w-full px-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            onChange={(e) =>
              handleFilterChange({
                completed: e.target.value === '' ? undefined : e.target.value === 'true',
              })
            }
            className="pl-10 w-full px-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </div>

      {/* Filtered Todos */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-gray-600" />
          Filtered Tasks
        </h2>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
