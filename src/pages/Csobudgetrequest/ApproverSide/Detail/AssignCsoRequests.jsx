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
	Badge,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuthUser } from "../../../../hooks/useAuthUser";
import { toast } from "react-toastify";
import CascadingDropdowns from "../../../../components/Common/CascadingDropdowns";
import {
	useUpdateProject,
	useFetchProject,
} from "../../../../queries/cso_project_query";
import { useFetchSectorInformations } from "../../../../queries/sectorinformation_query";
import { createMultiSelectOptions } from "../../../../utils/commonMethods";
import Select from "react-select";

const AssignCsoRequests = ({ requestData, isActive }) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const projectId = requestData?.bdr_project_id;
	const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();

	const { data: project, isLoading: isProjectLoading } = useFetchProject(
		projectId,
		userId,
		isActive,
	);
	const { data: sectorData } = useFetchSectorInformations();
	const isDisabled = [3, 4].includes(parseInt(requestData?.bdr_request_status));
	const sectorOptions = createMultiSelectOptions(
		sectorData?.data || [],
		"sci_id",
		["sci_name_en", "sci_name_or", "sci_name_am"],
	);
	const { mutateAsync, isPending } = useUpdateProject();

	const validationSchema = Yup.object().shape({
		prj_assigned_sectors: Yup.array()
			.min(1, t("prj_assigned_sectors"))
			.required(t("prj_assigned_sectors")),
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
				? project.data.prj_assigned_sectors
						.replace(/[{}]/g, "")
						.split(",")
						.map(Number)
				: [],
			object_type_id: 1,
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
				toast.success(t("add_success"), { autoClose: 3000 });
				formik.resetForm();
			} catch (error) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		},
	});

	return (
		<Row>
			<Col xl={8} className="mb-4">
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
										disabled={isDisabled}
										layout="vertical"
										required={true}
									/>
								</Col>
								<Col xl={12} className="mb-3">
									<Label>
										{t("prj_assigned_sectors")}{" "}
										<span className="text-danger">*</span>
									</Label>
									<Select
										isMulti
										name="prj_assigned_sectors"
										options={sectorOptions[`sci_name_${lang}`] || []}
										value={sectorOptions[`sci_name_${lang}`]?.filter((opt) =>
											formik.values.prj_assigned_sectors.includes(opt.value),
										)}
										onChange={(selected) =>
											formik.setFieldValue(
												"prj_assigned_sectors",
												selected ? selected.map((s) => s.value) : [],
											)
										}
										className="select2-selection"
										isDisabled={isDisabled}
									/>
									{formik.touched.prj_assigned_sectors &&
										formik.errors.prj_assigned_sectors && (
											<div className="text-danger mt-1">
												{formik.errors.prj_assigned_sectors}
											</div>
										)}
								</Col>
							</Row>
							<Button
								type="submit"
								color="primary"
								className="w-md"
								disabled={isPending || !formik.dirty}
							>
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
	requestData: PropTypes.object.isRequired,
	isActive: PropTypes.bool,
};

export default AssignCsoRequests;
