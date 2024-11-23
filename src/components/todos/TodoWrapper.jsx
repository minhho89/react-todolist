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

  const activeTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
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

  return (
    <section>
      <TodoForm addTodo={addTodo} />
      <h2>My Tasks</h2>
      <ul>
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
      </ul>
      <motion.h2 layout>Completed Tasks</motion.h2>
      <ul>
      <DndContext
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
      </DndContext>
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
