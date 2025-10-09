import React, { useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import Spinners from "../../components/Common/Spinner";
import {
  useSearchAccessLogs,
  useFetchAccessLogsByProps,
} from "../../queries/accesslog_query";
import AccessLogModal from "./AccessLogModal";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Card, CardBody } from "reactstrap";
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

const AccessLog = (props) => {
  const { ObjectId, ObjectTypeId, passedId, isActive } = props;
  let param;
  if (ObjectTypeId && ObjectId) {
    param = { ObjectTypeId, ObjectId };
  } else {
    param = { user_id: passedId };
  }

  const { data, isLoading, error, isError, refetch } =
    useFetchAccessLogsByProps(param, isActive);

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [accessLog, setAccessLog] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data: pageInfo } = useFetchPagess();

  const pagesOptions = createSelectOptions(
    pageInfo?.data || [],
    "pag_id",
    "pag_name",
  );

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
      },
    ];
    return baseColumns;
  }, [handleAccessLogClick, toggleViewModal]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <AccessLogModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <div>
        <div>
          <AdvancedSearch
            searchHook={useFetchAccessLogsByProps}
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

export default AccessLog;
