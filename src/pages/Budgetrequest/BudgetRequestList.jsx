import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinners from "../../components/Common/Spinner";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import RightOffCanvas from "../../components/Common/RightOffCanvas";

import BudgetRequestListModal from "./BudgetRequestListModal";
import ProjectDocument from "../../pages/Projectdocument/index";
import ProjectPayment from "../../pages/Projectpayment";
import ProjectStakeholder from "../../pages/Projectstakeholder";
import Projectcontractor from "../../pages/Projectcontractor";
import Budgetrequest from "../../pages/Budgetrequest";
import GeoLocation from "../../pages/GeoLocation";
import { useTranslation } from "react-i18next";

import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Input,
  Badge,
} from "reactstrap";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BudgetRequestAnalysis from "./BudgetRequestAnalysis";
import {
  useFetchBudgetRequests,
  useSearchBudgetRequests,
} from "../../queries/budget_request_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const statusClasses = {
  Approved: "success",
  Rejected: "danger",
  Requested: "secondary",
};

const BudgetRequestListModel = () => {
  //  get passed data from tab

  document.title = " BudgetRequest";

  const { t } = useTranslation();
  const [modal1, setModal1] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [budgetRequestMetaData, setBudgetRequestMetaData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } =
    useFetchBudgetRequests();
  const { data: budgetYearData } = useFetchBudgetYears();

  const [transaction, setTransaction] = useState({});

  const budgetYearMap = useMemo(() => {
    return (
      budgetYearData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [budgetYearData]);

  const budgetYearOptions = useMemo(() => {
    return (
      budgetYearData?.data?.map((year) => ({
        label: year.bdy_name,
        value: year.bdy_id,
      })) || []
    );
  }, [budgetYearData]);

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  const handleEyeClick = (data) => {
    setShowCanvas(!showCanvas);
    setBudgetRequestMetaData(data);
  };

  const toggleViewModal = () => setModal1(!modal1);

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: t("bdr_budget_year_id"),
        field: "bdr_budget_year_id",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const budgetYearName = budgetYearMap[params.value] || "";
          return budgetYearName;
        },
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
        headerName: t("bdr_requested_amount"),
        field: "bdr_requested_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_amount, 30) || "-";
        },
      },
      {
        headerName: t("bdr_released_amount"),
        field: "bdr_released_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_released_amount, 30) || "-";
        },
      },
      {
        headerName: t("bdr_requested_date_gc"),
        field: "bdr_requested_date_gc",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("bdr_released_date_gc"),
        field: "bdr_released_date_gc",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_released_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("bdr_request_status"),
        field: "bdr_request_status",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const badgeClass = statusClasses[params.value] || "secondary";
          return (
            <Badge className={`font-size-12 badge-soft-${badgeClass}`}>
              {params.value}
            </Badge>
          );
        },
      },
      {
        headerName: t("take_action"),
        field: "take_action",
        cellRenderer: (params) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                const data = params.data;
                toggleViewModal(data);
                setTransaction(data);
              }}
            >
              {t("take_action")}
            </Button>
          );
        },
      },
    ];

    if (
      data?.previledge?.is_role_editable &&
      data?.previledge?.is_role_deletable
    ) {
      baseColumnDefs.push({
        headerName: t("view_detail"),
        field: "view_detail",
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            {params.data.is_editable ? (
              <Link
                to="#"
                className="text-secondary"
                onClick={() => handleEyeClick(params.data)}
              >
                <i className="mdi mdi-eye font-size-18 ms-2" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
            ) : (
              ""
            )}
          </div>
        ),
      });
    }

    return baseColumnDefs;
  }, []);

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

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <BudgetRequestListModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
        budgetYearMap={budgetYearMap}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("budget_request")}
            breadcrumbItem={t("budget_request")}
          />
          <AdvancedSearch
            searchHook={useSearchBudgetRequests}
            textSearchKeys={["prj_name", "prj_code"]}
            dropdownSearchKeys={[
              {
                key: "bdr_budget_year_id",
                options: budgetYearOptions,
              },
            ]}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
          />

          {isLoading || isSearchLoading ? (
            <Spinners />
          ) : (
            <>
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
                    {/* <Button color="success" onClick={handleBudgetRequestClicks}>
                      Add New
                    </Button> */}
                  </Col>
                </Row>

                {/* AG Grid */}
                <div style={{ height: "400px" }}>
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
                    rowHeight={30}
                    animateRows={true}
                  />
                </div>
              </div>
              <BudgetRequestAnalysis data={showSearchResult ? searchResults?.data : data?.data || []} />
            </>
          )}
        </div>
      </div>
      <ToastContainer />
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleEyeClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={"Detail"}
          id={budgetRequestMetaData.bdr_project_id}
          navItems={[
            "Documents",
            "Payments",
            "Project Stakeholder",
            "Project Contractor",
            "Budget Request",
            "Geo Location",
          ]}
          components={[
            ProjectDocument,
            ProjectPayment,
            ProjectStakeholder,
            Projectcontractor,
            Budgetrequest,
            GeoLocation,
          ]}
        />
      )}
    </React.Fragment>
  );
};
BudgetRequestListModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetRequestListModel;
