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
import "bootstrap/dist/css/bootstrap.min.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./ag-grid.css";
import {
  useFetchProjects,
  useSearchProjects,
  useAddProject,
  useDeleteProject,
  useUpdateProject,
} from "../../queries/project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useFetchDepartments } from "../../queries/department_query";
import { useTranslation } from "react-i18next";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import ProjectDocument from "../../pages/Projectdocument/FileManager/index";
import ProjectPayment from "../../pages/Projectpayment";
import ProjectStakeholder from "../../pages/Projectstakeholder";
import Projectcontractor from "../../pages/Projectcontractor";
import GeoLocation from "../../pages/GeoLocation";
import ProjectBudgetExpenditureModel from "../Projectbudgetexpenditure";
import ProjectEmployeeModel from "../../pages/Projectemployee";
import ProjectHandoverModel from "../Projecthandover";
import ProjectPerformanceModel from "../Projectperformance";
import ProjectSupplimentaryModel from "../Projectsupplimentary";
import ProjectVariationModel from "../Projectvariation";
import ProposalRequestModel from "../../pages/Proposalrequest";
import Conversation from "../Conversationinformation/index1";
import RequestInformationModel from "../../pages/Requestinformation";
//import BudgetRequestModel from "../../pages/BudgetRequest";
//import ProjectPlanModel from "../../pages/ProjectPlan";
import { project_info } from "../../settings/printablecolumns";
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
  FormGroup,
  InputGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Badge
} from "reactstrap";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
  onlyAmharicValidation
} from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import { createSelectOptions, createMultiSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import AddressStructureForProject from "./AddressStructureForProject";
import { useProjectContext } from "../../context/ProjectContext";
import SearchForProject from "../../components/Common/SearchForProject";
import ExportToExcel from "../../components/Common/ExportToExcel";
import ExportToPDF from "../../components/Common/ExportToPdf";
import PrintPage from "../../components/Common/PrintPage";

const linkMapping = {
  34: "budget_request",
  61: "project_plan",
  39: "project_budget_expenditure"
};

const ProjectModel = () => {
  document.title = " Project";

  const [projectMetaData, setProjectMetaData] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [project, setProject] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  const {
    setSearchResults,
    isSearchLoading,
    showSearchResult,
    setShowSearchResult,
    projectParams,
    setProjectParams,
    setPrjLocationRegionId,
    setPrjLocationZoneId,
    setPrjLocationWoredaId,
    params,
    setParams,
    searchParams,
    setSearchParams,
    searchData,
    setInclude,
  } = useProjectContext();

  const tabMapping = {
    54: { label: t("project_document"), component: ProjectDocument },
    44: { label: t("project_contractor"), component: Projectcontractor },
    26: { label: t("project_payment"), component: ProjectPayment },
    53: { label: t("project_stakeholder"), component: ProjectStakeholder },
    //5: { label: "Budget Request", component: Budgetrequest },
    33: { label: t("prj_geo_location"), component: GeoLocation },
    //7: { label: "Budget Expenditures", component: ProjectBudgetExpenditureModel },
    43: { label: t("project_employee"), component: ProjectEmployeeModel },
    38: { label: t("project_handover"), component: ProjectHandoverModel },
    37: { label: t("project_performance"), component: ProjectPerformanceModel },
    41: {
      label: t("project_supplimentary"),
      component: ProjectSupplimentaryModel,
    },
    40: { label: t("project_variation"), component: ProjectVariationModel },
    58: { label: t("proposal_request"), component: ProposalRequestModel },
    57: {
      label: t("conversation_information"),
      component: Conversation,
    },
    59: { label: t("request_information"), component: RequestInformationModel },
    //46: { label: t('project_supplimentary'), component: ProjectBudgetPlan },
  };
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProjects();
  const { data: projectCategoryData } = useFetchProjectCategorys();
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

  const { data: departmentData } = useFetchDepartments();
  const {
    dep_name_en: departmentOptionsEn,
    dep_name_or: departmentOptionsOr,
    dep_name_am: departmentOptionsAm,
  } = createMultiSelectOptions(
    (departmentData?.data || []).slice(1), // Remove the item at index 0
    "dep_id",
    ["dep_name_en", "dep_name_or", "dep_name_am"]
  );
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

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
  const [allowedTabs, setAllowedTabs] = useState(searchData?.allowedTabs || []);
  const allowedLinks = searchData?.allowedLinks || []

  useEffect(() => {
    if (projectMetaData?.prj_project_status_id <= 4) {
      setAllowedTabs([54, 37]);
    } else {
      setAllowedTabs(searchData?.allowedTabs || []);
    }
  }, [projectMetaData?.prj_project_status_id, searchData]);

  const dynamicComponents = allowedTabs.reduce((acc, tabIndex) => {
    const tab = tabMapping[tabIndex];
    if (tab) {
      acc[tab.label] = tab.component;
    }
    return acc;
  }, {});

  // validation
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
      prj_department_id: (project && project.prj_department_id) || "",
      is_deletable: (project && project.is_deletable) || 1,
      is_editable: (project && project.is_editable) || 1,
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
      prj_code: alphanumericValidation(3, 20, true).test(
        "unique-prj_code",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) => item.prj_code == value && item.prj_id !== project?.prj_id
          );
        }
      ),
      //prj_project_status_id: Yup.string().required(t('prj_project_status_id')),
      prj_project_category_id: numberValidation(1, 200, true),
      //prj_project_budget_source_id: Yup.string().required(t('prj_project_budget_source_id')),
      prj_total_estimate_budget: amountValidation(1000, 1000000000000, true),

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
      prj_outcome: alphanumericValidation(3, 425, true),
      prj_remark: alphanumericValidation(3, 425, false),
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
          prj_department_id: Number(values.prj_department_id),
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
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
          prj_department_id: Number(values.prj_department_id),
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

  const handleClick = (data) => {
    setShowCanvas(!showCanvas);
    setProjectMetaData(data);
  };
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
      prj_department_id: project.prj_department_id,
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

  const handleProjectClicks = () => {
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
        flex: 5,
        valueFormatter: (params) =>
          params.node.footer ? t("Total") : params.value, // Display "Total" for footer
      },
      {
        field: "prj_code",
        headerName: t("prj_code"),
        sortable: true,
        filter: "agTextColumnFilter",
        /*floatingFilter: true,*/
        flex: 4,
        valueFormatter: (params) =>
          params.node.footer ? t("Total") : params.value, // Display "Total" for footer
      },
      {
        field: "add_name_or",
        headerName: t("prj_owner_zone_id"),
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 3,
        valueFormatter: (params) =>
          params.node.footer ? t("Total") : params.value, // Display "Total" for footer
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
          return params.value ? `$${params.value.toLocaleString()}` : "";
        },
      },
      {
        headerName: t("view_details"),
        sortable: false,
        filter: false,
        flex: 2,
        cellRenderer: (params) => {
          if (params.node.footer) {
            return ""; // Suppress button for footer
          }
          const { prj_id } = params.data || {};
          return (
            <Link to={`/Project/${prj_id}`}>
              <Button type="button" className="btn-sm mb-1 default" outline>
                <i className="fa fa-eye"></i>
              </Button>
            </Link>
          );
        },
      },
    ];
    // Add actions column based on privileges
    if (1 == 1) {
      baseColumnDefs.push({
        headerName: t("actions"),
        field: "actions",
        flex: 2,
        cellRenderer: (params) => {
          const { is_editable, is_deletable } = params.data || {};
          return (
            <div className="action-icons">
              {searchData?.previledge?.is_role_editable == 1 &&
                params.data.is_editable == 1 && (
                  <Link
                    to="#"
                    className="text-success me-2"
                    onClick={() => handleProjectClick(params.data)}
                  >
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                    />
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      {t("edit")}
                    </UncontrolledTooltip>
                  </Link>
                )}
              {Object.keys(dynamicComponents).length > 0 && (
                <Link
                  to="#"
                  className="text-secondary me-2"
                  onClick={() => handleClick(params.data)}
                >
                  <i className="mdi mdi-cog font-size-18" id="viewtooltip" />
                  <UncontrolledTooltip placement="top" target="viewtooltip">
                    Project Detail
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      });
    }
    if (allowedLinks.length > 0) {
      baseColumnDefs.push({
        headerName: "...",
        cellRenderer: renderConfiguration,
        cellStyle: { overflow: "visible", zIndex: "auto" },
        resizable: true,
        minWidth: 80,
        flex: 2,
      });
    }
    return baseColumnDefs;
  }, [data, handleProjectClick, onClickDelete, t]);

  function renderConfiguration(params) {
    const { prj_id } = params.data || {};
    const filteredLinks = allowedLinks.filter(id => linkMapping[id]);
    return (
      <UncontrolledDropdown>
        <DropdownToggle
          className="btn btn-light btn-sm"
          type="button"
          id={`dropdownMenuButton${prj_id}`}
          style={{ zIndex: 1050 }}
        >
          <i className="bx bx-dots-vertical-rounded"></i>
        </DropdownToggle>
        <DropdownMenu
          className="dropdown-menu"
          style={{ position: "absolute", zIndex: 9999 }}
          aria-labelledby={`dropdownMenuButton${prj_id}`}
        >
          {filteredLinks.map((linkId) => (
            <Link
              key={linkId}
              to={`/Project/${prj_id}/${linkMapping[linkId]}`}
              className="dropdown-item"
            >
              {t(linkMapping[linkId])}
            </Link>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
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

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };
  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);
  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  }, []);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProject}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProject.isPending}
      />
      <div className="page-content">
        <div>
          <Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
          <div className="w-100 d-flex gap-2">
            <AddressStructureForProject
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
                  },
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
                  <Col sm="12" md="6">
                    <Input
                      type="text"
                      placeholder={t("Search") + "..."}
                      onChange={(e) => setQuickFilterText(e.target.value)}
                      className="mb-2"
                    />
                  </Col>
                  <Col
                    sm="12"
                    md="6"
                    className="text-md-end d-flex align-items-center justify-content-end gap-2"
                  >
                    {searchData?.previledge?.is_role_can_add == 1 && (
                      <Button color="success" onClick={handleProjectClicks}>
                        {t("add")}
                      </Button>
                    )}
                    <ExportToExcel
                      tableData={searchData?.data || []}
                      tablename={"projects"}
                      includeKey={project_info}
                    />
                    <ExportToPDF
                      tableData={searchData?.data || []}
                      tablename={"projects"}
                      includeKey={project_info}
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
                    // immutableData={true}
                    getRowId={(params) => String(params.data.prj_id)}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                    paginationPageSize={10}
                    quickFilterText={quickFilterText}
                    onSelectionChanged={onSelectionChanged}
                    rowHeight={32} // Set the row height here
                    animateRows={true} // Enables row animations
                    domLayout="normal" // Auto-size the grid to fit content
                    onGridReady={(params) => {
                      params.api.sizeColumnsToFit(); // Size columns to fit the grid width
                    }}
                    localeText={localeText} // Dynamically translated texts
                  />
                </div>
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
                        <Label>
                          {t("prj_total_estimate_budget")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          minLength="3"
                          maxLength="12"
                          min="1"
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
                          step=".01"
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
                        <Label>
                          {t("prj_department_id")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="prj_department_id"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.prj_department_id || ""}
                          invalid={
                            validation.touched.prj_department_id &&
                              validation.errors.prj_department_id
                              ? true
                              : false
                          }
                        >
                          <option value={null}>
                            {t("prj_select_department")}
                          </option>
                          {lang === "en"
                            ? departmentOptionsEn.map((option) => (
                              <option key={option.value} value={option.value}>
                                {t(`${option.label}`)}
                              </option>
                            ))
                            : lang === "am"
                              ? departmentOptionsAm.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {t(`${option.label}`)}
                                </option>
                              ))
                              : departmentOptionsOr.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {t(`${option.label}`)}
                                </option>
                              ))}
                        </Input>
                        {validation.touched.prj_department_id &&
                          validation.errors.prj_department_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.prj_department_id}
                          </FormFeedback>
                        ) : null}
                      </Col>
                      <Col className="col-md-6 mb-3">
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
        </div>
      </div>
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={projectMetaData.prj_name}
          id={projectMetaData.prj_id}
          status={projectMetaData?.prj_project_status_id}
          startDate={projectMetaData?.prj_start_date_gc}
          components={dynamicComponents}
        />
      )}
    </React.Fragment>
  );
};
ProjectModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;
