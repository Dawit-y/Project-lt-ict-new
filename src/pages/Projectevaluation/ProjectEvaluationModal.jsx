import React from "react";
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
  Progress,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import {
  FaCalendar,
  FaAward,
  FaExclamationTriangle,
  FaLayerGroup,
} from "react-icons/fa";
import classnames from "classnames";

const transactionTypes = [
  { value: 1, label: "monitoring" },
  { value: 2, label: "evaluation" },
];
const transactionTypeMap = Object.fromEntries(
  transactionTypes.map(({ value, label }) => [value, label]),
);
const visitTypes = [
  { value: 1, label: "Regular" },
  { value: 2, label: "Surprise" },
];
const visitTypeMap = Object.fromEntries(
  visitTypes.map(({ value, label }) => [value, label]),
);

const ProjectEvaluationModal = ({ isOpen, toggle, transaction }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState("woreda");

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (!num) return "-";
    return new Intl.NumberFormat().format(num);
  };

  const ProgressCard = ({ title, physical, financial, color = "primary" }) => (
    <Card className="h-100 border-0 shadow-sm">
      <CardBody>
        <h6 className="fw-bold mb-3" style={{ color: "#495057" }}>
          {title}
        </h6>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">{t("physical_progress")}</span>
            <span className="fw-medium">{formatNumber(physical)}%</span>
          </div>
          <Progress
            value={physical || 0}
            color={color}
            style={{ height: "6px" }}
          />
        </div>
        <div>
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">{t("financial_progress")}</span>
            <span className="fw-medium">
              {formatNumber(financial)} {t("birr")}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      centered
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <ModalHeader
        toggle={toggle}
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          padding: "1.5rem 2rem",
        }}
      >
        <div className="d-flex align-items-center w-100">
          <div className="flex-grow-1">
            <h4 className="mb-1 fw-bold" style={{ color: "#212529" }}>
              {t("project_monitoring_details")}
            </h4>
            <div className="d-flex align-items-center">
              <small className="text-muted d-flex align-items-center">
                <FaCalendar className="me-1" size={14} />
                {formatDate(transaction?.mne_record_date)}
              </small>
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-4">
        {/* Progress Metrics Tabs */}
        <Row>
          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <Nav tabs className="mb-4">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "woreda" })}
                      onClick={() => setActiveTab("woreda")}
                    >
                      <FaLayerGroup className="me-1" />
                      {t("woreda_level")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "zone" })}
                      onClick={() => setActiveTab("zone")}
                    >
                      <FaLayerGroup className="me-1" />
                      {t("zone_level")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "region" })}
                      onClick={() => setActiveTab("region")}
                    >
                      <FaLayerGroup className="me-1" />
                      {t("region_level")}
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="woreda">
                    <Row className="g-4">
                      <Col>
                        <ProgressCard
                          title={t("woreda_progress")}
                          physical={transaction?.mne_physical}
                          financial={transaction?.mne_financial}
                          color="primary"
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="zone">
                    <Row className="g-4">
                      <Col>
                        <ProgressCard
                          title={t("zone_progress")}
                          physical={transaction?.mne_physical_zone}
                          financial={transaction?.mne_financial_zone}
                          color="warning"
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="region">
                    <Row className="g-4">
                      <Col>
                        <ProgressCard
                          title={t("region_progress")}
                          physical={transaction?.mne_physical_region}
                          financial={transaction?.mne_financial_region}
                          color="danger"
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <h5
                  className="d-flex align-items-center mb-3 fw-bold"
                  style={{ color: "#212529" }}
                >
                  {t("basic_information")}
                </h5>

                <Row className="g-3">
                  <Col sm={6}>
                    <div className="mb-3">
                      <span className="d-block small text-muted mb-1">
                        {t("evaluation_type")}
                      </span>
                      <p
                        className="mb-2 fw-medium"
                        style={{ color: "#212529" }}
                      >
                        {transactionTypeMap[transaction?.mne_type_id] || "-"}
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <span className="d-block small text-muted mb-1">
                        {t("visit_type")}
                      </span>
                      <p
                        className="mb-2 fw-medium"
                        style={{ color: "#212529" }}
                      >
                        {visitTypeMap[transaction?.mne_visit_type] || "-"}
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <span className="d-block small text-muted mb-1">
                        {t("team_size")}
                      </span>
                      <h3 className="mb-0 fw-bold" style={{ color: "#212529" }}>
                        {transaction?.mne_team_members?.split(",").length || 0}
                      </h3>
                      <small className="text-muted">
                        {transaction?.mne_team_members || "-"}
                      </small>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <span className="d-block small text-muted mb-1">
                        {t("evaluation_period")}
                      </span>
                      <h5 className="mb-0" style={{ color: "#212529" }}>
                        {formatDate(transaction?.mne_start_date)} -{" "}
                        {formatDate(transaction?.mne_end_date)}
                      </h5>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Details Section */}
        <Row className="g-4">
          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <CardBody>
                <h5
                  className="d-flex align-items-center mb-3 fw-bold"
                  style={{ color: "#212529" }}
                >
                  <FaExclamationTriangle className="me-2" />
                  {t("findings_analysis")}
                </h5>

                <div className="mb-3">
                  <h6
                    className="fw-semibold mb-2"
                    style={{ color: "#495057", fontSize: "0.9rem" }}
                  >
                    {t("feedback")}
                  </h6>
                  <div
                    className="p-3 rounded"
                    style={{
                      //   backgroundColor: "rgba(13,110,253,0.05)",
                      borderLeft: "3px solid #0d6efd",
                    }}
                  >
                    <p
                      className="mb-0 text-muted"
                      style={{ lineHeight: "1.6" }}
                    >
                      {transaction?.mne_feedback || "-"}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6
                    className="fw-semibold mb-2"
                    style={{ color: "#495057", fontSize: "0.9rem" }}
                  >
                    {t("challenges")}
                  </h6>
                  <div
                    className="p-3 rounded"
                    style={{
                      //   backgroundColor: "rgba(220,53,69,0.05)",
                      borderLeft: "3px solid #dc3545",
                    }}
                  >
                    <p
                      className="mb-0 text-muted"
                      style={{ lineHeight: "1.6" }}
                    >
                      {transaction?.mne_challenges || "-"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <CardBody>
                <h5
                  className="d-flex align-items-center mb-3 fw-bold"
                  style={{ color: "#212529" }}
                >
                  <FaAward className="me-2" />
                  {t("recommendations")}
                </h5>

                <div className="mb-3">
                  <h6
                    className="fw-semibold mb-2"
                    style={{ color: "#495057", fontSize: "0.9rem" }}
                  >
                    {t("proposed_actions")}
                  </h6>
                  <div
                    className="p-3 rounded"
                    style={{
                      //   backgroundColor: "rgba(111,66,193,0.05)",
                      borderLeft: "3px solid #6f42c1",
                    }}
                  >
                    <p
                      className="mb-0 text-muted"
                      style={{ lineHeight: "1.6" }}
                    >
                      {transaction?.mne_recommendations || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <h6
                    className="fw-semibold mb-2"
                    style={{ color: "#495057", fontSize: "0.9rem" }}
                  >
                    {t("evaluation_purpose")}
                  </h6>
                  <div
                    className="p-3 rounded"
                    style={{
                      //   backgroundColor: "rgba(32,201,151,0.05)",
                      borderLeft: "3px solid #20c997",
                    }}
                  >
                    <p
                      className="mb-0 text-muted"
                      style={{ lineHeight: "1.6" }}
                    >
                      {transaction?.mne_purpose || "-"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {transaction?.mne_description && (
            <Col lg={12}>
              <Card className="h-100 border-0 shadow-sm">
                <CardBody>
                  <h5
                    className="d-flex align-items-center mb-3 fw-bold"
                    style={{ color: "#212529" }}
                  >
                    {t("detailed_notes")}
                  </h5>
                  <div
                    className="p-3 rounded bg-light"
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      lineHeight: "1.7",
                    }}
                  >
                    <div
                      className="text-muted"
                      dangerouslySetInnerHTML={{
                        __html: transaction.mne_description,
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button
          color="light"
          onClick={toggle}
          className="px-4 py-2 rounded-2 fw-medium"
          style={{ fontSize: "0.95rem" }}
        >
          {t("close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ProjectEvaluationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  transaction: PropTypes.object,
};

export default ProjectEvaluationModal;
