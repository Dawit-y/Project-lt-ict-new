import React, { useState, useMemo } from "react";
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
import { IoMdDownload } from "react-icons/io";
import classnames from "classnames";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const modalStyle = {
  width: "100%",
  marginTop: "30px",
};

const pdfViewerStyle = {
  width: "100%",
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const API_URL = import.meta.env.VITE_BASE_URL;

const Preview = ({ file, onDocumentLoadSuccess, pageNumber }) => {
  const path = useMemo(
    () => `${API_URL}/public/uploads/projectfiles/${file}`,
    [file]
  );

  const memoizedOptions = useMemo(
    () => ({
      workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    }),
    []
  );

  return (
    <Document
      file={path}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.error("PDF loading error:", error)}
      options={memoizedOptions}
    >
      <Page pageNumber={pageNumber} scale={1} />
    </Document>
  );
};

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
      <div className="modal-xl mt-30px">
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
              <div style={{ paddingTop: "30px", height: "100%" }}>
                <div style={pdfViewerStyle}>
                  {transaction?.prd_size > 10485760 ? (
                    <div>
                      <h6 className="text-danger mt-2">
                        Unable to preview Document
                      </h6>
                      <a
                        className="btn btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${API_URL}/public/uploads/projectfiles/${transaction?.prd_file_path}`}
                      >
                        <IoMdDownload /> <span className="ms-2">Download</span>
                      </a>
                    </div>
                  ) : (
                    <Preview
                      file={transaction?.prd_file_path}
                      onDocumentLoadSuccess={onDocumentLoadSuccess}
                      pageNumber={pageNumber}
                    />
                  )}
                </div>
              </div>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter
          className={`d-flex align-items-center ${
            activeTab == "pdf" && transaction?.prd_size < 10485760
              ? "justify-content-between"
              : "justify-content-end"
          } `}
        >
          {activeTab == "pdf" && transaction?.prd_size < 10485760 && (
            <div className="d-flex align-items-center gap-3">
              <p className="mb-0">
                Page {pageNumber} of {numPages}
              </p>
              <Button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((prevPage) => prevPage - 1)}
                color="primary"
              >
                Previous
              </Button>
              <Button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((prevPage) => prevPage + 1)}
                color="primary"
              >
                Next
              </Button>
            </div>
          )}

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
