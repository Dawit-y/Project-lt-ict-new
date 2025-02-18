import React, { useEffect, useMemo, useState, useRef } from "react";
import Spinners from "../../components/Common/Spinner";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectPlans } from "../../queries/projectplan_query";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Input } from "reactstrap";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import AddressStructureForProject from "../Project/AddressStructureForProject";
import GanttModal from "./GanttModal";
import { useFetchBudgetYears } from "../../queries/budgetyear_query"

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectPlanList = () => {
  document.title = "Project Plan List";

  const { t } = useTranslation();
  const [modal1, setModal1] = useState(false);
  const [projectPlan, setProjectPlan] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [include, setInclude] = useState(0);

  const { data, isLoading, error, isError, refetch } = useState("");
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const { data: budgetYearData } = useFetchBudgetYears();
  const budgetYearMap = useMemo(() => {
    return (
      budgetYearData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [budgetYearData]);

  const toggleViewModal = () => setModal1(!modal1);

  // When selection changes, update selectedRows
  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  // Filter by marked rows
  const filterMarked = () => {
    if (gridRef.current) {
      gridRef.current.api.setRowData(selectedRows);
    }
  };
  // Clear the filter and show all rows again
  const clearFilter = () => {
    gridRef.current.api.setRowData(showSearchResults ? results : data);
  };
  //START FOREIGN CALLS

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  useEffect(() => {
    setProjectParams({
      ...(prjLocationRegionId && {
        prj_location_region_id: prjLocationRegionId,
      }),
      ...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
      ...(prjLocationWoredaId && {
        prj_location_woreda_id: prjLocationWoredaId,
      }),
      ...(include === 1 && { include }),
    });
  }, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);

  const handleNodeSelect = (node) => {
    if (node.level === "region") {
      setPrjLocationRegionId(node.id);
      setPrjLocationZoneId(null); // Clear dependent states
      setPrjLocationWoredaId(null);
    } else if (node.level === "zone") {
      setPrjLocationZoneId(node.id);
      setPrjLocationWoredaId(null); // Clear dependent state
    } else if (node.level === "woreda") {
      setPrjLocationWoredaId(node.id);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        headerName: t("pld_name"),
        field: "pld_name",
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          return truncateText(params.data.pld_name, 30) || "-";
        },
      },
      {
        headerName: t("pld_project_id"),
        field: "pld_project_id",
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          return truncateText(params.data.pld_project_id, 30) || "-";
        },
      },
      {
        headerName: t("pld_budget_year_id"),
        field: "pld_budget_year_id",
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          return budgetYearMap[params.data.pld_budget_year_id] || "-";
        },
      },
      {
        headerName: t("pld_start_date_gc"),
        field: "pld_start_date_gc",
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          return truncateText(params.data.pld_start_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("pld_end_date_gc"),
        field: "pld_end_date_gc",
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          return truncateText(params.data.pld_end_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("view_gantt"),
        field: t("view_gantt"),
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          return (
            <Button
              outline
              type="button"
              color="primary"
              size="sm"
              onClick={() => {
                setProjectPlan(params.data);
                toggleViewModal()
              }}
            >
              {t("view_gannt")}
            </Button>
          )
        },
      },
    ];
    return baseColumns;
  }, [t]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <GanttModal isOpen={modal1} toggle={toggleViewModal} projectPlan={projectPlan} />
      <div className="page-content">
        <div>
          <Breadcrumbs />
          <div className="w-100 d-flex gap-2">
            <AddressStructureForProject
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
            />
            <div className="w-100">
              <AdvancedSearch
                searchHook={useSearchProjectPlans}
                textSearchKeys={["pld_name"]}
                dateSearchKeys={["pld_start_date_gc"]}
                additionalParams={projectParams}
                setAdditionalParams={setProjectParams}
                onSearchResult={handleSearchResults}
                setIsSearchLoading={setIsSearchLoading}
                setSearchResults={setSearchResults}
                setShowSearchResult={setShowSearchResult}
              />
              {isLoading || isSearchLoading ? (
                <Spinners />
              ) : (
                <div
                  className="ag-theme-alpine"
                  style={{ height: "100%", width: "100%" }}
                >
                  <Row className="mb-3">
                    <Col sm="12" md="6">
                      <Input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setQuickFilterText(e.target.value)}
                        className="mb-2"
                        style={{ width: "50%", maxWidth: "400px" }}
                      />
                    </Col>
                    <Col sm="12" md="6" className="text-md-end"></Col>
                  </Row>

                  <div>
                    <AgGridReact
                      ref={gridRef}
                      rowData={
                        showSearchResult
                          ? searchResults?.data
                          : data?.data || []
                      }
                      columnDefs={columns}
                      pagination={true}
                      paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                      paginationPageSize={10}
                      quickFilterText={quickFilterText}
                      onSelectionChanged={onSelectionChanged}
                      rowHeight={30} // Set the row height here
                      animateRows={true} // Enables row animations
                      domLayout="autoHeight" // Auto-size the grid to fit content
                      onGridReady={(params) => {
                        params.api.sizeColumnsToFit(); // Size columns to fit the grid width
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectPlanList;
