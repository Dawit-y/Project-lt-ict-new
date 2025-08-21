import React, { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import ProjectDetail from "./ProjectOverview/ProjectDetail";
import { useTranslation } from "react-i18next";

const ProjectDetailColapse = ({ data }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(null);

  const toggle = (id) => {
    if (open === id) {
      setOpen(null);
    } else {
      setOpen(id);
    }
  };

  return (
    <Accordion open={open} toggle={toggle} className="mb-3 p-2">
      <AccordionItem>
        <AccordionHeader targetId="1" onClick={() => toggle("1")}>
          <strong>{`${t("details")}: ${data?.prj_name ?? ""}`}</strong>
        </AccordionHeader>
        <AccordionBody accordionId="1">
          {<ProjectDetail data={data} />}
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default ProjectDetailColapse;
