import { useState, useEffect } from "react";
import {
  getTodos as getTodosAPI,
  updateTodo as updateTodoAPI,
  addTodo as addTodoAPI,
  deleteTodo as deleteTodoAPI,
} from "../api/todoService";
import { isEqualWithoutFields } from "../utils/isEqual";

export const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTodosAPI();
        setTodos(todos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    try {
      await addTodoAPI(todo);
      setTodos([todo, ...todos]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTodoAPI(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const editTodo = async (updatedTodo) => {
    const existingTodo = todos.find((todo) => todo.id === updatedTodo.id);
    if (isEqualWithoutFields(existingTodo, updatedTodo, ["updatedAt"])) {
      console.log("No changes detected");
      return;
    }
    try {
      await updateTodoAPI(updatedTodo.id, updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return { todos, addTodo, deleteTodo, editTodo, setTodos };
};
