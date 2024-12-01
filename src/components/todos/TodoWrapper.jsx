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
    todosPerPage,
  } = useTodos();
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  const handlePageClickActive = (event, status) => {
    console.log("selected page | handlePageClickActive", event.selected);
    //setCurrentPageActive(Number(event.selected));
  };

  const handlePageClickCompleted = (event, status) => {
    console.log(`selected page with isDone as ${status} | handlePageClickCompleted`, event.selected);
    fetchTodosByPage(status === 'completed' ? true : false, event.selected);
    //setCurrentPageCompleted(Number(event.selected));
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
          key="active"
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={Math.ceil(100 / todosPerPage)} // TODO: impl. count api to get total count
          onPageChange={(event) => handlePageClickCompleted(event, 'active')}
          onPageActive={(event) => handlePageClickCompleted(event,'active')}
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
          key="completed"
          previousLabel={"←"}
          nextLabel={"→"}
          pageCount={Math.ceil(100 / todosPerPage)} // TODO: impl. count api to get total count
          onPageChange={(event) => handlePageClickCompleted(event,'completed')}
          onPageActive={(event) => handlePageClickActive(event,'completed')}
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
