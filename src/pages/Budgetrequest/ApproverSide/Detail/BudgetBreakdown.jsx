import { useState, useCallback, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Input,
  Table,
  Progress,
} from "reactstrap";
import Chart from "react-apexcharts";
import { useFetchBudgetRequestAmounts } from "../../../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../../../queries/budgetrequesttask_query";
import { useFetchRequestCategorys } from "../../../../queries/requestcategory_query";
import { useBudgetRequestColumnsApproval } from "../../../../hooks/useBdrAmountsColumn";
import TableContainer from "../../../../components/Common/TableContainer";
import { useBudgetRequestTaskColumns } from "../../../../hooks/useBdrTasksColumn";
import { useTranslation } from "react-i18next";
import BrAmountApproverModal from "./BrAmountApproverModal";
import { createMultiLangKeyValueMap } from "../../../../utils/commonMethods";

export default function BudgetBreakdown({ request: requestData }) {
  const { t, i18n } = useTranslation();
  const [brAmountModal, setBrAmountModal] = useState(false);
  const toggleBrAmountModal = () => setBrAmountModal(!brAmountModal);
  const [braAmount, setBraAmount] = useState(null);

  const handleBudgetRequestAmountClick = useCallback(
    (row) => {
      setBraAmount(row);
      toggleBrAmountModal();
    },
    [toggleBrAmountModal],
  );

  const { data: amounts, isLoading: isAmountsLoading } =
    useFetchBudgetRequestAmounts({ budget_request_id: requestData?.bdr_id });
  const amountColumns = useBudgetRequestColumnsApproval({
    data: amounts || [],
    showApprove: true,
    onClickApprove: handleBudgetRequestAmountClick,
  });

  const { data: tasks, isLoading: isTasksLoading } = useFetchBudgetRequestTasks(
    { budget_request_id: requestData?.bdr_id },
  );
  const taskColumns = useBudgetRequestTaskColumns({
    data: tasks || [],
    toggleViewModal: () => {},
    setTransaction: () => {},
    handleBudgetRequestTaskClick: () => {},
    onClickDelete: () => {},
    showEdit: false,
    showDelete: false,
    showActions: false,
    showDetail: false,
  });

  const { data: requestCategories } = useFetchRequestCategorys();
  const bgCategoryMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      requestCategories?.data || [],
      "rqc_id",
      {
        en: "rqc_name_en",
        am: "rqc_name_am",
        or: "rqc_name_or",
      },
      i18n.language,
    );
  }, [requestCategories, i18n.language]);

  const physicalProgress =
    (requestData?.bdr_physical_baseline / requestData?.bdr_physical_planned) *
    100;
  const financialProgress =
    requestData?.bdr_financial_baseline > 0
      ? (requestData?.bdr_financial_baseline /
          requestData?.bdr_requested_amount) *
        100
      : 0;

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `$${val.toLocaleString()}`;
      },
      offsetX: 10,
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: ["Baseline", "Requested", "Released", "Recommended"],
      labels: {
        formatter: function (val) {
          return `$${val.toLocaleString()}`;
        },
      },
    },
    colors: ["#17a2b8", "#007bff", "#28a745", "#ffc107"],
    tooltip: {
      y: {
        formatter: function (val) {
          return `$${val.toLocaleString()}`;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Amount",
      data: [
        requestData?.bdr_financial_baseline || 0,
        requestData?.bdr_requested_amount || 0,
        requestData?.bdr_released_amount || 0,
        requestData?.bdr_financial_recommended || 0,
      ],
    },
  ];

  return (
    <>
      <BrAmountApproverModal
        isOpen={brAmountModal}
        toggle={toggleBrAmountModal}
        budgetRequestAmount={braAmount}
      />
      <div className="d-flex flex-column gap-4">
        {/* Enhanced Summary Cards with Real Data */}
        <Row className="g-3 align-items-stretch">
          <Col md={3}>
            <Card className="text-center border-primary h-100">
              <CardBody className="py-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="h3 text-primary mb-1">
                    ${requestData?.bdr_requested_amount?.toLocaleString()}
                  </div>
                  <small className="text-muted">Total Requested Amount</small>
                </div>
                <div className="mt-2">
                  <Badge color="primary" outline>
                    Budget Year {requestData?.budget_year}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center border-success h-100">
              <CardBody className="py-4 d-flex flex-column justify-content-center">
                <div>
                  <div className="h3 text-success mb-1">
                    ${requestData?.bdr_released_amount?.toLocaleString() ?? 0}
                  </div>
                  <small className="text-muted">Released Amount</small>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center border-info h-100">
              <CardBody className="py-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="h3 text-info mb-1">
                    {requestData?.bdr_physical_baseline}%
                  </div>
                  <small className="text-muted">Physical Baseline</small>
                </div>
                <div className="mt-2">
                  <Progress
                    value={requestData?.bdr_physical_baseline}
                    color="info"
                    className="mb-1"
                  />
                  <small className="text-muted">
                    vs {requestData?.bdr_physical_planned}% planned
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center border-warning h-100">
              <CardBody className="py-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="h3 text-warning mb-1">
                    ${requestData?.bdr_financial_baseline?.toLocaleString()}
                  </div>
                  <small className="text-muted">Financial Baseline</small>
                </div>
                <div className="mt-2">
                  <Progress
                    value={financialProgress}
                    color="warning"
                    className="mb-1"
                  />
                  <small className="text-muted">
                    {financialProgress.toFixed(1)}% of requested
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Request Details Card */}
        <Card>
          <CardHeader className="bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Budget Request Information</h5>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <Table borderless className="mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-bold text-muted">Request Type:</td>
                      <td>{requestData?.request_type}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Status:</td>
                      <td>
                        <Badge color={requestData?.color_code}>
                          {requestData?.status_name}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Requested Date:</td>
                      <td>{requestData?.bdr_requested_date_gc}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Released Date:</td>
                      <td>
                        {requestData?.bdr_released_date_gc || "Not Released"}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Request Category:</td>
                      <td>
                        {bgCategoryMap[requestData?.bdr_request_category_id]}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <Table borderless className="mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-bold text-muted">Created Time:</td>
                      <td>
                        {new Date(
                          requestData?.bdr_create_time,
                        )?.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Action Remark:</td>
                      <td>{requestData?.bdr_action_remark || "No remarks"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Physical vs Financial Progress Comparison */}
        <Card className="h-100">
          <CardHeader>
            <h5 className="mb-1">Progress Analysis</h5>
            <small className="text-muted">
              Physical and financial progress comparison
            </small>
          </CardHeader>
          <CardBody>
            <Row className="h-100">
              {/* Physical Progress */}
              <Col
                md={6}
                className="d-flex flex-column justify-content-between h-100"
              >
                <h6 className="text-muted mb-3">Physical Progress</h6>
                <div className="d-flex flex-column justify-content-evenly flex-grow-1">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Baseline</small>
                      <small>{requestData?.bdr_physical_baseline}%</small>
                    </div>
                    <Progress
                      value={requestData?.bdr_physical_baseline}
                      color="info"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Planned</small>
                      <small>{requestData?.bdr_physical_planned}%</small>
                    </div>
                    <Progress
                      value={requestData?.bdr_physical_planned}
                      color="primary"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Approved</small>
                      <small>{requestData?.bdr_physical_approved}%</small>
                    </div>
                    <Progress
                      value={requestData?.bdr_physical_approved}
                      color="success"
                    />
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <small>Recommended</small>
                      <small>{requestData?.bdr_physical_recommended}%</small>
                    </div>
                    <Progress
                      value={requestData?.bdr_physical_recommended}
                      color="warning"
                    />
                  </div>
                </div>
              </Col>

              {/* Financial Progress */}
              <Col md={6} className="d-flex flex-column h-100">
                <h6 className="text-muted mb-3">Financial Progress</h6>
                <Card className="flex-grow-1">
                  <CardBody className="p-2">
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      height="100%"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Summary Cards */}
        <Row className="g-3">
          <Col md={2}>
            <Card className="text-center">
              <CardBody className="py-4">
                <div className="h4 text-primary mb-1">
                  $
                  {amounts?.data
                    ?.reduce(
                      (sum, item) => sum + (item.bra_requested_amount || 0),
                      0,
                    )
                    ?.toLocaleString()}
                </div>
                <small className="text-muted">Total Requested</small>
              </CardBody>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <CardBody className="py-4">
                <div className="h4 text-success mb-1">
                  $
                  {amounts?.data
                    ?.reduce(
                      (sum, item) => sum + (item.bra_current_year_expense || 0),
                      0,
                    )
                    ?.toLocaleString()}
                </div>
                <small className="text-muted">Current Year Expense</small>
              </CardBody>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <CardBody className="py-4">
                <div className="h4 text-warning mb-1">
                  $
                  {amounts?.data
                    ?.reduce(
                      (sum, item) =>
                        sum + (item.bra_source_government_requested || 0),
                      0,
                    )
                    ?.toLocaleString()}
                </div>
                <small className="text-muted">Government Source</small>
              </CardBody>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <CardBody className="py-4">
                <div className="h4 text-info mb-1">
                  $
                  {amounts?.data
                    ?.reduce(
                      (sum, item) =>
                        sum + (item.bra_source_internal_requested || 0),
                      0,
                    )
                    ?.toLocaleString()}
                </div>
                <small className="text-muted">Internal Source</small>
              </CardBody>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <CardBody className="py-4">
                <div className="h4 text-secondary mb-1">
                  $
                  {amounts?.data
                    ?.reduce(
                      (sum, item) =>
                        sum + (item.bra_source_support_requested || 0),
                      0,
                    )
                    ?.toLocaleString()}
                </div>
                <small className="text-muted">Support Source</small>
              </CardBody>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <CardBody className="py-4">
                <div className="h4 text-dark mb-1">
                  $
                  {amounts?.data
                    ?.reduce(
                      (sum, item) =>
                        sum + (item.bra_source_credit_requested || 0),
                      0,
                    )
                    ?.toLocaleString()}
                </div>
                <small className="text-muted">Credit Source</small>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Budget Request Amounts Table */}
        <Card>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Budget Request Amounts</h5>
                <small className="text-muted">
                  Detailed breakdown of requested budget items
                </small>
              </div>
              <div className="d-flex gap-2">
                <Button color="secondary" size="sm" outline>
                  <i className="bi bi-funnel me-2"></i>
                  Filter
                </Button>
                <Button color="secondary" size="sm" outline>
                  <i className="bi bi-download me-2"></i>
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <TableContainer
              columns={amountColumns}
              data={amounts?.data || []}
              isLoading={isAmountsLoading}
              isAddButton={false}
              size="lg"
              isGlobalFilter={true}
              SearchPlaceholder={t("filter_placeholder")}
              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
              theadClass="table-light"
              pagination="pagination"
              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />
          </CardBody>
        </Card>

        {/* Budget Request Tasks */}
        <Card>
          <CardHeader>
            <h5 className="mb-1">Budget Request Tasks</h5>
            <small className="text-muted">
              Project tasks and their associated costs
            </small>
          </CardHeader>
          <CardBody>
            <TableContainer
              columns={taskColumns}
              data={tasks?.data || []}
              isLoading={isTasksLoading}
              isAddButton={false}
              size="lg"
              isGlobalFilter={true}
              SearchPlaceholder={t("filter_placeholder")}
              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
              theadClass="table-light"
              pagination="pagination"
              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
