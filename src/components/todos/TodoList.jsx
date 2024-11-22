import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Todo } from './Todo';
import PropTypes from 'prop-types';

export const TodoList = ({ todos, deleteTodo, editTodo }) => {

    const handleDeleteTodo = (id) => {
        deleteTodo(id);
    };

    const handleEditTask = (id, newTask, isDone) => {
      editTodo(id, newTask, isDone);
    };

  return (
    <SortableContext items={todos} strategy={verticalListSortingStrategy} >
            {todos.map((todo) => (
                <Todo
                key={todo.id}
                task={{ id: todo.id, task: todo.task, isDone: todo.isDone }}
                deleteTask={handleDeleteTodo}
                editTask={handleEditTask}
                />
            ))}
        </SortableContext>
  )
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      task: PropTypes.string.isRequired,
      isDone: PropTypes.bool,
    })
  ),
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
}