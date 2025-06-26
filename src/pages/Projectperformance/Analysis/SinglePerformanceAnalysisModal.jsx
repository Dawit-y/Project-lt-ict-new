import { Modal, ModalBody, ModalHeader } from "reactstrap";

import { useState } from "react";
import ProjectPerformanceAnalysis from "./ProjectPerformanceAnalysis";

function SinglePerformanceAnalysisModal({
  isOpen,
  toggle,
  selectedRequest,
  data,
}) {
  const [chartType, setChartType] = useState("bar");
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">Analysis</h5>
      </ModalHeader>
      <ModalBody>
        <ProjectPerformanceAnalysis
          performanceData={selectedRequest}
          allData={data}
          isOverallView={false}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
      </ModalBody>
    </Modal>
  );
}

export default SinglePerformanceAnalysisModal;
