import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import {
  TabWrapper,
  PDFPreview,
  DetailsView,
} from "../../components/Common/DetailViewWrapper";

const modalStyle = {
  width: "100%",
  marginTop: "30px",
};

const ProjectDocumentModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const keysToRemove = [
    "prd_document_type_id",
    "prd_update_time",
    "is_deletable",
    "is_editable",
    "prd_project_id",
    "prd_id",
    "total_count",
    "prd_delete_time",
    "prd_uploaded_date",
    "prd_description",
    "prd_created_by",
  ];
  const tabs = [
    {
      id: "details",
      label: "Details",
      content: (
        <DetailsView details={transaction} keysToRemove={keysToRemove} />
      ),
    },
    {
      id: "pdf",
      label: "PDF Viewer",
      content: (
        <PDFPreview
          filePath={transaction?.prd_file_path}
          fileSize={transaction?.prd_size}
        />
      ),
    },
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
      <div className="modal-xl mt-30px">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          <TabWrapper tabs={tabs} />
        </ModalBody>
      </div>
    </Modal>
  );
};

ProjectDocumentModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default ProjectDocumentModal;
