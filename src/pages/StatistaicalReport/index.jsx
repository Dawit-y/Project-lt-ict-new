import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  Spinner,
} from "reactstrap";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import TableRenderers from "react-pivottable/TableRenderers";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const StatisticalReport = () => {
  const [endpoints, setEndpoints] = useState([
    { name: "Users", url: "https://pmsor.awashsol.com/api/users/listgrid" },
    {
      name: "Budget Requests",
      url: "https://pmsor.awashsol.com/api/budget_request/listgrid",
    },
    {
      name: "Projects",
      url: "https://pmsor.awashsol.com/api/project/listgrid",
    },
  ]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [data, setData] = useState([]);
  const [pivotState, setPivotState] = useState({});
  const [showPivot, setShowPivot] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch data from selected API endpoint
  const fetchData = async (endpoint) => {
    setLoading(true); // Show loading spinner
    try {
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "value" }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loading spinner after fetching data
    }
  };

  useEffect(() => {
    if (selectedEndpoint) fetchData(selectedEndpoint);
  }, [selectedEndpoint]);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    const endpoint = endpoints.find((e) => e.name === selectedValue);

    // Reset pivotState and update the selected endpoint
    setPivotState({});
    setSelectedEndpoint(endpoint);
    setShowPivot(true);
  };

  return (
    <Container className="page-content">
      <Row className="mb-4">
        <Col xs="12" sm="6" lg="4">
          <FormGroup>
            <Label for="api-endpoints">Get Statistical Report</Label>
            <Input
              type="select"
              name="endpoint"
              id="api-endpoints"
              value={selectedEndpoint.name || ""}
              onChange={handleSelectionChange}
            >
              <option value="" disabled>
                Select To Get The Report
              </option>
              {endpoints.map((endpoint, index) => (
                <option key={index} value={endpoint.name}>
                  {endpoint.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <Col xs="12">
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner color="primary" />
          </div>
        ) : (
          showPivot && (
            <Card>
              <CardBody>
                <div className="overflow-x-auto">
                  <PivotTableUI
                    key={selectedEndpoint.name} // Force re-render when endpoint changes
                    data={data}
                    onChange={(state) => setPivotState(state)}
                    renderers={Object.assign(
                      {},
                      TableRenderers,
                      PlotlyRenderers
                    )}
                    {...pivotState}
                  />
                </div>
              </CardBody>
            </Card>
          )
        )}
      </Col>
    </Container>
  );
};

export default StatisticalReport;
