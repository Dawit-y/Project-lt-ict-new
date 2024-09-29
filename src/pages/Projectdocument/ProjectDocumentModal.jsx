// import React, { useTransition } from "react"
// import PropTypes from "prop-types"
// import { useTranslation } from "react-i18next";
// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Table,
// } from "reactstrap"

// const modalStyle = {
//   width: '100%',
//   height: '100%',
// };

// const ProjectDocumentModal = (props) => {
//   const { t } = useTranslation();
//   const { isOpen, toggle, transaction } = props;

//   return (
//     <Modal
//       isOpen={isOpen}
//       role="dialog"
//       autoFocus={true}
//       centered={true}
//       className="modal-xl"
//       tabIndex="-1"
//       toggle={toggle}
//       style={modalStyle}
//     >
//       <div className="modal-xl">
//         <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
//         <ModalBody>
//         <tr>
//                     <p className="mb-2">
//             {t('prd_project_id')}: <span className="text-primary">{transaction.prd_project_id}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_document_type_id')}: <span className="text-primary">{transaction.prd_document_type_id}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_name')}: <span className="text-primary">{transaction.prd_name}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_file_path')}: <span className="text-primary">{transaction.prd_file_path}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_size')}: <span className="text-primary">{transaction.prd_size}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_file_extension')}: <span className="text-primary">{transaction.prd_file_extension}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_uploaded_date')}: <span className="text-primary">{transaction.prd_uploaded_date}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_description')}: <span className="text-primary">{transaction.prd_description}</span>
//           </p>
//           </tr><tr>
//                     <p className="mb-2">
//             {t('prd_status')}: <span className="text-primary">{transaction.prd_status}</span>
//           </p>
//           </tr>

//           {transaction.is_deletable === 1 && (
//             <p className="text-danger">data is deletable</p>
//           )}
          
//           {transaction.is_editable === 1 && (
//             <p className="text-success">Editable</p>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button type="button" color="secondary" onClick={toggle}>
//             {t('Close')}
//           </Button>
//         </ModalFooter>
//       </div>
//     </Modal>
//   );
// };
// ProjectDocumentModal.propTypes = {
//   toggle: PropTypes.func,
//   isOpen: PropTypes.bool,
//   transaction: PropTypes.object,
// };
// export default ProjectDocumentModal;

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
  Table
} from "reactstrap";
import classnames from 'classnames';
import axios from 'axios';

const modalStyle = {
  width: '100%',
  height: '100%',
};

const pdfViewerStyle = {
  height: '500px',
  width: '100%',
};

const ProjectDocumentModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  const [activeTab, setActiveTab] = useState('details');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (isOpen && transaction?.prd_file_path) {
      
      const fetchPdfUrl = async () => {
        try {
          
          const response = await axios.get(`https://pmsor.awashsol.com/public/uploads/projectfiles/${transaction.filePath}`, {
            
          });
          
          setPdfUrl(response.data.pdfUrl || '');
        } catch (error) {
          console.error('Error fetching PDF URL:', error);
          setPdfUrl('');
        }
      };
      fetchPdfUrl();
    }
  }, [isOpen, transaction]);

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
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'details' })}
                onClick={() => toggleTab('details')}
              >
                {t('Details')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'pdf' })}
                onClick={() => toggleTab('pdf')}
              >
                {t('PDF Viewer')}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="details">
              <Table>
                <tbody>
                  <tr>
                    <td>{t('prd_project_id')}:</td>
                    <td><span className="text-primary">{transaction.prd_project_id}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_document_type_id')}:</td>
                    <td><span className="text-primary">{transaction.prd_document_type_id}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_name')}:</td>
                    <td><span className="text-primary">{transaction.prd_name}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_file_path')}:</td>
                    <td><span className="text-primary">{transaction.prd_file_path}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_size')}:</td>
                    <td><span className="text-primary">{transaction.prd_size}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_file_extension')}:</td>
                    <td><span className="text-primary">{transaction.prd_file_extension}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_uploaded_date')}:</td>
                    <td><span className="text-primary">{transaction.prd_uploaded_date}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_description')}:</td>
                    <td><span className="text-primary">{transaction.prd_description}</span></td>
                  </tr>
                  <tr>
                    <td>{t('prd_status')}:</td>
                    <td><span className="text-primary">{transaction.prd_status}</span></td>
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
              {pdfUrl ? (
                <div style={pdfViewerStyle}>
                  <iframe
                    src={`${import.meta.env.VITE_BASE_API_URL1}/public/uploads/projectfiles/${transaction.filePath}`}
                    title="PDF Viewer"
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                  ></iframe>
                </div>
              ) : (
                <p>{t('No PDF available')}</p>
              )}
            </TabPane>
          </TabContent>
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

ProjectDocumentModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default ProjectDocumentModal;

