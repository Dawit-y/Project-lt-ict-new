import React, { useEffect, useMemo, useState, useRef } from "react";
import Spinners from "../../components/Common/Spinner";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  useSearchMonitoringEvaluationTypes,
} from "../../queries/monitoringevaluationtype_query";
import { useTranslation } from "react-i18next";
import {
  Col,
  Row,
  Input,
} from "reactstrap";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const MonitoringEvaluationTypeList = () => {
  //meta title
  document.title = "MonitoringEvaluationType";
  const { t } = useTranslation();

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const { data, isLoading, error, isError, refetch } = useState("");
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

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
    });
  }, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId]);
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

  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "met_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_status, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_gov_active",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_gov_active, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_cso_active",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_cso_active, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_monitoring_active",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_monitoring_active, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "met_evaluation_active",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_evaluation_active, 30) ||
                "-"}
            </span>
          );
        },
      },
    ];
    return baseColumns;
  });
  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("Project Payment List")}
          />
          <div className="w-100 d-flex gap-2">
            <div className="w-100">
              <AdvancedSearch
                searchHook={useSearchMonitoringEvaluationTypes}
                textSearchKeys={["prj_name", "prj_code"]}
                checkboxSearchKeys={[]}
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
                  {/* Row for search input and buttons */}
                  <Row className="mb-3">
                    <Col sm="12" md="6">
                      {/* Search Input for  Filter */}
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

                  {/* AG Grid */}
                  <div>
                    <AgGridReact
                      ref={gridRef}
                      rowData={
                        showSearchResult
                          ? searchResults?.data
                          : data?.data || []
                      }
                      columnDefs={columnDefs}
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
export default MonitoringEvaluationTypeList;
