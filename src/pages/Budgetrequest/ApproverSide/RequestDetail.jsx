import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  CardTitle,
  NavLink,
  Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classnames from "classnames";
import { useFetchBudgetExSources } from "../../../queries/budgetexsource_query";
import { useFetchBudgetRequestAmounts } from "../../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../../queries/budgetrequesttask_query";
import TableContainer from "../../../components/Common/TableContainer";
import ApproveModal from "./ApproveModal";
import { useAuthUser } from "../../../hooks/useAuthUser";

const RequestDetail = ({ request, isOpen, toggle }) => {
  const { t } = useTranslation();
  const excludedKeys = [
    "is_editable",
    "is_deletable",
    "color_code",
    "bdr_requested_date_ec",
    "bdr_released_date_ec",
    "bdr_description",
    "bdr_create_time",
    "bdr_update_time",
    "bdr_delete_time",
    "bdr_created_by",
    "bdr_status",
    "status_name",
    "status_type",
    "bdr_action_remark",
    "bdr_released_date_gc",
    "bdr_released_amount",
    "forwarded",
    "bdr_request_status",
  ];

  const filteredDataArray = Object.entries(request).filter(
    ([key]) => !key.endsWith("_id") && !excludedKeys.includes(key),
  );
  const [verticalActiveTab, setVerticalActiveTab] = useState("1");
  const toggleVertical = (tab) => {
    if (verticalActiveTab !== tab) {
      setVerticalActiveTab(tab);
    }
  };

  const param = { budget_request_id: request?.bdr_id };
  const brAmounts = useFetchBudgetRequestAmounts(
    param,
    verticalActiveTab === "1",
  );
  const brTasks = useFetchBudgetRequestTasks(param, verticalActiveTab === "2");
  const brExSources = useFetchBudgetExSources(param, verticalActiveTab === "3");

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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
    return baseColumns;
  }, []);

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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
                30,
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
    <Modal isOpen={isOpen} centered className="modal-xl" toggle={toggle}>
      <ModalHeader toggle={toggle}>{t("take_action")}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            <Row>
              <Col>
                <Badge
                  color={request.color_code}
                  pill
                  className="py-1 px-2 mb-2"
                >
                  {request?.status_name}
                </Badge>
              </Col>
            </Row>
            <Row className="d-flex align-items-center justify-content-center">
              <Col md={8} className="border-end border-secondary pe-3">
                {filteredDataArray && (
                  <div>
                    <Table className="table-sm">
                      <tbody>
                        {filteredDataArray
                          ?.reduce((rows, [key, value], index) => {
                            const currentRowIndex = Math.floor(index / 2);
                            if (!rows[currentRowIndex])
                              rows[currentRowIndex] = [];
                            rows[currentRowIndex].push([key, value]);
                            return rows;
                          }, [])
                          .map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map(([key, value], colIndex) => (
                                <>
                                  <td key={`key-${rowIndex}-${colIndex}`}>
                                    {t(key)} :{" "}
                                  </td>
                                  <td key={`value-${rowIndex}-${colIndex}`}>
                                    {value?.toString()}
                                  </td>
                                </>
                              ))}
                              {Array.from({ length: 3 - row.length }).map(
                                (_, i) => (
                                  <>
                                    <td key={`empty-key-${rowIndex}-${i}`}></td>
                                    <td
                                      key={`empty-value-${rowIndex}-${i}`}
                                    ></td>
                                  </>
                                ),
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
              <Col md={4}>
                <Table className="table-sm">
                  <tbody>
                    <tr>
                      <td>{t("bdr_released_amount")}:</td>
                      <td>{request.bdr_released_amount}</td>
                    </tr>
                    <tr>
                      <td>{t("bdr_released_date_gc")}:</td>
                      <td>{request.bdr_released_date_gc}</td>
                    </tr>
                    <tr>
                      <td>{t("bdr_action_remark")}:</td>
                      <td>{request.bdr_action_remark}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col>
                <CardTitle className="h4 m-3">Details</CardTitle>
                <Row>
                  <Col md="3">
                    <Nav
                      pills
                      className="flex-column"
                      style={{ minHeight: "300px" }}
                    >
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            "mb-2": true,
                            active: verticalActiveTab === "1",
                          })}
                          onClick={() => {
                            toggleVertical("1");
                          }}
                        >
                          Budget Request Amounts
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            "mb-2": true,
                            active: verticalActiveTab === "2",
                          })}
                          onClick={() => {
                            toggleVertical("2");
                          }}
                        >
                          Budget Request Tasks
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            "mb-2": true,
                            active: verticalActiveTab === "3",
                          })}
                          onClick={() => {
                            toggleVertical("3");
                          }}
                        >
                          Budget Request External Sources
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col md="9">
                    <TabContent
                      activeTab={verticalActiveTab}
                      className="text-muted mt-4 mt-md-0"
                    >
                      <TabPane tabId="1">
                        {brAmounts?.isLoading ? (
                          <div className="w-100 d-flex align-items-center justify-content-center">
                            <Spinner color="primary" />
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
                      </TabPane>
                      <TabPane tabId="2">
                        {brTasks?.isLoading ? (
                          <div className="w-100 d-flex align-items-center justify-content-center">
                            <Spinner color="primary" />
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
                      </TabPane>
                      <TabPane tabId="3">
                        {brExSources?.isLoading ? (
                          <div className="w-100 d-flex align-items-center justify-content-center">
                            <Spinner color="primary" />
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
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="secondary" onClick={toggle}>
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RequestDetail;
