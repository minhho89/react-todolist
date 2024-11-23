import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import "./Todo.css";
import { TodoForm } from "./TodoForm";
import { todoPropTypes, updateTodo } from "../models/Todo";


export const Todo = ({ task, deleteTask, editTask }) => {
  const [editMode, setEditMode] = useState(false);
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ 
    id: task.id,
    disabled: false,
    data: {
        handle:true,
    }
   });

  const style = {
    transition, 
    transform: CSS.Transform.toString(transform),
  }

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const hangleToggleFinish = (e) => {
    const updatedTodo = updateTodo(task, { isDone: e.target.checked });
    editTask(updatedTodo);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditMode(true);
  };


  const handleSave = (edittedTask) => {
    const updatedTodo = updateTodo(task, { task: edittedTask.task.trim(), isDone: edittedTask.isDone });
    editTask(updatedTodo);
    setEditMode(false);
  };

  return (
    <li 
    ref={setNodeRef} 
    {...attributes} 
    style={style} 
    className="todo">
         <span {...listeners} className="drag-handle">☰</span>
      <div
        className="task-group">
        <input 
          type="checkbox"
          className="checkbox"
          id={`task-${task.id}`}
          onChange={hangleToggleFinish} 
          checked={task.isDone}
          />
          <label htmlFor={`task-${task.id}`} className="checkbox-label"></label>
            {editMode ? (
              <TodoForm
                initialTask={{ id: task.id, task: task.task, isDone: task.isDone }}
                editTodo={handleSave} />
            ): (
              <div className={task.isDone ? "done" : ""}>{task.task}</div>
            )}
           
      </div>
      <div className="action-group">
        {editMode 
        ? (<></>) 
        :(
           <FontAwesomeIcon
           className="icon edit-icon"
           data-no-dnd
           icon={faEdit}
           onClick={handleEdit}
         />
        )}
        <FontAwesomeIcon
          className="icon trash-icon"
          icon={faTrash}
          data-no-dnd
          onClick={handleDelete}
        />
      </div>
    </li>
  );
};

Todo.propTypes = {
  task: todoPropTypes.isRequired,
  deleteTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
};

