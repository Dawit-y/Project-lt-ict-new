import { useTranslation } from "react-i18next";
import {
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Row,
  Col,
} from "reactstrap";
import BudgetRequestAnalysis from "./BudgetRequestAnalysis";
import { useState } from "react";

function TotalAnalysisModal({ isOpen, toggle, data }) {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState("bar");
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">Analysis</h5>
      </ModalHeader>
      <ModalBody>
        <BudgetRequestAnalysis
          allData={data}
          isOverallView={true}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
      </ModalBody>
    </Modal>
  );
}

export default TotalAnalysisModal;
