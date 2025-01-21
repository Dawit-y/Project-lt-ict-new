import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  ModalFooter,
  Button,
} from "reactstrap";

const modalStyle = {
  width: "100%",
};

const DetailModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, details, excludeKey = [] } = props;

  const filteredDetails = Object.entries(details).filter(
    ([key]) => !excludeKey.includes(key)
  );

  const printDetail = () => {
    console.log(details);
    const modalContent = document.getElementById("printable-content").innerHTML;
    const printWindow = window.open("", "_blank", `width=${window.screen.width},height=${window.screen.height}`);
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
      className="modal-xl"
      tabIndex="-1"
      toggle={toggle}
      style={modalStyle}
    >
      <div className="modal-xl mt-30px">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody id="printable-content">
          <Table>
            <tbody>
              {filteredDetails.map(([key, value]) => (
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
        </ModalBody>
        <ModalFooter>
          <Button onClick={printDetail} className="btn btn-success me-2">
            <i className="fa fa-print" />
          </Button>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

DetailModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  details: PropTypes.object.isRequired,
  excludeKey: PropTypes.arrayOf(PropTypes.string),
};

export default DetailModal;
