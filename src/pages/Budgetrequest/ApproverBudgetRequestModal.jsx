import React, { useState, useMemo, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { TabWrapper } from "../../components/Common/DetailViewWrapper";
import RequestFollowupModel from "../Requestfollowup";
import ApproveDecline from "./ApproveDecline";

const modalStyle = {
  width: "100%",
};

const ApproverBudgetRequestListModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction, budgetYearMap = {} } = props;

  const tabs = [
    {
      id: "approve/reject",
      label: `Recommend/Reject`,
      content: <ApproveDecline request={transaction} toggleParent={toggle} />,
    },
    {
      id: "request_followup",
      label: `Forward Request`,
      content: <RequestFollowupModel request={transaction} />,
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="modal-xl"
      toggle={toggle}
      style={modalStyle}
    >
      <ModalHeader toggle={toggle}>{t("take_action")}</ModalHeader>
      <ModalBody>
        <TabWrapper tabs={tabs} />
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="secondary" onClick={toggle}>
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ApproverBudgetRequestListModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
  budgetYearMap: PropTypes.object,
};

export default ApproverBudgetRequestListModal;
