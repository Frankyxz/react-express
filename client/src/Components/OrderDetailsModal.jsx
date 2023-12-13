import React from "react";
import { Modal, Button } from "react-bootstrap";

const OrderDetailsModal = ({ show, onHide, data }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {data?.customerName} ORDERS - {data?.date}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data?.type === "Raw" ? (
          <>
            <h5 className="text-center">Price set: {data?.setPrice}</h5>
          </>
        ) : null}
        <table className="table">
          <thead>
            <tr>
              {data?.type === "Processed" ? (
                <>
                  <th>Processed Meat Name</th>
                  <th>Price</th>
                  <th>Total Price</th>
                </>
              ) : (
                <>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Brand</th>
                </>
              )}
              <th>KG</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders.map((order, index) => (
              <tr key={index}>
                {data?.type === "Processed" ? (
                  <>
                    <td>{order.brandName}</td>
                    <td>{order.price}</td>
                    <td>{order.totalPrice}</td>
                  </>
                ) : (
                  <>
                    <td>{order.brandId}</td>
                    <td>{order.combined}</td>
                    <td>{order.brandName}</td>
                  </>
                )}
                <td>{order.kg}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="grand-total d-flex justify-content-center">
          Grand Total: {data?.totalPrice}
        </h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
