import React, { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { EmptyBanner } from "../commons/EmptyBanner";
import PropTypes from "prop-types";
import { dummyTodos, todoPropTypes, updateTodo } from "../models/Todo";
import { AnimatePresence, motion } from "motion/react";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState(dummyTodos);
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  const activeTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  const addTodo = (todo) => {
    setTodos([todo, ...todos]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? updateTodo(todo, updatedTodo) : todo
      )
    );
  };

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (over === null) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
    }
  };

  const handleIsMyTasksOpen = () => setIsMyTasksOpen(prev => !prev);
  const handleIsCompletedTasksOpen = () => setIsCompletedTasksOpen(prev => !prev);

  return (
    <section>
      <TodoForm addTodo={addTodo} />
      <h2 onClick={handleIsMyTasksOpen} className="pointer">
        <div className="accordion">
          <span>My Tasks</span>
          <span>{isMyTasksOpen ? "▲" : "▼"}</span>
        </div>
      </h2>
      <ul>
        {
          isMyTasksOpen &&
          <DndContext
          onDragEnd={handleOnDragEnd}
          collisionDetection={closestCorners}
        >
          <AnimatePresence>
          {activeTodos.length !== 0 ? (
            <TodoList
              todos={activeTodos}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ) : (
            <EmptyBanner />
          )}
          </AnimatePresence>
        </DndContext>
        }
      </ul>
      <hr />
      <motion.h2 
      layout
      onClick={handleIsCompletedTasksOpen}
      className="pointer"
      >
        <div className="accordion">
          <span>Completed Tasks</span>
          <span>{isCompletedTasksOpen ? "▲" : "▼"}</span>
        </div>
        </motion.h2>
      <ul>
      {isCompletedTasksOpen && <DndContext
          onDragEnd={handleOnDragEnd}
          collisionDetection={closestCorners}
        >
        <AnimatePresence>
        {completedTodos.length !== 0 ? (
          <TodoList
            todos={completedTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ) : (
          <EmptyBanner />
        )}
        </AnimatePresence>
      </DndContext>}
      </ul>
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
