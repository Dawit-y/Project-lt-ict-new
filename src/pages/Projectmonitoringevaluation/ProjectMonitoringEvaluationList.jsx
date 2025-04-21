import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { AgGridReact } from "ag-grid-react";
import TreeForLists from "../../components/Common/TreeForLists";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectMonitoringEvaluations,
  useSearchProjectMonitoringEvaluations,
  useAddProjectMonitoringEvaluation,
  useDeleteProjectMonitoringEvaluation,
  useUpdateProjectMonitoringEvaluation,
} from "../../queries/projectmonitoringevaluation_query";
import ProjectMonitoringEvaluationModal from "./ProjectMonitoringEvaluationModal";
import { useTranslation } from "react-i18next";
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
import { toast } from "react-toastify";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import AgGridContainer from "../../components/Common/AgGridContainer";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectMonitoringEvaluationList = () => {
  //meta title
  document.title = " ProjectMonitoringEvaluation";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectMonitoringEvaluation, setProjectMonitoringEvaluation] = useState(null);

  const [include, setInclude] = useState()
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

  const columnDefs = [
    {
      headerName: t('mne_transaction_type_id'),
      field: 'mne_transaction_type_id',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_visit_type'),
      field: 'mne_visit_type',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_project_id'),
      field: 'mne_project_id',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_type_id'),
      field: 'mne_type_id',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_physical'),
      field: 'mne_physical',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_financial'),
      field: 'mne_financial',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_physical_region'),
      field: 'mne_physical_region',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_financial_region'),
      field: 'mne_financial_region',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_team_members'),
      field: 'mne_team_members',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_feedback'),
      field: 'mne_feedback',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_weakness'),
      field: 'mne_weakness',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_challenges'),
      field: 'mne_challenges',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_recommendations'),
      field: 'mne_recommendations',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_purpose'),
      field: 'mne_purpose',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_record_date'),
      field: 'mne_record_date',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_start_date'),
      field: 'mne_start_date',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_end_date'),
      field: 'mne_end_date',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_description'),
      field: 'mne_description',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
    {
      headerName: t('mne_status'),
      field: 'mne_status',
      sortable: true,
      filter: false,
      valueFormatter: ({ value }) => truncateText(value, 30) || '-',
    },
  ];

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
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
            />
            <div style={{ flex: "0 0 75%" }}>
              <AdvancedSearch
                searchHook={useSearchProjectMonitoringEvaluations}
                textSearchKeys={["mne_type_id"]}
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
                <>
                  <div>
                    <AgGridContainer
                      rowData={
                        showSearchResult ? searchResults?.data : data?.data || []
                      }
                      columnDefs={columnDefs}
                      isPagination={true}
                      paginationPageSize={20}
                      isGlobalFilter={true}
                      isAddButton={false}
                      addButtonText="Add"
                      isExcelExport={true}
                      isPdfExport={true}
                      isPrint={true}
                      tableName="Project Monitoring and Evaluation"
                      includeKey={["usr_full_name", "usr_email", "usr_phone_number"]}
                      excludeKey={["is_editable", "is_deletable"]}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectMonitoringEvaluationList;