import React from "react";
import { Container, Row } from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import FormSelect2 from "./FormSelect2";
import ReactColorPicker from "./ReactColorpicker";
import BootstrapMaxLength from "./BootstrapMaxLength";
import BootstrapTouchSpin from "./BootstrapTouchSpin";
import CssSwitch from "./CssSwitch";
import BootstrapDatePicker from "./BootstrapDatePicker";
import DatePicker from "./DatePicker";

const FormAdvanced = () => {
  //meta title
  document.title = "Form Advanced | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Forms" breadcrumbItem="Form Advanced" />

          <FormSelect2 />
          <Row>

            <ReactColorPicker />

            <BootstrapDatePicker />
          </Row>

          <Row>
            <BootstrapMaxLength />

            <BootstrapTouchSpin />
          </Row>

          <CssSwitch />

          <DatePicker />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormAdvanced
