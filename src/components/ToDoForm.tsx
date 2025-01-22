'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addTodo } from '@/lib/actions';

export default function AddTodoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);
      await addTodo(formData);
      router.refresh();
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      layout
      className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {!isExpanded ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Task</span>
        </motion.button>
      ) : (
        <motion.form
          action={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 space-y-4"
        >
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <textarea
              name="description"
              placeholder="Task description"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="dueDate"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                name="priority"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="tags"
                placeholder="Add tags (comma-separated)"
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(false)}
              className="py-3 px-4 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}