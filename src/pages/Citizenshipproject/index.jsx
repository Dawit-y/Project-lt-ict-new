import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { before, isEmpty, update } from "lodash";
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./ag-grid.css";
import { useSearchProjects, useFetchProject, useAddProject, useUpdateProject, useDeleteProject } from "../../queries/citizenship_project_query";
import { useSearchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Row,
  Input,
  Badge,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormFeedback,
  Label,
  Spinner
} from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup"
import { createSelectOptions, createMultiSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists";
import SearchForProject from "../../components/Common/SearchForProject";
import ExportToExcel from "../../components/Common/ExportToExcel";
import ExportToPDF from "../../components/Common/ExportToPdf";
import PrintPage from "../../components/Common/PrintPage";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
  onlyAmharicValidation
} from "../../utils/Validation/validation";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import DatePicker from "../../components/Common/DatePicker"
import AgGridContainer from "../../components/Common/AgGridContainer";
import AdvancedSearch from "../../components/Common/AdvancedSearch";

const ProjectModel = () => {
  document.title = "Citizenship Projects List ";
  const { t, i18n } = useTranslation();
  const lang = i18n.language
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [project, setProject] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [include, setInclude] = useState(0);

  const [params, setParams] = useState({});
  const [searchParams, setSearchParams] = useState({});
  const {
    data: searchData,
    error: srError,
    isError: isSrError,
    refetch: search,
  } = useSearchProjects(searchParams);

  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const { data, isLoading, error, isError, refetch } = useState(false);
  const param = { owner_type_id: "3" };
  const { data: projectCategoryData } = useSearchProjectCategorys(param);
  const {
    pct_name_en: projectCategoryOptionsEn,
    pct_name_or: projectCategoryOptionsOr,
    pct_name_am: projectCategoryOptionsAm,
  } = createMultiSelectOptions(
    projectCategoryData?.data || [],
    "pct_id",
    ["pct_name_en", "pct_name_or", "pct_name_am"]
  );
  const { data: sectorInformationData } = useFetchSectorInformations();
  const sectorInformationOptions = createSelectOptions(
    sectorInformationData?.data || [],
    "sci_id",
    "sci_name_en"
  );
  const { data: projectStatusData } = useFetchProjectStatuss();
  const {
    prs_status_name_en: projectStatusOptionsEn,
    prs_status_name_or: projectStatusOptionsOr,
    prs_status_name_am: projectStatusOptionsAm,
  } = createMultiSelectOptions(
    projectStatusData?.data || [],
    "prs_id",
    ["prs_status_name_en", "prs_status_name_or", "prs_status_name_am"]
  );
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSearchLoading(true);
        await search();
        setShowSearchResult(true);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsSearchLoading(false);
      }
    };
    if (Object.keys(searchParams).length > 0) {
      fetchData();
    }
  }, [searchParams]);

  useEffect(() => {
    setProjectParams({
      ...(prjLocationRegionId && {
        prj_location_region_id: prjLocationRegionId,
      }),
      ...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
      ...(prjLocationWoredaId && {
        prj_location_woreda_id: prjLocationWoredaId,
      }),
      ...(include === 1 && { include: include }),
    });
  }, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);

  const handleAddProject = async (data) => {
    try {
      await addProject.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateProject = async (data) => {
    try {
      await updateProject.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
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
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(t("delete_success"), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      prj_name: (project && project.prj_name) || "",
      prj_name_am: (project && project.prj_name_am) || "",
      prj_name_en: (project && project.prj_name_en) || "",
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
      //prj_owner_region_id: (project && project.prj_owner_region_id) || "",
      /*prj_owner_zone_id: (project && project.prj_owner_zone_id) || "",
      prj_owner_woreda_id: (project && project.prj_owner_woreda_id) || "",
      prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",*/
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
      // prj_department_id: (project && project.prj_department_id) || "",
      is_deletable: (project && project.is_deletable) || 1,
      is_editable: (project && project.is_editable) || 1,
      prj_male_participant: (project && project.prj_male_participant) || "0",
      prj_female_participant: (project && project.prj_female_participant) || "0",
      prj_job_opportunity: (project && project.prj_job_opportunity) || "",
    },

    validationSchema: Yup.object({
      prj_name: alphanumericValidation(3, 200, true).test(
        "unique-prj_name",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) => item.prj_name == value && item.prj_id !== project?.prj_id
          );
        }
      ),
      prj_name_am: onlyAmharicValidation(3, 200, true)
        .test("unique-prj_name_am", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) =>
              item.prj_name_am == value && item.prj_id !== project?.prj_id
          );
        }),
      prj_name_en: alphanumericValidation(3, 200, true).test(
        "unique-prj_name_en",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.prj_name_en == value && item.prj_id !== project?.prj_id
          );
        }
      ),
      prj_code: alphanumericValidation(3, 20, false),
      prj_project_status_id: Yup.number().required(t('prj_project_status_id')),
      prj_project_category_id: numberValidation(1, 200, true),
      //prj_project_budget_source_id: Yup.string().required(t('prj_project_budget_source_id')),
      //prj_total_estimate_budget: amountValidation(1000, 1000000000000, true),

      prj_total_actual_budget: amountValidation(1000, 1000000000000, false),
      //prj_geo_location: Yup.string().required(t('prj_geo_location')),
      //prj_sector_id: Yup.string().required(t("prj_sector_id")),
      prj_location_region_id: Yup.string().required(
        t("prj_location_region_id")
      ),
      prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
      prj_location_woreda_id: Yup.string().required(
        t("prj_location_woreda_id")
      ),
      //prj_department_id: Yup.string().required(t("prj_department_id")),
      prj_urban_ben_number: numberValidation(10, 10000000, false),
      prj_rural_ben_number: numberValidation(10, 10000000, false),
      prj_location_description: alphanumericValidation(3, 425, false),
      //prj_outcome: alphanumericValidation(3, 425, true),
      prj_remark: alphanumericValidation(3, 425, false),
      prj_male_participant: Yup.number()
        .typeError("Must be a number")
        .integer("Must be an integer")
        .min(0, "Must be 0 or greater")
        .required("This field is required"),

      prj_female_participant: Yup.number()
        .typeError("Must be a number")
        .integer("Must be an integer")
        .min(0, "Must be 0 or greater")
        .required("This field is required"),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProject = {
          prj_id: project.prj_id,
          prj_name: values.prj_name,
          prj_name_am: values.prj_name_am,
          prj_name_en: values.prj_name_en,
          prj_code: values.prj_code,
          prj_project_status_id: values.prj_project_status_id,
          prj_project_category_id: values.prj_project_category_id,
          prj_project_budget_source_id: values.prj_project_budget_source_id,
          prj_total_estimate_budget: values.prj_total_estimate_budget,
          prj_total_actual_budget: values.prj_total_actual_budget,
          prj_geo_location: values.prj_geo_location,
          // prj_sector_id: Number(selectedPage.data.pri_sector_id),
          prj_location_region_id: Number(values.prj_location_region_id),
          prj_location_zone_id: Number(values.prj_location_zone_id),
          prj_location_woreda_id: Number(values.prj_location_woreda_id),
          prj_location_kebele_id: values.prj_location_kebele_id,
          prj_location_description: values.prj_location_description,
          prj_owner_region_id: Number(prjLocationRegionId),
          prj_owner_zone_id: Number(prjLocationZoneId),
          prj_owner_woreda_id: Number(prjLocationWoredaId),
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
          //prj_department_id: Number(values.prj_department_id),
          // prj_program_id: Number(selectedPage.data.pri_id),
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,

          prj_male_participant: values.prj_male_participant,
          prj_female_participant: values.prj_female_participant,
          prj_job_opportunity: values.prj_job_opportunity

        };
        // update Project
        handleUpdateProject(updateProject);
      } else {
        const newProject = {
          prj_name: values.prj_name,
          prj_name_am: values.prj_name_am,
          prj_name_en: values.prj_name_en,
          prj_code: values.prj_code,
          prj_project_status_id: values.prj_project_status_id,
          prj_project_category_id: values.prj_project_category_id,
          prj_project_budget_source_id: values.prj_project_budget_source_id,
          prj_total_estimate_budget: values.prj_total_estimate_budget,
          prj_total_actual_budget: values.prj_total_actual_budget,
          prj_geo_location: values.prj_geo_location,
          // prj_sector_id: Number(selectedPage.data.pri_sector_id),
          prj_location_region_id: Number(values.prj_location_region_id),
          prj_location_zone_id: Number(values.prj_location_zone_id),
          prj_location_woreda_id: Number(values.prj_location_woreda_id),
          prj_location_kebele_id: values.prj_location_kebele_id,
          prj_location_description: values.prj_location_description,
          prj_owner_region_id: Number(prjLocationRegionId),
          prj_owner_zone_id: Number(prjLocationZoneId),
          prj_owner_woreda_id: Number(prjLocationWoredaId),
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

          prj_male_participant: values.prj_male_participant,
          prj_female_participant: values.prj_female_participant,
          prj_job_opportunity: values.prj_job_opportunity

          //prj_department_id: Number(values.prj_department_id),
          // prj_program_id: Number(selectedPage.data.pri_id)
        };
        // save new Project
        handleAddProject(newProject);
      }
    },
  });

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

  const handleNodeSelect = useCallback(
    (node) => {
      if (node.level === "region") {
        setPrjLocationRegionId(node.id);
        setPrjLocationZoneId(null);
        setPrjLocationWoredaId(null);
      } else if (node.level === "zone") {
        setPrjLocationZoneId(node.id);
        setPrjLocationWoredaId(null);
      } else if (node.level === "woreda") {
        setPrjLocationWoredaId(node.id);
      }

      if (showSearchResult) {
        setShowSearchResult(false);
      }
    },
    [
      setPrjLocationRegionId,
      setPrjLocationZoneId,
      setPrjLocationWoredaId,
      showSearchResult,
      setShowSearchResult,
    ]
  );
  const handleProjectClick = (arg) => {
    const project = arg;
    setProject({
      prj_id: project.prj_id,
      prj_name: project.prj_name,
      prj_name_am: project.prj_name_am,
      prj_name_en: project.prj_name_en,
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
      //prj_department_id: project.prj_department_id,
      is_deletable: project.is_deletable,
      is_editable: project.is_editable,
      prj_male_participant: project.prj_male_participant,
      prj_female_participant: project.prj_female_participant,
      prj_job_opportunity: project.prj_job_opportunity
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

  const handleProjectClicks = () => {
    validation.resetForm()
    setIsEdit(false);
    setProject("");
    toggle();
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
  };
  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: t("S.N"),
        field: "sn",
        valueGetter: (params) => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        flex: 1,
      },
      {
        field: "prj_name",
        headerName: t("prj_name"),
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 5
      },
      {
        field: "prj_code",
        headerName: t("prj_code"),
        sortable: true,
        filter: "agTextColumnFilter",
        /*floatingFilter: true,*/
        flex: 3
      },
      {
        field: "zone_name",
        headerName: t("prj_owner_zone_id"),
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 2.5
      },
      {
        headerName: t("prs_status"),
        field: "bdr_request_status",
        sortable: true,
        filter: true,
        flex: 2,
        cellRenderer: (params) => {
          const badgeClass = params.data.color_code;
          return (
            <Badge className={`font-size-12 badge-soft-${badgeClass}`}>
              {params.data.status_name}
            </Badge>
          );
        },
      },
      {
        field: "prj_total_estimate_budget",
        headerName: t("prj_total_estimate_budget"),
        flex: 3,
        valueFormatter: (params) => {
          if (params.node.footer) {
            return params.value
              ? `$${params.value.toLocaleString()}` // Show total in footer
              : "";
          }
          return params.value ? `${params.value.toLocaleString()}` : "";
        },
      },
      {
        headerName: t("view_details"),
        sortable: false,
        filter: false,
        flex: 1.5,
        cellRenderer: (params) => {
          if (params.node.footer) {
            return ""; // Suppress button for footer
          }
          const { prj_id } = params.data || {};
          return (
            <Link to={`/citizenship_project_detail/${prj_id}`} target="_blank">
              <Button type="button" className="btn-sm mb-1 default" outline>
                <i className="fa fa-eye"></i>
              </Button>
            </Link>
          );
        },
      },
    ];
    if (
      searchData?.previledge?.is_role_editable == 1 ||
      searchData?.previledge?.is_role_deletable == 1
    ) {
      baseColumnDefs.push({
        headerName: t("Action"),
        filter: false,
        sortable: true,
        cellRenderer: (params) => {
          return (
            <div className="d-flex gap-3">
              {(searchData?.previledge?.is_role_editable == 1 && params.data?.is_editable == 1) && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = params.data;
                    handleProjectClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      });
    }
    return baseColumnDefs;
  }, [data, onClickDelete, t, searchData]);

  const rowData = useMemo(() => {
    return showSearchResult ? searchData?.data : data?.data || [];
  }, [showSearchResult, searchData?.data, data?.data]);

  const searchConfig = useMemo(
    () => ({
      params,
      projectParams,
      showSearchResult,
    }),
    [params, projectParams, showSearchResult]
  );

  const handleSearch = useCallback((searchResults) => {
    setSearchResults(searchResults);
    setShowSearchResult(true);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  }, []);

  if (isSrError) {
    return <FetchErrorHandler error={srError} refetch={search} />;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
          <div className="w-100 d-flex gap-2">
            <>
              <TreeForLists
                onNodeSelect={handleNodeSelect}
                setIsAddressLoading={setIsAddressLoading}
                setInclude={setInclude}
              />
              <div className="w-100">
                <SearchForProject
                  textSearchKeys={["prj_name", "prj_code"]}
                  dropdownSearchKeys={[
                    {
                      key: "prj_project_category_id",
                      options: lang === "en"
                        ? projectCategoryOptionsEn
                        : lang === "am"
                          ? projectCategoryOptionsAm
                          : projectCategoryOptionsOr
                      ,
                    }
                  ]}
                  checkboxSearchKeys={[]}
                  additionalParams={searchConfig.projectParams}
                  setAdditionalParams={setProjectParams}
                  setSearchResults={handleSearch}
                  setShowSearchResult={setShowSearchResult}
                  params={searchConfig.params}
                  setParams={setParams}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
                <div
                  className="ag-theme-alpine"
                  style={{ height: "100%", width: "100%" }}
                >
                  <Row className="mb-3">
                    <Col sm="12" md="4">
                      <Input
                        type="text"
                        placeholder={t("filter") + "..."}
                        onChange={(e) => setQuickFilterText(e.target.value)}
                        className="mb-2"
                      />
                    </Col>
                    <Col
                      sm="12"
                      md="8"
                      className="text-md-end d-flex align-items-center justify-content-end gap-2"
                    >
                      <Col sm="12" md="6" className="text-md-end">
                        <Button color="success" disabled={!prjLocationWoredaId} onClick={handleProjectClicks}>
                          {t("add")}
                        </Button>
                      </Col>
                      <ExportToExcel
                        tableData={searchData?.data || []}
                        tablename={"projects"}
                        excludeKey={["is_editable", "is_deletable"]}
                      />
                      <ExportToPDF
                        tableData={searchData?.data || []}
                        tablename={"projects"}
                        excludeKey={["is_editable", "is_deletable"]}
                      />
                      <PrintPage
                        tableData={searchData?.data || []}
                        tablename={t("Projects")}
                        excludeKey={["is_editable", "is_deletable"]}
                        gridRef={gridRef}
                        columnDefs={columnDefs}
                        columnsToIgnore="3"
                      />
                    </Col>
                  </Row>
                  <div style={{ height: "500px", overflow: "visible" }}>
                    <AgGridReact
                      rowStyle={{ overflow: "visible" }}
                      ref={gridRef}
                      rowData={rowData}
                      immutableData={true}
                      getRowId={(params) => String(params.data.prj_id)}
                      columnDefs={columnDefs}
                      pagination={true}
                      paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                      paginationPageSize={10}
                      quickFilterText={quickFilterText}
                      onSelectionChanged={onSelectionChanged}
                      rowHeight={32} // Set the row height here
                      animateRows={true} // Enables row animations
                      domLayout="autoHeight" // Auto-size the grid to fit content
                      onGridReady={(params) => {
                        params.api.sizeColumnsToFit(); // Size columns to fit the grid width
                      }}
                      localeText={localeText} // Dynamically translated texts
                    />
                  </div>
                </div>
              </div>
            </>
          </div>
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
                      isEdit={isEdit}
                      row
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
                      value={
                        validation.values.prj_location_description || ""
                      }
                      invalid={
                        validation.touched.prj_location_description &&
                          validation.errors.prj_location_description
                          ? true
                          : false
                      }
                      maxLength={200}
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
                      {t("prj_name_or")}
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
                      maxLength={200}
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
                      {t("prj_name_am")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_name_am"
                      type="text"
                      placeholder={t("prj_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_name_am || ""}
                      invalid={
                        validation.touched.prj_name_am &&
                          validation.errors.prj_name_am
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.prj_name_am &&
                      validation.errors.prj_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_name_en")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_name_en"
                      type="text"
                      placeholder={t("prj_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_name_en || ""}
                      invalid={
                        validation.touched.prj_name_en &&
                          validation.errors.prj_name_en
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.prj_name_en &&
                      validation.errors.prj_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_code")}
                      {/* <span className="text-danger">*</span> */}
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
                      value={
                        validation.values.prj_project_category_id || ""
                      }
                      invalid={
                        validation.touched.prj_project_category_id &&
                          validation.errors.prj_project_category_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>
                        {t("prj_select_category")}
                      </option>
                      {lang === "en"
                        ? projectCategoryOptionsEn.map((option) => (
                          <option key={option.value} value={option.value}>
                            {t(`${option.label}`)}
                          </option>
                        ))
                        : lang === "am"
                          ? projectCategoryOptionsAm.map((option) => (
                            <option key={option.value} value={option.value}>
                              {t(`${option.label}`)}
                            </option>
                          ))
                          : projectCategoryOptionsOr.map((option) => (
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
                    <DatePicker
                      isRequired={true}
                      componentId={"prj_start_date_plan_gc"}
                      validation={validation}
                    />
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <DatePicker
                      isRequired={true}
                      componentId={"prj_end_date_plan_gc"}
                      validation={validation}
                      minDate={validation.values.prj_start_date_plan_gc}
                    />
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <DatePicker
                      isRequired={true}
                      componentId={"prj_end_date_actual_gc"}
                      validation={validation}
                    />
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_project_status_id")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prj_project_status_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.prj_project_status_id || ""
                      }
                      invalid={
                        validation.touched.prj_project_status_id &&
                          validation.errors.prj_project_status_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>
                        {t("Select Status")}
                      </option>
                      {lang === "en"
                        ? projectStatusOptionsEn.map((option) => (
                          <option key={option.value} value={option.value}>
                            {t(`${option.label}`)}
                          </option>
                        ))
                        : lang === "am"
                          ? projectStatusOptionsAm.map((option) => (
                            <option key={option.value} value={option.value}>
                              {t(`${option.label}`)}
                            </option>
                          ))
                          : projectStatusOptionsOr.map((option) => (
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
                  <Col className="col-md-4 mb-3">
                    <Label>
                      {t("prj_total_estimate_budget")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      maxLength="12"
                      min={0}
                      step=".01"
                      name="prj_total_estimate_budget"
                      type="number"
                      placeholder={t("prj_total_estimate_budget")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.prj_total_estimate_budget || ""
                      }
                      invalid={
                        validation.touched.prj_total_estimate_budget &&
                          validation.errors.prj_total_estimate_budget
                          ? true
                          : false
                      }
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
                      min={0}
                      placeholder={t("prj_total_actual_budget")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.prj_total_actual_budget || ""
                      }
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
                      min={0}
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
                      min={0}
                    />
                    {validation.touched.prj_rural_ben_number &&
                      validation.errors.prj_rural_ben_number ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_rural_ben_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_male_participant")}</Label>
                    <Input
                      name="prj_male_participant"
                      type="number"
                      placeholder={t("prj_male_participant")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_male_participant || ""}
                      invalid={
                        validation.touched.prj_male_participant &&
                          validation.errors.prj_male_participant
                          ? true
                          : false
                      }
                      min={0}
                    />
                    {validation.touched.prj_male_participant &&
                      validation.errors.prj_male_participant ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_male_participant}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("prj_female_participant")}</Label>
                    <Input
                      name="prj_female_participant"
                      type="number"
                      placeholder={t("prj_female_participant")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_female_participant || ""}
                      invalid={
                        validation.touched.prj_female_participant &&
                          validation.errors.prj_female_participant
                          ? true
                          : false
                      }
                      min={0}
                    />
                    {validation.touched.prj_female_participant &&
                      validation.errors.prj_female_participant ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_female_participant}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_job_opportunity")}</Label>
                    <Input
                      name="prj_job_opportunity"
                      type="textarea"
                      rows={4}
                      placeholder={t("prj_job_opportunity")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prj_job_opportunity || ""}
                      invalid={
                        validation.touched.prj_job_opportunity &&
                          validation.errors.prj_job_opportunity
                          ? true
                          : false
                      }
                    />
                    {validation.touched.prj_job_opportunity &&
                      validation.errors.prj_job_opportunity ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prj_job_opportunity}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prj_outcome")}</Label>
                    <Input
                      name="prj_outcome"
                      type="textarea"
                      rows={4}
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
                      maxLength={200}
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
                      rows={4}
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
                      maxLength={200}
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
                          <Spinner
                            size={"sm"}
                            color="light"
                            className="me-2"
                          />
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
    </React.Fragment>
  );
};
ProjectModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;