import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ErrorModal } from "./ErrorModal";
import { TodoInputForm } from "./TodoInputForm";

export const TodoForm = ({ addTodo }) => {
  const [error, setError] = useState(null);

  const handleOnFormSubmit = (inputTask) => {
    if (inputTask.trim() === "") {
      setError("Task cannot be empty");
      return;
    }
    addTodo({ id: uuidv4(), task: inputTask.trim() });
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
      <TodoInputForm handleOnFormSubmit={handleOnFormSubmit} />
    </>
  );
};
