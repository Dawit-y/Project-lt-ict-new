import { Modal, ModalBody, ModalHeader } from "reactstrap";

import MonitoringEvaluationAnalysis from "./MonitoringEvaluationAnalysis";

function TotalAnalysisModal({
  isOpen,
  toggle,
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
          evaluationTypes={evaluationTypes}
          visitTypes={visitTypes}
          periodTypes={periodTypes}
          allData={data}
          isOverallView={true}
        />
      </ModalBody>
    </Modal>
  );
}

export default TotalAnalysisModal;
