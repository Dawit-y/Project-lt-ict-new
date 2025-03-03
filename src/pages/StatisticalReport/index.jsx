import React, { useState, useEffect } from "react";
import {
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
import TreeForLists from "../../components/Common/TreeForLists";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useSearchStatisticalReport } from "../../queries/statisticalreport_query";
import "./statistical.css";
import { createSelectOptions } from "../../utils/commonMethods";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const StatisticalReport = () => {
  const { t, i18n } = useTranslation();
  const [endpoints, setEndpoints] = useState([
    { name: "project", url: "" },
    { name: "project_employee", url: "" },
    { name: "project_budget_plan", url: "" },
    { name: "project_budget_expenditure", url: "" },
    { name: "budget_source", url: "" },
    { name: "project_contractor", url: "" },
    { name: "project_payment", url: "" },
    { name: "project_performance", url: "" },
    { name: "project_stakeholder", url: "" },
    { name: "project_supplimentary", url: "" },
    { name: "project_variation", url: "" },
    { name: "project_handover", url: "" },
    { name: "budget_request", url: "" },
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(true);
  const [reportType, setReportType] = useState({});
  const [projectParams, setProjectParams] = useState({});
  const [locationParams, setLocationParams] = useState({});
  const [ReportTypeId, setReportTypeId] = useState(null);
  const [LocationRegionId, setLocationRegionId] = useState(null);
  const [LocationZoneId, setLocationZoneId] = useState(null);
  const [LocationWoredaId, setLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [searchHook, setSearchHook] = useState(null);
  const [textSearchKeys, setTextSearchKeys] = useState([]);
  const [dateSearchKeys, setDateSearchKeys] = useState([]);
  const [dropdownSearchKeys, setDropdownSearchKeys] = useState([]);
  const [include, setInclude] = useState(0)

  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [data, setData] = useState([]);
  const [pivotState, setPivotState] = useState({});
  const [showPivot, setShowPivot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localizedRenderersUI, setLocalizedRenderersUI] = useState({});
  const [localizedAggregatorTemplates, setLocalizedAggregatorTemplates] =
    useState({});
  const { data: budgetYearData } = useFetchBudgetYears();
  const budgetYearOptions = createSelectOptions(
    budgetYearData?.data || [],
    "bdy_id",
    "bdy_name"
  );

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
        const localizedKey = t(key);
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
    setPivotState({});
  }, [t, i18n.language]);

  // Map for endpoints and their respective configurations
  const endpointConfigs = {
    project: {
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prj_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 1,
    },
    project_employee: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "emp_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 2,
    },
    project_budget_plan: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "bpl_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 3,
    },
    project_budget_expenditure: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "pbe_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 4,
    },
    budget_source: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "pbs_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 5,
    },
    project_contractor: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "cni_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 6,
    },
    project_payment: {
      dateKeys: ["payment_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prp_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 7,
    },

    project_performance: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prp_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 8,
    },
    project_stakeholder: {
      textKeys: ["prj_name", "prj_code"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "psh_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 9,
    },
    project_supplimentary: {
      textKeys: ["prj_name", "prj_code"],
      dateKeys: ["payment_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prs_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 10,
    },

    project_variation: {
      textKeys: ["prj_name", "prj_code"],
      dateKeys: ["payment_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prv_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 11,
    },
    project_handover: {
      textKeys: ["prh_name", ""],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prh_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 12,
    },
    budget_request: {
      textKeys: ["prd_name"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      dropdownSearchKeys: [{
        key: "prd_budget_year_id",
        options: budgetYearOptions
      }],
      reportTypeIndex: 13,
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
      setDropdownSearchKeys(config.dropdownSearchKeys)
      setDateSearchKeys(config.dateKeys);
      setReportTypeId(config.reportTypeIndex);
    }
  };

  const handleSearchResults = ({ data, error }) => {
    setLoading(true);
    // setData(data?.data || []);
    setSearchResults(data?.data);
    setPivotState({});
    //setSelectedEndpoint(endpoint);
    setShowPivot(true);
    setSearchError(error);
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
    if (ReportTypeId) {
      updatedParams["report_type"] = ReportTypeId;
    }
    const newParams = { ...updatedParams, ...(include === 1 && { include }) }
    setProjectParams(newParams);
  }, [
    LocationRegionId,
    LocationZoneId,
    LocationWoredaId,
    ReportTypeId,
    locationParams,
    include
  ]);

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
      setLocationParams(config.locationParams || {});
    } else {
      setLocationParams({}); // Clear if no location params
    }
  }, [selectedEndpoint]);

  useEffect(() => {
    setData([]); // Clear data when the endpoint changes
    setPivotState({});
    setShowPivot(false);
  }, [selectedEndpoint]);

  return (
    <div className="page-content">
      <div className="">
        <Breadcrumbs
          title={t("Report")}
          breadcrumbItem={t("Statistical Report")}
        />
        <div className="w-100 d-flex gap-2">
          <TreeForLists
            onNodeSelect={handleNodeSelect}
            setIsAddressLoading={setIsAddressLoading}
            setInclude={setInclude}
          />
          <div className="w-100">
            <Row className="d-flex align-items-center justify-content-center">
              <Col xs="2" sm="2" lg="2">
                <Card className="">
                  <CardBody className="">
                    <>
                      <Input
                        type="select"
                        name="endpoint"
                        id="api-endpoints"
                        value={selectedEndpoint.name}
                        onChange={handleSelectionChange}
                        className=""
                      >
                        <option value="">{t("select_stat")}</option>
                        {endpoints.map((endpoint, index) => (
                          <option key={index} value={endpoint.name}>
                            {t(endpoint.name)}
                          </option>
                        ))}
                      </Input>
                    </>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="10" sm="10" lg="10">
                <AdvancedSearch
                  searchHook={useSearchStatisticalReport}
                  textSearchKeys={textSearchKeys}
                  dateSearchKeys={dateSearchKeys}
                  dropdownSearchKeys={dropdownSearchKeys}
                  checkboxSearchKeys={[]}
                  additionalParams={projectParams}
                  setAdditionalParams={setProjectParams}
                  onSearchResult={handleSearchResults}
                  setIsSearchLoading={setIsSearchLoading}
                  setSearchResults={setSearchResults}
                  setShowSearchResult={setShowSearchResult}
                />
              </Col>
            </Row>
            <Col xs="12">
              {loading || isSearchLoading ? (
                <div className="d-flex justify-content-center">
                  <Spinner color="primary" />
                </div>
              ) : (
                <>
                  {!loading &&
                    showPivot &&
                    searchResults.length > 0 &&
                    showSearchResult && (
                      <Card>
                        <CardBody>
                          <div className="overflow-x-auto">
                            <PivotTableUI
                              key={selectedEndpoint || "default"}
                              data={searchResults}
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
                  {searchResults && searchResults.length === 0 && (
                    <p>
                      {t("statistical_search")}
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

