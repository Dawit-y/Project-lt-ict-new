import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ProjectDetail from "./ProjectDetail";
import ProjectStakeholders from "./ProjectStakeholders";
import ProjectDocuments from "./ProjectDocuments";
import { useFetchProject } from "../../../queries/project_query";
import { useFetchProjectDocuments } from "../../../queries/projectdocument_query";
import { useFetchProjectStakeholders } from "../../../queries/projectstakeholder_query";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const ProjectsOverview = (props) => {
  document.title = "Overview | Project";
  const { id } = useParams();
  const projectId = Number(id);

  const project = useFetchProject(projectId);
  const documents = useFetchProjectDocuments({ project_id: projectId }, true);
  const stakeholders = useFetchProjectStakeholders({
    project_id: projectId,
  });

  const isLoading =
    project.isLoading || documents.isLoading || stakeholders.isLoading;

  const location = project?.data?.data?.prj_geo_location || "0,0";
  const [latitude, longitude] = location.split(",").map(Number);
  const position = { lat: latitude, lng: longitude };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Project Overview" />
          <>
            {isLoading ? (
              <Spinner
                className="position-absolute top-50 start-50"
                size={"md"}
              />
            ) : (
              <>
                <Row>
                  <Col lg="8">
                    <ProjectDetail data={project?.data?.data || []} />
                  </Col>

                  <Col lg="4">
                    <ProjectStakeholders
                      data={stakeholders?.data?.data || []}
                    />
                    <ProjectDocuments data={documents?.data?.data || []} />
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardTitle className="mx-4 mt-4">
                        Project Location
                      </CardTitle>
                      <CardBody>
                        <>
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
                        </>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </>
        </Container>
      </div>
    </>
  );
};

ProjectsOverview.propTypes = {
  match: PropTypes.object,
};

export default ProjectsOverview;
