import { v4 as uuidv4 } from 'uuid';
import { PropTypes } from 'prop-types';

export const createTodo = (title, priority = 'normal', dueDate = null) => ({
  id: uuidv4(),
  title,
  isDone: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority,
  dueDate,
});

export const updateTodo = (todo, updates) => ({
  ...todo,
  ...updates,
  updatedAt: new Date(),
});

export const todoPropTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isDone: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    updatedAt: PropTypes.instanceOf(Date).isRequired,
    priority: PropTypes.oneOf(['low', 'normal', 'high']).isRequired,
    dueDate: PropTypes.instanceOf(Date),
    };

// Generate some dummy todo items
export const dummyTodos = [
    createTodo('Learn React', 'high', new Date('2023-12-31')),
    createTodo('Learn Vue', 'normal', new Date('2023-11-30')),
    createTodo('Learn Angular', 'low', new Date('2023-10-31')),
    createTodo('Build a Todo App', 'high', new Date('2023-09-30')),
    createTodo('Write Unit Tests', 'normal', new Date('2023-08-31')),
  ];