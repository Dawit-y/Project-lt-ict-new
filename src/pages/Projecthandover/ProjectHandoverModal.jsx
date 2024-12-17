import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import {
  TabWrapper,
  PDFPreview,
  DetailsView,
} from "../../components/Common/DetailViewWrapper";
import { useSearchProjectDocuments } from "../../queries/projectdocument_query";
import Spinners from "../../components/Common/Spinner";

const modalStyle = {
  width: "100%",
  marginTop: "30px",
};

const ProjectHandoverModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const handoverId = transaction?.prh_id;
  const param = { prd_owner_type_id: 1, prd_owner_id: handoverId };

  const { data, isLoading } = useSearchProjectDocuments(
    handoverId ? param : null
  );

  const tabs = [
    {
      id: "details",
      label: "Details",
      content: <DetailsView details={transaction} />,
    },
    {
      id: "pdf",
      label: "PDF Viewer",
      content: isLoading ? (
        <Spinners />
      ) : (
        <PDFPreview
          filePath={data?.data[0]?.prd_file_path}
          fileSize={data?.data[0]?.prd_size}
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
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          {isLoading ? <Spinners /> : <TabWrapper tabs={tabs} />}
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
