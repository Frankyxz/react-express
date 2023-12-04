import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../js/url";
import Table from "../Components/Table";
const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleAdd = () => {};

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${url}/fetchData/users`);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

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
            // onClick={() => openEditModal(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          <button
            className="btn btn-danger ms-2 d-flex align-items-center p-2"
            // onClick={() => handleDeleteUser(params.row.id)}
          >
            <i className="bx bxs-trash"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        <h2>Accounts</h2>
        <Table rows={users} columns={columns} height={"400px"} />
      </div>
    </>
  );
};

export default Accounts;
