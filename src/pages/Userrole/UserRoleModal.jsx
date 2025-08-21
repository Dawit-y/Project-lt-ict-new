import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { parseISO, format } from "date-fns";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";
import { useFetchRoleAssignedPermissions } from "../../queries/permission_query";
import TableContainer from "../../components/Common/TableContainer";
import { DetailsView } from "../../components/Common/DetailViewWrapper";
import Spinners from "../../components/Common/Spinner";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const modalStyle = {
  width: "100%",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return format(parseISO(dateString), "PP");
};

const UserRoleModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const param = { pem_role_id: transaction.url_role_id };
  const { data, isLoading, error, isError, refetch } =
    useFetchRoleAssignedPermissions(param, isOpen);

  const updatedTransaction = {
    ...transaction,
    url_create_time: formatDate(transaction?.url_create_time),
    url_update_time: formatDate(transaction?.url_update_time),
  };

  const optionsMap = useMemo(() => {
    return {
      1: "Yes",
      2: "No",
    };
  }, []);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "page_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pag_name}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_enabled",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{optionsMap[cellProps.row.original.pem_enabled] || "-"}</span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pem_edit",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{optionsMap[cellProps.row.original.pem_edit] || "-"}</span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pem_insert",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{optionsMap[cellProps.row.original.pem_insert] || "-"}</span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pem_view",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{optionsMap[cellProps.row.original.pem_view] || "-"}</span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pem_delete",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{optionsMap[cellProps.row.original.pem_delete] || "-"}</span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pem_show",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{optionsMap[cellProps.row.original.pem_show] || "-"}</span>
          );
        },
      },
    ];
    return baseColumns;
  }, []);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="modal-xl"
      tabIndex="-1"
      toggle={toggle}
      style={modalStyle}
    >
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          <DetailsView
            details={updatedTransaction}
            keysToRemove={[
              "url_id",
              "url_role_id",
              "url_user_id",
              "url_delete_time",
              "url_created_by",
              "url_status",
              "is_editable",
              "is_deletable",
              "total_count",
            ]}
          />
          <h4>{t("permission")}</h4>
          <hr />
          {isLoading ? (
            <Spinners top={"top-70"} />
          ) : (
            <TableContainer
              columns={columns}
              data={data?.data || []}
              isGlobalFilter={false}
              isAddButton={false}
              isCustomPageSize={true}
              isPagination={true}
              isPrint={false}
              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
              theadClass="table-light"
              pagination="pagination"
              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
              divClassName="-"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
UserRoleModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default UserRoleModal;
