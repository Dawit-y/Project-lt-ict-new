import React from "react";
import {
  Col,
  Card,
  CardBody,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from "reactstrap";
//Import Breadcrumb
import Permission from "../../pages/Permission";

const PermissionListTable = ({
  handleClick,
  showCanvas,
  canvasWidth,
  data,
}) => {
  //meta title PermissionListTable
  document.title = "Right OffCanvas | For Roles Permission";

  return (
    <React.Fragment>
      {/* Right offcanvas */}
      <Offcanvas
        isOpen={showCanvas}
        direction="end"
        toggle={handleClick}
        style={{ width: `${canvasWidth}vw` }}
      >
        <OffcanvasHeader toggle={handleClick}>
          Role : {data.rol_name}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Col lg={12}>
            <Card>
              <CardBody>
                {/* <ProjectDocument /> */}
                <Permission rol_id={data.rol_id} />
              </CardBody>
            </Card>
          </Col>
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  );
};

export default PermissionListTable;
