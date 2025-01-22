'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, CheckCircle2, Trash2 } from 'lucide-react';
import { Todo } from '../lib/types';
import { deleteTodo, toggleTodo } from '@/lib/actions';

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      setError(null);
      await toggleTodo(todo.id);
    } catch {
      setError('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await deleteTodo(todo.id);
    } catch {
      setError('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-50 text-red-700 ring-red-600/20',
      medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    };
    return colors[priority] || 'text-gray-700';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`
        p-6 mb-4 bg-white rounded-lg shadow-md transition-all
        ${isLoading ? 'opacity-50' : ''}
        cursor-pointer
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className="focus:outline-none"
          >
            <CheckCircle2
              className={`w-6 h-6 ${
                todo.completed ? 'text-green-500 fill-green-500' : 'text-gray-300'
              }`}
            />
          </motion.button>

          <div className="flex-1">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>

            <AnimatePresence>
              {isExpanded && todo.description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-gray-600 mt-2"
                >
                  {todo.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(todo.priority)}`}>
            {todo.priority}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="flex flex-wrap gap-3">
              {todo.dueDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}

              {todo.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}