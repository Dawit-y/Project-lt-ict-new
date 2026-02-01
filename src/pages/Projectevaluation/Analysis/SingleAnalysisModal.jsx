import { Modal, ModalBody, ModalHeader } from "reactstrap";
import MonitoringEvaluationAnalysis from "./MonitoringEvaluationAnalysis";

function SingleAnalysisModal({
  isOpen,
  toggle,
  selectedRequest,
  data,
  evaluationTypes,
  visitTypes,
  periodTypes,
}) {
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">Analysis</h5>
      </ModalHeader>
      <ModalBody>
        <MonitoringEvaluationAnalysis
          monitoringEvaluationData={selectedRequest}
          allData={data}
          evaluationTypes={evaluationTypes}
          visitTypes={visitTypes}
          periodTypes={periodTypes}
          isOverallView={false}
        />
      </ModalBody>
    </Modal>
  );
}

export default SingleAnalysisModal;
