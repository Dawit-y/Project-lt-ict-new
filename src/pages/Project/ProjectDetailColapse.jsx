import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import ProjectDetail from "./ProjectOverview/ProjectDetail";
import { useTranslation } from "react-i18next";

const ProjectDetailColapse = ({ data }) => {
  const { t } = useTranslation();
  return (
    <UncontrolledAccordion className="mb-3 p-2">
      <AccordionItem>
        <AccordionHeader targetId="1">
          <strong>{`${t("details")}: ${data?.prj_name}`}</strong>
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
