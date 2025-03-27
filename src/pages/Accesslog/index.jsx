import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Modal, ModalHeader, ModalBody, Form, FormFeedback, Label, Card, CardBody, FormGroup } from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchAccessLogs} from "../../queries/accesslog_query";
import { useFetchPagess } from "../../queries/pages_query";
import { createSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
const TableContainer = lazy(() => import("../../components/Common/TableContainer"));
const Spinners = lazy(() => import("../../components/Common/Spinner"));
const Breadcrumbs = lazy(() => import("../../components/Common/Breadcrumb"));
const AccessLogModal = lazy(() => import("./AccessLogModal"));
const AdvancedSearch = lazy(() => import("../../components/Common/AdvancedSearch"));
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const AccessLogModel = () => {
  //meta title
  document.title = "AccessLog";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [accessLog, setAccessLog] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useSearchAccessLogs();
  const { data: pageInfo } = useFetchPagess();
  const pagesOptions = useMemo(() => createSelectOptions(pageInfo?.data || [], "pag_id", "pag_name"), [pageInfo]);
  // validation
  const validation = useFormik({
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
    validateOnChange: false
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
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
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "acl_ip",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => <span>{truncateText(cellProps.row.original.acl_ip, 30) || "-"}</span>,
      },
      {
        header: "",
        accessorKey: "acl_user_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => <span>{truncateText(cellProps.row.original.acl_user_id, 30) || "-"}</span>,
      },
      {
        header: "",
        accessorKey: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => <span>{cellProps.row.original.acl_object_action}</span>,
      },
      {
        header: "",
        accessorKey: "Object Type",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => <span>{truncateText(cellProps.row.original.acl_object_name, 40) || "-"}</span>,
      },
      {
        header: "",
        accessorKey: "acl_create_time",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => <span>{truncateText(cellProps.row.original.acl_create_time, 30) || "-"}</span>,
      },
      {
        header: t("view_detail"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
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
        ),
      },
    ];
    return baseColumns;
  }, [handleAccessLogClick, toggleViewModal, onClickDelete]);
  if (isError) {
    <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <AccessLogModal isOpen={modal1} toggle={toggleViewModal} transaction={transaction} />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title={t("access_log")} breadcrumbItem={t("access_log")} />
            <AdvancedSearch
              searchHook={useSearchAccessLogs}
              textSearchKeys={["acl_user_id"]}
              dateSearchKeys={["log_time"]}
              dropdownSearchKeys={[
    {
      key: "acl_object_action",
      options: [
        { value: "INSERT", label: "INSERT" },
        { value: "UPDATE", label: "UPDATE" },
        { value: "DELETE", label: "DELETE" }
        ]
    },{
                    key: "bdr_budget_year_id",
                    options: pagesOptions,
                  },
    ]}
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
                        data={showSearchResult ? searchResults?.data : data?.data || []}
                        isGlobalFilter={true}
                        isAddButton={false}
                        isCustomPageSize={true}
                        handleUserClick={handleAccessLogClicks}
                        isPagination={true}
                        SearchPlaceholder={t("filter_placeholder")}
                        buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                        buttonName={`${t("add")} ${t("access_log")}`}
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
      </Suspense>
    </React.Fragment>
  );
};
AccessLogModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default AccessLogModel;