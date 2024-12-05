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
  const { todos, pagination, pageStatus, actions } = useTodos();
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  const handlePageClickActive = (event) => {
    pagination.setCurrentPageActive(event.selected);
    actions.fetchTodosByPage(false, event.selected);
  };

  const handlePageClickCompleted = (event, status) => {
    pagination.setCurrentPageCompleted(event.selected);
    actions.fetchTodosByPage(true, event.selected);
  };

  const handleToggleSelection = (setter) => setter((prev) => !prev);

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (active.id !== over.id) {
      const activeTodoOldIndex = todos.activeTodos.findIndex(
        (todo) => todo.id === active.id
      );
      const activeTodoNewIndex = todos.activeTodos.findIndex(
        (todo) => todo.id === over.id
      );
      actions.setActiveTodos(
        arrayMove(todos.activeTodos, activeTodoOldIndex, activeTodoNewIndex)
      );

      const completedTodoOldIndex = todos.completedTodos.findIndex(
        (todo) => todo.id === active.id
      );
      const completedTodoNewIndex = todos.completedTodos.findIndex(
        (todo) => todo.id === over.id
      );
      actions.setCompletedTodos(
        arrayMove(todos.completedTodos, completedTodoOldIndex, completedTodoNewIndex)
      );
    }
  };

  return (
  <>
  <LoadingOverlay isLoading={pageStatus.loading} />
  <ErrorModal isOpen={pageStatus.error} onRequestClose={() => actions.setError(null)} message={pageStatus.error} />
  <section>
      <TodoForm addTodo={actions.addTodo} />
      <Section
        title={`Active Tasks (${pagination.totalActiveTodos})`}
        isOpen={isMyTasksOpen}
        toggleSection={() => handleToggleSelection(setIsMyTasksOpen)}
      >
        <DraggableTodoList todos={todos.activeTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={todos.activeTodos}
            deleteTodo={actions.deleteTodo}
            editTodo={actions.editTodo}
            emptyBannerSrc={EmptyTodoImage}
            emptyBannerMessage="Add more tasks!"
          />
        </DraggableTodoList>
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={Math.ceil(pagination.totalActiveTodos / pagination.todosPerPage)}
          forcePage={pagination.currentPageActive}
          onPageChange={handlePageClickActive}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </Section>

      <hr />
      <Section
        title={`Completed Tasks (${pagination.totalCompletedTodos})`}
        isOpen={isCompletedTasksOpen}
        toggleSection={() => handleToggleSelection(setIsCompletedTasksOpen)}
      >
        <DraggableTodoList todos={todos.completedTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={todos.completedTodos}
            deleteTodo={actions.deleteTodo}
            editTodo={actions.editTodo}
            emptyBannerSrc={EmptyFinishedImage}
            emptyBannerMessage="No completed tasks!"
          />
        </DraggableTodoList>

        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          forcePage={pagination.currentPageCompleted}
          pageCount={Math.ceil(pagination.totalCompletedTodos / pagination.todosPerPage)} 
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
  todos: PropTypes.shape({
    activeTodos: PropTypes.arrayOf(PropTypes.shape(todoPropTypes)),
    completedTodos: PropTypes.arrayOf(PropTypes.shape(todoPropTypes)),
  }),
  pagination: PropTypes.shape({
    currentPageActive: PropTypes.number,
    currentPageCompleted: PropTypes.number,
    totalActiveTodos: PropTypes.number,
    totalCompletedTodos: PropTypes.number,
    todosPerPage: PropTypes.number,
  }),
  pageStatus: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
  }),
  actions: PropTypes.shape({
    fetchTodosByPage: PropTypes.func,
    setActiveTodos: PropTypes.func,
    setCompletedTodos: PropTypes.func,
    addTodo: PropTypes.func,
    deleteTodo: PropTypes.func,
    editTodo: PropTypes.func,
    setError: PropTypes.func,
  }),
};

