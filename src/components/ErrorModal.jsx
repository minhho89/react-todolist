import React from 'react';
import Modal from 'react-modal';
import './ErrorModal.css';

Modal.setAppElement('#root');

export const ErrorModal = ({ isOpen, onRequestClose, message }) => {
  return (
    <Modal
    isOpen={isOpen}
    className="error-modal"
    overlayClassName="error-modal-overlay"
    onRequestClose={onRequestClose}
    >
        <div className="error-modal-content">
            <h2>Error</h2>
            <p>{message}</p>
            <button onClick={onRequestClose}>Close</button>
        </div>
    </Modal>
  )
}
