import React, { useEffect, useMemo, useState } from "react";
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
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectKpiResults,
  useSearchProjectKpiResults,
  useAddProjectKpiResult,
  useDeleteProjectKpiResult,
  useUpdateProjectKpiResult,
} from "../../queries/projectkpiresult_query";
import ProjectKpiResultModal from "./ProjectKpiResultModal";
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
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
import {
  useFetchBudgetYears,
  usePopulateBudgetYears,
} from "../../queries/budgetyear_query";

import {
  useFetchProjectKpis
} from "../../queries/projectkpi_query";
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
  const { data, isLoading, isFetching, error, isError, refetch } = useFetchProjectKpiResults(param, isActive);
  const addProjectKpiResult = useAddProjectKpiResult();
  const updateProjectKpiResult = useUpdateProjectKpiResult();
  const deleteProjectKpiResult = useDeleteProjectKpiResult();
   const { data: bgYearsOptionsData } = usePopulateBudgetYears();
   const { data: kpiOptionsData } = useFetchProjectKpis();
   
//START CRUD
  const handleAddProjectKpiResult = async (data) => {
    try {
      await addProjectKpiResult.mutateAsync(data);
      toast.success(t('add_success'), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t('add_failure'), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateProjectKpiResult = async (data) => {
    try {
      await updateProjectKpiResult.mutateAsync(data);
      toast.success(t('update_success'), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t('update_failure'), {
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
        toast.success(t('delete_success'), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t('delete_failure'), {
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
     kpr_project_id:passedId, 
kpr_project_kpi_id:(projectKpiResult && projectKpiResult.kpr_project_kpi_id) || "", 
kpr_year_id:(projectKpiResult && projectKpiResult.kpr_year_id) || "", 
kpr_planned_month_1:(projectKpiResult && projectKpiResult.kpr_planned_month_1) || "0", 
kpr_actual_month_1:(projectKpiResult && projectKpiResult.kpr_actual_month_1) || "0", 
kpr_planned_month_2:(projectKpiResult && projectKpiResult.kpr_planned_month_2) || "0", 
kpr_actual_month_2:(projectKpiResult && projectKpiResult.kpr_actual_month_2) || "0", 
kpr_planned_month_3:(projectKpiResult && projectKpiResult.kpr_planned_month_3) || "0", 
kpr_actual_month_3:(projectKpiResult && projectKpiResult.kpr_actual_month_3) || "0", 
kpr_planned_month_4:(projectKpiResult && projectKpiResult.kpr_planned_month_4) || "0", 
kpr_actual_month_4:(projectKpiResult && projectKpiResult.kpr_actual_month_4) || "0", 
kpr_planned_month_5:(projectKpiResult && projectKpiResult.kpr_planned_month_5) || "0", 
kpr_actual_month_5:(projectKpiResult && projectKpiResult.kpr_actual_month_5) || "0", 
kpr_planned_month_6:(projectKpiResult && projectKpiResult.kpr_planned_month_6) || "0", 
kpr_actual_month_6:(projectKpiResult && projectKpiResult.kpr_actual_month_6) || "0", 
kpr_planned_month_7:(projectKpiResult && projectKpiResult.kpr_planned_month_7) || "0", 
kpr_actual_month_7:(projectKpiResult && projectKpiResult.kpr_actual_month_7) || "0", 
kpr_planned_month_8:(projectKpiResult && projectKpiResult.kpr_planned_month_8) || "0", 
kpr_actual_month_8:(projectKpiResult && projectKpiResult.kpr_actual_month_8) || "0", 
kpr_planned_month_9:(projectKpiResult && projectKpiResult.kpr_planned_month_9) || "0", 
kpr_actual_month_9:(projectKpiResult && projectKpiResult.kpr_actual_month_9) || "0", 
kpr_planned_month_10:(projectKpiResult && projectKpiResult.kpr_planned_month_10) || "0", 
kpr_actual_month_10:(projectKpiResult && projectKpiResult.kpr_actual_month_10) || "0", 
kpr_planned_month_11:(projectKpiResult && projectKpiResult.kpr_planned_month_11) || "0", 
kpr_actual_month_11:(projectKpiResult && projectKpiResult.kpr_actual_month_11) || "0", 
kpr_planned_month_12:(projectKpiResult && projectKpiResult.kpr_planned_month_12) || "0", 
kpr_actual_month_12:(projectKpiResult && projectKpiResult.kpr_actual_month_12) || "0", 
kpr_description:(projectKpiResult && projectKpiResult.kpr_description) || "", 
kpr_status:(projectKpiResult && projectKpiResult.kpr_status) || "", 

     is_deletable: (projectKpiResult && projectKpiResult.is_deletable) || 1,
     is_editable: (projectKpiResult && projectKpiResult.is_editable) || 1
   },
   validationSchema: Yup.object({
    kpr_project_id: Yup.string().required(t('kpr_project_id')),
kpr_project_kpi_id: Yup.string().required(t('kpr_project_kpi_id')),
kpr_year_id: Yup.string().required(t('kpr_year_id')),
kpr_planned_month_1: Yup.string().required(t('kpr_planned_month_1')),
kpr_actual_month_1: Yup.string().required(t('kpr_actual_month_1')),
kpr_planned_month_2: Yup.string().required(t('kpr_planned_month_2')),
kpr_actual_month_2: Yup.string().required(t('kpr_actual_month_2')),
kpr_planned_month_3: Yup.string().required(t('kpr_planned_month_3')),
kpr_actual_month_3: Yup.string().required(t('kpr_actual_month_3')),
kpr_planned_month_4: Yup.string().required(t('kpr_planned_month_4')),
kpr_actual_month_4: Yup.string().required(t('kpr_actual_month_4')),
kpr_planned_month_5: Yup.string().required(t('kpr_planned_month_5')),
kpr_actual_month_5: Yup.string().required(t('kpr_actual_month_5')),
kpr_planned_month_6: Yup.string().required(t('kpr_planned_month_6')),
kpr_actual_month_6: Yup.string().required(t('kpr_actual_month_6')),
kpr_planned_month_7: Yup.string().required(t('kpr_planned_month_7')),
kpr_actual_month_7: Yup.string().required(t('kpr_actual_month_7')),
kpr_planned_month_8: Yup.string().required(t('kpr_planned_month_8')),
kpr_actual_month_8: Yup.string().required(t('kpr_actual_month_8')),
kpr_planned_month_9: Yup.string().required(t('kpr_planned_month_9')),
kpr_actual_month_9: Yup.string().required(t('kpr_actual_month_9')),
kpr_planned_month_10: Yup.string().required(t('kpr_planned_month_10')),
kpr_actual_month_10: Yup.string().required(t('kpr_actual_month_10')),
kpr_planned_month_11: Yup.string().required(t('kpr_planned_month_11')),
kpr_actual_month_11: Yup.string().required(t('kpr_actual_month_11')),
kpr_planned_month_12: Yup.string().required(t('kpr_planned_month_12')),
kpr_actual_month_12: Yup.string().required(t('kpr_actual_month_12')),
kpr_description: Yup.string().required(t('kpr_description')),
kpr_status: Yup.string().required(t('kpr_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateProjectKpiResult = {
        kpr_id: projectKpiResult ? projectKpiResult.kpr_id : 0,
        kpr_id:projectKpiResult.kpr_id, 
kpr_project_id:passedId, 
kpr_project_kpi_id:values.kpr_project_kpi_id, 
kpr_year_id:values.kpr_year_id, 
kpr_planned_month_1:values.kpr_planned_month_1, 
kpr_actual_month_1:values.kpr_actual_month_1, 
kpr_planned_month_2:values.kpr_planned_month_2, 
kpr_actual_month_2:values.kpr_actual_month_2, 
kpr_planned_month_3:values.kpr_planned_month_3, 
kpr_actual_month_3:values.kpr_actual_month_3, 
kpr_planned_month_4:values.kpr_planned_month_4, 
kpr_actual_month_4:values.kpr_actual_month_4, 
kpr_planned_month_5:values.kpr_planned_month_5, 
kpr_actual_month_5:values.kpr_actual_month_5, 
kpr_planned_month_6:values.kpr_planned_month_6, 
kpr_actual_month_6:values.kpr_actual_month_6, 
kpr_planned_month_7:values.kpr_planned_month_7, 
kpr_actual_month_7:values.kpr_actual_month_7, 
kpr_planned_month_8:values.kpr_planned_month_8, 
kpr_actual_month_8:values.kpr_actual_month_8, 
kpr_planned_month_9:values.kpr_planned_month_9, 
kpr_actual_month_9:values.kpr_actual_month_9, 
kpr_planned_month_10:values.kpr_planned_month_10, 
kpr_actual_month_10:values.kpr_actual_month_10, 
kpr_planned_month_11:values.kpr_planned_month_11, 
kpr_actual_month_11:values.kpr_actual_month_11, 
kpr_planned_month_12:values.kpr_planned_month_12, 
kpr_actual_month_12:values.kpr_actual_month_12, 
kpr_description:values.kpr_description, 
kpr_status:values.kpr_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update ProjectKpiResult
      handleUpdateProjectKpiResult(updateProjectKpiResult);
    } else {
      const newProjectKpiResult = {
        kpr_project_id:passedId, 
kpr_project_kpi_id:values.kpr_project_kpi_id, 
kpr_year_id:values.kpr_year_id, 
kpr_planned_month_1:values.kpr_planned_month_1, 
kpr_actual_month_1:values.kpr_actual_month_1, 
kpr_planned_month_2:values.kpr_planned_month_2, 
kpr_actual_month_2:values.kpr_actual_month_2, 
kpr_planned_month_3:values.kpr_planned_month_3, 
kpr_actual_month_3:values.kpr_actual_month_3, 
kpr_planned_month_4:values.kpr_planned_month_4, 
kpr_actual_month_4:values.kpr_actual_month_4, 
kpr_planned_month_5:values.kpr_planned_month_5, 
kpr_actual_month_5:values.kpr_actual_month_5, 
kpr_planned_month_6:values.kpr_planned_month_6, 
kpr_actual_month_6:values.kpr_actual_month_6, 
kpr_planned_month_7:values.kpr_planned_month_7, 
kpr_actual_month_7:values.kpr_actual_month_7, 
kpr_planned_month_8:values.kpr_planned_month_8, 
kpr_actual_month_8:values.kpr_actual_month_8, 
kpr_planned_month_9:values.kpr_planned_month_9, 
kpr_actual_month_9:values.kpr_actual_month_9, 
kpr_planned_month_10:values.kpr_planned_month_10, 
kpr_actual_month_10:values.kpr_actual_month_10, 
kpr_planned_month_11:values.kpr_planned_month_11, 
kpr_actual_month_11:values.kpr_actual_month_11, 
kpr_planned_month_12:values.kpr_planned_month_12, 
kpr_actual_month_12:values.kpr_actual_month_12, 
kpr_description:values.kpr_description, 
kpr_status:values.kpr_status, 

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
      kpr_id:projectKpiResult.kpr_id, 
kpr_project_id:projectKpiResult.kpr_project_id, 
kpr_project_kpi_id:projectKpiResult.kpr_project_kpi_id, 
kpr_year_id:projectKpiResult.kpr_year_id, 
kpr_planned_month_1:projectKpiResult.kpr_planned_month_1, 
kpr_actual_month_1:projectKpiResult.kpr_actual_month_1, 
kpr_planned_month_2:projectKpiResult.kpr_planned_month_2, 
kpr_actual_month_2:projectKpiResult.kpr_actual_month_2, 
kpr_planned_month_3:projectKpiResult.kpr_planned_month_3, 
kpr_actual_month_3:projectKpiResult.kpr_actual_month_3, 
kpr_planned_month_4:projectKpiResult.kpr_planned_month_4, 
kpr_actual_month_4:projectKpiResult.kpr_actual_month_4, 
kpr_planned_month_5:projectKpiResult.kpr_planned_month_5, 
kpr_actual_month_5:projectKpiResult.kpr_actual_month_5, 
kpr_planned_month_6:projectKpiResult.kpr_planned_month_6, 
kpr_actual_month_6:projectKpiResult.kpr_actual_month_6, 
kpr_planned_month_7:projectKpiResult.kpr_planned_month_7, 
kpr_actual_month_7:projectKpiResult.kpr_actual_month_7, 
kpr_planned_month_8:projectKpiResult.kpr_planned_month_8, 
kpr_actual_month_8:projectKpiResult.kpr_actual_month_8, 
kpr_planned_month_9:projectKpiResult.kpr_planned_month_9, 
kpr_actual_month_9:projectKpiResult.kpr_actual_month_9, 
kpr_planned_month_10:projectKpiResult.kpr_planned_month_10, 
kpr_actual_month_10:projectKpiResult.kpr_actual_month_10, 
kpr_planned_month_11:projectKpiResult.kpr_planned_month_11, 
kpr_actual_month_11:projectKpiResult.kpr_actual_month_11, 
kpr_planned_month_12:projectKpiResult.kpr_planned_month_12, 
kpr_actual_month_12:projectKpiResult.kpr_actual_month_12, 
kpr_description:projectKpiResult.kpr_description, 
kpr_status:projectKpiResult.kpr_status, 

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
  }
  ;  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
{
        header: '',
        accessorKey: 'kpr_project_kpi_id',
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
        header: '',
        accessorKey: 'kpr_year_id',
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
        header: '',
        accessorKey: 'kpr_planned_month_1',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_1, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_1',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_1, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_2',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_2, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_2',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_2, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_3',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_3, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_3',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_3, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_4',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_4, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_4',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_4, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_5',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_5, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_5',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_5, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_6',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_6, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_6',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_6, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_7',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_7, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_7',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_7, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_8',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_8, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_8',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_8, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_9',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_9, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_9',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_9, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_10',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_10, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_10',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_10, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_11',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_11, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_11',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_11, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_planned_month_12',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_planned_month_12, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpr_actual_month_12',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpr_actual_month_12, 30) ||
                '-'}
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
    if (
      data?.previledge?.is_role_editable==1 ||
      data?.previledge?.is_role_deletable==1
      ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
            {cellProps.row.original.is_editable==1 && (
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
      data={
        showSearchResult
        ? searchResults?.data
        : data?.data || []
      }
      isGlobalFilter={true}
      isAddButton={data?.previledge?.is_role_can_add==1}
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
      <ModalHeader toggle={toggle} tag="h4">
      {!!isEdit ? (t("edit") + " "+t("project_kpi_result")) : (t("add") +" "+t("project_kpi_result"))}
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
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_project_kpi_id')}</Label>
                      <Input
                        name='kpr_project_kpi_id'
                        type='select'
                        placeholder={t('kpr_project_kpi_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_project_kpi_id || ''}
                        invalid={
                          validation.touched.kpr_project_kpi_id &&
                          validation.errors.kpr_project_kpi_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      >
                       <option value="">Select KPI</option>
                  {kpiOptionsData?.data?.map((data) => (
                    <option key={data.kpi_id} value={data.kpi_id}>
                      {data.kpi_name_or}
                    </option>
                  ))}
                      </Input>
                      {validation.touched.kpr_project_kpi_id &&
                      validation.errors.kpr_project_kpi_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_project_kpi_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_year_id')}</Label>
                      <Input
                        name='kpr_year_id'
                        type='select'
                        placeholder={t('kpr_year_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_year_id || ''}
                        invalid={
                          validation.touched.kpr_year_id &&
                          validation.errors.kpr_year_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      >
                      <option value="">Select Budget Year</option>
                  {bgYearsOptionsData?.data?.map((data) => (
                    <option key={data.bdy_id} value={data.bdy_id}>
                      {data.bdy_name}
                    </option>
                  ))}
                      </Input>
                      {validation.touched.kpr_year_id &&
                      validation.errors.kpr_year_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_year_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_1')}</Label>
                      <Input
                        name='kpr_planned_month_1'
                        type='text'
                        placeholder={t('kpr_planned_month_1')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_1 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_1 &&
                          validation.errors.kpr_planned_month_1
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_1 &&
                      validation.errors.kpr_planned_month_1 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_1}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_1')}</Label>
                      <Input
                        name='kpr_actual_month_1'
                        type='text'
                        placeholder={t('kpr_actual_month_1')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_1 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_1 &&
                          validation.errors.kpr_actual_month_1
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_1 &&
                      validation.errors.kpr_actual_month_1 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_1}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_2')}</Label>
                      <Input
                        name='kpr_planned_month_2'
                        type='text'
                        placeholder={t('kpr_planned_month_2')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_2 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_2 &&
                          validation.errors.kpr_planned_month_2
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_2 &&
                      validation.errors.kpr_planned_month_2 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_2}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_2')}</Label>
                      <Input
                        name='kpr_actual_month_2'
                        type='text'
                        placeholder={t('kpr_actual_month_2')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_2 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_2 &&
                          validation.errors.kpr_actual_month_2
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_2 &&
                      validation.errors.kpr_actual_month_2 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_2}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_3')}</Label>
                      <Input
                        name='kpr_planned_month_3'
                        type='text'
                        placeholder={t('kpr_planned_month_3')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_3 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_3 &&
                          validation.errors.kpr_planned_month_3
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_3 &&
                      validation.errors.kpr_planned_month_3 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_3}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_3')}</Label>
                      <Input
                        name='kpr_actual_month_3'
                        type='text'
                        placeholder={t('kpr_actual_month_3')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_3 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_3 &&
                          validation.errors.kpr_actual_month_3
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_3 &&
                      validation.errors.kpr_actual_month_3 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_3}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_4')}</Label>
                      <Input
                        name='kpr_planned_month_4'
                        type='text'
                        placeholder={t('kpr_planned_month_4')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_4 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_4 &&
                          validation.errors.kpr_planned_month_4
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_4 &&
                      validation.errors.kpr_planned_month_4 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_4}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_4')}</Label>
                      <Input
                        name='kpr_actual_month_4'
                        type='text'
                        placeholder={t('kpr_actual_month_4')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_4 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_4 &&
                          validation.errors.kpr_actual_month_4
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_4 &&
                      validation.errors.kpr_actual_month_4 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_4}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_5')}</Label>
                      <Input
                        name='kpr_planned_month_5'
                        type='text'
                        placeholder={t('kpr_planned_month_5')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_5 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_5 &&
                          validation.errors.kpr_planned_month_5
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_5 &&
                      validation.errors.kpr_planned_month_5 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_5}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_5')}</Label>
                      <Input
                        name='kpr_actual_month_5'
                        type='text'
                        placeholder={t('kpr_actual_month_5')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_5 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_5 &&
                          validation.errors.kpr_actual_month_5
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_5 &&
                      validation.errors.kpr_actual_month_5 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_5}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_6')}</Label>
                      <Input
                        name='kpr_planned_month_6'
                        type='text'
                        placeholder={t('kpr_planned_month_6')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_6 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_6 &&
                          validation.errors.kpr_planned_month_6
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_6 &&
                      validation.errors.kpr_planned_month_6 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_6}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_6')}</Label>
                      <Input
                        name='kpr_actual_month_6'
                        type='text'
                        placeholder={t('kpr_actual_month_6')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_6 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_6 &&
                          validation.errors.kpr_actual_month_6
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_6 &&
                      validation.errors.kpr_actual_month_6 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_6}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_7')}</Label>
                      <Input
                        name='kpr_planned_month_7'
                        type='text'
                        placeholder={t('kpr_planned_month_7')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_7 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_7 &&
                          validation.errors.kpr_planned_month_7
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_7 &&
                      validation.errors.kpr_planned_month_7 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_7}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_7')}</Label>
                      <Input
                        name='kpr_actual_month_7'
                        type='text'
                        placeholder={t('kpr_actual_month_7')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_7 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_7 &&
                          validation.errors.kpr_actual_month_7
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_7 &&
                      validation.errors.kpr_actual_month_7 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_7}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_8')}</Label>
                      <Input
                        name='kpr_planned_month_8'
                        type='text'
                        placeholder={t('kpr_planned_month_8')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_8 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_8 &&
                          validation.errors.kpr_planned_month_8
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_8 &&
                      validation.errors.kpr_planned_month_8 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_8}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_8')}</Label>
                      <Input
                        name='kpr_actual_month_8'
                        type='text'
                        placeholder={t('kpr_actual_month_8')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_8 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_8 &&
                          validation.errors.kpr_actual_month_8
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_8 &&
                      validation.errors.kpr_actual_month_8 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_8}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_9')}</Label>
                      <Input
                        name='kpr_planned_month_9'
                        type='text'
                        placeholder={t('kpr_planned_month_9')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_9 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_9 &&
                          validation.errors.kpr_planned_month_9
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_9 &&
                      validation.errors.kpr_planned_month_9 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_9}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_9')}</Label>
                      <Input
                        name='kpr_actual_month_9'
                        type='text'
                        placeholder={t('kpr_actual_month_9')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_9 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_9 &&
                          validation.errors.kpr_actual_month_9
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_9 &&
                      validation.errors.kpr_actual_month_9 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_9}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_10')}</Label>
                      <Input
                        name='kpr_planned_month_10'
                        type='text'
                        placeholder={t('kpr_planned_month_10')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_10 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_10 &&
                          validation.errors.kpr_planned_month_10
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_10 &&
                      validation.errors.kpr_planned_month_10 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_10}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_10')}</Label>
                      <Input
                        name='kpr_actual_month_10'
                        type='text'
                        placeholder={t('kpr_actual_month_10')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_10 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_10 &&
                          validation.errors.kpr_actual_month_10
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_10 &&
                      validation.errors.kpr_actual_month_10 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_10}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_11')}</Label>
                      <Input
                        name='kpr_planned_month_11'
                        type='text'
                        placeholder={t('kpr_planned_month_11')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_11 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_11 &&
                          validation.errors.kpr_planned_month_11
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_11 &&
                      validation.errors.kpr_planned_month_11 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_11}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_11')}</Label>
                      <Input
                        name='kpr_actual_month_11'
                        type='text'
                        placeholder={t('kpr_actual_month_11')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_11 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_11 &&
                          validation.errors.kpr_actual_month_11
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_11 &&
                      validation.errors.kpr_actual_month_11 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_11}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_planned_month_12')}</Label>
                      <Input
                        name='kpr_planned_month_12'
                        type='text'
                        placeholder={t('kpr_planned_month_12')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_planned_month_12 || ''}
                        invalid={
                          validation.touched.kpr_planned_month_12 &&
                          validation.errors.kpr_planned_month_12
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_planned_month_12 &&
                      validation.errors.kpr_planned_month_12 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_planned_month_12}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_actual_month_12')}</Label>
                      <Input
                        name='kpr_actual_month_12'
                        type='text'
                        placeholder={t('kpr_actual_month_12')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_actual_month_12 || ''}
                        invalid={
                          validation.touched.kpr_actual_month_12 &&
                          validation.errors.kpr_actual_month_12
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_actual_month_12 &&
                      validation.errors.kpr_actual_month_12 ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_actual_month_12}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_description')}</Label>
                      <Input
                        name='kpr_description'
                        type='text'
                        placeholder={t('kpr_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_description || ''}
                        invalid={
                          validation.touched.kpr_description &&
                          validation.errors.kpr_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_description &&
                      validation.errors.kpr_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-3 mb-3'>
                      <Label>{t('kpr_status')}</Label>
                      <Input
                        name='kpr_status'
                        type='text'
                        placeholder={t('kpr_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpr_status || ''}
                        invalid={
                          validation.touched.kpr_status &&
                          validation.errors.kpr_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpr_status &&
                      validation.errors.kpr_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpr_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addProjectKpiResult.isPending || updateProjectKpiResult.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addProjectKpiResult.isPending ||
          updateProjectKpiResult.isPending ||
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
          addProjectKpiResult.isPending ||
          updateProjectKpiResult.isPending ||
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
        <ToastContainer />
        </React.Fragment>
        );
};
ProjectKpiResultModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectKpiResultModel;