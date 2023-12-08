import React from "react";
import { Button, Modal } from "react-bootstrap";

const NotifModal = ({ isOpen, onClose, val, count, details }) => {
  if (val == 1) {
    return (
      <>
        <Modal
          show={isOpen}
          onHide={onClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Notication</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            There are incoming {count} box <br />
            <table>
              <thead>
                <tr>
                  <th>Meat Type</th>
                  <th>Total KG</th>
                </tr>
              </thead>
              <tbody>
                {details &&
                  Object.values(details).map((group) => (
                    <tr key={`${group.meatType}_${group.brandName}`}>
                      <td>
                        {group.meatType} ({group.brandName})
                      </td>
                      <td>{group.totalKg}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={onClose}>
              Okay
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else if (val == 2) {
    return (
      <>
        <Modal
          show={isOpen}
          onHide={onClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>CANCELED</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onClose}>
              Okay
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
};

export default NotifModal;
