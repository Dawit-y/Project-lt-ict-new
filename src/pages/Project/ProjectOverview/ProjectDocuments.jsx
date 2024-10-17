import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardTitle, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { map } from "lodash";

import { getProjectDocument as onGetProjectDocument } from "../../../store/projectdocument/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const ProjectDocuments = ({ projectId }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetProjectDocument(projectId));
  }, [dispatch]);

  const projectDocumentProperties = createSelector(
    (state) => state.ProjectDocumentR, // this is geting from  reducer
    (ProjectDocumentReducer) => ({
      // this is from Project.reducer
      projectDocument: ProjectDocumentReducer.projectDocument,
      loading: ProjectDocumentReducer.loading,
      update_loading: ProjectDocumentReducer.update_loading,
    })
  );

  const {
    projectDocument: { data, previledge },
    loading,
    update_loading,
  } = useSelector(projectDocumentProperties);
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Project Documents</CardTitle>
        <div className="table-responsive">
          <Table className="table-nowrap align-middle table-hover mb-0">
            <tbody>
              {map(data, (file, i) => (
                <tr key={"_file_" + i}>
                  <td style={{ width: "45px" }}>
                    <div className="avatar-sm">
                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-24">
                        <i className="bx bxs-file-doc" />
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
                      <Link to={file.link} className="text-dark">
                        <i className="bx bx-download h3 m-0" />
                      </Link>
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
