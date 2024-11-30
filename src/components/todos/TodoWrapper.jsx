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
import ReactPaginate from "react-paginate";
import "../commons/Pagination.css";

export const TodoWrapper = () => {
  const {
    activeTodos,
    completedTodos,
    loading,
    error,
    addTodo,
    deleteTodo,
    editTodo,
    setActiveTodos,
    setCompletedTodos,
  } = useTodos();
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);
  // paginations
  const [currentPageActive, setCurrentPageActive] = useState(1);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(1);
  const todosPerpage = 10;

  const offsetActive = currentPageActive * todosPerpage;
  const currentActiveTodos = activeTodos.slice(offsetActive, offsetActive + todosPerpage);

  const offsetCompleted = currentPageCompleted * todosPerpage;
  const currentCompletedTodos = completedTodos.slice(offsetCompleted, offsetCompleted + todosPerpage);

  const handlePageClickActive = (e) => {
    setCurrentPageActive(Number(e.selected));
    
  };

  const handlePageClickCompleted = (e) => {
    setCurrentPageCompleted(Number(e.selected));
  };

  const resetCurrentPage = () => {
    setCurrentPageActive(1);
    setCurrentPageCompleted(1);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section>
      <TodoForm addTodo={addTodo} />
      <Section
        title="My Tasks"
        isOpen={isMyTasksOpen}
        toggleSection={() => handleToggleSelection(setIsMyTasksOpen)}
      >
        <DraggableTodoList todos={currentActiveTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={currentActiveTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            emptyBannerSrc={EmptyTodoImage}
            emptyBannerMessage="Add more tasks!"
          />
        </DraggableTodoList>
        <ReactPaginate
        previousLabel={"←"}
        nextLabel={"→"}
        pageCount={Math.ceil(activeTodos.length / todosPerpage)}
        onPageActive={handlePageClickActive}
        containerClassName={"pagination"}
        activeClassName={"active"}
        />
      </Section>

      <hr />
      <Section
        title="Completed Tasks"
        isOpen={isCompletedTasksOpen}
        toggleSection={() => handleToggleSelection(setIsCompletedTasksOpen)}
      >
        <DraggableTodoList todos={currentCompletedTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={currentCompletedTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            emptyBannerSrc={EmptyFinishedImage}
            emptyBannerMessage="No completed tasks!"
          />
        </DraggableTodoList>

         <ReactPaginate
        previousLabel={"←"}
        nextLabel={"→"}
        pageCount={Math.ceil(completedTodos.length / todosPerpage)}
        onPageChange={handlePageClickCompleted}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
      </Section>
    </section>
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
