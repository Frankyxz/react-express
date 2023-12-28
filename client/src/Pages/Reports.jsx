import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import useCalculateSales from "../customHooks/useCalculateSales";
import useMovingProducts from "../customHooks/useMovingProducts";
import { formattedStartYear, formattedEndYear } from "../js/dates";
import axios from "axios";
import { url } from "../js/url";
const Reports = () => {
  const { today, week, month, year } = useCalculateSales();
  const [yearChart, setYearChart] = useState([]);
  const [sortBy, setSortBy] = useState("Daily");
  const processedProducts = useMovingProducts("Processed", sortBy);
  const rawProducts = useMovingProducts("Raw", sortBy);

  useEffect(() => {
    const fetchForChart = async () => {
      try {
        const res = await axios.get(
          `${url}/reports/sales-chart?start=${formattedStartYear}&end=${formattedEndYear}`
        );
        setYearChart(res.data.sales);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchForChart();
  }, []);
  const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  return (
    <>
      <div className="content-container">
        <h2>Reports</h2>
        <div
          className="card-reports"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
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
                Total Sales Today
              </Typography>
              <Typography variant="h4" component="div">
                {today}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                24 hours.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 290, margin: 1 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                color="text.secondary"
                gutterBottom
              >
                Total Sales This Week
              </Typography>
              <Typography variant="h4" component="div">
                {week}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                7 days.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 290, margin: 1 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                color="text.secondary"
                gutterBottom
              >
                Total Sales This Month
              </Typography>
              <Typography variant="h4" component="div">
                {month}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                4 weeks
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 290, margin: 1 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                color="text.secondary"
                gutterBottom
              >
                Total Sales This Year
              </Typography>
              <Typography variant="h4" component="div">
                {year}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                12 Months
              </Typography>
            </CardContent>
          </Card>
        </div>

        <Card sx={{ width: "99%" }}>
          <div>
            <Typography
              sx={{ fontSize: 20, textAlign: "center", paddingTop: "20px" }}
              variant="h3"
              gutterBottom
            >
              Fast and Slow Moving Products
            </Typography>
            <div className="d-flex justify-content-end mx-3">
              <FormControl sx={{ mx: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Sort By </InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="Brand"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value={"Daily"}>Daily</MenuItem>
                  <MenuItem value={"Weekly"}>Weekly</MenuItem>
                  <MenuItem value={"Monthly"}>Monthly</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <CardContent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <CardContent>
              <PieChart
                series={[
                  {
                    data: processedProducts.map((product) => ({
                      id: product.forReport,
                      value: product.totalSales,
                      label: product.forReport,
                    })),
                  },
                ]}
                width={500}
                height={200}
              />
              <Typography
                sx={{ fontSize: 17, marginLeft: "140px", marginTop: "20px" }}
                variant="h3"
                gutterBottom
              >
                Processed Meat
              </Typography>
            </CardContent>
            <CardContent>
              <PieChart
                series={[
                  {
                    data: rawProducts.map((product) => ({
                      id: product.forReport,
                      value: product.totalSales,
                      label: product.forReport,
                    })),
                  },
                ]}
                width={600}
                height={200}
              />
              <Typography
                sx={{ fontSize: 17, marginLeft: "210px", marginTop: "20px" }}
                variant="h3"
                gutterBottom
              >
                Raw Meat
              </Typography>
            </CardContent>
          </CardContent>
        </Card>

        <Card sx={{ marginTop: "10px", width: "99%" }}>
          <div>
            <Typography
              sx={{ fontSize: 20, textAlign: "center", paddingTop: "20px" }}
              variant="h3"
              gutterBottom
            >
              Line Chart Monthly Sales
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {yearChart.length > 0 ? (
              <LineChart
                xAxis={[{ scaleType: "point", data: months }]}
                series={[{ data: yearChart, area: true, showMark: false }]}
                width={1100}
                height={350}
              />
            ) : (
              <div></div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Reports;
