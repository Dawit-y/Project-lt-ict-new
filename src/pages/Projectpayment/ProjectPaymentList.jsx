import React, { useEffect, useMemo, useState, useRef } from "react";
import Spinners from "../../components/Common/Spinner";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

// import { getProject as onGetProject } from "../../store/project/actions";
import { getProjectPayment as onGetProjectPayment } from "../../store/projectpayment/actions";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { Button, Col, Row, Input } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import PaymentAnalaysis from "./PaymentAnalaysis";
import {
  useFetchProjectPayments,
  useSearchProjectPayments,
} from "../../queries/projectpayment_query";
const ProjectPaymentList = () => {
  document.title = "Project Payment List";

  const { t } = useTranslation();
  //   const [project, setProject] = useState(null);
  const [projectPayment, setProjectPayment] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  //const { data, isLoading, error, isError, refetch } = useFetchProjectPayments();
  const { data, isLoading, error, isError, refetch } = useState(false);

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

  useEffect(() => {
    setProjectPayment(data);
  }, [data]);

  const truncateText = (text, maxLength) => {
    if (typeof text !== "string") {
      return text;
    }
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: t("S.N"),
        field: "sn",
        valueGetter: (params) => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        width: 60,
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("prp_type"),
        field: "prp_type",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_type, 30) || "-";
        },
      },
      {
        headerName: t("prp_payment_date_gc"),
        field: "prp_payment_date_gc",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_payment_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("prp_payment_amount"),
        field: "prp_payment_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_payment_amount, 30) || "-";
        },
      },

      {
        headerName: t("prp_payment_percentage"),
        field: "prp_payment_percentage",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_payment_percentage, 30) || "-";
        },
      },
      {
        headerName: t("prp_description"),
        field: "prp_description",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_description, 30) || "-";
        },
      },
    ];
    return baseColumnDefs;
  });
  // console.log("here is the data" + JSON.stringify(data[0]));
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("Project Payment List")}
          />
          <AdvancedSearch
            searchHook={useSearchProjectPayments}
            textSearchKeys={["prj_name", "prj_code"]}
            dateSearchKeys={["payment_date"]}
            dropdownSearchKeys={[
              {
                key: "prp_type",
                options: [
                  { value: "Advance", label: "Advance" },
                  { value: "Interim", label: "Interim" },
                  { value: "Final", label: "Final" },
                ],
              },
            ]}
            checkboxSearchKeys={[]}
            Component={CascadingDropdowns}
            component_params={{
              dropdown1name: "prj_location_region_id",
              dropdown2name: "prj_location_zone_id",
              dropdown3name: "prj_location_woreda_id",
            }}
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
                    showSearchResult ? searchResults?.data : data?.data || []
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
      <PaymentAnalaysis
        data={showSearchResult ? searchResults?.data : data?.data || []}
      />
    </React.Fragment>
  );
};
export default ProjectPaymentList;
