import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import ProjectDetail from "./ProjectOverview/ProjectDetail";

const ProjectDetailColapse = ({ data }) => {
  return (
    <UncontrolledAccordion className="mb-3 p-2">
      <AccordionItem>
        <AccordionHeader targetId="1">
          <strong>{`Details of ${data?.prj_name}`}</strong>
        </AccordionHeader>
        <AccordionBody accordionId="1">
          <>
            <ProjectDetail data={data} />
          </>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default ProjectDetailColapse;
