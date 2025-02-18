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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ProjectDetail from "./ProjectDetail";
import ProjectStakeholders from "./ProjectStakeholders";
import ProjectDocuments from "./ProjectDocuments";
import { useFetchProject } from "../../../queries/project_query";
import { useFetchProjectDocuments } from "../../../queries/projectdocument_query";
import { useFetchProjectStakeholders } from "../../../queries/projectstakeholder_query";

const ProjectsOverview = (props) => {
  document.title = "Overview | Project";
  
  const { id } = useParams();
  const projectId = Number(id);

  const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const project = useFetchProject(projectId, userId, true);
  const documents = useFetchProjectDocuments({ project_id: projectId }, true);
  const stakeholders = useFetchProjectStakeholders({
    project_id: projectId,
  });

  const isLoading =
    project.isLoading || documents.isLoading || stakeholders.isLoading;

  const location = project?.data?.data?.prj_geo_location || "0,0";
  const [latitude, longitude] = location.split(",").map(Number);
  const position = [latitude, longitude];

  const projectName = project?.data?.data?.prj_name || "";

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
                        <div className="container-fluid1">
                          <MapContainer
                            center={position}
                            zoom={16}
                            scrollWheelZoom={true}
                            style={{ height: "400px", width: "100%", zIndex: 1 }}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position}>
                              {projectName && <Popup>{projectName}</Popup>}
                            </Marker>
                          </MapContainer>
                        </div>
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
