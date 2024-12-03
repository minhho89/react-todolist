import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';


export const TodoInputForm = ({ initialTask,isEdit, handleOnFormSubmit }) => {
    const [ task, setTask ] = useState(initialTask ? initialTask.title : "");
    const [ prevTask, setPrevTask ] = useState(task);

    const inputRef = useRef(null);
    useEffect(() => {
      if (isEdit && inputRef.current) {
        inputRef.current.focus();
      }
    },[isEdit]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleOnFormSubmit(task);
        // In case the user tries to submit an empty task, we will revert the task to its previous value
        if (task.trim() === "") {
          setTask(prevTask);
          return;
        }
        // Reset the form
        setTask('');
        e.target.reset();
    }
    const handleOnChange = (e) => {
        setTask(e.target.value);
    }
  return (
    <form 
    className={isEdit ? 'form-edit' : ''} onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={task}
          placeholder="Add a new task"
          onChange={handleOnChange}
          ref={inputRef}
        />
        <button type="submit">{isEdit ? 'Save' : 'Add'}</button>
      </form>
  )
}

TodoInputForm.propTypes = {
    handleOnFormSubmit: PropTypes.func.isRequired,
    initialTask: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        isDone: PropTypes.bool,
    }),
    isEdit: PropTypes.bool,
}
