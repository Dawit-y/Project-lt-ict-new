import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from "reactstrap";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import {
  selectProject,
  fetchSingleProjectRequest,
} from "../../../store/project/actions";
import ProjectDetail from "./ProjectDetail";
import ProjectStakeholders from "./ProjectStakeholders";
import ProjectDocuments from "./ProjectDocuments";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const ProjectsOverview = (props) => {
  //meta title
  document.title =
    "Project Overview | Skote - Vite React Admin & Dashboard Template";

  const { id: projectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectProject(projectId));
  }, [dispatch, projectId]);

  const projectProperties = createSelector(
    (state) => state.ProjectR, // this is geting from  reducer
    (ProjectReducer) => ({
      // this is from Project.reducer
      project: ProjectReducer.project,
      selectedProject: ProjectReducer.selectedProject,
      loading: ProjectReducer.loading,
      update_loading: ProjectReducer.update_loading,
    })
  );

  const {
    project: { data, previledge },
    selectedProject,
    loading,
    update_loading,
  } = useSelector(projectProperties);

  useEffect(() => {
    if (isEmpty(selectedProject)) {
      dispatch(fetchSingleProjectRequest(projectId));
    }
  }, [dispatch, selectedProject, projectId]);
  const location = selectedProject?.prj_geo_location || "0,0";
  const [latitude, longitude] = location.split(",").map(Number);
  const position = { lat: latitude, lng: longitude };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Project Overview" />

          <>
            <Row>
              <Col lg="8">
                <ProjectDetail data={selectedProject} />
              </Col>

              <Col lg="4">
                <ProjectStakeholders projectId={projectId} />
                <ProjectDocuments projectId={projectId} />
              </Col>
            </Row>

            <Row>
              <Col lg="12">
                <Card>
                  <CardTitle className="mx-4 mt-4">Project Location</CardTitle>
                  <CardBody>
                    <React.Fragment>
                      {!isEmpty(selectedProject) ? (
                        <div className="container-fluid">
                          <APIProvider apiKey={API_KEY}>
                            <Map
                              style={{ height: "100vh" }}
                              defaultCenter={position}
                              defaultZoom={16}
                              gestureHandling="greedy"
                              disableDefaultUI={true}
                            >
                              <Marker position={position} />
                            </Map>
                          </APIProvider>
                        </div>
                      ) : (
                        <Spinner
                          className="position-absolute top-50 start-50"
                          size={"md"}
                        />
                      )}
                    </React.Fragment>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        </Container>
      </div>
    </React.Fragment>
  );
};

ProjectsOverview.propTypes = {
  match: PropTypes.object,
};

export default ProjectsOverview;
