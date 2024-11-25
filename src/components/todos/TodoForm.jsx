import React, { useState } from "react";
import { ErrorModal } from "../commons/ErrorModal";
import { TodoInputForm } from "./TodoInputForm";
import { createTodo, todoPropTypes, updateTodo } from "../models/Todo";
import PropTypes from "prop-types";


export const TodoForm = ({ addTodo, editTodo, initialTask }) => {
  const [todo, setTodo] = useState(initialTask ? initialTask : "");
  const [error, setError] = useState(null);


  const handleOnFormSubmit = (inputTask) => {
    if (inputTask.trim() === "") {
      setError("Task cannot be empty");
      return;
    }
    if (initialTask) {
      const updatedTodo = updateTodo( todo, {task: inputTask.trim()});
      editTodo?.(updatedTodo);
    } else {
      const newTodo = createTodo(inputTask.trim());
      addTodo?.(newTodo);
    }
    setTodo("");
  };

  const handleOnModalClose = () => {
    setError(null);
  };

  return (
    <>
      {error && (
        <ErrorModal
          isOpen={true}
          onRequestClose={handleOnModalClose}
          message={error}
        />
      )}
      <TodoInputForm 
      initialTask={initialTask}
      isEdit={!!initialTask} handleOnFormSubmit={handleOnFormSubmit} />
    </>
  );
};

TodoForm.propTypes = {
  addTodo: PropTypes.func,
  editTodo: PropTypes.func,
  initialTask: PropTypes.shape(todoPropTypes),
};