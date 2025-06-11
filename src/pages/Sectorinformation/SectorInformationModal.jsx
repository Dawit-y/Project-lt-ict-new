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

const SectorInformationModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  const renderBooleanBadge = (value) => {
    return value === 1 ? (
      <Badge color="success">{t("Yes")}</Badge>
    ) : (
      <Badge color="danger">{t("No")}</Badge>
    );
  };
  const { data: sectorCategoryData } = useFetchSectorCategorys();
  const sectorCategoryMap = useMemo(() => {
    return (
      sectorCategoryData?.data?.reduce((acc, category) => {
        acc[category.psc_id] = category.psc_name;
        return acc;
      }, {}) || {}
    );
  }, [sectorCategoryData]);

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
              <th width="30%">{t("Name (OR)")}</th>
              <td>{transaction.sci_name_or || "-"}</td>
            </tr>
            <tr>
              <th>{t("Name (AM)")}</th>
              <td>{transaction.sci_name_am || "-"}</td>
            </tr>
            <tr>
              <th>{t("Name (EN)")}</th>
              <td>{transaction.sci_name_en || "-"}</td>
            </tr>
            <tr>
              <th>{t("Code")}</th>
              <td>
                <span className="text-primary font-weight-bold">
                  {transaction.sci_code || "-"}
                </span>
              </td>
            </tr>
            <tr>
              <th>{t("Sector Category")}</th>
              <td>
                {sectorCategoryMap[transaction.sci_sector_category_id] || "-"}
              </td>
            </tr>
            <tr>
              <th>{t("Available at Region")}</th>
              <td>{renderBooleanBadge(transaction.sci_available_at_region)}</td>
            </tr>
            <tr>
              <th>{t("Available at Zone")}</th>
              <td>{renderBooleanBadge(transaction.sci_available_at_zone)}</td>
            </tr>
            <tr>
              <th>{t("Available at Woreda")}</th>
              <td>{renderBooleanBadge(transaction.sci_available_at_woreda)}</td>
            </tr>
            <tr>
              <th>{t("is_inactive")}</th>
              <td>{renderBooleanBadge(transaction.sci_status)}</td>
            </tr>
            <tr>
              <th>{t("Description")}</th>
              <td>{transaction.sci_description || "-"}</td>
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

SectorInformationModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default SectorInformationModal;
