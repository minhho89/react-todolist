import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ErrorModal } from "../commons/ErrorModal";
import { TodoInputForm } from "./TodoInputForm";
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
      const updatedTodo = { ...todo, task: inputTask.trim() };
      editTodo && editTodo(updatedTodo);
    } else {
      addTodo && addTodo({ id: uuidv4(), task: inputTask.trim(), isDone: false });
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
  initialTask: PropTypes.shape({
    id: PropTypes.string,
    task: PropTypes.string,
    isDone: PropTypes.bool,
  }),
};