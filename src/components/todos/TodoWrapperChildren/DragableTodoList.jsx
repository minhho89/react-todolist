import React from "react";
import PropTypes from "prop-types";
import { todoPropTypes } from "../../models/Todo";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { AnimatePresence } from "motion/react";

export const DraggableTodoList = ({ todos, onDragEnd, children }) => (
  <DndContext onDragEnd={onDragEnd} collisionDetection={closestCorners}>
    <AnimatePresence>{children}</AnimatePresence>
  </DndContext>
);

DraggableTodoList.propTypes = {
  todos: PropTypes.arrayOf(todoPropTypes),
  onDragEnd: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
