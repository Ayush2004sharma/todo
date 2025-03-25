'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return action.payload;
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'DELETE_TODO':
      return state.filter((todo) => todo._id !== action.payload);
    case 'UPDATE_TODO':
      return state.map((todo) =>
        todo._id === action.payload.id ? { ...todo, ...action.payload.data } : todo
      );
    default:
      return state;
  }
};

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  // ✅ Fetch Todos from API on Mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      dispatch({ type: 'SET_TODOS', payload: data });
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // ✅ Add a new task (POST request)
  const addTodo = async (newTodo) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const savedTodo = await response.json();
      dispatch({ type: 'ADD_TODO', payload: savedTodo });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // ✅ Delete a task (DELETE request)
  const deleteTodo = async (id) => {
    try {
      console.log("Deleting Task with ID:", id); // Debugging
  
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }
  
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };
  

  // ✅ Update a task (PUT request)
  const updateTodo = async (id, data) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTodo = await response.json();
      dispatch({ type: 'UPDATE_TODO', payload: { id, data: updatedTodo } });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const getTodoById = (id) => {
    return todos.find((todo) => todo._id === id) || null;
  };
  

  return (
    <TodoContext.Provider value={{ todos, addTodo, deleteTodo, updateTodo, getTodoById }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}