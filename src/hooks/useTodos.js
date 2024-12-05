import { useReducer, useEffect } from "react";
import {
  updateTodo as updateTodoAPI,
  addTodo as addTodoAPI,
  deleteTodo as deleteTodoAPI,
  getTodosByStatus as getTodosByStatusAPI,
  countTaskByStatus as countTaskByStatusAPI,
} from "../services/todoService";
import { isEqualWithoutFields } from "../utils/isEqual";

const initialState = {
  todos: {
    activeTodos: [],
    completedTodos: []
  },
  pageStatus: {
    loading: true,
    error: null,
  },
  pagination: {
    currentPageActive: 0,
    currentPageCompleted: 0,
    totalActiveTodos: 0,
    totalCompletedTodos: 0,
    todosPerPage: 10
  }  
}

const todoReducer = (state, action) => {
  switch(action.type) {
    case "SET_ACTIVE_TODOS":
      return {
        ...state, 
        todos: { ...state.todos, activeTodos: action.payload }
      };
    case "SET_COMPLETED_TODOS":
      return {
        ...state,
        todos: { ...state.todos, completedTodos: action.payload }
      };
    case "SET_LOADING":
      return {
        ...state,
        pageStatus: { ...state.pageStatus, loading: action.payload }
      };
    case "SET_ERROR":
      return {
        ...state,
        pageStatus: { ...state.pageStatus, error: action.payload }
      };
    case "SET_CURRENT_PAGE_ACTIVE":
      return {
        ...state,
        pagination: { ...state.pagination, currentPageActive: action.payload}
      };
    case "SET_CURRENT_PAGE_COMPLETED":
      return {
        ...state,
        pagination: { ...state.pagination, currentPageCompleted: action.payload }
      };
    case "SET_TOTAL_ACTIVE_TODOS":
      return {
        ...state,
        pagination: { ...state.pagination, totalActiveTodos: action.payload }
      };
    case "SET_TOTAL_COMPLETED_TODOS":
      return {
        ...state,
        pagination: { ...state.pagination, totalCompletedTodos: action.payload }
      }
    default:
      return state
  }
}

export const useTodos = () => {

  const [state, dispatch] = useReducer(todoReducer, initialState);

   // Action Creators
   const setActiveTodos = (todos) => dispatch({ type: "SET_ACTIVE_TODOS", payload: todos });
   const setCompletedTodos = (todos) => dispatch({ type: "SET_COMPLETED_TODOS", payload: todos });
   const setLoading = (loading) => dispatch({ type: "SET_LOADING", payload: loading });
   const setError = (error) => dispatch({ type: "SET_ERROR", payload: error });
   const setCurrentPageActive = (page) => dispatch({ type: "SET_CURRENT_PAGE_ACTIVE", payload: page });
   const setCurrentPageCompleted = (page) => dispatch({ type: "SET_CURRENT_PAGE_COMPLETED", payload: page });

  const fetchTodosByPage = async (isDone, page) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true});
      const todos = await getTodosByStatusAPI(isDone, state.pagination.todosPerPage, page);
      dispatch({
        type: isDone ? "SET_COMPLETED_TODOS" : "SET_ACTIVE_TODOS",
        payload: todos,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  };

  const fetchTotalTodos = async (isDone) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true});
      const total = await countTaskByStatusAPI(isDone);
      dispatch({
        type: isDone ? "SET_TOTAL_COMPLETED_TODOS" : "SET_TOTAL_ACTIVE_TODOS",
        payload: total,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
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
    fetchTodosByPage(false, state.pagination.currentPageActive);
    fetchTodosByPage(true, state.pagination.currentPageCompleted);
    fetchTotalTodos(true);
    fetchTotalTodos(false);
  }, [
    state.pagination.currentPageActive,
    state.pagination.currentPageCompleted,
  ]);

  const addTodo = async (todo) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await addTodoAPI(todo);
      dispatch({ type: todo.isDone ? "SET_COMPLETED_TODOS" : "SET_ACTIVE_TODOS", payload: [todo, ...(todo.isDone ? state.todos.completedTodos : state.todos.activeTodos)] });
      resetCurrentPage();
    } catch (error) {
      console.error(error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteTodo = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await deleteTodoAPI(id);
      dispatch({
        type: "SET_ACTIVE_TODOS",
        payload: state.todos.activeTodos.filter((todo) => todo.id !== id),
      });
      dispatch({
        type: "SET_COMPLETED_TODOS",
        payload: state.todos.completedTodos.filter((todo) => todo.id !== id),
      });
      reCountTotalTodos();
    } catch (error) {
      console.error(error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const editTodo = async (updatedTodo) => {
    const existingTodo =
      state.todos.activeTodos.find((todo) => todo.id === updatedTodo.id) ||
      state.todos.completedTodos.find((todo) => todo.id === updatedTodo.id);
      // Update the updatedAt field to the date object before comparing
      updatedTodo.updatedAt = Date(updatedTodo.updatedAt);
    if (isEqualWithoutFields(existingTodo, updatedTodo, ["updatedAt"])) {
      console.log("No changes detected");
      return;
    }
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await updateTodoAPI(updatedTodo.id, updatedTodo);
      if (existingTodo.isDone !== updatedTodo.isDone) {
        // status change
        if (updatedTodo.isDone) {
          // active -> completed
          dispatch({
            type: "SET_ACTIVE_TODOS",
            payload: state.todos.activeTodos.filter((todo) => todo.id !== updatedTodo.id),
          });
          dispatch({
            type: "SET_COMPLETED_TODOS",
            payload: [{ ...existingTodo, ...updatedTodo }, ...state.todos.completedTodos],
          });
        } else {
          // completed -> active
          dispatch({
            type: "SET_COMPLETED_TODOS",
            payload: state.todos.completedTodos.filter((todo) => todo.id !== updatedTodo.id),
          });
          dispatch({
            type: "SET_ACTIVE_TODOS",
            payload: [{ ...existingTodo, ...updatedTodo }, ...state.todos.activeTodos],
          });
        }
      } else {
        // status not changed
        dispatch({
          type: updatedTodo.isDone ? "SET_COMPLETED_TODOS" : "SET_ACTIVE_TODOS",
          payload: (updatedTodo.isDone ? state.todos.completedTodos : state.todos.activeTodos).map((todo) =>
            todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
          ),
        });
      }
      reCountTotalTodos();
    } catch (error) {
      console.error(error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    todos: state.todos,
    pagination: {
      ...state.pagination,
      setCurrentPageActive,
      setCurrentPageCompleted,
    },
    pageStatus: {
      ...state.pageStatus,
      setError,
      setLoading,
    },
    actions: {
      addTodo,
      deleteTodo,
      editTodo,
      setActiveTodos,
      setCompletedTodos,
      fetchTodosByPage
    },
  };
};
