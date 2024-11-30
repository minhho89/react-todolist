import * as TodoRepo from '../repositories/todoRepository';

export const getTodos = async () => {
    return await TodoRepo.getTodos();
}

export const getTodosByStatus = async (isDone) => {
    return await TodoRepo.getTodosByStatus(isDone);
}

export const addTodo = async (todo) => {
    return await TodoRepo.addTodo(todo);
}

export const updateTodo = async (id, todo) => {
    return await TodoRepo.updateTodo(id, todo);
}

export const deleteTodo = async (id) => {
    return await TodoRepo.deleteTodo(id);
}

export const getTodoById = async (id) => {
    return await TodoRepo.getTodoById(id);
}

