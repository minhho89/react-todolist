import React from 'react';
import PropTypes from 'prop-types';
import { TodoList } from '../TodoList';
import { EmptyBanner } from '../../commons/EmptyBanner';
import { todoPropTypes } from '../../models/Todo';

export const TodoSectionContent = ({
    todos = [],
    deleteTodo,
    editTodo,
    emptyBannerSrc,
    emptyBannerMessage,
  }) =>
    todos.length ? (
      <TodoList todos={todos} deleteTodo={deleteTodo} editTodo={editTodo} />
    ) : (
      <EmptyBanner src={emptyBannerSrc} message={emptyBannerMessage} />
    );
  
  TodoSectionContent.propTypes = {
    todos: PropTypes.arrayOf(todoPropTypes).isRequired,
    deleteTodo: PropTypes.func.isRequired,
    editTodo: PropTypes.func.isRequired,
    emptyBannerSrc: PropTypes.string.isRequired,
    emptyBannerMessage: PropTypes.string.isRequired,
  };