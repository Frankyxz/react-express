import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useTotal from "../customHooks/useTotal";
import useFetchMeatPart from "../customHooks/useFetchMeatParts";
import useStockLevelStore from "../stores/useStockLevelStore";
import StockLevel from "../Components/StockLevel";
import useMeat from "../customHooks/useMeat";
import useData from "../customHooks/useData";
import axios from "axios";
import { url } from "../js/url";
const Dashboard = () => {
  const meat = useMeat();
  const { levels, setLevels } = useStockLevelStore();
  const { raw, process } = levels;
  const [kiloDelivered, setKiloDelivered] = useState(0);
  const orders = useData("orders-list");
  const pending = useData("pending-list");
  const processedMeatList = useData("processed-meat");
  const { meatPartTotals } = useFetchMeatPart();

  useEffect(() => {
    const getLevels = async () => {
      try {
        const res = await axios.get(`${url}/dashboard/levels`);
        setLevels({
          raw: res.data.raw,
          process: res.data.process,
        });
      } catch (error) {
        console.error("Error  ", error);
      }
    };
    const deliveredToday = async () => {
      try {
        const res = await axios.get(`${url}/dashboard/delivered-today`);
        setKiloDelivered(res.data.kiloDelivered);
      } catch (error) {
        console.error("Error  ", error);
      }
    };
    deliveredToday();
    getLevels();
  }, []);
  const rawColumns = [
    {
      field: "meatType",
      headerName: "Raw Meat",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "kg",
      headerName: "Total (kg)",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        const { value } = params;
        const average = value < raw[2]?.value;
        const reOrder = value < raw[1]?.value;
        const critical = value < raw[0]?.value;

        if (critical) {
          return "Critical";
        } else if (reOrder) {
          return "Low Level";
        } else if (average) {
          return "Average";
        }

        return "Stable";
      },
    },
  ];

  const rawRows = Object.entries(meatPartTotals).map(([meatType, kg]) => ({
    id: meatType,
    meatType,
    kg,
    status: kg,
  }));

  const overAll = useTotal(rawRows, "kg");
  const processedColumns = [
    {
      field: "processedMeat",
      headerName: "Processed Meat",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity",
      headerName: "Total (kg)",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        const { value } = params;
        const average = value < process[2]?.value;
        const reOrder = value < process[1]?.value;
        const critical = value < process[0]?.value;

        if (critical) {
          return "Critical";
        } else if (reOrder) {
          return "Low Level";
        } else if (average) {
          return "Average";
        }

        return "Stable";
      },
    },
  ];
  const processedRows = processedMeatList.dataList.map((processed) => ({
    id: processed.id,
    processedMeat: processed.processedMeat,
    quantity: processed.quantity,
    status: processed.quantity,
  }));

  return (
    <>
      <div className="content-container">
        <h2>Dashboard</h2>

        <div
          className="card-reports"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Card sx={{ minWidth: 290, margin: 1 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                color="text.secondary"
                gutterBottom
              >
                Overall Raw Meat KG
              </Typography>
              <Typography variant="h4" component="div">
                {overAll}
              </Typography>
            </CardContent>
          </Card>

          <Link to="/admin/delivery-history" style={{ textDecoration: "none" }}>
            <Card sx={{ minWidth: 290, margin: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 17 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Delivered Today
                </Typography>
                <Typography variant="h4" component="div">
                  {kiloDelivered}
                </Typography>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/manage-orders" style={{ textDecoration: "none" }}>
            <Card sx={{ minWidth: 290, margin: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 17 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Orders
                </Typography>
                <Typography variant="h4" component="div">
                  {orders.dataList.length}
                </Typography>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/pending-payment" style={{ textDecoration: "none" }}>
            <Card sx={{ minWidth: 290, margin: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 17 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Pending Payment
                </Typography>
                <Typography variant="h4" component="div">
                  {pending.dataList.length}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card sx={{ width: "99.5%" }}>
          <div>
            <Typography
              sx={{ fontSize: 20, textAlign: "center", paddingTop: "20px" }}
              variant="h3"
              gutterBottom
            >
              Stock Levels
            </Typography>
          </div>
          <CardContent>
            <div className="stock-lvl d-flex ">
              <StockLevel rows={rawRows} columns={rawColumns} type={"Raw"} />
              <StockLevel
                rows={processedRows}
                columns={processedColumns}
                type={"Process"}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
