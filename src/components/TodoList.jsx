import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Todo } from './Todo';

export const TodoList = ({ todos, deleteTodo, editTodo }) => {
    const handleDeleteTodo = (id) => {
        deleteTodo(id);
    };

    const handleEditTask = (id, newTask) => {
      editTodo(id, newTask);
    };

  return (
    <SortableContext items={todos} strategy={verticalListSortingStrategy} >
            {todos.map((todo) => (
                <Todo
                key={todo.id}
                task={{ id: todo.id, task: todo.task }}
                deleteTask={handleDeleteTodo}
                editTask={handleEditTask}
                />
            ))}
        </SortableContext>
  )
}
