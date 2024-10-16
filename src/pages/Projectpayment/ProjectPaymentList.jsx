import React, { useEffect, useMemo, useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

// import { getProject as onGetProject } from "../../store/project/actions";
import { getProjectPayment as onGetProjectPayment } from "../../store/projectpayment/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { Button, Col, Row, Input } from "reactstrap";
import { ToastContainer } from "react-toastify";

const ProjectPaymentList = () => {
  document.title = "Project Payment List";

  const { t } = useTranslation();
  //   const [project, setProject] = useState(null);
  const [projectPayment, setProjectPayment] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed

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

  const dispatch = useDispatch();
  // Fetch ProjectPayment on component mount
  useEffect(() => {
    dispatch(onGetProjectPayment());
  }, [dispatch]);

  const projectPaymentProperties = createSelector(
    (state) => state.ProjectPaymentR, // this is geting from  reducer
    (ProjectPaymentReducer) => ({
      // this is from Project.reducer
      projectPayment: ProjectPaymentReducer.projectPayment,
      loading: ProjectPaymentReducer.loading,
      update_loading: ProjectPaymentReducer.update_loading,
    })
  );

  const {
    projectPayment: { data },
    loading,
    update_loading,
  } = useSelector(projectPaymentProperties);

  const selectSearchProperties = createSelector(
    (state) => state.search,
    (search) => ({
      results: search.results,
    })
  );

  const { results } = useSelector(selectSearchProperties);

  const [isLoading, setLoading] = useState(loading);
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

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
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
        headerName: t("prp_payment_date_et"),
        field: "prp_payment_date_et",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_payment_date_et, 30) || "-";
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
      {
        headerName: t("prp_status"),
        field: "prp_status",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return params.data.prp_status;
        },
      },
    ];

    return baseColumnDefs;
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("Project Payment List")}
          />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
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
                <Col sm="12" md="6" className="text-md-end">
                  <Button
                    color="primary"
                    className="me-2"
                    onClick={filterMarked}
                  >
                    Filter Marked
                  </Button>
                  <Button
                    color="secondary"
                    className="me-2"
                    onClick={clearFilter}
                  >
                    Clear Filter
                  </Button>
                </Col>
              </Row>

              {/* AG Grid */}
              <div style={{ height: "400px" }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={showSearchResults ? results : data}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                  paginationPageSize={10}
                  quickFilterText={quickFilterText}
                  onSelectionChanged={onSelectionChanged}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};
export default ProjectPaymentList;
