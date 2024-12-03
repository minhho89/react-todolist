import api from "../api/axios";

const getTodos = async () => {
    const response = await api.get("/tasks");
    return response.data;
};

const getTodosByStatus = async (isDone, todosPerPage, page) => {
    const response = await api.get(`/tasks/status/${isDone}`, {
        params: {
            limit: todosPerPage,
            page: page
        }
    });
    return response.data;
}

const addTodo = async (todo) => {
    const response = await api.post("/tasks", todo);
    return response.data;
}

const updateTodo = async (id, todo) => {
    const response = await api.put(`/tasks/${id}`, todo);
    return response.data;
}

const deleteTodo = async (id) => { 
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
}

const getTodoById = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
}

const countTaskByStatus = async (isDone) => {
    const response = await api.get(`/tasks/count/${isDone}`);
    return response.data;
}

export { getTodos, addTodo, updateTodo, deleteTodo, getTodoById, getTodosByStatus, countTaskByStatus };