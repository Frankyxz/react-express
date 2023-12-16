import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../js/url";
import Table from "../../Components/Table";
import useData from "../../customHooks/useData";
import { Button, Modal, Form } from "react-bootstrap";
import LoadingModal from "../../Components/LoadingModal";
const Accounts = () => {
  const users = useData("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editOldPass, setEditOldPass] = useState("");
  const [editNewPass, setEditNewPass] = useState("");
  const [editConfirmPass, setEditConfirmPass] = useState("");
  const [formData, setFormData] = useState({
    employeeType: "Admin",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      employeeType: "Admin",
      username: "",
      password: "",
    });
    setEditOldPass("");
    setEditNewPass("");
    setEditConfirmPass("");
  };

  const openEditModal = (user) => {
    setIsEditModalOpen(true);
    setEditUser(user);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    if (formData.username.trim() === "" || formData.password.trim() === "") {
      alert("Input a value");
      return;
    }
    e.preventDefault();

    try {
      closeModal();
      setIsLoading(true);
      const res = await axios.post(`${url}/auth/add-user`, { data: formData });
      users.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const res = await axios.delete(`${url}/auth/delete-user/${id}`);
      users.fetchData();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };
  const columns = [
    {
      field: "userName",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Access Level",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "actions",
      headerName: "Action",
      headerClassName: "custom-cell",
      cellClassName: "cell",
      headerAlign: "center",
      align: "center",
      width: 160,
      renderCell: (params) => (
        <>
          <button
            className="btn btn-success ms-2 d-flex align-items-center p-2"
            onClick={() => openEditModal(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          <button
            className="btn btn-danger ms-2 d-flex align-items-center p-2"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            <i className="bx bxs-trash"></i>
          </button>
        </>
      ),
    },
  ];

  const handleEditUser = async () => {
    // Perform validation checks
    if (
      editOldPass.trim() === "" ||
      editNewPass.trim() === "" ||
      editConfirmPass.trim() === ""
    ) {
      alert("Please fill in all password fields.");
      return;
    }
    if (editNewPass !== editConfirmPass) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await axios.put(`${url}/auth/edit-user/${editUser.id}`, {
        editOldPass,
        editNewPass,
      });
      closeEditModal();
    } catch (error) {
      console.error("Error updating password in Firestore:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="content-container">
        <h2>User Maintenance</h2>
        {isLoading ? <LoadingModal /> : null}
        <div className="btn-add-user mb-2">
          <button className="btn btn-primary" onClick={openModal}>
            Add New User
          </button>
        </div>
        <Table rows={users.dataList} columns={columns} height={"400px"} />
      </div>

      <Modal
        show={isModalOpen}
        onHide={closeModal}
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">Register User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Select
                id="empType"
                name="employeeType"
                aria-label="Floating label select example"
                value={formData.employeeType}
                onChange={handleInputChange}
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </Form.Select>
              <label htmlFor="empType">Type of Employee</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="uname"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <label htmlFor="uname">Username</label>
            </Form.Floating>
            <Form.Floating>
              <Form.Control
                type="password"
                id="pass"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <label htmlFor="pass">Password</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-add-emp" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isEditModalOpen}
        onHide={closeEditModal}
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="edit-uname"
                name="edit-username"
                placeholder="Username"
                value={editUser ? editUser.userName : ""}
                disabled
              />
              <label htmlFor="edit-uname">Username</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                id="edit-old-pass"
                name="edit-old-password"
                placeholder="Password"
                value={editOldPass}
                onChange={(e) => setEditOldPass(e.target.value)}
              />
              <label htmlFor="pass">Old Password</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                id="edit-new-pass"
                name="edit-new-password"
                placeholder="Password"
                value={editNewPass}
                onChange={(e) => setEditNewPass(e.target.value)}
              />
              <label htmlFor="pass">New Password</label>
            </Form.Floating>
            <Form.Floating>
              <Form.Control
                type="password"
                id="edit-confirm-pass"
                name="edit-confirm-password"
                placeholder="Password"
                value={editConfirmPass}
                onChange={(e) => setEditConfirmPass(e.target.value)}
              />
              <label htmlFor="pass">Confirm Password</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEditUser}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Accounts;
