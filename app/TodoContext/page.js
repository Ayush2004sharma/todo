'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

const generateId = () => crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: generateId(), ...action.payload }];
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'UPDATE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, ...action.payload.data } : todo
      );
    case 'SET_TODOS':
      return action.payload;
    default:
      return state;
  }
};

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      dispatch({ type: 'SET_TODOS', payload: storedTodos });
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }, [todos]);

  const addTodo = (newTodo) => {
    dispatch({ type: 'ADD_TODO', payload: newTodo });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const updateTodo = (id, data) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, data } });
  };

  // ✅ Now fetching from state instead of `localStorage`
  const getTodoById = (id) => {
    return todos.find((todo) => todo.id === id) || null;
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
