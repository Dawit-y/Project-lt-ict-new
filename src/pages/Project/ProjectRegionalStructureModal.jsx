import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getUserSectorListTree } from "../../queries/usersector_query";
import { useTranslation } from "react-i18next";
import {
	Button,
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
} from "reactstrap";
import ProgramCascadingDropdowns from "../../components/Common/ProgramCascadingDropdown";
import { useFetchProgramTree } from "../../queries/programinfo_query";


/**
 * Find the parent cluster ID for a given sector ID
 */
const getParentClusterIdFromSectorId = (clustersWithSectors, sectorId) => {
	if (!clustersWithSectors || !Array.isArray(clustersWithSectors)) {
		return null;
	}

	for (const cluster of clustersWithSectors) {
		if (cluster.children && Array.isArray(cluster.children)) {
			const foundSector = cluster.children.find(
				(sector) => sector.sci_id === sectorId || sector.id === sectorId
			);
			if (foundSector) {
				return cluster.psc_id;
			}
		}
	}
	return null;
};

/**
 * Get the program and sub-program IDs for a specific output ID
 */
const getProgramHierarchyForOutput = (programTreeData, outputId) => {
	let programId = null;
	let subProgramId = null;

	if (!programTreeData || !Array.isArray(programTreeData)) {
		return { programId, subProgramId };
	}

	const findOutputInTree = (
		nodes,
		currentProgram = null,
		currentSubProgram = null
	) => {
		for (const node of nodes) {
			if (node.pri_object_type_id === 4 && node.id === outputId) {
				programId = currentProgram;
				subProgramId = currentSubProgram;
				return true;
			}

			if (node.children && Array.isArray(node.children)) {
				let newProgram = currentProgram;
				let newSubProgram = currentSubProgram;

				if (node.pri_object_type_id === 1) {
					newProgram = node.id;
				} else if (node.pri_object_type_id === 3) {
					newSubProgram = node.id;
				}

				if (findOutputInTree(node.children, newProgram, newSubProgram)) {
					return true;
				}
			}
		}
		return false;
	};

	findOutputInTree(programTreeData);
	return { programId, subProgramId };
};

const ProjectRegionalStructureModal = ({
	isOpen,
	toggle,
	project = {},
	onSubmit,
	isLoading: isFormLoading,
}) => {
	const { t } = useTranslation();
	const { userId } = useAuthUser();

	const { data: clustersWithSectors = [], isLoading: isClusterLoading } =
		getUserSectorListTree(userId);
	const sectorId = project?.prj_sector_id;
	const shouldFetchPrograms = isOpen && !!sectorId;

	const { data: programs, isLoading: isProgramsLoading } = useFetchProgramTree(
		{ pri_sector_id: sectorId },
		shouldFetchPrograms
	);

	const derivedValues = useMemo(() => {
		if (!isOpen || !project)
			return { clusterId: "", programId: "", subProgramId: "" };

		// Find Cluster
		const foundClusterId = getParentClusterIdFromSectorId(
			clustersWithSectors,
			sectorId
		);

		// Find Program Hierarchy
		let hierarchy = { programId: null, subProgramId: null };
		if (programs?.data && project?.prj_parent_id) {
			hierarchy = getProgramHierarchyForOutput(
				programs.data,
				project.prj_parent_id
			);
		}

		return {
			clusterId: foundClusterId || "",
			programId: hierarchy.programId || "",
			subProgramId: hierarchy.subProgramId || "",
		};
	}, [isOpen, project, clustersWithSectors, programs, sectorId]);

	// 4. Formik Setup
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			prj_owner_region_id: project?.prj_owner_region_id || "",
			prj_owner_zone_id: project?.prj_owner_zone_id || "",
			prj_owner_woreda_id: project?.prj_owner_woreda_id || "",
			prj_sector_id: sectorId || "",
			prj_cluster_id: derivedValues.clusterId,
			prj_program_id: derivedValues.programId,
			prj_sub_program_id: derivedValues.subProgramId,
			prj_parent_id: project?.prj_parent_id || "",
			prj_id: project?.prj_id || "",
		},
		validationSchema: Yup.object({
			prj_owner_region_id: Yup.string().required(t("val_required")),
			prj_owner_zone_id: Yup.string().required(t("val_required")),
			prj_owner_woreda_id: Yup.string().required(t("val_required")),
			prj_cluster_id: Yup.string().required(t("val_required")),
			prj_sector_id: Yup.string().required(t("val_required")),
			prj_program_id: Yup.string().required(t("val_required")),
			prj_sub_program_id: Yup.string().required(t("val_required")),
			prj_parent_id: Yup.string().required(t("val_required")),
		}),
		onSubmit: (values) => {
			const submissionValues = { ...values };
			submissionValues.prj_id = Number(submissionValues.prj_id);
			submissionValues.prj_owner_region_id = Number(
				submissionValues.prj_owner_region_id
			);
			submissionValues.prj_owner_zone_id = Number(
				submissionValues.prj_owner_zone_id
			);
			submissionValues.prj_owner_woreda_id = Number(
				submissionValues.prj_owner_woreda_id
			);
			submissionValues.prj_cluster_id = Number(submissionValues.prj_cluster_id);
			submissionValues.prj_sector_id = Number(submissionValues.prj_sector_id);
			submissionValues.prj_program_id = Number(submissionValues.prj_program_id);
			submissionValues.prj_sub_program_id = Number(
				submissionValues.prj_sub_program_id
			);
			submissionValues.prj_parent_id = Number(submissionValues.prj_parent_id);

			onSubmit(submissionValues);
		},
	});

	const isCalculatingStructure = isProgramsLoading || isClusterLoading;

	if (isOpen && isCalculatingStructure) {
		return (
			<Modal isOpen={isOpen} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					{t("Project Regional Structure")}
				</ModalHeader>
				<ModalBody className="d-flex justify-content-center align-items-center py-5">
					<Spinner color="primary" className="me-2" />
					<span>{t("Loading structure data...")}</span>
				</ModalBody>
			</Modal>
		);
	}

	return (
		<Modal isOpen={isOpen} toggle={toggle} className="modal-lg">
			<ModalHeader toggle={toggle} tag="h4">
				{t("Project Regional Structure")}
			</ModalHeader>
			<ModalBody>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit();
						return false;
					}}
				>
					<Row className="d-flex align-items-center justify-content-center">
						<Col className="col-md-10">
							<ProgramCascadingDropdowns
								validation={validation}
								regionField="prj_owner_region_id"
								zoneField="prj_owner_zone_id"
								woredaField="prj_owner_woreda_id"
								clusterField="prj_cluster_id"
								sectorField="prj_sector_id"
								programField="prj_program_id"
								subProgramField="prj_sub_program_id"
								outputField="prj_parent_id"
								required={true}
							/>
						</Col>
					</Row>

					<Row className="mt-4">
						<Col>
							<div className="text-end">
								<Button color="secondary" onClick={toggle} className="me-2">
									{t("Cancel")}
								</Button>
								<Button
									color="success"
									type="submit"
									className="save-user"
									disabled={isFormLoading || !validation.dirty}
								>
									{isFormLoading && (
										<Spinner size="sm" color="light" className="me-2" />
									)}
									{t("Save Structure")}
								</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</ModalBody>
		</Modal>
	);
};

ProjectRegionalStructureModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	project: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
};

export default ProjectRegionalStructureModal;
