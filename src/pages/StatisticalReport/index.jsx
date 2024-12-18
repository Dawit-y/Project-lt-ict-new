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
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import AddressStructureForProject from "../Project/AddressStructureForProject";
const PlotlyRenderers = createPlotlyRenderers(Plot);

import { useSearchDepartments } from "../../queries/department_query";
import { useSearchUserss } from "../../queries/users_query";
import { useSearchProjects } from "../../queries/project_query";

const StatisticalReport = () => {
  const { t, i18n } = useTranslation();
  const [endpoints, setEndpoints] = useState([
    { name: "users", url: "https://pmsor.awashsol.com/api/users/listgrid" },
    {
      name: "department",
      url: "https://pmsor.awashsol.com/api/department/listgrid",
    },
    {
      name: "Projects",
      url: "https://pmsor.awashsol.com/api/project/listgrid",
    },
  ]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [locationParams, setLocationParams] = useState({});
  const [LocationRegionId, setLocationRegionId] = useState(null);
  const [LocationZoneId, setLocationZoneId] = useState(null);
  const [LocationWoredaId, setLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  //const { data, isLoading, error, isError, refetch } =  useState("");

  const [searchHook, setSearchHook] = useState(() => useSearchProjects); // Default hook
  const [textSearchKeys, setTextSearchKeys] = useState([
    "prj_name",
    "prj_code",
  ]);
  const [dateSearchKeys, setDateSearchKeys] = useState(["prj_date"]);

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

  // Map for endpoints and their respective configurations
  const endpointConfigs = {
    users: {
      hook: useSearchUserss,
      textKeys: ["usr_phone_number", "usr_full_name", "sector_name"],
      dateKeys: [],
      locationParams: {
        region: "usr_region_id",
        zone: "usr_zone_id",
        woreda: "usr_woreda_id",
      },
    },
    department: {
      hook: useSearchDepartments,
      textKeys: ["dep_name_en", "dep_code"],
      dateKeys: [],
      locationParams: {
        region: "dep_available_at_region",
        zone: "dep_available_at_zone",
        woreda: "dep_available_at_woreda",
      },
    },
    Projects: {
      hook: useSearchProjects,
      textKeys: ["prj_name", "prj_code"],
      dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
    },
  };

  // Handle dropdown selection
  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedEndpoint(selectedValue);
    setPivotState({});
    setShowPivot(false);

    const config = endpointConfigs[selectedValue];
    if (config) {
      setSearchHook(() => config.hook);
      setTextSearchKeys(config.textKeys);
      setDateSearchKeys(config.dateKeys);
    }
  };

  const handleSearchResults = ({ data, error }) => {
    setLoading(true);
    setData(showSearchResult ? searchResults?.data : data?.data || []);
    //setSearchResults(data);
    setPivotState({});
    //setSelectedEndpoint(endpoint);
    setShowPivot(true);
    //setSearchError(error);
    setShowSearchResult(true);
    setLoading(false);
  };

  // Update projectParams dynamically based on selected endpoint and location params
  useEffect(() => {
    const updatedParams = {};

    if (LocationRegionId && locationParams.region) {
      updatedParams[locationParams.region] = LocationRegionId;
    }
    if (LocationZoneId && locationParams.zone) {
      updatedParams[locationParams.zone] = LocationZoneId;
    }
    if (LocationWoredaId && locationParams.woreda) {
      updatedParams[locationParams.woreda] = LocationWoredaId;
    }

    setProjectParams(updatedParams);
  }, [LocationRegionId, LocationZoneId, LocationWoredaId, locationParams]);

  // Handle node selection dynamically based on selected endpoint's location keys
  const handleNodeSelect = (node) => {
    if (node.level === "region") {
      setLocationRegionId(node.id);
      setLocationZoneId(null); // Clear dependent states
      setLocationWoredaId(null);
    } else if (node.level === "zone") {
      setLocationZoneId(node.id);
      setLocationWoredaId(null); // Clear dependent state
    } else if (node.level === "woreda") {
      setLocationWoredaId(node.id);
    }

    if (showSearchResult) {
      setShowSearchResult(false);
    }
  };

  // Update locationParams when selected endpoint changes
  useEffect(() => {
    if (selectedEndpoint && endpointConfigs[selectedEndpoint]) {
      const config = endpointConfigs[selectedEndpoint];
      setLocationParams(config.locationParams || {}); // Use endpoint's location params
    } else {
      setLocationParams({}); // Clear if no location params
    }
  }, [selectedEndpoint]);

  useEffect(() => {
    setData([]); // Clear data when the endpoint changes
    setPivotState({});
    setShowPivot(false);
  }, [selectedEndpoint]);

  console.log("dataaaaaaaa", data);

  return (
    <div className="page-content">
      <div className="">
        <Breadcrumbs
          title={t("Report")}
          breadcrumbItem={t("Statistical Report")}
        />
        <div className="w-100 d-flex gap-2">
          <AddressStructureForProject
            onNodeSelect={handleNodeSelect}
            setIsAddressLoading={setIsAddressLoading}
          />
          <div className="w-100">
            <AdvancedSearch
              searchHook={searchHook}
              textSearchKeys={textSearchKeys}
              dateSearchKeys={dateSearchKeys}
              dropdownSearchKeys={[]}
              checkboxSearchKeys={[]}
              additionalParams={projectParams}
              setAdditionalParams={setProjectParams}
              onSearchResult={handleSearchResults}
              setIsSearchLoading={setIsSearchLoading}
              setSearchResults={setSearchResults}
              setShowSearchResult={setShowSearchResult}
            />
            <Row className="mb-4">
              <Col xs="12" sm="6" lg="4">
                <FormGroup>
                  <Label for="api-endpoints">
                    {t("Get Statistical Report")}
                  </Label>
                  <Input
                    type="select"
                    name="endpoint"
                    id="api-endpoints"
                    value={selectedEndpoint.name}
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
                <>
                  {!loading && showPivot && data?.length > 0 && (
                    <Card>
                      <CardBody>
                        <div className="overflow-x-auto">
                          <PivotTableUI
                            key={selectedEndpoint || "default"}
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
                  )}
                  {(!data || data.length === 0) && (
                    <p>
                      {t(
                        "No data available for the selected endpoint please select related Address Structure."
                      )}
                    </p>
                  )}
                </>
              )}
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StatisticalReport;
