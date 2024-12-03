import React, { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import { todoPropTypes } from "../models/Todo";
import { useTodos } from "../../hooks/useTodos";
import EmptyFinishedImage from "../../assets/img/empty-finished.svg";
import EmptyTodoImage from "../../assets/img/empty-todo.svg";
import { Section } from "./TodoWrapperChildren/Section";
import { TodoSectionContent } from "./TodoWrapperChildren/TodoSectionContent";
import { DraggableTodoList } from "./TodoWrapperChildren/DragableTodoList";
import { TodoForm } from "./TodoForm";
import { LoadingOverlay } from "../commons/LoadingOverlay";
import ReactPaginate from "react-paginate";
import "../commons/Pagination.css";
import { ErrorModal } from "../commons/ErrorModal";

export const TodoWrapper = () => {
  const {
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
    totalActiveTodos,
    todosPerPage,
    totalCompletedTodos,
  } = useTodos();
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  const handlePageClickActive = (event) => {
    console.log("selected page | handlePageClickActive", event.selected);
    setCurrentPageActive(event.selected);
    fetchTodosByPage(false, event.selected);
  };

  const handlePageClickCompleted = (event, status) => {
    console.log(`selected page with isDone as ${status} | handlePageClickCompleted`, event.selected);
    setCurrentPageCompleted(event.selected);
    fetchTodosByPage(true, event.selected);
  };

  const handleToggleSelection = (setter) => setter((prev) => !prev);

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (active.id !== over.id) {
      const activeTodoOldIndex = activeTodos.findIndex(
        (todo) => todo.id === active.id
      );
      const activeTodoNewIndex = activeTodos.findIndex(
        (todo) => todo.id === over.id
      );
      setActiveTodos(
        arrayMove(activeTodos, activeTodoOldIndex, activeTodoNewIndex)
      );

      const completedTodoOldIndex = completedTodos.findIndex(
        (todo) => todo.id === active.id
      );
      const completedTodoNewIndex = completedTodos.findIndex(
        (todo) => todo.id === over.id
      );
      setCompletedTodos(
        arrayMove(completedTodos, completedTodoOldIndex, completedTodoNewIndex)
      );
    }
  };

  return (
  <>
  <LoadingOverlay isLoading={loading} />
  <ErrorModal isOpen={error} onRequestClose={() => setError(null)} message={error} />
  <section>
      <TodoForm addTodo={addTodo} />
      <Section
        title={`Active Tasks (${totalActiveTodos})`}
        isOpen={isMyTasksOpen}
        toggleSection={() => handleToggleSelection(setIsMyTasksOpen)}
      >
        <DraggableTodoList todos={activeTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={activeTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            emptyBannerSrc={EmptyTodoImage}
            emptyBannerMessage="Add more tasks!"
          />
        </DraggableTodoList>
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={Math.ceil(totalActiveTodos / todosPerPage)}
          forcePage={currentPageActive}
          onPageChange={handlePageClickActive}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </Section>

      <hr />
      <Section
        title={`Completed Tasks (${totalCompletedTodos})`}
        isOpen={isCompletedTasksOpen}
        toggleSection={() => handleToggleSelection(setIsCompletedTasksOpen)}
      >
        <DraggableTodoList todos={completedTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={completedTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            emptyBannerSrc={EmptyFinishedImage}
            emptyBannerMessage="No completed tasks!"
          />
        </DraggableTodoList>

        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          forcePage={currentPageCompleted}
          pageCount={Math.ceil(totalCompletedTodos / todosPerPage)} 
          onPageChange={handlePageClickCompleted}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </Section>
    </section>
  </>
    
  );
};

TodoWrapper.propTypes = {
  todos: PropTypes.arrayOf(todoPropTypes),
  setTodos: PropTypes.func,
  addTodo: PropTypes.func,
  deleteTodo: PropTypes.func,
  editTodo: PropTypes.func,
  handleOnDragEnd: PropTypes.func,
};
