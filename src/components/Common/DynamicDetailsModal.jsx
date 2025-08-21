import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Col,
  Row,
} from "reactstrap";

const DynamicDetailsModal = (props) => {
  const { t } = useTranslation();
  const {
    isOpen,
    toggle,
    data,
    fields,
    title,
    description,
    footerText,
    modalClassName,
    dateInGC,
    dateInEC,
    projectName,
  } = props;
  const renderTableRows = () => {
    // Ensure that fields is an array and data (transaction) is an object
    if (Array.isArray(fields) && typeof data === "object") {
      return fields.map((field, index) => (
        <tr key={index}>
          <th scope="row">{field.label} :</th>
          <td>
            {field.value
              ? field.value
              : typeof data[field.key] === "number"
                ? data[field.key].toLocaleString()
                : data && data[field.key]
                  ? data[field.key]
                  : "-"}
          </td>
        </tr>
      ));
    }
    return null; // Return null if fields or data are not valid
  };
  const printDetail = () => {
    const modalContent = document.getElementById("printable-detail").innerHTML;
    const printWindow = window.open(
      "",
      "_blank",
      `width=${window.screen.width},height=${window.screen.height}`,
    );
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${t("Print Details")}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            @media print{
              button{
                display:none;
              }
            }
          </style>
        </head>
        <body>
          ${modalContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };
  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className={modalClassName || "modal-xl"}
      tabIndex="-1"
      toggle={toggle}
    >
      <div className={modalClassName || "modal-xl"} id="printable-detail">
        <ModalHeader toggle={toggle}>
          {t(title)} - {projectName}
        </ModalHeader>
        <ModalBody>
          <div className="d-flex">
            <div className="flex-grow-1 overflow-hidden">
              <h5 className="text-truncate font-size-15">{t("Description")}</h5>
              <p className="text-muted">{description || "-"}</p>
            </div>
          </div>
          <h5 className="font-size-15 mt-4">{t("view_details")}</h5>
          <div className="text-muted mt-4">
            <Table className="table-nowrap mb-0 table-sm table-hover">
              <tbody>{renderTableRows()}</tbody>
            </Table>
          </div>
          {/* Static date fields */}
          <Row className="task-dates justify-content-center">
            {dateInEC && (
              <Col sm="4" xs="6">
                <div className="mt-4 text-center">
                  <h5 className="font-size-14">
                    <i className="bx bx-calendar me-1 text-primary" /> Date in
                    Ethiopian Calendar
                  </h5>
                  <p className="text-muted mb-0">{dateInEC}</p>
                </div>
              </Col>
            )}
            {dateInGC && (
              <Col sm="4" xs="6">
                <div className="mt-4 text-center">
                  <h5 className="font-size-14">
                    <i className="bx bx-calendar-check me-1 text-primary" />{" "}
                    Date
                  </h5>
                  <p className="text-muted mb-0">{dateInGC}</p>
                </div>
              </Col>
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={printDetail} className="btn btn-success me-2">
            <i className="fa fa-print" />
          </Button>
          <Button type="button" color="secondary" onClick={toggle}>
            {t(footerText || "Close")}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
DynamicDetailsModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.object, // Ensure data is an object
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string,
  footerText: PropTypes.string,
  modalClassName: PropTypes.string,
};
export default DynamicDetailsModal;
