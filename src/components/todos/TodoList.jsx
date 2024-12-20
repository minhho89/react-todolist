import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Todo } from './Todo';
import { todoPropTypes } from '../models/Todo';
import PropTypes from 'prop-types';

export const TodoList = ({ todos, deleteTodo, editTodo }) => {
  return (
    <SortableContext items={todos} strategy={verticalListSortingStrategy} >
            {todos.map((todo) => (
                <Todo
                key={todo.id}
                task={todo}
                deleteTask={deleteTodo}
                editTask={editTodo}
                />
            ))}
        </SortableContext>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape(todoPropTypes)).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
}