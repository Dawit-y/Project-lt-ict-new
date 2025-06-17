import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState } from "react";
import ProjectPaymentAnalysis from "./ProjectPaymentAnalysis";
import { useTranslation } from "react-i18next";

function SinglePaymentAnalysisModal({
  isOpen,
  toggle,
  selectedPayment,
  data,
  paymentCategoryMap,
}) {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState("bar");
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">{t("payment_analysis")}</h5>
      </ModalHeader>
      <ModalBody>
        <ProjectPaymentAnalysis
          paymentData={selectedPayment}
          allData={data}
          isOverallView={false}
          chartType={chartType}
          onChartTypeChange={setChartType}
          paymentCategoryMap={paymentCategoryMap}
        />
      </ModalBody>
    </Modal>
  );
}

export default SinglePaymentAnalysisModal;
