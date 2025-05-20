import React, { useMemo } from "react";
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
  Badge,
  Card,
  CardBody,
} from "reactstrap";
import { usePopulateBudgetYears } from "../../queries/budgetyear_query";

const ProjectKpiResultModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const { data: bgYearsOptionsData } = usePopulateBudgetYears();

  const budgetYearMap = useMemo(() => {
    return (
      bgYearsOptionsData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [bgYearsOptionsData]);

  // Helper function to render month data
  const renderMonthData = (monthNumber) => {
    const planned = transaction[`kpr_planned_month_${monthNumber}`];
    const actual = transaction[`kpr_actual_month_${monthNumber}`];
    const variance =
      planned !== null && actual !== null ? actual - planned : null;

    return (
      <Col md={6} lg={4} key={monthNumber} className="mb-3">
        <Card className="h-100 shadow-sm">
          <CardBody>
            <h6 className="card-title text-uppercase text-muted mb-3">
              {t(`Month ${monthNumber}`)}
            </h6>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">{t("Planned")}:</span>
              <strong className={planned === null ? "text-danger" : ""}>
                {planned !== null ? planned : "N/A"}
              </strong>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">{t("Actual")}:</span>
              <strong className={actual === null ? "text-danger" : ""}>
                {actual !== null ? actual : "N/A"}
              </strong>
            </div>
            {variance !== null && (
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">{t("Variance")}:</span>
                <Badge color={variance >= 0 ? "success" : "danger"}>
                  {variance >= 0 ? "+" : ""}
                  {variance}
                </Badge>
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      centered
      scrollable
      className="modal-dialog-scrollable"
    >
      <ModalHeader toggle={toggle} className="bg-light">
        <div className="d-flex align-items-center">
          <i className="bx bx-line-chart display-6 me-3 text-primary" />
          <div>
            <h4 className="mb-0">{t("KPI Result Details")}</h4>
            <small className="text-muted">
              {t("Project ID")}: {transaction.kpr_project_id}
            </small>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-4">
        {/* Basic Information Section */}
        <Card className="mb-4 shadow-sm">
          <CardBody>
            <h5 className="card-title mb-4">
              <i className="bx bx-info-circle me-2" />
              {t("Basic Information")}
            </h5>
            <Row>
              <Col md={4} className="mb-3">
                <label className="form-label text-muted">{t("KPI ID")}</label>
                <p className="fw-semibold">{transaction.kpr_project_kpi_id}</p>
              </Col>
              <Col md={4} className="mb-3">
                <label className="form-label text-muted">{t("Year")}</label>
                <p className="fw-semibold">
                  {budgetYearMap[transaction.kpr_year_id]}
                </p>
              </Col>
              <Col md={4} className="mb-3">
                <label className="form-label text-muted">{t("Status")}</label>
                <div>
                  <Badge
                    color={
                      transaction.kpr_status === "approved"
                        ? "success"
                        : transaction.kpr_status === "pending"
                        ? "warning"
                        : "secondary"
                    }
                    pill
                    className="px-3 py-2"
                  >
                    {transaction.kpr_status}
                  </Badge>
                </div>
              </Col>
              <Col md={12}>
                <label className="form-label text-muted">
                  {t("Description")}
                </label>
                <p className="fw-semibold">
                  {transaction.kpr_description || (
                    <span className="text-muted fst-italic">
                      No description provided
                    </span>
                  )}
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Monthly Data Section */}
        <Card className="mb-4 shadow-sm">
          <CardBody>
            <h5 className="card-title mb-4">
              <i className="bx bx-calendar me-2" />
              {t("Monthly Performance")}
            </h5>
            <Row>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(renderMonthData)}
            </Row>
          </CardBody>
        </Card>

        {/* Permissions Section */}
        {(transaction.is_deletable === 1 || transaction.is_editable === 1) && (
          <Card className="shadow-sm">
            <CardBody>
              <h5 className="card-title mb-4">
                <i className="bx bx-edit me-2" />
                {t("Permissions")}
              </h5>
              <div className="d-flex gap-3">
                {transaction.is_deletable === 1 && (
                  <Badge
                    color="danger"
                    className="px-3 py-2 d-flex align-items-center"
                  >
                    <i className="bx bx-trash me-1" /> {t("Deletable")}
                  </Badge>
                )}
                {transaction.is_editable === 1 && (
                  <Badge
                    color="success"
                    className="px-3 py-2 d-flex align-items-center"
                  >
                    <i className="bx bx-edit-alt me-1" /> {t("Editable")}
                  </Badge>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </ModalBody>

      <ModalFooter className="bg-light">
        <Button color="secondary" onClick={toggle} className="px-4">
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ProjectKpiResultModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default ProjectKpiResultModal;
