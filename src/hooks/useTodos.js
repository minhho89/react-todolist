import { useState, useEffect } from "react";
import {
  updateTodo as updateTodoAPI,
  addTodo as addTodoAPI,
  deleteTodo as deleteTodoAPI,
  getTodosByStatus as getTodosByStatusAPI,
  countTaskByStatus as countTaskByStatusAPI,
} from "../services/todoService";
import { isEqualWithoutFields } from "../utils/isEqual";

export const useTodos = () => {
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageActive, setCurrentPageActive] = useState(0);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(0);
  const [totalActiveTodos, setTotalActiveTodos] = useState(0);
  const [totalCompletedTodos, setTotalCompletedTodos] = useState(0);
  const todosPerPage = 10;

  const fetchTodosByPage = async (isDone, page) => {
    try {
      setLoading(true);
      const todos = await getTodosByStatusAPI(isDone, todosPerPage, page);
      isDone ? setCompletedTodos(todos) : setActiveTodos(todos);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalTodos = async (isDone) => {
    try {
      setLoading(true);
      const total = await countTaskByStatusAPI(isDone);
      isDone ? setTotalCompletedTodos(total) : setTotalActiveTodos(total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const reCountTotalTodos = () => {
    fetchTotalTodos(true);
    fetchTotalTodos(false);
  };

  const resetCurrentPage = () => {
    setCurrentPageActive(0);
    setCurrentPageCompleted(0);
  };

  useEffect(() => {
    fetchTodosByPage(false, currentPageActive);
    fetchTodosByPage(true, currentPageCompleted);
    fetchTotalTodos(true);
    fetchTotalTodos(false);
  }, [
    currentPageActive,
    currentPageCompleted,
    totalActiveTodos,
    totalCompletedTodos,
  ]);

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
      reCountTotalTodos();
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
      // Update the updatedAt field to the date object before comparing
      updatedTodo.updatedAt = Date(updatedTodo.updatedAt);
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
      reCountTotalTodos();
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
    setError,
    addTodo,
    deleteTodo,
    editTodo,
    setActiveTodos,
    setCompletedTodos,
    currentPageActive,
    setCurrentPageActive,
    currentPageCompleted,
    setCurrentPageCompleted,
    todosPerPage,
    totalActiveTodos,
    totalCompletedTodos,
  };
};
