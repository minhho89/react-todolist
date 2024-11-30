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

export const TodoWrapper = () => {
  const { activeTodos , completedTodos, loading, error, addTodo, deleteTodo, editTodo, setActiveTodos, setCompletedTodos } = useTodos();
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  const handleToggleSelection = (setter) => setter((prev) => !prev);

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (active.id !== over.id) {
      
      // setTodos(arrayMove(todos, oldIndex, newIndex));
      const activeTodoOldIndex = activeTodos.findIndex((todo) => todo.id === active.id);
      const activeTodoNewIndex = activeTodos.findIndex((todo) => todo.id === over.id);
      setActiveTodos(arrayMove(activeTodos, activeTodoOldIndex, activeTodoNewIndex));

      const completedTodoOldIndex = completedTodos.findIndex((todo) => todo.id === active.id);
      const completedTodoNewIndex = completedTodos.findIndex((todo) => todo.id === over.id);
      setCompletedTodos(arrayMove(completedTodos, completedTodoOldIndex, completedTodoNewIndex));
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
