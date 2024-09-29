import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getProject as onGetProject,
  addProject as onAddProject,
  updateProject as onUpdateProject,
  deleteProject as onDeleteProject,
} from "../../store/project/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import ProjectModal from "./ProjectModal";
import { useTranslation } from "react-i18next";

import RightOffCanvas from "../../components/Common/RightOffCanvas";

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
import { ToastContainer } from "react-toastify";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectModel = () => {
  //meta title
  document.title = " Project";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [project, setProject] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS
  const [projectStatusOptions, setProjectStatusOptions] = useState([]);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState("");
  const [projectCategoryOptions, setProjectCategoryOptions] = useState([]);
  const [selectedProjectCategory, setSelectedProjectCategory] = useState("");
  const [budgetSourceOptions, setBudgetSourceOptions] = useState([]);
  const [selectedBudgetSource, setSelectedBudgetSource] = useState("");
  const [projectMetaData, setProjectMetaData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}project_status/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.prs_status_name_or.toString(),
          value: item.prs_status_name_or.toString(),
        }));
        const optionsWithDefault = [
          { label: "select budget year", value: "" },
          ...transformedData,
        ];
        setProjectStatusOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching budget years:", error);
      }
    };
    fetchProjectStatus();
  }, []);
  const handleProjectStatusChange = (e) => {
    setSelectedProjectStatus(e.target.value);
    validation.setFieldValue("prj_project_status_id", e.target.value);
  };

  const handleClick = (data) => {
    setShowCanvas(!showCanvas); // Toggle canvas visibility
    console.log(data, "project data");
    setProjectMetaData(data);
  };

  useEffect(() => {
    const fetchProjectCategory = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}project_category/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.pct_name_or.toString(),
          value: item.pct_name_or.toString(),
        }));
        const optionsWithDefault = [
          { label: "select budget year", value: "" },
          ...transformedData,
        ];
        setProjectCategoryOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching budget years:", error);
      }
    };
    fetchProjectCategory();
  }, []);
  const handleProjectCategoryChange = (e) => {
    setSelectedProjectCategory(e.target.value);
    validation.setFieldValue("prj_project_category_id", e.target.value);
  };
  useEffect(() => {
    const fetchBudgetSource = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}budget_source/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.pbs_name_or.toString(),
          value: item.pbs_name_or.toString(),
        }));
        const optionsWithDefault = [
          { label: "select budget year", value: "" },
          ...transformedData,
        ];
        setBudgetSourceOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching budget years:", error);
      }
    };
    fetchBudgetSource();
  }, []);
  const handleBudgetSourceChange = (e) => {
    setSelectedBudgetSource(e.target.value);
    validation.setFieldValue("prj_project_budget_source_id", e.target.value);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      prj_name: (project && project.prj_name) || "",
      prj_code: (project && project.prj_code) || "",
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
      prj_name: Yup.string().required(t("prj_name")),
      prj_code: Yup.string().required(t("prj_code")),
      prj_total_estimate_budget: Yup.string().required(
        t("prj_total_estimate_budget")
      ),
      prj_total_actual_budget: Yup.string().required(
        t("prj_total_actual_budget")
      ),
      prj_geo_location: Yup.string().required(t("prj_geo_location")),
      prj_sector_id: Yup.string().required(t("prj_sector_id")),
      prj_location_region_id: Yup.string().required(
        t("prj_location_region_id")
      ),
      prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
      prj_location_woreda_id: Yup.string().required(
        t("prj_location_woreda_id")
      ),
      prj_location_kebele_id: Yup.string().required(
        t("prj_location_kebele_id")
      ),
      prj_location_description: Yup.string().required(
        t("prj_location_description")
      ),
      prj_owner_region_id: Yup.string().required(t("prj_owner_region_id")),
      prj_owner_zone_id: Yup.string().required(t("prj_owner_zone_id")),
      prj_owner_woreda_id: Yup.string().required(t("prj_owner_woreda_id")),
      prj_owner_kebele_id: Yup.string().required(t("prj_owner_kebele_id")),
      prj_owner_description: Yup.string().required(t("prj_owner_description")),
      prj_start_date_et: Yup.string().required(t("prj_start_date_et")),
      prj_start_date_gc: Yup.string().required(t("prj_start_date_gc")),
      prj_start_date_plan_et: Yup.string().required(
        t("prj_start_date_plan_et")
      ),
      prj_start_date_plan_gc: Yup.string().required(
        t("prj_start_date_plan_gc")
      ),
      prj_end_date_actual_et: Yup.string().required(
        t("prj_end_date_actual_et")
      ),
      prj_end_date_actual_gc: Yup.string().required(
        t("prj_end_date_actual_gc")
      ),
      prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
      prj_end_date_plan_et: Yup.string().required(t("prj_end_date_plan_et")),
      prj_outcome: Yup.string().required(t("prj_outcome")),
      prj_deleted: Yup.string().required(t("prj_deleted")),
      prj_remark: Yup.string().required(t("prj_remark")),
      prj_created_date: Yup.string().required(t("prj_created_date")),
      prj_owner_id: Yup.string().required(t("prj_owner_id")),
      prj_urban_ben_number: Yup.string().required(t("prj_urban_ben_number")),
      prj_rural_ben_number: Yup.string().required(t("prj_rural_ben_number")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProject = {
          prj_id: project ? project.prj_id : 0,
          prj_name: values.prj_name,
          prj_code: values.prj_code,
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
        dispatch(onUpdateProject(updateProject));
        validation.resetForm();
      } else {
        const newProject = {
          prj_name: values.prj_name,
          prj_code: values.prj_code,
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
        // save new Projects
        dispatch(onAddProject(newProject));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch Project on component mount
  useEffect(() => {
    dispatch(onGetProject());
  }, [dispatch]);

  const projectProperties = createSelector(
    (state) => state.ProjectR, // this is geting from  reducer
    (ProjectReducer) => ({
      // this is from Project.reducer
      project: ProjectReducer.project,
      loading: ProjectReducer.loading,
      update_loading: ProjectReducer.update_loading,
    })
  );

  const {
    project: { data, previledge },
    loading,
    update_loading,
  } = useSelector(projectProperties);

  useEffect(() => {
    console.log("update_loading in useEffect", update_loading);
    setModal(false);
  }, [update_loading]);

  const selectSearchProperties = createSelector(
    (state) => state.search,
    (search) => ({
      results: search.results,
    })
  );

  const { results } = useSelector(selectSearchProperties);

  const [isLoading, setLoading] = useState(loading);
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

  const handleProjectClick = (arg) => {
    const project = arg;
    // console.log("handleProjectClick", project);
    setProject({
      prj_id: project.prj_id,
      prj_name: project.prj_name,
      prj_code: project.prj_code,
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

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (project) => {
    setProject(project);
    setDeleteModal(true);
  };

  const handleDeleteProject = () => {
    if (project && project.prj_id) {
      dispatch(onDeleteProject(project.prj_id));
      setDeleteModal(false);
    }
  };
  const handleProjectClicks = () => {
    setIsEdit(false);
    setProject("");
    toggle();
  };
  const handleSearch = () => {
    setSearchLoading(true); // Set loading to true when search is initiated// Update filtered data with search results
    setShowSearchResults(true); // Show search results
    setSearchLoading(false);
  };

  const handleClearSearch = () => {
    setShowSearchResults(false);
  };

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
        accessorKey: "prj_total_estimate_budget",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_total_estimate_budget,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_total_actual_budget",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_total_actual_budget,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_geo_location",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_geo_location, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_sector_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_sector_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_location_region_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_location_region_id,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_location_zone_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_location_zone_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_location_woreda_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_location_woreda_id,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_location_kebele_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_location_kebele_id,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_location_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_location_description,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_owner_region_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_owner_region_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_owner_zone_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_owner_zone_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_owner_woreda_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_owner_woreda_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_owner_kebele_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_owner_kebele_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_owner_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_owner_description, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_start_date_et",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_start_date_et, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_start_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_start_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_start_date_plan_et",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_start_date_plan_et,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_start_date_plan_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_start_date_plan_gc,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_end_date_actual_et",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_end_date_actual_et,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_end_date_actual_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prj_end_date_actual_gc,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_end_date_plan_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_end_date_plan_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_end_date_plan_et",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_end_date_plan_et, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_outcome",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_outcome, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_deleted",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_deleted, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_remark",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_remark, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_created_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_created_date, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_owner_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_owner_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_urban_ben_number",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_urban_ben_number, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prj_rural_ben_number",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prj_rural_ben_number, 30) ||
                "-"}
            </span>
          );
        },
      },

      {
        header: t("view_detail"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                const data = cellProps.row.original;
                toggleViewModal(data);
                setTransaction(cellProps.row.original);
              }}
            >
              {t("view_detail")}
            </Button>
          );
        },
      },
    ];
    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProjectClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
              {cellProps.row.original.is_editable && (
                <Link
                  to="#"
                  className="text-secondary"
                  onClick={() => {
                    const ProjectData = cellProps.row.original;
                    // console.log("handleProjectClick before edit", ProjectData);
                    handleClick(ProjectData);
                    // console.log("update search result table dtata",)
                  }}
                  //  onClick={handleClick}
                >
                  <i className="mdi mdi-eye font-size-18" id="viewtooltip" />

                  <UncontrolledTooltip placement="top" target="viewtooltip">
                    View
                  </UncontrolledTooltip>
                </Link>
              )}

              {cellProps.row.original.is_deletable && (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => {
                    const data = cellProps.row.original;
                    onClickDelete(data);
                  }}
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [handleProjectClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

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
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={showSearchResults ? results : data}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleProjectClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project")}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
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
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateProject(validation.values, modalCallback);
                  } else {
                    onAddProject(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_name")}</Label>
                    <Input
                      name="prj_name"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_code")}</Label>
                    <Input
                      name="prj_code"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_project_status_id")}</Label>
                    <Input
                      name="prj_project_status_id"
                      type="select"
                      className="form-select"
                      onChange={handleProjectStatusChange}
                      onBlur={validation.handleBlur}
                      value={selectedProjectStatus}
                    >
                      {projectStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.prj_project_status_id &&
                    validation.errors.prj_project_status_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_project_status_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_project_category_id")}</Label>
                    <Input
                      name="prj_project_category_id"
                      type="select"
                      className="form-select"
                      onChange={handleProjectCategoryChange}
                      onBlur={validation.handleBlur}
                      value={selectedProjectCategory}
                    >
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_project_budget_source_id")}</Label>
                    <Input
                      name="prj_project_budget_source_id"
                      type="select"
                      className="form-select"
                      onChange={handleBudgetSourceChange}
                      onBlur={validation.handleBlur}
                      value={selectedBudgetSource}
                    >
                      {budgetSourceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.prj_project_budget_source_id &&
                    validation.errors.prj_project_budget_source_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_project_budget_source_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_total_estimate_budget")}</Label>
                    <Input
                      name="prj_total_estimate_budget"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_total_actual_budget")}</Label>
                    <Input
                      name="prj_total_actual_budget"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_geo_location")}</Label>
                    <Input
                      name="prj_geo_location"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_geo_location || ""}
                      invalid={
                        validation.touched.prj_geo_location &&
                        validation.errors.prj_geo_location
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_geo_location &&
                    validation.errors.prj_geo_location ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_geo_location}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_sector_id")}</Label>
                    <Input
                      name="prj_sector_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_sector_id || ""}
                      invalid={
                        validation.touched.prj_sector_id &&
                        validation.errors.prj_sector_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_sector_id &&
                    validation.errors.prj_sector_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_sector_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_location_region_id")}</Label>
                    <Input
                      name="prj_location_region_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_location_region_id || ""}
                      invalid={
                        validation.touched.prj_location_region_id &&
                        validation.errors.prj_location_region_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_location_region_id &&
                    validation.errors.prj_location_region_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_location_region_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_location_zone_id")}</Label>
                    <Input
                      name="prj_location_zone_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_location_zone_id || ""}
                      invalid={
                        validation.touched.prj_location_zone_id &&
                        validation.errors.prj_location_zone_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_location_zone_id &&
                    validation.errors.prj_location_zone_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_location_zone_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_location_woreda_id")}</Label>
                    <Input
                      name="prj_location_woreda_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_location_woreda_id || ""}
                      invalid={
                        validation.touched.prj_location_woreda_id &&
                        validation.errors.prj_location_woreda_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_location_woreda_id &&
                    validation.errors.prj_location_woreda_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_location_woreda_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_location_kebele_id")}</Label>
                    <Input
                      name="prj_location_kebele_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_location_kebele_id || ""}
                      invalid={
                        validation.touched.prj_location_kebele_id &&
                        validation.errors.prj_location_kebele_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_location_kebele_id &&
                    validation.errors.prj_location_kebele_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_location_kebele_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_location_description")}</Label>
                    <Input
                      name="prj_location_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_owner_region_id")}</Label>
                    <Input
                      name="prj_owner_region_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_owner_region_id || ""}
                      invalid={
                        validation.touched.prj_owner_region_id &&
                        validation.errors.prj_owner_region_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_owner_region_id &&
                    validation.errors.prj_owner_region_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_owner_region_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_owner_zone_id")}</Label>
                    <Input
                      name="prj_owner_zone_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_owner_zone_id || ""}
                      invalid={
                        validation.touched.prj_owner_zone_id &&
                        validation.errors.prj_owner_zone_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_owner_zone_id &&
                    validation.errors.prj_owner_zone_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_owner_zone_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_owner_woreda_id")}</Label>
                    <Input
                      name="prj_owner_woreda_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_owner_woreda_id || ""}
                      invalid={
                        validation.touched.prj_owner_woreda_id &&
                        validation.errors.prj_owner_woreda_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_owner_woreda_id &&
                    validation.errors.prj_owner_woreda_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_owner_woreda_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_owner_kebele_id")}</Label>
                    <Input
                      name="prj_owner_kebele_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_owner_kebele_id || ""}
                      invalid={
                        validation.touched.prj_owner_kebele_id &&
                        validation.errors.prj_owner_kebele_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_owner_kebele_id &&
                    validation.errors.prj_owner_kebele_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_owner_kebele_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_owner_description")}</Label>
                    <Input
                      name="prj_owner_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_owner_description || ""}
                      invalid={
                        validation.touched.prj_owner_description &&
                        validation.errors.prj_owner_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_owner_description &&
                    validation.errors.prj_owner_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_owner_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_start_date_et")}</Label>
                    <Input
                      name="prj_start_date_et"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_start_date_et || ""}
                      invalid={
                        validation.touched.prj_start_date_et &&
                        validation.errors.prj_start_date_et
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_start_date_et &&
                    validation.errors.prj_start_date_et ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_start_date_et}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_start_date_gc")}</Label>
                    <Input
                      name="prj_start_date_gc"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_start_date_gc || ""}
                      invalid={
                        validation.touched.prj_start_date_gc &&
                        validation.errors.prj_start_date_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_start_date_gc &&
                    validation.errors.prj_start_date_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_start_date_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_start_date_plan_et")}</Label>
                    <Input
                      name="prj_start_date_plan_et"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_start_date_plan_et || ""}
                      invalid={
                        validation.touched.prj_start_date_plan_et &&
                        validation.errors.prj_start_date_plan_et
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_start_date_plan_et &&
                    validation.errors.prj_start_date_plan_et ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_start_date_plan_et}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_start_date_plan_gc")}</Label>
                    <Input
                      name="prj_start_date_plan_gc"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_end_date_actual_et")}</Label>
                    <Input
                      name="prj_end_date_actual_et"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_end_date_actual_et || ""}
                      invalid={
                        validation.touched.prj_end_date_actual_et &&
                        validation.errors.prj_end_date_actual_et
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_end_date_actual_et &&
                    validation.errors.prj_end_date_actual_et ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_end_date_actual_et}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_end_date_actual_gc")}</Label>
                    <Input
                      name="prj_end_date_actual_gc"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_end_date_actual_gc || ""}
                      invalid={
                        validation.touched.prj_end_date_actual_gc &&
                        validation.errors.prj_end_date_actual_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_end_date_actual_gc &&
                    validation.errors.prj_end_date_actual_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_end_date_actual_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_end_date_plan_gc")}</Label>
                    <Input
                      name="prj_end_date_plan_gc"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_end_date_plan_et")}</Label>
                    <Input
                      name="prj_end_date_plan_et"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_end_date_plan_et || ""}
                      invalid={
                        validation.touched.prj_end_date_plan_et &&
                        validation.errors.prj_end_date_plan_et
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_end_date_plan_et &&
                    validation.errors.prj_end_date_plan_et ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_end_date_plan_et}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_outcome")}</Label>
                    <Input
                      name="prj_outcome"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                    <Label>{t("prj_deleted")}</Label>
                    <Input
                      name="prj_deleted"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_deleted || ""}
                      invalid={
                        validation.touched.prj_deleted &&
                        validation.errors.prj_deleted
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_deleted &&
                    validation.errors.prj_deleted ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_deleted}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_remark")}</Label>
                    <Input
                      name="prj_remark"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_created_date")}</Label>
                    <Input
                      name="prj_created_date"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_created_date || ""}
                      invalid={
                        validation.touched.prj_created_date &&
                        validation.errors.prj_created_date
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_created_date &&
                    validation.errors.prj_created_date ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_created_date}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_owner_id")}</Label>
                    <Input
                      name="prj_owner_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_owner_id || ""}
                      invalid={
                        validation.touched.prj_owner_id &&
                        validation.errors.prj_owner_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prj_owner_id &&
                    validation.errors.prj_owner_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_owner_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_urban_ben_number")}</Label>
                    <Input
                      name="prj_urban_ben_number"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_rural_ben_number")}</Label>
                    <Input
                      name="prj_rural_ben_number"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {update_loading ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
                        >
                          <Spinner size={"sm"} color="#fff" />
                          {t("Save")}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
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
      <ToastContainer />
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          data={projectMetaData}
        />
      )}
    </React.Fragment>
  );
};
ProjectModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectModel;
