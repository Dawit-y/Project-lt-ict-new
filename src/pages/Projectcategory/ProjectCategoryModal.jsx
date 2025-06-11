import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Badge,
} from "reactstrap";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";

const modalStyle = {
  width: "100%",
  maxWidth: "1200px",
};

const ProjectCategoryModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const { data: sectorCategoryData } = useFetchSectorCategorys();

  const renderBooleanBadge = (value) => {
    return value === 1 ? (
      <Badge color="success">{t("Yes")}</Badge>
    ) : (
      <Badge color="danger">{t("No")}</Badge>
    );
  };

  const sectorCategoryMap = useMemo(() => {
    return (
      sectorCategoryData?.data?.reduce((acc, category) => {
        acc[category.psc_id] = category.psc_name;
        return acc;
      }, {}) || {}
    );
  }, [sectorCategoryData]);

  const getOwnerTypeText = (ownerType) => {
    if (ownerType === 1) return "Gov";
    if (ownerType === 2) return "CSO";
    if (ownerType === 3) return "Citizenship";
    return "-";
  };

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
      <ModalHeader toggle={toggle} className="">
        <h4 className="modal-title">{t("view_details")}</h4>
      </ModalHeader>
      <ModalBody>
        <Table bordered size="sm" responsive className="table-details">
          <tbody>
            <tr>
              <th width="30%">{t("pct_name_or")}</th>
              <td>{transaction.pct_name_or || "-"}</td>
            </tr>
            <tr>
              <th>{t("pct_name_am")}</th>
              <td>{transaction.pct_name_am || "-"}</td>
            </tr>
            <tr>
              <th>{t("pct_name_en")}</th>
              <td>{transaction.pct_name_en || "-"}</td>
            </tr>
            <tr>
              <th>{t("pct_code")}</th>
              <td>
                <span className="text-primary font-weight-bold">
                  {transaction.pct_code || "-"}
                </span>
              </td>
            </tr>
            <tr>
              <th>{t("pct_description")}</th>
              <td>{transaction.pct_description || "-"}</td>
            </tr>
            <tr>
              <th>{t("pct_owner_type_id")}</th>
              <td>{getOwnerTypeText(transaction.pct_owner_type_id)}</td>
            </tr>
            <tr>
              <th>{t("pct_parent_id")}</th>
              <td>{sectorCategoryMap[transaction.pct_parent_id] || "-"}</td>
            </tr>
            <tr>
              <th>{t("is_inactive")}</th>
              <td>{renderBooleanBadge(transaction.pct_status)}</td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter className="border-top-0">
        <Button color="secondary" onClick={toggle} className="px-4">
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ProjectCategoryModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default ProjectCategoryModal;
