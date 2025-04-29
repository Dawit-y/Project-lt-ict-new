import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
//import components
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectKpiResults,
  useAddProjectKpiResult,
  useDeleteProjectKpiResult,
  useUpdateProjectKpiResult,
} from "../../queries/projectkpiresult_query";
import { formattedAmountValidation } from "../../utils/Validation/validation";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { convertToNumericValue } from "../../utils/commonMethods";
import ProjectKpiResultModal from "./ProjectKpiResultModal";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
import { usePopulateBudgetYears } from "../../queries/budgetyear_query";

import { useFetchProjectKpis } from "../../queries/projectkpi_query";
const ProjectKpiResultModel = (props) => {
  //meta title
  document.title = " ProjectKpiResult";
  const { passedId, isActive, status, startDate } = props;
  const param = { project_id: passedId, request_type: "single" };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectKpiResult, setProjectKpiResult] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchProjectKpiResults(param, isActive);
  const addProjectKpiResult = useAddProjectKpiResult();
  const updateProjectKpiResult = useUpdateProjectKpiResult();
  const deleteProjectKpiResult = useDeleteProjectKpiResult();
  const { data: bgYearsOptionsData } = usePopulateBudgetYears();
  const { data: kpiOptionsData } = useFetchProjectKpis();
  const [activeTab, setActiveTab] = useState("Quarter1");

  //START CRUD
  const handleAddProjectKpiResult = async (data) => {
    try {
      await addProjectKpiResult.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateProjectKpiResult = async (data) => {
    try {
      await updateProjectKpiResult.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProjectKpiResult = async () => {
    if (projectKpiResult && projectKpiResult.kpr_id) {
      try {
        const id = projectKpiResult.kpr_id;
        await deleteProjectKpiResult.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t("delete_failure"), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  //END CRUD
  //START FOREIGN CALLS
  const budgetYearMap = useMemo(() => {
    return (
      bgYearsOptionsData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [bgYearsOptionsData]);

  const kpiMap = useMemo(() => {
    return (
      kpiOptionsData?.data?.reduce((acc, year) => {
        acc[year.kpi_id] = year.kpi_name_or;
        return acc;
      }, {}) || {}
    );
  }, [kpiOptionsData]);

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    initialValues: {
      kpr_project_id: passedId,
      kpr_project_kpi_id:
        (projectKpiResult && projectKpiResult.kpr_project_kpi_id) || "",
      kpr_year_id: (projectKpiResult && projectKpiResult.kpr_year_id) || "",
      kpr_planned_month_1:
        (projectKpiResult && projectKpiResult.kpr_planned_month_1) || "",
      kpr_actual_month_1:
        (projectKpiResult && projectKpiResult.kpr_actual_month_1) || "",
      kpr_planned_month_2:
        (projectKpiResult && projectKpiResult.kpr_planned_month_2) || "",
      kpr_actual_month_2:
        (projectKpiResult && projectKpiResult.kpr_actual_month_2) || "",
      kpr_planned_month_3:
        (projectKpiResult && projectKpiResult.kpr_planned_month_3) || "",
      kpr_actual_month_3:
        (projectKpiResult && projectKpiResult.kpr_actual_month_3) || "",
      kpr_planned_month_4:
        (projectKpiResult && projectKpiResult.kpr_planned_month_4) || "",
      kpr_actual_month_4:
        (projectKpiResult && projectKpiResult.kpr_actual_month_4) || "",
      kpr_planned_month_5:
        (projectKpiResult && projectKpiResult.kpr_planned_month_5) || "",
      kpr_actual_month_5:
        (projectKpiResult && projectKpiResult.kpr_actual_month_5) || "",
      kpr_planned_month_6:
        (projectKpiResult && projectKpiResult.kpr_planned_month_6) || "",
      kpr_actual_month_6:
        (projectKpiResult && projectKpiResult.kpr_actual_month_6) || "",
      kpr_planned_month_7:
        (projectKpiResult && projectKpiResult.kpr_planned_month_7) || "",
      kpr_actual_month_7:
        (projectKpiResult && projectKpiResult.kpr_actual_month_7) || "",
      kpr_planned_month_8:
        (projectKpiResult && projectKpiResult.kpr_planned_month_8) || "",
      kpr_actual_month_8:
        (projectKpiResult && projectKpiResult.kpr_actual_month_8) || "",
      kpr_planned_month_9:
        (projectKpiResult && projectKpiResult.kpr_planned_month_9) || "",
      kpr_actual_month_9:
        (projectKpiResult && projectKpiResult.kpr_actual_month_9) || "",
      kpr_planned_month_10:
        (projectKpiResult && projectKpiResult.kpr_planned_month_10) || "",
      kpr_actual_month_10:
        (projectKpiResult && projectKpiResult.kpr_actual_month_10) || "",
      kpr_planned_month_11:
        (projectKpiResult && projectKpiResult.kpr_planned_month_11) || "",
      kpr_actual_month_11:
        (projectKpiResult && projectKpiResult.kpr_actual_month_11) || "",
      kpr_planned_month_12:
        (projectKpiResult && projectKpiResult.kpr_planned_month_12) || "",
      kpr_actual_month_12:
        (projectKpiResult && projectKpiResult.kpr_actual_month_12) || "",
      kpr_description:
        (projectKpiResult && projectKpiResult.kpr_description) || "",
      // kpr_status: (projectKpiResult && projectKpiResult.kpr_status) || "",

      is_deletable: (projectKpiResult && projectKpiResult.is_deletable) || 1,
      is_editable: (projectKpiResult && projectKpiResult.is_editable) || 1,
    },
    validationSchema: Yup.object({
      kpr_project_id: Yup.string().required(t("kpr_project_id")),
      kpr_project_kpi_id: Yup.string().required(t("kpr_project_kpi_id")),
      kpr_year_id: Yup.string().required(t("kpr_year_id")),
      kpr_planned_month_1: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_1: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_2: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_2: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_3: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_3: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_4: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_4: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_5: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_5: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_6: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_6: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_7: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_7: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_8: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_8: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_9: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_9: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_10: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_10: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_11: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_11: formattedAmountValidation(0, 10000000000, true),
      kpr_planned_month_12: formattedAmountValidation(0, 10000000000, true),
      kpr_actual_month_12: formattedAmountValidation(0, 10000000000, true),
      // kpr_description: Yup.string().required(t("kpr_description")),
      // kpr_status: Yup.string().required(t("kpr_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectKpiResult = {
          kpr_id: projectKpiResult ? projectKpiResult.kpr_id : 0,
          // kpr_id: projectKpiResult.kpr_id,
          kpr_project_id: passedId,
          kpr_project_kpi_id: values.kpr_project_kpi_id,
          kpr_year_id: values.kpr_year_id,
          kpr_planned_month_1: convertToNumericValue(
            values.kpr_planned_month_1
          ),
          kpr_actual_month_1: convertToNumericValue(values.kpr_actual_month_1),
          kpr_planned_month_2: convertToNumericValue(
            values.kpr_planned_month_2
          ),
          kpr_actual_month_2: convertToNumericValue(values.kpr_actual_month_2),
          kpr_planned_month_3: convertToNumericValue(
            values.kpr_planned_month_3
          ),
          kpr_actual_month_3: convertToNumericValue(values.kpr_actual_month_3),
          kpr_planned_month_4: convertToNumericValue(
            values.kpr_planned_month_4
          ),
          kpr_actual_month_4: convertToNumericValue(values.kpr_actual_month_4),
          kpr_planned_month_5: convertToNumericValue(
            values.kpr_planned_month_5
          ),
          kpr_actual_month_5: convertToNumericValue(values.kpr_actual_month_5),
          kpr_planned_month_6: convertToNumericValue(
            values.kpr_planned_month_6
          ),
          kpr_actual_month_6: convertToNumericValue(values.kpr_actual_month_6),
          kpr_planned_month_7: convertToNumericValue(
            values.kpr_planned_month_7
          ),
          kpr_actual_month_7: convertToNumericValue(values.kpr_actual_month_7),
          kpr_planned_month_8: convertToNumericValue(
            values.kpr_planned_month_8
          ),
          kpr_actual_month_8: convertToNumericValue(values.kpr_actual_month_8),
          kpr_planned_month_9: convertToNumericValue(
            values.kpr_planned_month_9
          ),
          kpr_actual_month_9: convertToNumericValue(values.kpr_actual_month_9),
          kpr_planned_month_10: convertToNumericValue(
            values.kpr_planned_month_10
          ),
          kpr_actual_month_10: convertToNumericValue(
            values.kpr_actual_month_10
          ),
          kpr_planned_month_11: convertToNumericValue(
            values.kpr_planned_month_11
          ),
          kpr_actual_month_11: convertToNumericValue(
            values.kpr_actual_month_11
          ),
          kpr_planned_month_12: convertToNumericValue(
            values.kpr_planned_month_12
          ),
          kpr_actual_month_12: convertToNumericValue(
            values.kpr_actual_month_12
          ),
          kpr_description: values.kpr_description,
          // kpr_status: values.kpr_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectKpiResult
        handleUpdateProjectKpiResult(updateProjectKpiResult);
      } else {
        const newProjectKpiResult = {
          kpr_project_id: passedId,
          kpr_project_kpi_id: values.kpr_project_kpi_id,
          kpr_year_id: values.kpr_year_id,
          kpr_planned_month_1: convertToNumericValue(
            values.kpr_planned_month_1
          ),
          kpr_actual_month_1: convertToNumericValue(values.kpr_actual_month_1),
          kpr_planned_month_2: convertToNumericValue(
            values.kpr_planned_month_2
          ),
          kpr_actual_month_2: convertToNumericValue(values.kpr_actual_month_2),
          kpr_planned_month_3: convertToNumericValue(
            values.kpr_planned_month_3
          ),
          kpr_actual_month_3: convertToNumericValue(values.kpr_actual_month_3),
          kpr_planned_month_4: convertToNumericValue(
            values.kpr_planned_month_4
          ),
          kpr_actual_month_4: convertToNumericValue(values.kpr_actual_month_4),
          kpr_planned_month_5: convertToNumericValue(
            values.kpr_planned_month_5
          ),
          kpr_actual_month_5: convertToNumericValue(values.kpr_actual_month_5),
          kpr_planned_month_6: convertToNumericValue(
            values.kpr_planned_month_6
          ),
          kpr_actual_month_6: convertToNumericValue(values.kpr_actual_month_6),
          kpr_planned_month_7: convertToNumericValue(
            values.kpr_planned_month_7
          ),
          kpr_actual_month_7: convertToNumericValue(values.kpr_actual_month_7),
          kpr_planned_month_8: convertToNumericValue(
            values.kpr_planned_month_8
          ),
          kpr_actual_month_8: convertToNumericValue(values.kpr_actual_month_8),
          kpr_planned_month_9: convertToNumericValue(
            values.kpr_planned_month_9
          ),
          kpr_actual_month_9: convertToNumericValue(values.kpr_actual_month_9),
          kpr_planned_month_10: convertToNumericValue(
            values.kpr_planned_month_10
          ),
          kpr_actual_month_10: convertToNumericValue(
            values.kpr_actual_month_10
          ),
          kpr_planned_month_11: convertToNumericValue(
            values.kpr_planned_month_11
          ),
          kpr_actual_month_11: convertToNumericValue(
            values.kpr_actual_month_11
          ),
          kpr_planned_month_12: convertToNumericValue(
            values.kpr_planned_month_12
          ),
          kpr_actual_month_12: convertToNumericValue(
            values.kpr_actual_month_12
          ),
          kpr_description: values.kpr_description,
          // kpr_status: values.kpr_status,
        };
        // save new ProjectKpiResult
        handleAddProjectKpiResult(newProjectKpiResult);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProjectKpiResult on component mount
  useEffect(() => {
    setProjectKpiResult(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectKpiResult(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectKpiResult(null);
    } else {
      setModal(true);
    }
  };
  const handleProjectKpiResultClick = (arg) => {
    const projectKpiResult = arg;
    // console.log("handleProjectKpiResultClick", projectKpiResult);
    setProjectKpiResult({
      kpr_id: projectKpiResult.kpr_id,
      kpr_project_id: projectKpiResult.kpr_project_id,
      kpr_project_kpi_id: projectKpiResult.kpr_project_kpi_id,
      kpr_year_id: projectKpiResult.kpr_year_id,
      kpr_planned_month_1: Number(
        projectKpiResult.kpr_planned_month_1
      ).toLocaleString(),
      kpr_actual_month_1: Number(
        projectKpiResult.kpr_actual_month_1
      ).toLocaleString(),
      kpr_planned_month_2: Number(
        projectKpiResult.kpr_planned_month_2
      ).toLocaleString(),
      kpr_actual_month_2: Number(
        projectKpiResult.kpr_actual_month_2
      ).toLocaleString(),
      kpr_planned_month_3: Number(
        projectKpiResult.kpr_planned_month_3
      ).toLocaleString(),
      kpr_actual_month_3: Number(
        projectKpiResult.kpr_actual_month_3
      ).toLocaleString(),
      kpr_planned_month_4: Number(
        projectKpiResult.kpr_planned_month_4
      ).toLocaleString(),
      kpr_actual_month_4: Number(
        projectKpiResult.kpr_actual_month_4
      ).toLocaleString(),
      kpr_planned_month_5: Number(
        projectKpiResult.kpr_planned_month_5
      ).toLocaleString(),
      kpr_actual_month_5: Number(
        projectKpiResult.kpr_actual_month_5
      ).toLocaleString(),
      kpr_planned_month_6: Number(
        projectKpiResult.kpr_planned_month_6
      ).toLocaleString(),
      kpr_actual_month_6: Number(
        projectKpiResult.kpr_actual_month_6
      ).toLocaleString(),
      kpr_planned_month_7: Number(
        projectKpiResult.kpr_planned_month_7
      ).toLocaleString(),
      kpr_actual_month_7: Number(
        projectKpiResult.kpr_actual_month_7
      ).toLocaleString(),
      kpr_planned_month_8: Number(
        projectKpiResult.kpr_planned_month_8
      ).toLocaleString(),
      kpr_actual_month_8: Number(
        projectKpiResult.kpr_actual_month_8
      ).toLocaleString(),
      kpr_planned_month_9: Number(
        projectKpiResult.kpr_planned_month_9
      ).toLocaleString(),
      kpr_actual_month_9: Number(
        projectKpiResult.kpr_actual_month_9
      ).toLocaleString(),
      kpr_planned_month_10: Number(
        projectKpiResult.kpr_planned_month_10
      ).toLocaleString(),
      kpr_actual_month_10: Number(
        projectKpiResult.kpr_actual_month_10
      ).toLocaleString(),
      kpr_planned_month_11: Number(
        projectKpiResult.kpr_planned_month_11
      ).toLocaleString(),
      kpr_actual_month_11: Number(
        projectKpiResult.kpr_actual_month_11
      ).toLocaleString(),
      kpr_planned_month_12: Number(
        projectKpiResult.kpr_planned_month_12
      ).toLocaleString(),
      kpr_actual_month_12: Number(
        projectKpiResult.kpr_actual_month_12
      ).toLocaleString(),

      kpr_description: projectKpiResult.kpr_description,
      // kpr_status: projectKpiResult.kpr_status,

      is_deletable: projectKpiResult.is_deletable,
      is_editable: projectKpiResult.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectKpiResult) => {
    setProjectKpiResult(projectKpiResult);
    setDeleteModal(true);
  };
  const handleProjectKpiResultClicks = () => {
    setIsEdit(false);
    setProjectKpiResult("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "kpr_project_kpi_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {kpiMap[cellProps.row.original.kpr_project_kpi_id] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "kpr_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {budgetYearMap[cellProps.row.original.kpr_year_id] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_1",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                Number(
                  cellProps.row.original.kpr_planned_month_1
                ).toLocaleString(),
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_1",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_1
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_2",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_2
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_2",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_2
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_3",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_3
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_3",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_3
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_4",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_4
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_4",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_4
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_5",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_5
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_5",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_5
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_6",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_6
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_6",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_6
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_7",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_7
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_7",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_7
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_8",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_8
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_8",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_8
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_9",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_9
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_9",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_9
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_10",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_10
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_10",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_10
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_11",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_11
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_11",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_11
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_planned_month_12",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_planned_month_12
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "kpr_actual_month_12",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>
            {truncateText(
              Number(
                cellProps.row.original.kpr_actual_month_12
              ).toLocaleString(),
              30
            ) || "-"}
          </span>
        ),
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
    if (
      data?.previledge?.is_role_editable == 1 ||
      data?.previledge?.is_role_deletable == 1
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable == 1 && (
                <Button
                  color="none"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProjectKpiResultClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Button>
              )}
            </div>
          );
        },
      });
    }
    return baseColumns;
  }, [handleProjectKpiResultClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
      <ProjectKpiResultModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectKpiResult}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectKpiResult.isPending}
      />
      {isLoading || isSearchLoading ? (
        <Spinners />
      ) : (
        <TableContainer
          columns={columns}
          data={showSearchResult ? searchResults?.data : data?.data || []}
          isGlobalFilter={true}
          isAddButton={data?.previledge?.is_role_can_add == 1}
          isCustomPageSize={true}
          handleUserClick={handleProjectKpiResultClicks}
          isPagination={true}
          // SearchPlaceholder="26 records..."
          SearchPlaceholder={26 + " " + t("Results") + "..."}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={t("add")}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-light"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          refetch={refetch}
          isFetching={isFetching}
        />
      )}

      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} className="border-0 pb-0">
          <h4 className="mb-0">
            {isEdit
              ? `${t("edit")} ${t("project_kpi_result")}`
              : `${t("add")} ${t("project_kpi_result")}`}
          </h4>
        </ModalHeader>

        <ModalBody className="pt-1">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            {/* KPI & Year Selection (Top Section) */}
            <Card className="mb-4 border-light shadow-sm">
              <CardBody>
                <Row>
                  <Col md={6}>
                    <Label className="fw-medium">
                      {t("kpr_project_kpi_id")}
                    </Label>
                    <Input
                      name="kpr_project_kpi_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      value={validation.values.kpr_project_kpi_id || ""}
                      invalid={
                        validation.touched.kpr_project_kpi_id &&
                        !!validation.errors.kpr_project_kpi_id
                      }
                    >
                      <option value="">{t("select")}</option>
                      {kpiOptionsData?.data?.map((data) => (
                        <option key={data.kpi_id} value={data.kpi_id}>
                          {data.kpi_name_or}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>
                      {validation.errors.kpr_project_kpi_id}
                    </FormFeedback>
                  </Col>

                  <Col md={6}>
                    <Label className="fw-medium">{t("kpr_year_id")}</Label>
                    <Input
                      name="kpr_year_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      value={validation.values.kpr_year_id || ""}
                      invalid={
                        validation.touched.kpr_year_id &&
                        !!validation.errors.kpr_year_id
                      }
                    >
                      <option value="">{t("select")}</option>
                      {bgYearsOptionsData?.data?.map((data) => (
                        <option key={data.bdy_id} value={data.bdy_id}>
                          {data.bdy_name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{validation.errors.kpr_year_id}</FormFeedback>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Quarterly Tabs */}
            <Nav tabs className="nav-tabs-custom mb-3 justify-content-center">
              {["Quarter1", "Quarter2", "Quarter3", "Quarter4"].map(
                (quarter, idx) => (
                  <NavItem key={idx} className="mx-3">
                    <NavLink
                      className={`cursor-pointer ${
                        activeTab === quarter ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(quarter)}
                    >
                      {quarter}
                    </NavLink>
                  </NavItem>
                )
              )}
            </Nav>

            {/* Quarterly Input Groups */}
            <TabContent activeTab={activeTab}>
              {["Quarter1", "Quarter2", "Quarter3", "Quarter4"].map(
                (quarter) => {
                  const months = {
                    Quarter1: [1, 2, 3],
                    Quarter2: [4, 5, 6],
                    Quarter3: [7, 8, 9],
                    Quarter4: [10, 11, 12],
                  }[quarter];

                  return (
                    <TabPane tabId={quarter} key={quarter}>
                      <Card className="border-light shadow-sm">
                        <CardBody>
                          <Row>
                            {months.map((month) => (
                              <Col md={4} key={month} className="mb-3">
                                <div className="border rounded p-3 h-100">
                                  <h6 className="text-muted mb-3">
                                    Month {month}
                                  </h6>

                                  <div className="mb-2">
                                    {/* <Label className="small">Planned</Label> */}

                                    <FormattedAmountField
                                      validation={validation}
                                      fieldId={`kpr_planned_month_${month}`}
                                      isRequired={true}
                                    />
                                  </div>

                                  <div>
                                    {/* <Label className="small">Actual</Label> */}

                                    <FormattedAmountField
                                      validation={validation}
                                      fieldId={`kpr_actual_month_${month}`}
                                      isRequired={true}
                                    />
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </CardBody>
                      </Card>
                    </TabPane>
                  );
                }
              )}
            </TabContent>

            {/* Description (Optional) */}
            <Card className="mt-3 border-light shadow-sm">
              <CardBody>
                <Label className="fw-medium">
                  {t("kpr_description")}{" "}
                  <small className="text-muted">({t("optional")})</small>
                </Label>
                <Input
                  name="kpr_description"
                  type="textarea"
                  rows="2"
                  placeholder={t("description")}
                  onChange={validation.handleChange}
                  value={validation.values.kpr_description || ""}
                />
              </CardBody>
            </Card>

            {/* Submit Button */}
            <div className="text-end mt-4">
              <Button
                color="primary"
                type="submit"
                disabled={
                  addProjectKpiResult.isPending ||
                  updateProjectKpiResult.isPending ||
                  !validation.dirty
                }
              >
                {addProjectKpiResult.isPending ||
                updateProjectKpiResult.isPending ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {t("saving")}...
                  </>
                ) : (
                  t("save")
                )}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};
ProjectKpiResultModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectKpiResultModel;
