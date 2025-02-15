import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import {
  TabWrapper,
  PDFPreview,
  DetailsView,
} from "../../components/Common/DetailViewWrapper";
import { useSearchProjectDocuments } from "../../queries/projectdocument_query";
import Spinners from "../../components/Common/Spinner";
import { PAGE_ID } from "../../constants/constantFile";
const modalStyle = {
  width: "100%",
  marginTop: "30px",
};

const ProjectHandoverModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  const keysToRemove = [
    "prh_update_time",
    "is_role_editable",
    "is_role_deletable",
    "prh_handover_date_ec",
    "is_deletable",
    "is_editable",
    "prh_project_id",
    "prh_id",
    "prh_status",
    "prh_create_time",
    "prh_delete_time",
    "prh_created_by",
  ];

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
          {<DetailsView details={transaction} keysToRemove={keysToRemove} />}
        </ModalBody>
      </div>
    </Modal>
  );
};
ProjectHandoverModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default ProjectHandoverModal;
