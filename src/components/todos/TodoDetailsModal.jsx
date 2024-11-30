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
    if (name === 'dueDate') {
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
    setTodoDetails((prev) => ({ ...prev, updatedAt: new Date() }));
    editTodo(todoDetails);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Todo Details"
      className="todo-detail-modal"
      overlayClassName="todo-detail-overlay"
    >
      <h2>Todo Details Modal</h2>
      <div className="modal-content">
      <div className="form-group-row"> 
      <div className="form-group">
          <label>Task:</label>
          <input
            type="text"
            name="title"
            value={todoDetails.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Done:</label>
          <input
            name="isDone"
            type="checkbox"
            checked={todoDetails.isDone}
            onChange={handleCheckboxChange}
          />
        </div>

        <div className="form-group">
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
        </div>
      </div>
        

        <div className="form-group full-width">
          <label>Description:</label>
          <textarea
            name="description"
            value={todoDetails.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={todoDetails.dueDate ? new Date(todoDetails.dueDate).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group-row">
        <div className="form-group">
          <label>Created At:</label>
          <input
            type="text"
            name="createdAt"
            value={todoDetails.createdAt ? new Date(todoDetails.createdAt).toISOString().split('T')[0] : ''}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Updated At:</label>
          <input
            type="text"
            name="updatedAt"
            value={todoDetails.updatedAt ? new Date(todoDetails.updatedAt).toISOString().split('T')[0] : ''}
            readOnly
          />
        </div>
        </div>

        

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};
