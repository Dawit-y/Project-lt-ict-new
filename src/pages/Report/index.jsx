import React, { useState, useEffect, useMemo } from "react";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import AddressStructureForProject from "../Project/AddressStructureForProject";
import TableContainer from "../../components/Common/TableContainer";
import { useSearchDepartments } from "../../queries/department_query";
import { useSearchUserss } from "../../queries/users_query";
import { useSearchProjects } from "../../queries/project_query";
import { useSearchReport } from "../../queries/report_query";
import Greenbook from "./ReportDesign/Greenbook";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

import { useTranslation } from "react-i18next";
const Report = () => {
  const { t, i18n } = useTranslation();
  const [endpoints, setEndpoints] = useState([
    { name: "project_stat", url: "uuuu" },
    { name: "employee_stat", url: "uuuu" },
    { name: "budget_plan_stat", url: "uuuu" },
    { name: "budget_expenditure_stat", url: "uuuu" },
    { name: "budget_source_stat", url: "uuuu" },
    { name: "budget_contractor_stat", url: "uuuu" },
    { name: "project_payment_stat", url: "uuuu" },
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

  /* const [searchHook, setSearchHook] = useState(() => useSearchProjects); // Default hook
  const [textSearchKeys, setTextSearchKeys] = useState([
    "prj_name",
    "prj_code",
  ]);
  const [dateSearchKeys, setDateSearchKeys] = useState(["prj_date"]);*/

  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map for endpoints and their respective configurations
  const endpointConfigs = {
    project_stat: {
      //textKeys: ["prj_name", "prj_code"],
      //dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 1,
    },
    employee_stat: {
      textKeys: ["prj_name", "prj_code"],
      //dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 2,
    },
    budget_plan_stat: {
      textKeys: ["prj_name", "prj_code"],
      //dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 3,
    },
    budget_expenditure_stat: {
      textKeys: ["prj_name", "prj_code"],
      //dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 4,
    },
    budget_source_stat: {
      textKeys: ["prj_name", "prj_code"],
      //dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 5,
    },
    budget_contractor_stat: {
      textKeys: ["prj_name", "prj_code"],
      //dateKeys: ["prj_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 6,
    },
    project_payment_stat: {
      //textKeys: ["prj_name", "prj_code"],
      dateKeys: ["payment_date"],
      locationParams: {
        region: "prj_location_region_id",
        zone: "prj_location_zone_id",
        woreda: "prj_location_woreda_id",
      },
      reportTypeIndex: 7,
    },
  };
  // Handle dropdown selection
  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedEndpoint(selectedValue);
    const config = endpointConfigs[selectedValue];
    if (config) {
      setSearchHook(() => config.hook);
      setTextSearchKeys(config.textKeys);
      setDateSearchKeys(config.dateKeys);
      setReportTypeId(config.reportTypeIndex);
    }
  };
  const handleSearchResults = ({ data, error }) => {
    setLoading(true);
    // setData(data?.data || []);
    setSearchResults(data?.data);
    //setSearchError(error);
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
    setProjectParams(updatedParams);
  }, [
    LocationRegionId,
    LocationZoneId,
    LocationWoredaId,
    ReportTypeId,
    locationParams,
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
  }, [selectedEndpoint]);
  //START COLUMN
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "prj_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sector_category",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sector_category, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_requested_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_requested_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
    ];
    return baseColumns;
  }, []);
  //END COLUMN
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
            <Row>
              <Col xs="2" sm="2" lg="2">
                <Card className="job-filter">
                  <CardBody>
                    <FormGroup>
                      <Input
                        type="select"
                        name="endpoint"
                        id="api-endpoints"
                        value={selectedEndpoint.name}
                        onChange={handleSelectionChange}
                        className="mb-1"
                      >
                        <option value="">{t("select_stat")}</option>
                        {endpoints.map((endpoint, index) => (
                          <option key={index} value={endpoint.name}>
                            {t(endpoint.name)}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="10" sm="10" lg="10">
                <AdvancedSearch
                  searchHook={useSearchReport}
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
              </Col>
            </Row>
            <Row></Row>
            <Col xs="12">
              {loading || isSearchLoading ? (
                <div className="d-flex justify-content-center">
                  <Spinner color="primary" />
                </div>
              ) : (
                <>
                  {!loading &&
                    searchResults?.length > 0 &&
                    showSearchResult && (
                      <Card>
                        <CardBody>
                          {ReportTypeId === 1 && (
                            <Greenbook
                              columns={columns}
                              data={searchResults}
                              isGlobalFilter={true}
                              isAddButton={true}
                              isCustomPageSize={true}
                              isPagination={true}
                              SearchPlaceholder={t("Results") + "..."}
                              buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                              buttonName={t("add") + " " + t("budget_source")}
                              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                              theadClass="table-info"
                              pagination="pagination"
                              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                            />
                          )}
                          {ReportTypeId === 2 && (
                            <TableContainer
                              columns={columns}
                              data={searchResults}
                              isGlobalFilter={true}
                              isAddButton={true}
                              isCustomPageSize={true}
                              isPagination={true}
                              SearchPlaceholder={t("Results") + "..."}
                              buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                              buttonName={t("add") + " " + t("budget_source")}
                              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                              theadClass="table-light"
                              pagination="pagination"
                              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                            />
                          )}
                        </CardBody>
                      </Card>
                    )}
                  {searchResults && searchResults.length === 0 && (
                    <p>
                      {t(
                        "No data available for the selected endpoint please select related Address Structure and click Search button."
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
export default Report;
