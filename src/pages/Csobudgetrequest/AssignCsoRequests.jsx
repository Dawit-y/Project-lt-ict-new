import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Spinner,
  Table,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns1";
import { useUpdateProject, useFetchProject } from "../../queries/cso_project_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import Select from "react-select";

const AssignCsoRequests = ({ request, isActive, budgetYearMap }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const projectId = request?.bdr_project_id;
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;

  const { data: project, isLoading: isProjectLoading } = useFetchProject(projectId, userId, isActive);
  const { data: sectorData } = useFetchSectorInformations();

  const sectorOptions = createMultiSelectOptions(sectorData?.data || [], "sci_id", ["sci_name_en", "sci_name_or", "sci_name_am"]);
  const { mutateAsync, isPending } = useUpdateProject();

  const validationSchema = Yup.object().shape({
    prj_assigned_sectors: Yup.array().min(1, t("prj_assigned_sectors")).required(t("prj_assigned_sectors")),
    prj_owner_region_id: Yup.string().required(t("prj_owner_region_id")),
    prj_owner_zone_id: Yup.string().required(t("prj_owner_zone_id")),
    prj_owner_woreda_id: Yup.string().required(t("prj_owner_woreda_id")),
  });

  const formik = useFormik({
    initialValues: {
      prj_id: projectId,
      prj_owner_region_id: project?.data?.prj_owner_region_id || "",
      prj_owner_zone_id: project?.data?.prj_owner_zone_id || "",
      prj_owner_woreda_id: project?.data?.prj_owner_woreda_id || "",
      prj_assigned_sectors: project?.data?.prj_assigned_sectors
        ? project.data.prj_assigned_sectors.replace(/[{}]/g, "").split(",").map(Number)
        : [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          prj_assigned_sectors: JSON.stringify(values.prj_assigned_sectors), // stringify array
        };
        await mutateAsync(payload);
        toast.success(t("add_success"), { autoClose: 2000 });
        formik.resetForm();
      } catch (error) {
        toast.error(t("add_failure"), { autoClose: 2000 });
      }
    },

  });

  return (
    <Row>
      <Col xl={7}>
        <Card>
          <CardBody>
            <CardTitle>Overview</CardTitle>
            <Table size="sm">
              <tbody>
                {[
                  [t("Year"), budgetYearMap[request.bdr_budget_year_id]],
                  [t("bdr_requested_date_gc"), request.bdr_requested_date_gc],
                  [t("bdr_description"), request.bdr_description],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
            <Table size="sm">
              <tbody>
                {[
                  [t("prj_name"), project?.data?.prj_name],
                  [t("prj_code"), project?.data?.prj_code],
                  [t("prj_project_category_id"), project?.data?.prj_project_category_id],
                  [t("prj_total_estimate_budget"), project?.data?.prj_total_estimate_budget],
                  [t("prj_total_actual_budget"), project?.data?.prj_total_actual_budget],
                  [t("prj_start_date_plan_gc"), project?.data?.prj_start_date_plan_gc],
                  [t("prj_outcome"), project?.data?.prj_outcome],
                  [t("prj_remark"), project?.data?.prj_remark],
                  [t("prj_urban_ben_number"), project?.data?.prj_urban_ben_number],
                  [t("prj_rural_ben_number"), project?.data?.prj_rural_ben_number],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
      <Col xl={5}>
        <Card>
          <CardBody>
            <CardTitle className="mb-4">Assign</CardTitle>
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <Col xl={12} className="mb-3">
                  <CascadingDropdowns
                    validation={formik}
                    dropdown1name="prj_owner_region_id"
                    dropdown2name="prj_owner_zone_id"
                    dropdown3name="prj_owner_woreda_id"
                  />
                </Col>
                <Col xl={12} className="mb-3">
                  <Label>
                    {t("prj_assigned_sectors")} <span className="text-danger">*</span>
                  </Label>
                  <Select
                    isMulti
                    name="prj_assigned_sectors"
                    options={sectorOptions[`sci_name_${lang}`] || []}
                    value={sectorOptions[`sci_name_${lang}`]?.filter(opt =>
                      formik.values.prj_assigned_sectors.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      formik.setFieldValue(
                        "prj_assigned_sectors",
                        selected ? selected.map((s) => s.value) : []
                      )
                    }
                    className="select2-selection"
                  />
                  {formik.touched.prj_assigned_sectors && formik.errors.prj_assigned_sectors && (
                    <div className="text-danger mt-1">{formik.errors.prj_assigned_sectors}</div>
                  )}
                </Col>
              </Row>
              <Button type="submit" color="primary" className="w-md" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner size="sm" /> <span className="ms-2">Submit</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

AssignCsoRequests.propTypes = {
  request: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  budgetYearMap: PropTypes.object.isRequired,
};

export default AssignCsoRequests;
