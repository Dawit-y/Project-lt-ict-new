import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState } from "react";
import ProjectPaymentAnalysis from "./ProjectPaymentAnalysis";
import { useTranslation } from "react-i18next";

function TotalPaymentAnalysisModal({
  isOpen,
  toggle,
  data,
  paymentCategoryMap,
}) {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState("bar");
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">{t("payments_analysis")}</h5>
      </ModalHeader>
      <ModalBody>
        <ProjectPaymentAnalysis
          allData={data}
          isOverallView={true}
          chartType={chartType}
          onChartTypeChange={setChartType}
          paymentCategoryMap={paymentCategoryMap}
        />
      </ModalBody>
    </Modal>
  );
}

export default TotalPaymentAnalysisModal;
