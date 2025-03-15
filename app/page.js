'use client';
import { useState } from 'react';
import TodoEditor from './components/AddList/page';
import Header from './components/Header/page';
import TodoList from './components/TodoList/page';

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState(null);

  const toggleEditor = (todo = null) => {
    setSelectedTodo(todo);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-6xl flex bg-white shadow-lg rounded-xl overflow-hidden">
          <aside className="w-1/3 p-4 border-r bg-gray-50">
            <div className="h-[500px] overflow-y-auto">
              <TodoList toggleEditor={toggleEditor} />
            </div>
          </aside>

          {/* Ensure Editor Always Exists */}
          <main className="flex-1 p-8">
            {selectedTodo ? (
              <TodoEditor selectedTodo={selectedTodo} toggleEditor={toggleEditor} />
            ) : (
              <p className="text-gray-500">Select a task to edit</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

