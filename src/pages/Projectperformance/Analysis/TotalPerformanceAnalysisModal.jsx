import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState } from "react";
import ProjectPerformanceAnalysis from "./ProjectPerformanceAnalysis";

function TotalPerformanceAnalysisModal({ isOpen, toggle, data }) {
  const [chartType, setChartType] = useState("bar");
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">Analysis</h5>
      </ModalHeader>
      <ModalBody>
        <ProjectPerformanceAnalysis
          allData={data}
          isOverallView={true}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
      </ModalBody>
    </Modal>
  );
}

export default TotalPerformanceAnalysisModal;
