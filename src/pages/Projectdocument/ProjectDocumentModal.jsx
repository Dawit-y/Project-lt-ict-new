import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";
import classnames from "classnames";
import axios from "axios";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import { Document, Page } from "react-pdf";

const modalStyle = {
  width: "100%",
  height: "100%",
};

const pdfViewerStyle = {
  height: "500px",
  width: "100%",
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const API_URL = import.meta.env.VITE_BASE_URL;

const ProjectDocumentModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const [activeTab, setActiveTab] = useState("details");

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  console.log(transaction);
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
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "details" })}
                onClick={() => toggleTab("details")}
              >
                {t("Details")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "pdf" })}
                onClick={() => toggleTab("pdf")}
              >
                {t("PDF Viewer")}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="details">
              <Table>
                <tbody>
                  <tr>
                    <td>{t("prd_project_id")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_project_id}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_document_type_id")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_document_type_id}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_name")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_file_path")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_file_path}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_size")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_size}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_file_extension")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_file_extension}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_uploaded_date")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_uploaded_date}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_description")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_description}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("prd_status")}:</td>
                    <td>
                      <span className="text-primary">
                        {transaction.prd_status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
              {transaction.is_deletable === 1 && (
                <p className="text-danger">Data is deletable</p>
              )}
              {transaction.is_editable === 1 && (
                <p className="text-success">Editable</p>
              )}
            </TabPane>
            <TabPane tabId="pdf">
              <div style={pdfViewerStyle}>
                {transaction?.prd_size > 10485760 ? (
                  <div>
                    <h6 className="text-danger mt-2">Unable to preview pdf</h6>
                    <a
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${API_URL}/public/uploads/projectfiles/${transaction?.prd_file_path}`}
                    >
                      Download PDF
                    </a>
                  </div>
                ) : (
                  <>
                    <Document
                      file={`${API_URL}/public/uploads/projectfiles/${transaction?.prd_file_path}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      options={{
                        workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
                      }}
                    >
                      <Page pageNumber={pageNumber} scale={1.5} />
                    </Document>
                  </>
                )}
              </div>
              <div className="absolute bottom-0 d-flex gap-2">
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <Button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((prevPage) => prevPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber((prevPage) => prevPage + 1)}
                >
                  Next
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

ProjectDocumentModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default ProjectDocumentModal;
