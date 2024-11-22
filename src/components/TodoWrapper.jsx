import React, { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { EmptyBanner } from "./EmptyBanner";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([
    { id: 1, task: "Learn React" },
    { id: 2, task: "Learn Vue" },
    { id: 3, task: "Learn Angular" },
  ]);

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (id) => {
    console.log("deleteTodo", id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newTask) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, task: newTask.trim() } : todo
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
