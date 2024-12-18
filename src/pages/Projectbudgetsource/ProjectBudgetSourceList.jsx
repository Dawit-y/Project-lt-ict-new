import React, { useEffect, useMemo, useState,useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  useFetchProjectBudgetSources,
  useSearchProjectBudgetSources,
  useAddProjectBudgetSource,
  useDeleteProjectBudgetSource,
  useUpdateProjectBudgetSource,
} from "../../queries/projectbudgetsource_query";
import { useFetchBudgetSources } from "../../queries/budgetsource_query";
import ProjectBudgetSourceModal from "./ProjectBudgetSourceModal";
import { useTranslation } from "react-i18next";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
  FormGroup,
  Badge,
} from "reactstrap";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { createSelectOptions } from "../../utils/commonMethods";
import AddressStructureForProject from "../Project/AddressStructureForProject";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectBudgetSourceList = () => {
  //meta title
  document.title = " ProjectBudgetSource";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectBudgetSource, setProjectBudgetSource] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
   const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const { data, isLoading, error, isError, refetch } =  useState("");
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

 const { data: budgetSourceData } = useFetchBudgetSources();
  const budgetSourceOptions = createSelectOptions(
    budgetSourceData?.data || [],
    "pbs_id",
    "pbs_name_or"
  );


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
    if (showSearchResult) {
      setShowSearchResult(false);
    }
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
        headerName: t("bsr_name"),
        field: "bsr_name",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bsr_name, 30) || "-";
        },
      },
      {
        headerName: t("pbs_name_or"),
        field: "pbs_name_or",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.pbs_name_or, 30) || "-";
        },
      },
      {
        headerName: t("bsr_amount"),
        field: "bsr_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bsr_amount, 30) || "-";
        },
      }
    ];
    return baseColumnDefs;
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
            breadcrumbItem={t("project_budget_source_list")}
          />
          <div className="w-100 d-flex gap-2">
            <AddressStructureForProject onNodeSelect={handleNodeSelect} setIsAddressLoading={setIsAddressLoading} />
            <div className="w-100">
          <AdvancedSearch
            searchHook={useSearchProjectBudgetSources}
            textSearchKeys={["prj_name", "prj_code"]}
            dateSearchKeys={[]}
            dropdownSearchKeys={[
              {
                    key: "bsr_budget_source_id",
                    options: budgetSourceOptions,
                  },
            ]}

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
      </div>
      </div>

    </React.Fragment>
  );
};
export default ProjectBudgetSourceList;