import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner,UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Spinners from "../../components/Common/Spinner";

//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  useFetchAccessLogs,
  useSearchAccessLogs,
  useAddAccessLog,
  useDeleteAccessLog,
  useUpdateAccessLog,
} from "../../queries/accesslog_query";
import AccessLogModal from "./AccessLogModal";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { useFetchPagess } from "../../queries/pages_query";
import { createSelectOptions } from "../../utils/commonMethods";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const AccessLogModel = () => {
  //meta title
  document.title = " AccessLog";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [accessLog, setAccessLog] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useState(null);
  const { data: pageInfo } = useFetchPagess();
  const addAccessLog = useAddAccessLog();
  const updateAccessLog = useUpdateAccessLog();
  const deleteAccessLog = useDeleteAccessLog();
  const pagesOptions = createSelectOptions(
    pageInfo?.data || [],
    "pag_id",
    "pag_name"
  );
  const handleAddAccessLog = async (data) => {
    try {
      await addAccessLog.mutateAsync(data);
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

  const handleUpdateAccessLog = async (data) => {
    try {
      await updateAccessLog.mutateAsync(data);
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
  const handleDeleteAccessLog = async () => {
    if (accessLog && accessLog.acl_id) {
      try {
        const id = accessLog.acl_id;
        await deleteAccessLog.mutateAsync(id);
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
      acl_ip: (accessLog && accessLog.acl_ip) || "",
      acl_user_id: (accessLog && accessLog.acl_user_id) || "",
      acl_role_id: (accessLog && accessLog.acl_role_id) || "",
      acl_object_name: (accessLog && accessLog.acl_object_name) || "",
      acl_object_id: (accessLog && accessLog.acl_object_id) || "",
      acl_remark: (accessLog && accessLog.acl_remark) || "",
      acl_detail: (accessLog && accessLog.acl_detail) || "",
      acl_object_action: (accessLog && accessLog.acl_object_action) || "",
      acl_description: (accessLog && accessLog.acl_description) || "",
      acl_status: (accessLog && accessLog.acl_status) || "",

      is_deletable: (accessLog && accessLog.is_deletable) || 1,
      is_editable: (accessLog && accessLog.is_editable) || 1,
    },

    validationSchema: Yup.object({
      acl_ip: Yup.string().required(t("acl_ip")),
      acl_user_id: Yup.string().required(t("acl_user_id")),
      acl_role_id: Yup.string().required(t("acl_role_id")),
      acl_object_name: Yup.string().required(t("acl_object_name")),
      acl_object_id: Yup.string().required(t("acl_object_id")),
      acl_remark: Yup.string().required(t("acl_remark")),
      acl_detail: Yup.string().required(t("acl_detail")),
      acl_object_action: Yup.string().required(t("acl_object_action")),
      acl_description: Yup.string().required(t("acl_description")),
      acl_status: Yup.string().required(t("acl_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateAccessLog = {
          acl_id: accessLog ? accessLog.acl_id : 0,
          acl_ip: values.acl_ip,
          acl_user_id: values.acl_user_id,
          acl_role_id: values.acl_role_id,
          acl_object_name: values.acl_object_name,
          acl_object_id: values.acl_object_id,
          acl_remark: values.acl_remark,
          acl_detail: values.acl_detail,
          acl_object_action: values.acl_object_action,
          acl_description: values.acl_description,
          acl_status: values.acl_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update AccessLog
        handleUpdateAccessLog(updateAccessLog);
        validation.resetForm();
      } else {
        const newAccessLog = {
          acl_ip: values.acl_ip,
          acl_user_id: values.acl_user_id,
          acl_role_id: values.acl_role_id,
          acl_object_name: values.acl_object_name,
          acl_object_id: values.acl_object_id,
          acl_remark: values.acl_remark,
          acl_detail: values.acl_detail,
          acl_object_action: values.acl_object_action,
          acl_description: values.acl_description,
          acl_status: values.acl_status,
        };
        // save new AccessLog
        handleAddAccessLog(newAccessLog);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch AccessLog on component mount
  useEffect(() => {
    setAccessLog(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setAccessLog(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setAccessLog(null);
    } else {
      setModal(true);
    }
  };

  const handleAccessLogClick = (arg) => {
    const accessLog = arg;
    // console.log("handleAccessLogClick", accessLog);
    setAccessLog({
      acl_id: accessLog.acl_id,
      acl_ip: accessLog.acl_ip,
      acl_user_id: accessLog.acl_user_id,
      acl_role_id: accessLog.acl_role_id,
      acl_object_name: accessLog.acl_object_name,
      acl_object_id: accessLog.acl_object_id,
      acl_remark: accessLog.acl_remark,
      acl_detail: accessLog.acl_detail,
      acl_object_action: accessLog.acl_object_action,
      acl_description: accessLog.acl_description,
      acl_status: accessLog.acl_status,

      is_deletable: accessLog.is_deletable,
      is_editable: accessLog.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (accessLog) => {
    setAccessLog(accessLog);
    setDeleteModal(true);
  };

  const handleAccessLogClicks = () => {
    setIsEdit(false);
    setAccessLog("");
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
        accessorKey: "acl_ip",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_ip, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_user_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_user_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "URL",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_object_name, 40) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_create_time",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_create_time, 30) || "-"}
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
      }
    ];
    return baseColumns;
  }, [handleAccessLogClick, toggleViewModal, onClickDelete]);

  if (isError) {
    <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <AccessLogModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("access_log")}
            breadcrumbItem={t("access_log")}
          />
          <AdvancedSearch
            searchHook={useSearchAccessLogs}
            textSearchKeys={["acl_user_id"]}
            dateSearchKeys={["log_time"]}
            dropdownSearchKeys={[]}
            checkboxSearchKeys={[]}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
          />
          {isLoading || isSearchLoading ? (
            <Spinners />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={
                        showSearchResult
                          ? searchResults?.data
                          : data?.data || []
                      }
                      isGlobalFilter={true}
                      isAddButton={false}
                      isCustomPageSize={true}
                      handleUserClick={handleAccessLogClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("access_log")}
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
        </div>
      </div>
    </React.Fragment>
  );
};
AccessLogModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default AccessLogModel;
