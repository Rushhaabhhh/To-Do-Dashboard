import { Suspense } from 'react';
import { getTodos } from '../lib/actions';
import AddTodoForm from '../components/ToDoForm';
import TodoFilter from '../components/ToDoFilter'; 
import TodoItem from '../components/ToDoItem';

export default async function Home() {
  const todos = await getTodos();  

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Todo Dashboard</h1>
      
      <Suspense fallback={<div>Loading form...</div>}>
        <AddTodoForm />
      </Suspense>
      
      <Suspense fallback={<div>Loading filters...</div>}>
        <TodoFilter initialTodos={todos} />
      </Suspense>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </main>
  );
}