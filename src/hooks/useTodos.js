import { useState, useEffect } from "react";
import {
  updateTodo as updateTodoAPI,
  addTodo as addTodoAPI,
  deleteTodo as deleteTodoAPI,
  getTodosByStatus as getTodosByStatusAPI,
} from "../services/todoService";
import { isEqualWithoutFields } from "../utils/isEqual";

export const useTodos = () => {
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageActive, setCurrentPageActive] = useState(0);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(0);
  const todosPerPage = 10;

  const fetchTodosByPage = async (isDone, page) => {
    try {
      setLoading(true);
      const todos = await getTodosByStatusAPI(isDone, todosPerPage, page);
      isDone ?  setCompletedTodos(todos) : setActiveTodos(todos);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetCurrentPage = () => {
    setCurrentPageActive(1);
    setCurrentPageCompleted(1);
  };

  useEffect(() => {
    fetchTodosByPage(false, currentPageActive);
    fetchTodosByPage(true, currentPageCompleted);
  }, [currentPageActive, currentPageCompleted]);

  const addTodo = async (todo) => {
    try {
      setLoading(true);
      await addTodoAPI(todo);
      todo.isDone
        ? setCompletedTodos((prev) => [todo, ...prev])
        : setActiveTodos((prev) => [todo, ...prev]);
      resetCurrentPage();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await deleteTodoAPI(id);
      setActiveTodos((prev) => prev.filter((todo) => todo.id !== id));
      setCompletedTodos((prev) => prev.filter((todo) => todo.id !== id));
      resetCurrentPage();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async (updatedTodo) => {
    const existingTodo =
      activeTodos.find((todo) => todo.id === updatedTodo.id) ||
      completedTodos.find((todo) => todo.id === updatedTodo.id);

    if (isEqualWithoutFields(existingTodo, updatedTodo, ["updatedAt"])) {
      console.log("No changes detected");
      return;
    }
    try {
      setLoading(true);
      await updateTodoAPI(updatedTodo.id, updatedTodo);
      if (existingTodo.isDone !== updatedTodo.isDone) {
        // status change
        if (updatedTodo.isDone) {
          // active -> completed
          setActiveTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== updatedTodo.id)
          );
          setCompletedTodos((prevTodos) => [
            { ...existingTodo, ...updatedTodo },
            ...prevTodos,
          ]);
        } else {
          // completed -> active
          setCompletedTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== updatedTodo.id)
          );
          setActiveTodos((prevTodos) => [
            { ...existingTodo, ...updatedTodo },
            ...prevTodos,
          ]);
        }
      } else {
        // status not changed
        updatedTodo.isDone
          ? setCompletedTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
              )
            )
          : setActiveTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
              )
            );
      }
      resetCurrentPage();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchTodosByPage,
    activeTodos,
    completedTodos,
    loading,
    error,
    addTodo,
    deleteTodo,
    editTodo,
    setActiveTodos,
    setCompletedTodos,
    setCurrentPageActive,
    setCurrentPageCompleted,
    currentPageActive,
    currentPageCompleted,
    todosPerPage,
  };
};
