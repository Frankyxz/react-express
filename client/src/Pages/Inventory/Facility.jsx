import React, { useEffect, useState, useRef } from "react";
import MeatSelect from "../../Components/MeatSelect";
import useMeat from "../../customHooks/useMeat";
import useEditModal from "../../customHooks/useEditModal";
import { Button, Modal, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Table from "../../Components/Table";
import BrandSelect from "../../Components/BrandSelect";
import { url } from "../../js/url";
import useTotal from "../../customHooks/useTotal";
import SearchBar from "../../Components/SearchBar";
const Facility = () => {
  const {
    selectedMeatType,
    setSelectedMeatType,
    partsOptions,
    selectedParts,
    setSelectedParts,
    meatBrandOptions,
    meatData,
    meatTypeOptions,
    brandSelect,
    setBrandSelect,
  } = useMeat();

  const [searchQuery, setSearchQuery] = useState("");
  const [meatKg, setMeatKg] = useState("");
  const meatTotal = useTotal(meatData, "kg");
  const [brandTotalKgs, setBrandTotalKgs] = useState({});

  useEffect(() => {
    // calculate total kg of each brands
    const calculateBrandTotalKgs = () => {
      const brandKgs = {};

      for (const item of meatData) {
        if (!brandKgs[item.brandName]) {
          brandKgs[item.brandName] = item.kg;
        } else {
          brandKgs[item.brandName] += item.kg;
        }
      }

      setBrandTotalKgs(brandKgs);
    };

    calculateBrandTotalKgs();
  }, [meatData]);
  const columns = [
    {
      field: "brandId",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "brandName",
      headerName: "Brand Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "kg",
      headerName: "KG",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dateAdded",
      headerName: "Date Added",
      flex: 1,
      headerAlign: "center",
      align: "center",
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
            onClick={() => handleDelete(params.row.id)}
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
        <h2>Facility </h2>

        <MeatSelect
          label="Meat Type"
          options={meatTypeOptions}
          value={selectedMeatType}
          onChange={(e) => setSelectedMeatType(e.target.value)}
        />

        <MeatSelect
          label="Meat Part"
          options={partsOptions}
          value={selectedParts}
          onChange={(e) => setSelectedParts(e.target.value)}
        />
        <BrandSelect
          options={meatBrandOptions}
          value={brandSelect}
          onChange={(e) => setBrandSelect(e.target.value)}
        />

        <TextField
          sx={{ mr: 1, minWidth: 120 }}
          id="outlined-size-small"
          label="Kg"
          variant="outlined"
          type="number"
          size="small"
          value={meatKg}
          onChange={(e) => setMeatKg(e.target.value)}
        />
        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn"
          //   onClick={handleAddItem}
          disabled={
            selectedMeatType === "" ||
            selectedParts == "" ||
            meatKg == "" ||
            brandSelect == ""
          }
        >
          Add
        </button>
        <h3>Total KG: {meatTotal} </h3>
        {Object.keys(brandTotalKgs).map((brandName) => (
          <div key={brandName}>
            {brandName}: {brandTotalKgs[brandName].toFixed(2)} kg
          </div>
        ))}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="table-container mt-3">
          <Table
            rows={meatData.filter(
              (value) =>
                value.brandName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                value.kg.toString().includes(searchQuery.toLowerCase()) ||
                value.dateAdded
                  .toString()
                  .includes(searchQuery.toLowerCase()) ||
                value.id.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            height={"400px"}
          />
        </div>
      </div>
    </>
  );
};

export default Facility;
