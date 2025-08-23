import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";

const modalStyle = {
	width: "100%",
};

const ProjectModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

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
          <tr>
            <p className="mb-2">
              {t("prj_name")}:{" "}
              <span className="text-primary">{transaction.prj_name}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_code")}:{" "}
              <span className="text-primary">{transaction.prj_code}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_project_status_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_project_status_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_project_category_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_project_category_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_project_budget_source_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_project_budget_source_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_total_estimate_budget")}:{" "}
              <span className="text-primary">
                {transaction.prj_total_estimate_budget}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_total_actual_budget")}:{" "}
              <span className="text-primary">
                {transaction.prj_total_actual_budget}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_geo_location")}:{" "}
              <span className="text-primary">
                {transaction.prj_geo_location}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_sector_id")}:{" "}
              <span className="text-primary">{transaction.prj_sector_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_location_region_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_location_region_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_location_zone_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_location_zone_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_location_woreda_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_location_woreda_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_location_kebele_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_location_kebele_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_location_description")}:{" "}
              <span className="text-primary">
                {transaction.prj_location_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_owner_region_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_owner_region_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_owner_zone_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_owner_zone_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_owner_woreda_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_owner_woreda_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_owner_kebele_id")}:{" "}
              <span className="text-primary">
                {transaction.prj_owner_kebele_id}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_owner_description")}:{" "}
              <span className="text-primary">
                {transaction.prj_owner_description}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_start_date_et")}:{" "}
              <span className="text-primary">
                {transaction.prj_start_date_et}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_start_date_gc")}:{" "}
              <span className="text-primary">
                {transaction.prj_start_date_gc}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_start_date_plan_et")}:{" "}
              <span className="text-primary">
                {transaction.prj_start_date_plan_et}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_start_date_plan_gc")}:{" "}
              <span className="text-primary">
                {transaction.prj_start_date_plan_gc}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_end_date_actual_et")}:{" "}
              <span className="text-primary">
                {transaction.prj_end_date_actual_et}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_end_date_actual_gc")}:{" "}
              <span className="text-primary">
                {transaction.prj_end_date_actual_gc}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_end_date_plan_gc")}:{" "}
              <span className="text-primary">
                {transaction.prj_end_date_plan_gc}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_end_date_plan_et")}:{" "}
              <span className="text-primary">
                {transaction.prj_end_date_plan_et}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_outcome")}:{" "}
              <span className="text-primary">{transaction.prj_outcome}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_deleted")}:{" "}
              <span className="text-primary">{transaction.prj_deleted}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_remark")}:{" "}
              <span className="text-primary">{transaction.prj_remark}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_created_date")}:{" "}
              <span className="text-primary">
                {transaction.prj_created_date}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_owner_id")}:{" "}
              <span className="text-primary">{transaction.prj_owner_id}</span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_urban_ben_number")}:{" "}
              <span className="text-primary">
                {transaction.prj_urban_ben_number}
              </span>
            </p>
          </tr>
          <tr>
            <p className="mb-2">
              {t("prj_rural_ben_number")}:{" "}
              <span className="text-primary">
                {transaction.prj_rural_ben_number}
              </span>
            </p>
          </tr>

          {transaction.is_deletable === 1 && (
            <p className="text-danger">data is deletable</p>
          )}

          {transaction.is_editable === 1 && (
            <p className="text-success">Editable</p>
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
ProjectModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectModal;
