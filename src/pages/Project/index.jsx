import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { before, isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "ag-grid-enterprise";
import "../../App.css";

import {
  useFetchProjects,
  useSearchProjects,
  useAddProject,
  useDeleteProject,
  useUpdateProject,
} from "../../queries/project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import ProjectModal from "./ProjectModal";
import { useTranslation } from "react-i18next";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import ProjectDocument from "../../pages/Projectdocument/index";
import ProjectPayment from "../../pages/Projectpayment";
import ProjectStakeholder from "../../pages/Projectstakeholder";
import Projectcontractor from "../../pages/Projectcontractor";
import Budgetrequest from "../../pages/Budgetrequest";
import GeoLocation from "../../pages/GeoLocation";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

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
  InputGroup,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import { createSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { formatDate } from "../../utils/commonMethods";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectModel = () => {
  //meta title
  document.title = " Project";
  const [projectMetaData, setProjectMetaData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [project, setProject] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProjects();
  const { data: projectCategoryData } = useFetchProjectCategorys();
  const projectCategoryOptions = createSelectOptions(
    projectCategoryData?.data || [],
    "pct_id",
    "pct_name_en"
  );
  const { data: sectorInformationData } = useFetchSectorInformations();
  const sectorInformationOptions = createSelectOptions(
    sectorInformationData?.data || [],
    "sci_id",
    "sci_name_en"
  );

  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleAddProject = async (data) => {
    try {
      await addProject.mutateAsync(data);
      toast.success(`Data added successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add data", {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateProject = async (data) => {
    try {
      await updateProject.mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProject = async () => {
    if (project && project.prj_id) {
      try {
        const id = project.prj_id;
        await deleteProject.mutateAsync(id);
        toast.success(`Data deleted successfully`, {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(`Failed to delete Data`, {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  //END CRUD
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      prj_name: (project && project.prj_name) || "",
      prj_code: (project && project.prj_code) || "",
      prj_project_status_id: (project && project.prj_project_status_id) || "",
      prj_project_category_id:
        (project && project.prj_project_category_id) || "",
      prj_project_budget_source_id:
        (project && project.prj_project_budget_source_id) || "",
      prj_total_estimate_budget:
        (project && project.prj_total_estimate_budget) || "",
      prj_total_actual_budget:
        (project && project.prj_total_actual_budget) || "",
      prj_geo_location: (project && project.prj_geo_location) || "",
      prj_sector_id: (project && project.prj_sector_id) || "",
      prj_location_region_id: (project && project.prj_location_region_id) || "",
      prj_location_zone_id: (project && project.prj_location_zone_id) || "",
      prj_location_woreda_id: (project && project.prj_location_woreda_id) || "",
      prj_location_kebele_id: (project && project.prj_location_kebele_id) || "",
      prj_location_description:
        (project && project.prj_location_description) || "",
      prj_owner_region_id: (project && project.prj_owner_region_id) || "",
      prj_owner_zone_id: (project && project.prj_owner_zone_id) || "",
      prj_owner_woreda_id: (project && project.prj_owner_woreda_id) || "",
      prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",
      prj_owner_description: (project && project.prj_owner_description) || "",
      prj_start_date_et: (project && project.prj_start_date_et) || "",
      prj_start_date_gc: (project && project.prj_start_date_gc) || "",
      prj_start_date_plan_et: (project && project.prj_start_date_plan_et) || "",
      prj_start_date_plan_gc: (project && project.prj_start_date_plan_gc) || "",
      prj_end_date_actual_et: (project && project.prj_end_date_actual_et) || "",
      prj_end_date_actual_gc: (project && project.prj_end_date_actual_gc) || "",
      prj_end_date_plan_gc: (project && project.prj_end_date_plan_gc) || "",
      prj_end_date_plan_et: (project && project.prj_end_date_plan_et) || "",
      prj_outcome: (project && project.prj_outcome) || "",
      prj_deleted: (project && project.prj_deleted) || "",
      prj_remark: (project && project.prj_remark) || "",
      prj_created_date: (project && project.prj_created_date) || "",
      prj_owner_id: (project && project.prj_owner_id) || "",
      prj_urban_ben_number: (project && project.prj_urban_ben_number) || "",
      prj_rural_ben_number: (project && project.prj_rural_ben_number) || "",

      is_deletable: (project && project.is_deletable) || 1,
      is_editable: (project && project.is_editable) || 1,
    },

    validationSchema: Yup.object({
      prj_name: Yup.string()
        .required(t("prj_name"))
        .test("unique-prj_name", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) => item.prj_name == value && item.prj_id !== project?.prj_id
          );
        }),
      prj_code: Yup.string()
        .required(t("prj_code"))
        .test("unique-prj_code", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) => item.prj_code == value && item.prj_id !== project?.prj_id
          );
        }),
      //prj_project_status_id: Yup.string().required(t('prj_project_status_id')),
      prj_project_category_id: Yup.string().required(
        t("prj_project_category_id")
      ),
      //prj_project_budget_source_id: Yup.string().required(t('prj_project_budget_source_id')),
      prj_total_estimate_budget: Yup.string().required(
        t("prj_total_estimate_budget")
      ),
      prj_total_actual_budget: Yup.string().required(
        t("prj_total_actual_budget")
      ),
      //prj_geo_location: Yup.string().required(t('prj_geo_location')),
      prj_sector_id: Yup.string().required(t("prj_sector_id")),
      prj_location_region_id: Yup.string().required(
        t("prj_location_region_id")
      ),
      //prj_location_zone_id: Yup.string().required(t('prj_location_zone_id')),
      //prj_location_woreda_id: Yup.string().required(t('prj_location_woreda_id')),
      //prj_location_kebele_id: Yup.string().required(t('prj_location_kebele_id')),
      //prj_location_description: Yup.string().required(t('prj_location_description')),
      //prj_owner_region_id: Yup.string().required(t('prj_owner_region_id')),
      //prj_owner_zone_id: Yup.string().required(t('prj_owner_zone_id')),
      //prj_owner_woreda_id: Yup.string().required(t('prj_owner_woreda_id')),
      //prj_owner_kebele_id: Yup.string().required(t('prj_owner_kebele_id')),
      //prj_owner_description: Yup.string().required(t('prj_owner_description')),
      //prj_start_date_et: Yup.string().required(t('prj_start_date_et')),
      prj_start_date_gc: Yup.string().required(t("prj_start_date_gc")),
      //prj_start_date_plan_et: Yup.string().required(t('prj_start_date_plan_et')),
      prj_start_date_plan_gc: Yup.string().required(
        t("prj_start_date_plan_gc")
      ),
      //prj_end_date_actual_et: Yup.string().required(t('prj_end_date_actual_et')),
      prj_end_date_actual_gc: Yup.string().required(
        t("prj_end_date_actual_gc")
      ),
      prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
      //prj_end_date_plan_et: Yup.string().required(t('prj_end_date_plan_et')),
      //prj_outcome: Yup.string().required(t('prj_outcome')),
      //prj_deleted: Yup.string().required(t('prj_deleted')),
      //prj_remark: Yup.string().required(t('prj_remark')),
      //prj_created_date: Yup.string().required(t('prj_created_date')),
      //prj_owner_id: Yup.string().required(t('prj_owner_id')),
      //prj_urban_ben_number: Yup.string().required(t('prj_urban_ben_number')),
      //prj_rural_ben_number: Yup.string().required(t('prj_rural_ben_number')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProject = {
          prj_id: project.prj_id,
          prj_name: values.prj_name,
          prj_code: values.prj_code,
          prj_project_status_id: values.prj_project_status_id,
          prj_project_category_id: values.prj_project_category_id,
          prj_project_budget_source_id: values.prj_project_budget_source_id,
          prj_total_estimate_budget: values.prj_total_estimate_budget,
          prj_total_actual_budget: values.prj_total_actual_budget,
          prj_geo_location: values.prj_geo_location,
          prj_sector_id: values.prj_sector_id,
          prj_location_region_id: values.prj_location_region_id,
          prj_location_zone_id: values.prj_location_zone_id,
          prj_location_woreda_id: values.prj_location_woreda_id,
          prj_location_kebele_id: values.prj_location_kebele_id,
          prj_location_description: values.prj_location_description,
          prj_owner_region_id: values.prj_owner_region_id,
          prj_owner_zone_id: values.prj_owner_zone_id,
          prj_owner_woreda_id: values.prj_owner_woreda_id,
          prj_owner_kebele_id: values.prj_owner_kebele_id,
          prj_owner_description: values.prj_owner_description,
          prj_start_date_et: values.prj_start_date_et,
          prj_start_date_gc: values.prj_start_date_gc,
          prj_start_date_plan_et: values.prj_start_date_plan_et,
          prj_start_date_plan_gc: values.prj_start_date_plan_gc,
          prj_end_date_actual_et: values.prj_end_date_actual_et,
          prj_end_date_actual_gc: values.prj_end_date_actual_gc,
          prj_end_date_plan_gc: values.prj_end_date_plan_gc,
          prj_end_date_plan_et: values.prj_end_date_plan_et,
          prj_outcome: values.prj_outcome,
          prj_deleted: values.prj_deleted,
          prj_remark: values.prj_remark,
          prj_created_date: values.prj_created_date,
          prj_owner_id: values.prj_owner_id,
          prj_urban_ben_number: values.prj_urban_ben_number,
          prj_rural_ben_number: values.prj_rural_ben_number,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Project
        handleUpdateProject(updateProject);
        validation.resetForm();
      } else {
        const newProject = {
          prj_name: values.prj_name,
          prj_code: values.prj_code,
          prj_project_status_id: values.prj_project_status_id,
          prj_project_category_id: values.prj_project_category_id,
          prj_project_budget_source_id: values.prj_project_budget_source_id,
          prj_total_estimate_budget: values.prj_total_estimate_budget,
          prj_total_actual_budget: values.prj_total_actual_budget,
          prj_geo_location: values.prj_geo_location,
          prj_sector_id: values.prj_sector_id,
          prj_location_region_id: values.prj_location_region_id,
          prj_location_zone_id: values.prj_location_zone_id,
          prj_location_woreda_id: values.prj_location_woreda_id,
          prj_location_kebele_id: values.prj_location_kebele_id,
          prj_location_description: values.prj_location_description,
          prj_owner_region_id: values.prj_owner_region_id,
          prj_owner_zone_id: values.prj_owner_zone_id,
          prj_owner_woreda_id: values.prj_owner_woreda_id,
          prj_owner_kebele_id: values.prj_owner_kebele_id,
          prj_owner_description: values.prj_owner_description,
          prj_start_date_et: values.prj_start_date_et,
          prj_start_date_gc: values.prj_start_date_gc,
          prj_start_date_plan_et: values.prj_start_date_plan_et,
          prj_start_date_plan_gc: values.prj_start_date_plan_gc,
          prj_end_date_actual_et: values.prj_end_date_actual_et,
          prj_end_date_actual_gc: values.prj_end_date_actual_gc,
          prj_end_date_plan_gc: values.prj_end_date_plan_gc,
          prj_end_date_plan_et: values.prj_end_date_plan_et,
          prj_outcome: values.prj_outcome,
          prj_deleted: values.prj_deleted,
          prj_remark: values.prj_remark,
          prj_created_date: values.prj_created_date,
          prj_owner_id: values.prj_owner_id,
          prj_urban_ben_number: values.prj_urban_ben_number,
          prj_rural_ben_number: values.prj_rural_ben_number,
        };
        // save new Project
        handleAddProject(newProject);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch Project on component mount
  useEffect(() => {
    setProject(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProject(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProject(null);
    } else {
      setModal(true);
    }
  };
  const handleClick = (data) => {
    setShowCanvas(!showCanvas); // Toggle canvas visibility
    setProjectMetaData(data);
  };

  const handleProjectClick = (arg) => {
    const project = arg;
    // console.log("handleProjectClick", project);
    setProject({
      prj_id: project.prj_id,
      prj_name: project.prj_name,
      prj_code: project.prj_code,
      prj_project_status_id: project.prj_project_status_id,
      prj_project_category_id: project.prj_project_category_id,
      prj_project_budget_source_id: project.prj_project_budget_source_id,
      prj_total_estimate_budget: project.prj_total_estimate_budget,
      prj_total_actual_budget: project.prj_total_actual_budget,
      prj_geo_location: project.prj_geo_location,
      prj_sector_id: project.prj_sector_id,
      prj_location_region_id: project.prj_location_region_id,
      prj_location_zone_id: project.prj_location_zone_id,
      prj_location_woreda_id: project.prj_location_woreda_id,
      prj_location_kebele_id: project.prj_location_kebele_id,
      prj_location_description: project.prj_location_description,
      prj_owner_region_id: project.prj_owner_region_id,
      prj_owner_zone_id: project.prj_owner_zone_id,
      prj_owner_woreda_id: project.prj_owner_woreda_id,
      prj_owner_kebele_id: project.prj_owner_kebele_id,
      prj_owner_description: project.prj_owner_description,
      prj_start_date_et: project.prj_start_date_et,
      prj_start_date_gc: project.prj_start_date_gc,
      prj_start_date_plan_et: project.prj_start_date_plan_et,
      prj_start_date_plan_gc: project.prj_start_date_plan_gc,
      prj_end_date_actual_et: project.prj_end_date_actual_et,
      prj_end_date_actual_gc: project.prj_end_date_actual_gc,
      prj_end_date_plan_gc: project.prj_end_date_plan_gc,
      prj_end_date_plan_et: project.prj_end_date_plan_et,
      prj_outcome: project.prj_outcome,
      prj_deleted: project.prj_deleted,
      prj_remark: project.prj_remark,
      prj_created_date: project.prj_created_date,
      prj_owner_id: project.prj_owner_id,
      prj_urban_ben_number: project.prj_urban_ben_number,
      prj_rural_ben_number: project.prj_rural_ben_number,

      is_deletable: project.is_deletable,
      is_editable: project.is_editable,
    });
    //setSelectedProjectCategory(project.prj_project_category_id);
    //setSelectedSector(project.prj_sector_id);
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (project) => {
    setProject(project);
    setDeleteModal(true);
  };

  const handleProjectClicks = () => {
    setIsEdit(false);
    setProject("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  const localeText = {
    // For Pagination Panel
    page: t("page"),
    more: t("more"),
    to: t("to"),
    of: t("of"),
    next: t("next"),
    last: t("last"),
    first: t("first"),
    previous: t("previous"),
    loadingOoo: t("loadingOoo"),
    noRowsToShow: t("noRowsToShow"),

    // For Set Filter
    selectAll: t("selectAll"),
    selectAllSearchResults: t("selectAllSearchResults"),
    searchOoo: t("search..."),
    blank: t("blanks"),
    notBlank: t("notBlank"),
    noMatches: t("noMatches"),
    columns: t("columns"),
    filters: t("filters"),
    values: t("values"),
    rowGroup: t("rowGroup"),
    pageSize: t("pageSize"),
    sortAscending: t("sortAscending"),
    sortDescending: t("sortDescending"),
    chooseColumns: t("chooseColumns"),
    noPin: t("noPin"),
    pinLeft: t("pinLeft"),
    pinRight: t("pinRight"),
    dragHereToSetRowGroups: t("dragHereToSetRowGroups"),
    // For Number Filter & Text Filter
    filterOoo: t("filterOoo"),
    equals: t("equals"),
    notEqual: t("notEqual"),
    lessThan: t("lessThan"),
    greaterThan: t("greaterThan"),
    inRange: t("inRange"),
    lessThanOrEqual: t("lessThanOrEqual"),
    greaterThanOrEqual: t("greaterThanOrEqual"),
    contains: t("contains"),
    notContains: t("notContains"),
    startsWith: t("startsWith"),
    endsWith: t("endsWith"),

    // For Column Menu
    pinColumn: t("pinColumn"),
    before: t("before"),
    after: t("after"),
    valueAggregation: t("valueAggregation"),
    autosizeThiscolumn: t("autosizeThiscolumn"),
    autosizeAllColumns: t("autosizeAllColumns"),
    groupBy: t("groupBy"),
    ungroupBy: t("ungroupBy"),
    resetColumns: t("resetColumns"),
    expandAll: t("expandAll"),
    collapseAll: t("collapseAll"),
    copy: t("copy"),
    ctrlC: t("ctrlC"),
    copyWithHeaders: t("copyWithHeaders"),
    paste: t("paste"),
    ctrlV: t("ctrlV"),
    export: t("export"),

    // Enterprise Menu Aggregation and Status Bar
    sum: t("sum"),
    min: t("min"),
    max: t("max"),
    none: t("none"),
    count: t("count"),
    average: t("average"),
    filteredRows: t("filteredRows"),
    selectedRows: t("selectedRows"),
    totalRows: t("totalRows"),
    totalAndFilteredRows: t("totalAndFilteredRows"),

    // Charts
    pivotChartTitle: t("pivotChartTitle"),
    rangeChartTitle: t("rangeChartTitle"),
    columnChart: t("columnChart"),
    groupedColumn: t("groupedColumn"),
    stackedColumn: t("stackedColumn"),
    barChart: t("barChart"),
    pieChart: t("pieChart"),
    doughnutChart: t("doughnutChart"),
    line: t("line"),
    areaChart: t("areaChart"),
    stackedArea: t("stackedArea"),

    // Pivot Mode
    pivotMode: t("pivotMode"),
    pivotColumnGroupTotals: t("pivotColumnGroupTotals"),
    pivotColumnGroupFilterTotals: t("pivotColumnGroupFilterTotals"),

    // Miscellaneous
    ariaHidden: t("ariaHidden"),
    ariaVisible: t("ariaVisible"),
    ariaChecked: t("ariaChecked"),
    ariaUnchecked: t("ariaUnchecked"),
    ariaIndeterminate: t("ariaIndeterminate"),
    // Add more keys based on your requirements or AG Grid's localization documentation
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
        field: "prj_name",
        headerName: t("prj_name"),
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        enableRowGroup: true,
        width: 300,
        valueFormatter: (params) =>
          params.node.footer ? t("Total") : params.value, // Display "Total" for footer
      },
      {
        field: "prj_total_estimate_budget",
        headerName: t("prj_total_estimate_budget"),
        enableValue: true,
        aggFunc: t("sum"), // Use sum to aggregate
        valueFormatter: (params) => {
          if (params.node.footer) {
            return params.value
              ? `$${params.value.toLocaleString()}` // Show total in footer
              : "";
          }
          return params.value ? `$${params.value.toLocaleString()}` : "";
        },
      },
      {
        field: "prj_total_actual_budget",
        headerName: t("prj_total_actual_budget"),
        enableValue: true,
        aggFunc: t("sum"), // Use sum to aggregate
        valueFormatter: (params) => {
          if (params.node.footer) {
            return params.value
              ? `$${params.value.toLocaleString()}` // Show total in footer
              : "";
          }
          return params.value ? `$${params.value.toLocaleString()}` : "";
        },
      },
      {
        field: "prj_start_date_gc",
        headerName: t("prj_start_date_gc"),
        sortable: true,
        filter: "agDateColumnFilter",
        valueFormatter: (params) =>
          params.node.footer
            ? "" // Suppress in footer
            : params.value
              ? new Date(params.value).toLocaleDateString()
              : "Invalid date",
        enableRowGroup: true,
      },
      {
        field: "prj_end_date_actual_gc",
        headerName: t("prj_end_date_actual_gc"),
        sortable: true,
        filter: "agDateColumnFilter",
        valueFormatter: (params) =>
          params.node.footer
            ? "" // Suppress in footer
            : params.value
              ? new Date(params.value).toLocaleDateString()
              : "Invalid date",
        enableRowGroup: true,
      },
      {
        headerName: t("view_details"),
        sortable: false,
        filter: false,
        width: 120,
        cellRenderer: (params) => {
          if (params.node.footer) {
            return ""; // Suppress button for footer
          }
          const { prj_id } = params.data || {};
          return (
            <Link to={`/Project/${prj_id}`}>
              <Button type="button" color="primary" className="btn-sm mb-1">
                {t("view_details")}
              </Button>
            </Link>
          );
        },
      },
    ];

    // Add actions column based on privileges
    if (
      data?.previledge?.is_role_editable ||
      data?.previledge?.is_role_deletable
    ) {
      baseColumnDefs.push({
        headerName: t("actions"),
        field: "actions",
        width: 150,
        cellRenderer: (params) => {
          if (!params.data || params.node.group || params.node.footer)
            return null; // Suppress in group/footer rows
          const { is_editable, is_deletable } = params.data || {};
          return (
            <div className="action-icons">
            {is_editable && (
              <Link
                to="#"
                className="text-success me-2"
                onClick={() => handleProjectClick(params.data)}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  {t("edit")}
                </UncontrolledTooltip>
              </Link>
            )}

            {is_deletable ? (
              <Link
                to="#"
                className="text-danger ms-3"
                onClick={() => onClickDelete(params.data)}
              >
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            ) : (
              <i
                className="mdi mdi-delete-off font-size-18 text-muted ms-3"
                id="deletetooltip-disabled"
              />
            )}
            <Link
              to="#"
              className="text-secondary ms-2"
              onClick={() => handleClick(params.data)}
            >
              <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
              <UncontrolledTooltip placement="top" target="viewtooltip">
                View
              </UncontrolledTooltip>
            </Link>
            <Link
              to={{
                pathname: `/project/${params.data.prj_code}/project_plan`, // Route path
                state: { projectData: params.data }, // Pass data here
              }}
              className="text-secondary ms-2"
            >
              <i className="mdi mdi-file-document-outline font-size-18" id="viewtooltip" />
              <UncontrolledTooltip placement="top" target="viewtooltip">
                Project Plan
              </UncontrolledTooltip>
            </Link>
          </div>
          );
        },
      });
    }

    return baseColumnDefs;
  }, [data, handleProjectClick, onClickDelete, t]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };
  const sideBar = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
      },
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
      },
    ],
    defaultToolPanel: "columns",
  };
  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };
  const chartThemes = ["ag-default", "ag-material", "ag-pastel", "ag-vivid"];

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
      <ProjectModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProject}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProject.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
          <AdvancedSearch
            searchHook={useSearchProjects}
            textSearchKeys={["prj_name", "prj_code"]}
            dropdownSearchKeys={[
              {
                key: "prj_project_category_id",
                options: projectCategoryOptions,
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
            <Spinners top={"top-60"} />
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
                    placeholder={t("Search") + "..."}
                    onChange={(e) => setQuickFilterText(e.target.value)}
                    className="mb-2"
                  />
                </Col>
                <Col sm="12" md="6" className="text-md-end">
                  <Button color="success" onClick={handleProjectClicks}>
                    {t("Add New Project")}
                  </Button>
                </Col>
              </Row>

              {/* AG Grid */}
              <div style={{ height: "600px" }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={
                    showSearchResult ? searchResults?.data : data?.data || []
                  }
                  columnDefs={columnDefs}
                  groupIncludeFooter={true}
                  groupIncludeTotalFooter={true}
                  rowSelection="multiple"
                  enableRangeSelection={true}
                  enableCharts={true} // Enable charts
                  chartThemes={chartThemes} // Add custom chart themes
                  pivotMode={false}
                  sideBar={sideBar} // Enable and configure sidebar
                  rowGroupPanelShow="always"
                  pivotPanelShow="always"
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
                  localeText={localeText} // Dynamically translated texts
                />
              </div>
            </div>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("project")
                : t("add") + " " + t("project")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-12 mb-3">
                    <CascadingDropdowns
                      validation={validation}
                      dropdown1name="prj_location_region_id"
                      dropdown2name="prj_location_zone_id"
                      dropdown3name="prj_location_woreda_id"
                      isEdit={isEdit} // Set to true if in edit mode, otherwise false
                    />
                  </Col>
                  <Col className="col-md-12 mb-3">
                    <Label>{t("prj_location_description")}</Label>
                    <Input
                      name="prj_location_description"
                      type="textarea"
                      placeholder={t("prj_location_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_location_description || ""}
                      invalid={
                        validation.touched.prj_location_description &&
                          validation.errors.prj_location_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_location_description &&
                      validation.errors.prj_location_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_location_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_name")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_name"
                      type="text"
                      placeholder={t("prj_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_name || ""}
                      invalid={
                        validation.touched.prj_name &&
                          validation.errors.prj_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_name &&
                      validation.errors.prj_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_code")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_code"
                      type="text"
                      placeholder={t("prj_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_code || ""}
                      invalid={
                        validation.touched.prj_code &&
                          validation.errors.prj_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_code &&
                      validation.errors.prj_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_project_category_id")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_project_category_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_project_category_id || ""}
                      invalid={
                        validation.touched.prj_project_category_id &&
                          validation.errors.prj_project_category_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>Select Project Category</option>
                      {projectCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.prj_project_category_id &&
                      validation.errors.prj_project_category_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_project_category_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_total_estimate_budget")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_total_estimate_budget"
                      type="number"
                      placeholder={t("prj_total_estimate_budget")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_total_estimate_budget || ""}
                      invalid={
                        validation.touched.prj_total_estimate_budget &&
                          validation.errors.prj_total_estimate_budget
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_total_estimate_budget &&
                      validation.errors.prj_total_estimate_budget ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_total_estimate_budget}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_total_actual_budget")}</Label>
                    <Input
                      name="prj_total_actual_budget"
                      type="number"
                      placeholder={t("prj_total_actual_budget")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_total_actual_budget || ""}
                      invalid={
                        validation.touched.prj_total_actual_budget &&
                          validation.errors.prj_total_actual_budget
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_total_actual_budget &&
                      validation.errors.prj_total_actual_budget ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_total_actual_budget}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_sector_id")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_sector_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_sector_id || ""}
                      invalid={
                        validation.touched.prj_sector_id &&
                          validation.errors.prj_sector_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>Select Sector Information</option>
                      {sectorInformationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.prj_sector_id &&
                      validation.errors.prj_sector_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_sector_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <FormGroup>
                      <Label>{t("prj_start_date_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${validation.touched.prj_start_date_gc &&
                              validation.errors.prj_start_date_gc
                              ? "is-invalid"
                              : ""
                            }`}
                          name="prj_start_date_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.prj_start_date_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              "prj_start_date_gc",
                              formatedDate
                            ); // Set value in Formik
                          }}
                          onBlur={validation.handleBlur}
                        />

                        <Button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled
                        >
                          <i className="fa fa-calendar" aria-hidden="true" />
                        </Button>
                      </InputGroup>
                      {validation.touched.prj_start_date_gc &&
                        validation.errors.prj_start_date_gc ? (
                        <FormFeedback>
                          {validation.errors.prj_start_date_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_start_date_plan_gc")}</Label>
                    <Input
                      name="prj_start_date_plan_gc"
                      type="text"
                      placeholder={t("prj_start_date_plan_gc")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_start_date_plan_gc || ""}
                      invalid={
                        validation.touched.prj_start_date_plan_gc &&
                          validation.errors.prj_start_date_plan_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_start_date_plan_gc &&
                      validation.errors.prj_start_date_plan_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_start_date_plan_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <FormGroup>
                      <Label>{t("prj_end_date_actual_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${validation.touched.prj_end_date_actual_gc &&
                              validation.errors.prj_end_date_actual_gc
                              ? "is-invalid"
                              : ""
                            }`}
                          name="prj_end_date_actual_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.prj_end_date_actual_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              "prj_end_date_actual_gc",
                              formatedDate
                            ); // Set value in Formik
                          }}
                          onBlur={validation.handleBlur}
                        />

                        <Button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled
                        >
                          <i className="fa fa-calendar" aria-hidden="true" />
                        </Button>
                      </InputGroup>
                      {validation.touched.prj_end_date_actual_gc &&
                        validation.errors.prj_end_date_actual_gc ? (
                        <FormFeedback>
                          {validation.errors.prj_end_date_actual_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_end_date_plan_gc")}</Label>
                    <Input
                      name="prj_end_date_plan_gc"
                      type="text"
                      placeholder={t("prj_end_date_plan_gc")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_end_date_plan_gc || ""}
                      invalid={
                        validation.touched.prj_end_date_plan_gc &&
                          validation.errors.prj_end_date_plan_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_end_date_plan_gc &&
                      validation.errors.prj_end_date_plan_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_end_date_plan_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_urban_ben_number")}</Label>
                    <Input
                      name="prj_urban_ben_number"
                      type="number"
                      placeholder={t("prj_urban_ben_number")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_urban_ben_number || ""}
                      invalid={
                        validation.touched.prj_urban_ben_number &&
                          validation.errors.prj_urban_ben_number
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_urban_ben_number &&
                      validation.errors.prj_urban_ben_number ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_urban_ben_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_rural_ben_number")}</Label>
                    <Input
                      name="prj_rural_ben_number"
                      type="number"
                      placeholder={t("prj_rural_ben_number")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_rural_ben_number || ""}
                      invalid={
                        validation.touched.prj_rural_ben_number &&
                          validation.errors.prj_rural_ben_number
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_rural_ben_number &&
                      validation.errors.prj_rural_ben_number ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_rural_ben_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_outcome")}</Label>
                    <Input
                      name="prj_outcome"
                      type="textarea"
                      placeholder={t("prj_outcome")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_outcome || ""}
                      invalid={
                        validation.touched.prj_outcome &&
                          validation.errors.prj_outcome
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_outcome &&
                      validation.errors.prj_outcome ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_outcome}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_remark")}</Label>
                    <Input
                      name="prj_remark"
                      type="textarea"
                      placeholder={t("prj_remark")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_remark || ""}
                      invalid={
                        validation.touched.prj_remark &&
                          validation.errors.prj_remark
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_remark &&
                      validation.errors.prj_remark ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_remark}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProject.isPending || updateProject.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProject.isPending ||
                            updateProject.isPending ||
                            !validation.dirty
                          }
                        >
                          <Spinner size={"sm"} color="light" className="me-2" />
                          {t("Save")}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProject.isPending ||
                            updateProject.isPending ||
                            !validation.dirty
                          }
                        >
                          {t("Save")}
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>

      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={projectMetaData.prj_name}
          id={projectMetaData.prj_id}
          navItems={[
            "Documents",
            "Payments",
            "Stakeholder",
            "Contractor",
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
ProjectModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectModel;
