import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal, ModalHeader, ModalBody, Col, ModalFooter, Button } from "reactstrap";
import GanttChart from "../GanttChart";
import { useFetchProject } from "../../queries/project_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import Spinners from "../../components/Common/Spinner";

const modalStyle = {
  width: "100%",
  maxWidth: "1200px",
};

const GanttModal = (props) => {
  const { t, i18n } = useTranslation();
  const { isOpen, toggle, projectPlan } = props;

  const projectId = projectPlan?.pld_project_id
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const { data, isLoading, isError, error, refetch } = useFetchProject(projectId, userId, isOpen);
  const projectStatusId = data?.data?.prj_project_status_id || ""

  const [rerenderKey, setRerenderKey] = useState(0);
  useEffect(() => {
    const handleLanguageChange = () => {
      setRerenderKey((prevState) => prevState + 1);
    };
    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, t]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />
  }

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
          {isLoading ?
            <Spinners /> :
            <Col className="">
              <GanttChart
                key={rerenderKey}
                pld_id={projectPlan?.pld_id}
                name={projectPlan?.pld_name}
                startDate={projectPlan?.pld_start_date_gc}
                endDate={projectPlan?.pld_end_date_gc}
                projectStatusId={projectStatusId}
                readOnly={true}
              />
            </Col>}
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t('Close')}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

GanttModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  projectPlan: PropTypes.object,
};

export default GanttModal;