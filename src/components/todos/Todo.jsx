import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import "./Todo.css";
import { TodoForm } from "./TodoForm";
import { TodoDetailsModal } from "./TodoDetailsModal";
import { todoPropTypes, updateTodo } from "../models/Todo";
import { motion } from "framer-motion";
import { isEqualWithoutFields } from "../../utils/isEqual";

export const Todo = ({ task, deleteTask, editTask }) => {
  const [editMode, setEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    const updatedTodo = updateTodo(task, {
      isDone: e.target.checked,
      updateAt: new Date(),
    });
    editTask(updatedTodo);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleSave = (edittedTask) => {
    if (isEqualWithoutFields(edittedTask, task, ["updateAt"])) {
      setEditMode(false);
      return;
    }
    const updatedTodo = updateTodo(task, {
      title: edittedTask.task.trim(),
      isDone: edittedTask.isDone,
    });
    const updatedTodoWithDate = updateTodo(updatedTodo, {
      updateAt: new Date(),
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
      setIsDetailModalOpen(true);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <>
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
            <label
              htmlFor={`task-${task.id}`}
              className="checkbox-label"
            ></label>
            {editMode ? (
              <TodoForm
                initialTask={{
                  id: task.id,
                  task: task.title,
                  isDone: task.isDone,
                }}
                editTodo={handleSave}
              />
            ) : (
              <div className={task.isDone ? "done" : ""}>{task.title}</div>
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
      <TodoDetailsModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        todo={task}
        editTodo={editTask}
      />
    </>
  );
};

Todo.propTypes = {
  task: PropTypes.shape(todoPropTypes).isRequired,
  deleteTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
};
