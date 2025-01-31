import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import ProjectDocumentModal from "../ProjectDocumentModal";
import DeleteModal from "../../../components/Common/DeleteModal";

const formatFileSize = (bytes) => {
  if (isNaN(bytes) || bytes < 0) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const FileList = ({
  files,
  edit,
  handleDeleteProjectDocument,
  deleteModal,
  setDeleteModal,
  isDeleteLoading,
  onClickDelete,
}) => {
  const [modal1, setModal1] = useState(false);
  const [details, setDetails] = useState({});

  const toggleViewModal = () => setModal1(!modal1);

  return (
    <React.Fragment>
      <ProjectDocumentModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={details}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectDocument}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={isDeleteLoading}
      />
      <div>
        <Row className="mb-3">
          <Col xl={3} sm={6}>
            <div className="mt-2">
              <h5>Documents</h5>
            </div>
          </Col>
          <Col xl={9} sm={6}>
            <Form className="mt-4 mt-sm-0 float-sm-end d-flex align-items-center">
              <div className="search-box mb-2 me-2">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control bg-light border-light rounded"
                    placeholder="Search..."
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>
              <UncontrolledDropdown className="mb-0">
                <DropdownToggle
                  tag="a"
                  className="btn btn-link text-muted mt-n2"
                >
                  <i className="mdi mdi-dots-vertical font-size-20"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem to="#">Share Files</DropdownItem>
                  <DropdownItem to="#">Share with me</DropdownItem>
                  <DropdownItem to="#">Other Actions</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Form>
          </Col>
        </Row>
      </div>
      <div>
        {files.length > 0 ? (
          <Row>
            {files.map((file, key) => {
              const getFileIcon = (extension) => {
                switch (extension?.toLowerCase()) {
                  case "pdf":
                    return { icon: "bx bxs-file-pdf", color: "text-danger" };
                  case "doc":
                  case "docx":
                    return { icon: "bx bxs-file-word", color: "text-primary" };
                  case "xls":
                  case "xlsx":
                    return { icon: "bx bxs-file-excel", color: "text-success" };
                  case "ppt":
                  case "pptx":
                    return {
                      icon: "bx bxs-file-powerpoint",
                      color: "text-warning",
                    };
                  case "txt":
                    return { icon: "bx bxs-file-txt", color: "text-muted" };
                  case "jpg":
                  case "jpeg":
                  case "png":
                  case "gif":
                    return { icon: "bx bxs-file-image", color: "text-info" };
                  case "zip":
                  case "rar":
                    return {
                      icon: "bx bxs-file-archive",
                      color: "text-secondary",
                    };
                  default:
                    return { icon: "bx bxs-file", color: "text-dark" };
                }
              };

              const { icon, color } = getFileIcon(file?.prd_file_extension);

              return (
                <Col xl={4} sm={6} key={key}>
                  <Card className="shadow-none border">
                    <CardBody className="p-3">
                      <div>
                        <div className="float-end ms-2">
                          <UncontrolledDropdown className="mb-2">
                            <DropdownToggle
                              tag="a"
                              className="font-size-16 text-muted"
                            >
                              <i className="mdi mdi-dots-horizontal"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem
                                to="#"
                                onClick={() => {
                                  setDetails(file);
                                  toggleViewModal();
                                }}
                              >
                                Open
                              </DropdownItem>
                              <DropdownItem to="#" onClick={() => edit(file)}>
                                Edit
                              </DropdownItem>
                              <div className="dropdown-divider"></div>
                              <DropdownItem
                                to="#"
                                className="text-danger"
                                onClick={() => onClickDelete(file)}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>

                        {/* Dynamic File Icon */}
                        <div className="avatar-xs me-3 mb-3">
                          <div className="avatar-title bg-transparent rounded">
                            <i
                              className={`${icon} ${color}`}
                              style={{ fontSize: "40px" }}
                            />
                          </div>
                        </div>

                        <div className="">
                          <div className="overflow-hidden me-auto">
                            <h5 className="font-size-14 text-truncate mb-1">
                              <Link to="#" className="text-body">
                                {file?.prd_name}
                              </Link>
                            </h5>
                          </div>
                          <div className="align-self-end">
                            <p className="text-muted mb-0">
                              {formatFileSize(file?.prd_size)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">No files available.</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default FileList;
