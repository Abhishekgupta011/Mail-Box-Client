// ComposeModal.jsx
import React from 'react';
import { Modal } from 'react-bootstrap';
import Mailbox from './Mailbox'; 

const ComposeModal = ({ onClose }) => {
  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Mailbox handleClose={onClose} /> 
      </Modal.Body>
    </Modal>
  );
};

export default ComposeModal;
