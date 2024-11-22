import React, { useState } from 'react'

export const TodoInputForm = ({ handleOnFormSubmit }) => {

    const [ task, setTask ] = useState('');

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleOnFormSubmit(task);
        setTask('');
        e.target.reset();
    }
    const handleOnChange = (e) => {
        setTask(e.target.value);
    }
  return (
    <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={task}
          placeholder="Add a new task"
          onChange={handleOnChange}
        />
        <button type="submit">Add</button>
      </form>
  )
}
