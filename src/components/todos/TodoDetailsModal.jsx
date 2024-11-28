import React from "react";
import Modal from "react-modal";
import "./TodoDetailsModal.css";

export const TodoDetailsModal = ({ isOpen, onClose, todo, editTodo }) => {
  const [todoDetails, setTodoDetails] = React.useState(todo);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'dueDate') {
        setTodoDetails({
            ...todoDetails,
            [name]: new Date(value),
            });
    } else {
        setTodoDetails({
            ...todoDetails,
            [name]: value,
          });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTodoDetails({
      ...todoDetails,
      [name]: checked,
    });
  };

  const handleSave = () => {
    setTodoDetails(prev => ({...prev, updatedAt: new Date()}));
    editTodo(todoDetails);
    onClose();
  }
  
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Todo Details"
      className="todo-detail-modal"
      overlayClassName="todo-detail-overlay"
    >
      <h2>Todo Details Modal</h2>
      <div className="modal-content">
        <label>
          Task:
          <input
            type="text"
            name="task"
            value={todoDetails.task}
            onChange={handleInputChange}
          />
        </label>
        <label>
            Status:
        </label>
        <input
            name="isDone"
            type="checkbox"
            checked={todoDetails.isDone}
            onChange={handleCheckboxChange}
            />
        <label>Priority:</label>
        <select
          name="priority"
          value={todoDetails.priority}
          onChange={handleInputChange}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={todoDetails.dueDate ? todoDetails.dueDate.toISOString().split('T')[0] : ''
          }
          onChange={handleInputChange}  />
        <label>Created At:</label>
        <input
          type="text"
          name="createdAt"
          value={todoDetails.createdAt.toISOString().split('T')[0]}
          readOnly /> 
        <label>Updated At:</label>
        <input
          type="text"
          name="updateAt"
          value={todoDetails.updatedAt.toISOString().split('T')[0]}
          readOnly />

        <div className="modal-actions">
            <button onClick={handleSave}>Save</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};
