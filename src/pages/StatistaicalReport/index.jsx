import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
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
import { aggregators } from "react-pivottable/Utilities";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const StatisticalReport = () => {
  const { t, i18n } = useTranslation();
  const [endpoints, setEndpoints] = useState([
    { name: "users", url: "https://pmsor.awashsol.com/api/users/listgrid" },
    {
      name: "budget_request",
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

  const [localizedRenderersUI, setLocalizedRenderersUI] = useState({});
  const [localizedAggregatorTemplates, setLocalizedAggregatorTemplates] =
    useState({});

  // Recalculate renderers and aggregators on language change
  useEffect(() => {
    // Create localized renderers
    const localizedRenderers = Object.keys(TableRenderers).reduce(
      (acc, key) => {
        const localizedKey = t(key); // Translate key
        acc[localizedKey] = TableRenderers[key];
        return acc;
      },
      {}
    );

    // Create localized aggregators
    const localizedAggregatorTemplates = Object.entries(aggregators).reduce(
      (acc, [key, value]) => {
        const localizedKey = t(key); // Translate key
        acc[localizedKey] = value;
        return acc;
      },
      {}
    );

    // Add Plotly renderers if needed
    Object.keys(PlotlyRenderers).forEach((key) => {
      const localizedKey = t(`${key}`);
      if (localizedKey) {
        localizedRenderers[localizedKey] = PlotlyRenderers[key];
      }
    });

    // Update localized state
    setLocalizedRenderersUI(localizedRenderers);
    setLocalizedAggregatorTemplates(localizedAggregatorTemplates);

    // Reset pivot state when language changes
    setPivotState({});
  }, [t, i18n.language]); // Re-run when language changes

  const fetchData = async (endpoint) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEndpoint) fetchData(selectedEndpoint);
  }, [selectedEndpoint]);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    const endpoint = endpoints.find((e) => e.name === selectedValue);
    setPivotState({});
    setSelectedEndpoint(endpoint);
    setShowPivot(true);
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs
          title={t("Report")}
          breadcrumbItem={t("Statistical Report")}
        />
        <Row className="mb-4">
          <Col xs="12" sm="6" lg="4">
            <FormGroup>
              <Label for="api-endpoints">{t("Get Statistical Report")}</Label>
              <Input
                type="select"
                name="endpoint"
                id="api-endpoints"
                value={selectedEndpoint.name || ""}
                onChange={handleSelectionChange}
              >
                <option value="" disabled>
                  {t("Select To Get The Report")}
                </option>
                {endpoints.map((endpoint, index) => (
                  <option key={index} value={endpoint.name}>
                    {t(endpoint.name)}
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
                      key={selectedEndpoint?.name || "default"}
                      data={data}
                      onChange={(state) => setPivotState(state)}
                      renderers={localizedRenderersUI}
                      aggregators={localizedAggregatorTemplates}
                      aggregatorName={
                        Object.keys(localizedAggregatorTemplates)[0]
                      }
                      {...pivotState}
                    />
                  </div>
                </CardBody>
              </Card>
            )
          )}
        </Col>
      </div>
    </div>
  );
};

export default StatisticalReport;
