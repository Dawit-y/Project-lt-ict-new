import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import { IoMdDownload } from "react-icons/io";

import { pdfjs, Document, Page } from "react-pdf";
import { Button } from "reactstrap";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslation } from "react-i18next";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const API_URL = import.meta.env.VITE_BASE_API_FILE;

export const TabWrapper = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const toggleTab = (tabId) => {
    if (activeTab !== tabId) setActiveTab(tabId);
  };

  return (
    <div>
      <Nav tabs>
        {tabs.map((tab) => (
          <NavItem key={tab.id}>
            <NavLink
              className={classnames({ active: activeTab === tab.id })}
              onClick={() => toggleTab(tab.id)}
            >
              {tab.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {tabs.map((tab) => (
          <TabPane key={tab.id} tabId={tab.id}>
            {tab.content}
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
};

TabWrapper.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export const DetailsView = ({ details, keysToRemove }) => {
  const { t } = useTranslation();
  const removeKeys = (obj, keysToRemove) => {
    const newObj = { ...obj }; // Create a shallow copy of the object
    keysToRemove.forEach((key) => delete newObj[key]); // Remove the specified keys
    return newObj;
  };

  const newTransaction = removeKeys(details, keysToRemove); // Replace with keys to remove
  return (
    <Table>
      <tbody>
        {Object.entries(newTransaction).map(([key, value]) => (
          <tr key={key}>
            <td>
              <strong>{t(`${key}`)}:</strong>
            </td>
            <td>
              <span className="text-primary">{value}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

DetailsView.propTypes = {
  details: PropTypes.object.isRequired,
};

const pdfViewerStyle = {
  width: "100%",
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const PDFPreview = ({ filePath, fileSize }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDimensions, setPageDimensions] = useState({});
  const [goToPage, setGoToPage] = useState("");

  const fullPath = useMemo(
    () => `${API_URL}/public/uploads/projectfiles/${filePath}`,
    [filePath]
  );

  const onDocumentLoadSuccess = (pdfDocument) => {
    setNumPages(pdfDocument.numPages);

    const fetchPageDimensions = async () => {
      const dimensions = {};
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        dimensions[i] = {
          width: page.getViewport({ scale: 1 }).width,
          height: page.getViewport({ scale: 1 }).height,
        };
      }
      setPageDimensions(dimensions);
    };

    fetchPageDimensions();
  };

  const handleGoToPageSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(goToPage, 10);

    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    } else {
      alert(`Please enter a page number between 1 and ${numPages}`);
    }
    setGoToPage("");
  };

  const MAX_SIZE = 10485760; // 10MB

  if (!filePath || !fileSize) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          height: "100%",
        }}
      >
        <h6 className="text-danger">No PDF file available to preview</h6>
        <p className="text-muted">Please provide a valid file to preview.</p>
      </div>
    );
  }

  return (
    <>
      {fileSize > MAX_SIZE ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h6 className="text-danger mt-2">Unable to preview Document</h6>
          <a
            className="btn btn-success"
            target="_blank"
            rel="noopener noreferrer"
            href={`${API_URL}/public/uploads/projectfiles/${filePath}`}
          >
            Download
          </a>
        </div>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Document
              file={fullPath}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                console.error("PDF loading error:", error)
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={1}
                width={pageDimensions[pageNumber]?.width || undefined}
                height={pageDimensions[pageNumber]?.height || undefined}
              />
            </Document>
          </div>
          <Row className="align-items-center">
            <Col className="d-flex align-items-center justify-content-start">
              <Button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((prev) => prev - 1)}
                color="primary"
              >
                Previous
              </Button>
              <p className="my-auto mx-3">
                Page {pageNumber} of {numPages}
              </p>
              <Button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((prev) => prev + 1)}
                color="primary"
              >
                Next
              </Button>
            </Col>

            <Col className="d-flex justify-content-center">
              <Form
                onSubmit={handleGoToPageSubmit}
                className="d-flex align-items-center gap-2"
              >
                <Input
                  type="number"
                  placeholder="Go to page"
                  value={goToPage}
                  onChange={(e) => setGoToPage(e.target.value)}
                  min={1}
                  max={numPages || 1}
                />

                <Button type="submit" color="secondary">
                  Go
                </Button>
              </Form>
            </Col>

            <Col className="d-flex justify-content-center align-items-center">
              <a
                className="btn btn-success"
                target="_blank"
                rel="noopener noreferrer"
                href={`${API_URL}/public/uploads/projectfiles/${filePath}`}
              >
                <span className="d-flex align-items-center justify-content-center">
                  <IoMdDownload className="me-2" /> Download
                </span>
              </a>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

PDFPreview.propTypes = {
  filePath: PropTypes.string,
  fileSize: PropTypes.number,
};
