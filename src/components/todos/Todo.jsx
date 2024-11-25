import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import "./Todo.css";
import { TodoForm } from "./TodoForm";
import { todoPropTypes, updateTodo } from "../models/Todo";
import { motion } from "framer-motion";

export const Todo = ({ task, deleteTask, editTask }) => {
  const [editMode, setEditMode] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: false,
      data: {
        handle: true,
      },
    });

  const style = {
    transition, 
    transform: CSS.Transform.toString(transform),
  };

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
    const updatedTodo = updateTodo(task, {
      task: edittedTask.task.trim(),
      isDone: edittedTask.isDone,
    });
    editTask(updatedTodo);
    setEditMode(false);
  };

  const handleClick = (e) => {
    // Check if the click is outside of the interactive child elements
    if (
      e.target.tagName !== "INPUT" &&
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "LABEL" &&
      !e.target.classList.contains("icon")
    ) {
      console.log("Main Todo component clicked");
    }
  };

  return (
    <motion.li
      key={task.id}
      initial={{ opacity: 0, y: task.isDone ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        style={style}
        className="todo"
        onClick={handleClick}
      >
        <span {...listeners} className="drag-handle">
          ☰
        </span>
        <div className="task-group">
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
              initialTask={{
                id: task.id,
                task: task.task,
                isDone: task.isDone,
              }}
              editTodo={handleSave}
            />
          ) : (
            <div className={task.isDone ? "done" : ""}>{task.task}</div>
          )}
        </div>
        <div className="action-group">
          {editMode ? (
            <></>
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
      </div>
    </motion.li>
  );
};

Todo.propTypes = {
  task: PropTypes.shape(todoPropTypes).isRequired,
  deleteTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
};
