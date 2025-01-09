import React, { useState, useMemo, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Accordion,
  Table,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import ActionForm from "./ActionForm";
import { useFetchBudgetRequestAmounts } from "../../queries/budgetrequestamount_query";
import TableContainer from "../../components/Common/TableContainer";
import { useFetchBudgetRequestTasks } from "../../queries/budgetrequesttask_query";
import { useFetchBudgetExSources } from "../../queries/budgetexsource_query";

const modalStyle = {
  width: "100%",
  minHeight: "600px",
};

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ActionModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, data } = props;
  const [open, setOpen] = useState();
  const [budgetRequestAmount, setBudgetRequestAmount] = useState();

  const [openActonForm, setOpenActionForm] = useState(false);
  const toggleActionFormModal = () => setOpenActionForm(!openActonForm);

  const toggleAcc = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const [subOpen, setSubOpen] = useState();
  const toggleSubAcc = (id) => {
    if (subOpen === id) {
      setSubOpen();
    } else {
      setSubOpen(id);
    }
  };

  const id = data?.bdr_id;
  const param = { budget_request_id: id };
  const brAmounts = useFetchBudgetRequestAmounts(param, open === "1");
  const brTasks = useFetchBudgetRequestTasks(param, open === "2");
  const brExSources = useFetchBudgetExSources(param, open === "3");

  const handleBudgetRequestAmountClick = (arg) => {
    const budgetRequestAmount = arg;
    setBudgetRequestAmount({
      bra_id: budgetRequestAmount.bra_id,
      bra_expenditure_code_id: budgetRequestAmount.bra_expenditure_code_id,
      bra_budget_request_id: budgetRequestAmount.bra_budget_request_id,
      bra_current_year_expense: budgetRequestAmount.bra_current_year_expense,
      bra_requested_amount: budgetRequestAmount.bra_requested_amount,
      bra_approved_amount: budgetRequestAmount.bra_approved_amount,
      bra_source_government_requested:
        budgetRequestAmount.bra_source_government_requested,
      bra_source_government_approved:
        budgetRequestAmount.bra_source_government_approved,
      bra_source_internal_requested:
        budgetRequestAmount.bra_source_internal_requested,
      bra_source_internal_approved:
        budgetRequestAmount.bra_source_internal_approved,
      bra_source_support_requested:
        budgetRequestAmount.bra_source_support_requested,
      bra_source_support_approved:
        budgetRequestAmount.bra_source_support_approved,
      bra_source_support_code: budgetRequestAmount.bra_source_support_code,
      bra_source_credit_requested:
        budgetRequestAmount.bra_source_credit_requested,
      bra_source_credit_approved:
        budgetRequestAmount.bra_source_credit_approved,
      bra_source_credit_code: budgetRequestAmount.bra_source_credit_code,
      bra_source_other_requested:
        budgetRequestAmount.bra_source_other_requested,
      bra_source_other_approved: budgetRequestAmount.bra_source_other_approved,
      bra_source_other_code: budgetRequestAmount.bra_source_other_code,
      bra_requested_date: budgetRequestAmount.bra_requested_date,
      bra_approved_date: budgetRequestAmount.bra_approved_date,
      bra_description: budgetRequestAmount.bra_description,
      bra_status: budgetRequestAmount.bra_status,
      is_deletable: budgetRequestAmount.is_deletable,
      is_editable: budgetRequestAmount.is_editable,
    });
    toggleActionFormModal();
  };

  const braColumns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "bra_expenditure_code_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_expenditure_code_id,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_current_year_expense",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_current_year_expense,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_requested_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bra_requested_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_approved_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bra_approved_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_government_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_government_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_government_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_government_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_internal_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_internal_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_internal_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_internal_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_support_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_support_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_support_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_support_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_support_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_support_code,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_credit_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_credit_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_credit_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_credit_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_credit_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_credit_code,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_requested_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bra_requested_date, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_approved_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bra_approved_date, 30) ||
                "-"}
            </span>
          );
        },
      },
    ];
    if (
      brAmounts?.data?.previledge?.is_role_editable == 1 ||
      brAmounts?.data?.previledge?.is_role_deletable == 1
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
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleBudgetRequestAmountClick(data);
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

    return baseColumns;
  }, [brAmounts, handleBudgetRequestAmountClick]);

  const brTasksColumns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "brt_task_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.brt_task_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_measurement",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.brt_measurement, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_previous_year_physical",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.brt_previous_year_physical,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_previous_year_financial",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.brt_previous_year_financial,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_current_year_physical",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.brt_current_year_physical,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_current_year_financial",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.brt_current_year_financial,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_next_year_physical",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.brt_next_year_physical,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "brt_next_year_financial",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.brt_next_year_financial,
                30
              ) || "-"}
            </span>
          );
        },
      },
    ];
    return baseColumns;
  }, []);

  const brExSourceColumns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "bes_organ_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_organ_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_org_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_org_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_support_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_support_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_credit_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_credit_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_description, 30) || "-"}
            </span>
          );
        },
      },
    ];

    return baseColumns;
  }, []);

  return (
    <>
      <ActionForm
        isOpen={openActonForm}
        toggle={toggleActionFormModal}
        amount={budgetRequestAmount}
      />
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
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Overview</CardTitle>
                    <Col>
                      <div className="mt-4">
                        <Accordion open={open} toggle={toggleAcc}>
                          <AccordionItem>
                            <AccordionHeader targetId="1">
                              Budget Request Amount
                            </AccordionHeader>
                            <AccordionBody accordionId="1">
                              <Accordion
                                flush
                                open={subOpen}
                                toggle={toggleSubAcc}
                              >
                                {brAmounts?.isLoading ? (
                                  <div className="w-100 d-flex align-items-center justify-content-center">
                                    <Spinner size={"sm"} color="primary" />
                                  </div>
                                ) : (
                                  <TableContainer
                                    columns={braColumns}
                                    data={brAmounts?.data?.data || []}
                                    isGlobalFilter={true}
                                    isCustomPageSize={true}
                                    isPagination={true}
                                    SearchPlaceholder={t("filter_placeholder")}
                                    buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                                    buttonName={t("add")}
                                    tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                                    theadClass="table-light"
                                    pagination="pagination"
                                    paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                  />
                                )}
                              </Accordion>
                            </AccordionBody>
                          </AccordionItem>
                          <AccordionItem>
                            <AccordionHeader targetId="2">
                              Budget Request Task
                            </AccordionHeader>
                            <AccordionBody accordionId="2">
                              {brTasks?.isLoading ? (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                  <Spinner size={"sm"} color="primary" />
                                </div>
                              ) : (
                                <TableContainer
                                  columns={brTasksColumns}
                                  data={brTasks?.data?.data || []}
                                  isGlobalFilter={true}
                                  isCustomPageSize={true}
                                  isPagination={true}
                                  SearchPlaceholder={t("filter_placeholder")}
                                  buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                                  tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                                  theadClass="table-light"
                                  pagination="pagination"
                                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                />
                              )}
                            </AccordionBody>
                          </AccordionItem>
                          <AccordionItem>
                            <AccordionHeader targetId="3">
                              Budget Request External Source
                            </AccordionHeader>
                            <AccordionBody accordionId="3">
                              {brExSources?.isLoading ? (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                  <Spinner size={"sm"} color="primary" />
                                </div>
                              ) : (
                                <TableContainer
                                  columns={brExSourceColumns}
                                  data={brExSources?.data?.data || []}
                                  isGlobalFilter={true}
                                  isCustomPageSize={true}
                                  isPagination={true}
                                  SearchPlaceholder={t("filter_placeholder")}
                                  buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                                  tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                                  theadClass="table-light"
                                  pagination="pagination"
                                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                />
                              )}
                            </AccordionBody>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onClick={toggle}>
              {t("Close")}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
};
ActionModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.object,
};
export default memo(ActionModal);
