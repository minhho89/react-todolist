import React, { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { EmptyBanner } from "../commons/EmptyBanner";
import PropTypes from 'prop-types';


export const TodoWrapper = () => {
  const [todos, setTodos] = useState([
    { id: '1', task: "Learn React", isDone: true },
    { id: '2', task: "Learn Vue", isDone: false },
    { id: '3', task: "Learn Angular", isDone: false },
  ]);

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newTask, isDone) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, task: newTask.trim(), isDone: isDone } : todo
      )
    );
  };

  const handleOnDragEnd = (event) => {
    const { active, over } = event;
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
          {todos.length !== 0 ? (
            <TodoList
              todos={todos}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ) : (
            <EmptyBanner />
          )}
        </DndContext>
      </ul>
    </section>
  );
};

TodoWrapper.propTypes = {
  todos: PropTypes.array,
  setTodos: PropTypes.func,
  addTodo: PropTypes.func,
  deleteTodo: PropTypes.func,
  editTodo: PropTypes.func,
  handleOnDragEnd: PropTypes.func,
};
