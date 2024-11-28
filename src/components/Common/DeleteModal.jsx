import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Spinner } from "reactstrap";

const DeleteModal = ({ show, onDeleteClick, onCloseClick, isLoading }) => {
  const { t } = useTranslation();
  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button
            type="button"
            onClick={onCloseClick}
            className="btn-close position-absolute end-0 top-0 m-3"
          ></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
              <i className="mdi mdi-trash-can-outline"></i>
            </div>
          </div>
          <p className="text-muted font-size-16 mb-4">{t("confirm_erase")}</p>

          <div className="hstack gap-2 justify-content-center mb-0">
            {isLoading ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDeleteClick}
                disabled={isLoading}
              >
                <Spinner size={"sm"} color="#fff" className="me-1" />
                <span> {t("delete_now")}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDeleteClick}
              >
                {t("delete_now")}
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCloseClick}
            >
              {t("close")}
            </button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
};

export default DeleteModal;
