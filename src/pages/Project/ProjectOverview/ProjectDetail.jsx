import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row, Spinner } from "reactstrap";
import img1 from "../../../assets/images/companies/img-1.png";
import { useTranslation } from "react-i18next";

const ProjectDetail = ({ data }) => {
  const { t } = useTranslation();
  if (!data) {
    return (
      <Spinner className="position-absolute top-50 start-50" size={"md"} />
    );
  }
  const excludedKeys = [
    "is_editable",
    "is_deletable",
    "prj_create_time",
    "prj_update_time",
    "prj_deleted",
    "prj_end_date_plan_gc",
    "prj_end_date_plan_et",
    "prj_outcome",
    "prj_start_date_plan_et",
    "prj_start_date_plan_gc",
    "prj_end_date_actual_et",
    "prj_owner_description",
    "prj_start_date_et",
    "prj_name",
    "prj_code",
  ];

  // Filter out unwanted keys
  const filteredDataArray = Object.entries(data).filter(
    ([key]) => !key.endsWith("_id") && !excludedKeys.includes(key)
  );
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <img src={img1} alt="" className="avatar-sm me-4" />

          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15">{data?.prj_name}</h5>
            <p className="text-muted">{data?.prj_owner_description}</p>
          </div>
        </div>

        <h5 className="font-size-15 mt-4">{t("prj_outcome")} :</h5>
        <p className="text-muted">{data?.prj_outcome}</p>

        <h5 className="font-size-15 mt-4">{t("prj_remark")} :</h5>
        <p className="text-muted">{data?.prj_remark}</p>

        <div className="text-muted mt-4">
          {filteredDataArray?.map(([key, value], index) => (
            <p key={index}>
              <i className="mdi mdi-chevron-right text-primary me-1" />
              <strong>{t(key)}:</strong> {value?.toString()}
            </p>
          ))}
        </div>

        <Row className="task-dates">
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar me-1 text-primary" />{" "}
                {t("prj_start_date_plan_gc")}
              </h5>
              <p className="text-muted mb-0">{data?.prj_start_date_plan_gc}</p>
            </div>
          </Col>

          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar-check me-1 text-primary" />{" "}
                {t("prj_end_date_plan_gc")}
              </h5>
              <p className="text-muted mb-0">{data?.prj_end_date_plan_gc}</p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

ProjectDetail.propTypes = {
  project: PropTypes.object,
};

export default ProjectDetail;
