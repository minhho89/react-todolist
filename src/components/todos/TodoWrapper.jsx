import React, { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { EmptyBanner } from "../commons/EmptyBanner";
import PropTypes from "prop-types";
import { todoPropTypes, updateTodo } from "../models/Todo";
import { getTodos } from "../../api/todoService";
import { AnimatePresence, motion } from "motion/react";
import EmptyFinishedImage from "../../assets/img/empty-finished.svg";
import EmptyTodoImage from "../../assets/img/empty-todo.svg";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Section = ({ title, isOpen, toggleSection, children }) => (
  <>
    <motion.h2 layout onClick={toggleSection} className="pointer">
      <div className="accordion">
        <span>{title}</span>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
    </motion.h2>
    {isOpen && children}
  </>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const TodoSectionContent = ({ todos, deleteTodo, editTodo, emptyBannerSrc, emptyBannerMessage }) => (
  todos.length ? (
    <TodoList todos={todos} deleteTodo={deleteTodo} editTodo={editTodo} />
  ) : (
    <EmptyBanner src={emptyBannerSrc} message={emptyBannerMessage} />
  )
);

TodoSectionContent.propTypes = {
  todos: PropTypes.arrayOf(todoPropTypes).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  emptyBannerSrc: PropTypes.string.isRequired,
  emptyBannerMessage: PropTypes.string.isRequired,
};


const DraggableTodoList = ({ todos, onDragEnd, children }) => (
  <DndContext onDragEnd={onDragEnd} collisionDetection={closestCorners}>
    <AnimatePresence>{children}</AnimatePresence>
  </DndContext>
);

DraggableTodoList.propTypes = {
  todos: PropTypes.arrayOf(todoPropTypes).isRequired,
  onDragEnd: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);

  const activeTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  const handleToggleSelection = (setter) =>  setter((prev) => !prev);

  const addTodo = (todo) => {
    setTodos([todo, ...todos]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? updateTodo(todo, updatedTodo) : todo
      )
    );
  };

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      setTodos(arrayMove(todos, oldIndex, newIndex));
    }
  };

  return (
    <section>
      <TodoForm addTodo={addTodo} />
      <Section
        title="My Tasks"
        isOpen={isMyTasksOpen}
        toggleSection={() => handleToggleSelection(setIsMyTasksOpen)}
      >
        <DraggableTodoList todos={activeTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={activeTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            emptyBannerSrc={EmptyTodoImage}
            emptyBannerMessage="Add more tasks!"
          />
        </DraggableTodoList>
      </Section>
      
      <hr />
      <Section
        title="Completed Tasks"
        isOpen={isCompletedTasksOpen}
        toggleSection={() => handleToggleSelection(setIsCompletedTasksOpen)}
      >
        <DraggableTodoList todos={completedTodos} onDragEnd={handleOnDragEnd}>
          <TodoSectionContent
            todos={completedTodos}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            emptyBannerSrc={EmptyFinishedImage}
            emptyBannerMessage="No completed tasks!"
          />
        </DraggableTodoList>
      </Section>
    </section>
  );
};

TodoWrapper.propTypes = {
  todos: PropTypes.arrayOf(todoPropTypes),
  setTodos: PropTypes.func,
  addTodo: PropTypes.func,
  deleteTodo: PropTypes.func,
  editTodo: PropTypes.func,
  handleOnDragEnd: PropTypes.func,
};
