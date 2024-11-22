import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Todo.css";

export const Todo = ({ task, deleteTask, editTask }) => {
  const [isDone, setDone] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] = useState(task.task);
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: task.id,
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
    setDone(e.target.checked);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleSave = () => {
    editTask(task.id, newTask.trim());
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
        <input type="checkbox" onChange={hangleToggleFinish} />
        {editMode ? (
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            onBlur={handleSave}
          />
        ) : (
          <div className={isDone ? "done" : ""}>{task.task}</div>
        )}
      </div>
      <div className="action-group">
        {editMode ? (
          <button onClick={handleSave}>Save</button>
        ) : (
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

