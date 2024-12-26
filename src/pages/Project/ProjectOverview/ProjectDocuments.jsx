import PropTypes from "prop-types";
import { Card, CardBody, CardTitle, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { map, isEmpty } from "lodash";

const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const API_URL = import.meta.env.VITE_BASE_API_FILE;

const ProjectDocuments = ({ data }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Project Documents</CardTitle>
        <div className="table-responsive" style={{ minHeight: "200px" }}>
          {isEmpty(data) && <p>No Documents found for this project.</p>}
          <Table className="table-nowrap align-middle table-hover mb-0">
            <tbody>
              {map(data, (file, i) => (
                <tr key={"_file_" + i}>
                  <td style={{ width: "45px" }}>
                    <div className="avatar-sm">
                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-24">
                        {file?.prd_file_extension === "pdf" ? (
                          <i className="bx bxs-file-pdf" />
                        ) : (
                          <i className="bx bxs-file-doc" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <h5 className="font-size-14 mb-1">
                      <Link to="#" className="text-dark">
                        {file.prd_name}
                      </Link>
                    </h5>
                    <small>Size : {bytesToMB(file.prd_size)} MB</small>
                  </td>
                  <td>
                    <div className="text-center">
                      <a
                        href={`${API_URL}/public/uploads/projectfiles/${file.prd_file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark"
                      >
                        <i className="bx bx-download h3 m-0" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

ProjectDocuments.propTypes = {
  files: PropTypes.array,
};

export default ProjectDocuments;
