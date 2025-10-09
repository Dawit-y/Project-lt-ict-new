import React, { useEffect, useState } from "react";
import {
	FormGroup,
	Label,
	Input,
	FormFeedback,
	Row,
	Col,
	Spinner,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { post } from "../../helpers/api_Lists";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getUserSectorListTree } from "../../queries/usersector_query";

// API functions
const fetchAddressByParent = async (parentId) => {
	const response = await post(`addressbyparent?parent_id=${parentId}`);
	return response?.data || [];
};

const fetchProgramTree = async (sectorId) => {
	const response = await post(
		`program_info/listprogramtree?pri_sector_id=${sectorId}`
	);
	return response?.data || [];
};

// Helper function to extract programs, subprograms, and outputs from nested tree
const extractProgramHierarchy = (programTree) => {
	const programs = [];

	programTree.forEach((program) => {
		if (program.pri_object_type_id === 1) {
			// Program
			const programData = {
				id: program.id,
				name: program.name,
				pri_name_en: program.name,
				pri_name_or: program.pri_name_or,
				pri_name_am: program.pri_name_am,
				pri_program_code: program.pri_program_code,
				level: "program",
				children: [],
			};

			// Extract subprograms
			if (program.children && program.children.length > 0) {
				program.children.forEach((subProgram) => {
					if (subProgram.pri_object_type_id === 3) {
						// Sub Program
						const subProgramData = {
							id: subProgram.id,
							name: subProgram.name,
							pri_name_en: subProgram.name,
							pri_name_or: subProgram.pri_name_or,
							pri_name_am: subProgram.pri_name_am,
							pri_program_code: subProgram.pri_program_code,
							level: "sub_program",
							children: [],
						};

						// Extract outputs
						if (subProgram.children && subProgram.children.length > 0) {
							subProgram.children.forEach((output) => {
								if (output.pri_object_type_id === 4) {
									// Output
									subProgramData.children.push({
										id: output.id,
										name: output.name,
										pri_name_en: output.name,
										pri_name_or: output.pri_name_or,
										pri_name_am: output.pri_name_am,
										pri_program_code: output.pri_program_code,
										level: "output",
									});
								}
							});
						}

						programData.children.push(subProgramData);
					}
				});
			}

			programs.push(programData);
		}
	});

	return programs;
};

const getClustersWithId = (clustersWithSectors) => {
	return clustersWithSectors.map((cluster) => ({
		...cluster,
		id: cluster.psc_id, // Add id attribute with psc_id value
	}));
};

const ProgramCascadingDropdowns = ({
	validation,
	// Field names for each level
	regionField = "region_id",
	zoneField = "zone_id",
	woredaField = "woreda_id",
	clusterField = "c_id",
	sectorField = "s_id",
	programField = "program_id",
	subProgramField = "sub_program_id",
	outputField = "output_id",

	required = false,
	disabled = false,
	layout = "vertical",
	colSizes = { md: 6 },

	defaultRegion = "1",
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const { userId } = useAuthUser();

	// Fetch clusters and sectors in tree format
	const {
		data: clustersWithSectors = [],
		isLoading: loadingClustersSectors,
		isError: isClusterError,
		error: clusterError,
	} = getUserSectorListTree(userId);
	const clustersWithId = React.useMemo(() => {
		return getClustersWithId(clustersWithSectors);
	}, [clustersWithSectors]);

	// Fetch zones for selected region
	const {
		data: zones = [],
		isLoading: loadingZones,
		refetch: refetchZones,
	} = useQuery({
		queryKey: ["zones", validation?.values?.[regionField]],
		staleTime: 1000 * 60 * 5,
		queryFn: () => fetchAddressByParent(validation?.values?.[regionField]),
		enabled: !!validation?.values?.[regionField],
	});

	// Fetch woredas for selected zone
	const {
		data: woredas = [],
		isLoading: loadingWoredas,
		refetch: refetchWoredas,
	} = useQuery({
		queryKey: ["woredas", validation?.values?.[zoneField]],
		staleTime: 1000 * 60 * 5,
		queryFn: () => fetchAddressByParent(validation?.values?.[zoneField]),
		enabled: !!validation?.values?.[zoneField],
	});

	// Fetch program tree for selected sector
	const {
		data: programTreeData = [],
		isLoading: loadingPrograms,
		refetch: refetchPrograms,
	} = useQuery({
		queryKey: ["program-tree", validation?.values?.[sectorField]],
		staleTime: 1000 * 60 * 5,
		queryFn: () => fetchProgramTree(validation?.values?.[sectorField]),
		enabled: !!validation?.values?.[sectorField],
	});

	// Extract programs hierarchy from program tree
	const programsHierarchy = React.useMemo(() => {
		return extractProgramHierarchy(programTreeData);
	}, [programTreeData]);

	// Get subprograms for selected program
	const subPrograms = React.useMemo(() => {
		const selectedProgramId = validation?.values?.[programField];
		if (!selectedProgramId || !programsHierarchy.length) return [];

		const selectedProgram = programsHierarchy.find(
			(prog) => prog.id == selectedProgramId
		);
		return selectedProgram?.children || [];
	}, [programsHierarchy, validation?.values?.[programField]]);

	// Get outputs for selected subprogram
	const outputs = React.useMemo(() => {
		const selectedSubProgramId = validation?.values?.[subProgramField];
		if (!selectedSubProgramId || !subPrograms.length) return [];

		const selectedSubProgram = subPrograms.find(
			(sub) => sub.id == selectedSubProgramId
		);
		return selectedSubProgram?.children || [];
	}, [subPrograms, validation?.values?.[subProgramField]]);

	// Get sectors for selected cluster
	const sectorsForSelectedCluster = React.useMemo(() => {
		const selectedClusterId = validation?.values?.[clusterField];

		if (!selectedClusterId || !clustersWithSectors.length) return [];

		const selectedCluster = clustersWithSectors.find(
			(cluster) => cluster.psc_id == selectedClusterId
		);

		const sectors = selectedCluster?.children || [];
		return sectors.map((sector) => ({
			...sector,
			id: sector.sci_id,
		}));
	}, [clustersWithSectors, validation?.values?.[clusterField]]);

	// Set default region on initial load
	useEffect(() => {
		if (!validation?.values?.[regionField] && defaultRegion) {
			validation?.setFieldValue?.(regionField, defaultRegion);
		}
	}, [regionField, defaultRegion, validation]);

	// Handler functions with cascade reset
	const handleRegionChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(regionField, value);
		validation?.setFieldTouched?.(regionField, true, true);
		validation?.setFieldValue?.(zoneField, "");
		validation?.setFieldValue?.(woredaField, "");
		validation?.setFieldValue?.(clusterField, "");
		validation?.setFieldValue?.(sectorField, "");
		validation?.setFieldValue?.(programField, "");
		validation?.setFieldValue?.(subProgramField, "");
		validation?.setFieldValue?.(outputField, "");
		refetchZones();
		validation.validateForm();
	};

	const handleZoneChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(zoneField, value);
		validation?.setFieldTouched?.(zoneField, true, true);
		validation?.setFieldValue?.(woredaField, "");
		validation?.setFieldValue?.(clusterField, "");
		validation?.setFieldValue?.(sectorField, "");
		validation?.setFieldValue?.(programField, "");
		validation?.setFieldValue?.(subProgramField, "");
		validation?.setFieldValue?.(outputField, "");
		refetchWoredas();
		validation.validateForm();
	};

	const handleWoredaChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(woredaField, value);
		validation?.setFieldTouched?.(woredaField, true, true);
		validation?.setFieldValue?.(clusterField, "");
		validation?.setFieldValue?.(sectorField, "");
		validation?.setFieldValue?.(programField, "");
		validation?.setFieldValue?.(subProgramField, "");
		validation?.setFieldValue?.(outputField, "");
		validation.validateForm();
	};

	const handleClusterChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(clusterField, value);
		validation?.setFieldTouched?.(clusterField, true, true);
		validation?.setFieldValue?.(sectorField, "");
		validation?.setFieldValue?.(programField, "");
		validation?.setFieldValue?.(subProgramField, "");
		validation?.setFieldValue?.(outputField, "");
		validation.validateForm();
	};

	const handleSectorChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(sectorField, value);
		validation?.setFieldTouched?.(sectorField, true, true);
		validation?.setFieldValue?.(programField, "");
		validation?.setFieldValue?.(subProgramField, "");
		validation?.setFieldValue?.(outputField, "");
		refetchPrograms();
		validation.validateForm();
	};

	const handleProgramChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(programField, value);
		validation?.setFieldTouched?.(programField, true, true);
		validation?.setFieldValue?.(subProgramField, "");
		validation?.setFieldValue?.(outputField, "");
		validation.validateForm();
	};

	const handleSubProgramChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(subProgramField, value);
		validation?.setFieldTouched?.(subProgramField, true, true);
		validation?.setFieldValue?.(outputField, "");
		validation.validateForm();
	};

	const handleOutputChange = (e) => {
		const value = e.target.value;
		validation?.setFieldValue?.(outputField, value);
		validation?.setFieldTouched?.(outputField, true, true);
		validation.validateForm();
	};

	// Helper function to get the best available name field based on language and validity
	const getBestNameField = (item, lang, nameFields = {}) => {
		const {
			en = "pri_name_en",
			am = "pri_name_am",
			or = "pri_name_or",
		} = nameFields;

		// Define the priority order based on current language
		const priorityOrder =
			lang === "en"
				? [en, or, am, "name"]
				: lang === "or"
					? [or, en, am, "name"]
					: [am, en, or, "name"];

		// Check each field in priority order
		for (const field of priorityOrder) {
			const value = item[field];
			// Check if value exists and doesn't contain only hyphens (minimum 3 hyphens)
			if (value && !/^-{3,}$/.test(value)) {
				return value;
			}
		}

		// If all fields contain ---, return the first available one
		for (const field of priorityOrder) {
			const value = item[field];
			if (value) {
				return value;
			}
		}

		// Fallback to name field or empty string
		return item.name || "";
	};

	// Helper function to render dropdown options
	const renderOptions = (
		data,
		loading,
		emptyMessage,
		lang,
		nameFields = {}
	) => {
		if (loading) {
			return <option disabled>{t("loading")}</option>;
		}
		if (!data || data.length === 0) {
			return <option disabled>{t(emptyMessage)}</option>;
		}
		return data.map((item) => (
			<option key={item.id} value={item.id}>
				{getBestNameField(item, lang, nameFields)}
			</option>
		));
	};

	// Single dropdown component
	const Dropdown = ({
		name,
		label,
		value,
		onChange,
		onBlur,
		options,
		loading,
		emptyMessage,
		disabled: localDisabled,
		lang, // Pass the current language
		nameFields = {}, // Object with en, am, or field names
	}) => (
		<FormGroup>
			<Label for={name}>
				{t(label)} {required && <span className="text-danger">*</span>}
			</Label>
			<Input
				type="select"
				name={name}
				id={name}
				value={value || ""}
				onChange={onChange}
				onBlur={onBlur}
				invalid={!!(validation?.touched?.[name] && validation?.errors?.[name])}
				disabled={localDisabled}
			>
				<option value="">{t(`select_${label.toLowerCase()}`)}</option>
				{renderOptions(options, loading, emptyMessage, lang, nameFields)}
			</Input>
			{validation?.touched?.[name] && validation?.errors?.[name] ? (
				<FormFeedback>{validation?.errors?.[name]}</FormFeedback>
			) : null}
		</FormGroup>
	);

	// Vertical layout
	const renderVerticalLayout = () => (
		<>
			{/* Region */}
			<Dropdown
				name={regionField}
				label={"owner_region"}
				value={validation?.values?.[regionField]}
				onChange={handleRegionChange}
				onBlur={validation?.handleBlur}
				options={[{ id: "1", name: "Oromia" }]}
				loading={false}
				emptyMessage="no_regions_available"
				disabled={disabled}
			/>

			{/* Zone */}
			<Dropdown
				name={zoneField}
				label={"owner_zone"}
				value={validation?.values?.[zoneField]}
				onChange={handleZoneChange}
				onBlur={validation?.handleBlur}
				options={zones}
				loading={loadingZones}
				emptyMessage="no_zones_available"
				disabled={loadingZones || zones.length === 0 || disabled}
			/>

			{/* Woreda */}
			<Dropdown
				name={woredaField}
				label={"owner_woreda"}
				value={validation?.values?.[woredaField]}
				onChange={handleWoredaChange}
				onBlur={validation?.handleBlur}
				options={woredas}
				loading={loadingWoredas}
				emptyMessage="no_woredas_available"
				disabled={loadingWoredas || woredas.length === 0 || disabled}
			/>

			{/* Cluster */}
			<Dropdown
				name={clusterField}
				label="Cluster"
				value={validation?.values?.[clusterField]}
				onChange={handleClusterChange}
				onBlur={validation?.handleBlur}
				options={clustersWithId}
				loading={loadingClustersSectors}
				emptyMessage="no_clusters_available"
				disabled={
					loadingClustersSectors ||
					clustersWithSectors.length === 0 ||
					!validation?.values?.[woredaField] ||
					disabled
				}
				lang={lang}
				nameFields={{
					en: "psc_name",
					or: "psc_name",
					am: "psc_name",
				}}
			/>

			{/* Sector */}
			<Dropdown
				name={sectorField}
				label={"Sector"}
				value={validation?.values?.[sectorField]}
				onChange={handleSectorChange}
				onBlur={validation?.handleBlur}
				options={sectorsForSelectedCluster}
				loading={false}
				emptyMessage="no_sectors_available"
				disabled={
					sectorsForSelectedCluster.length === 0 ||
					!validation?.values?.[clusterField] ||
					disabled
				}
				lang={lang}
				nameFields={{
					en: "sci_name_en",
					or: "sci_name_or",
					am: "sci_name_am",
				}}
			/>

			{/* Program */}
			<Dropdown
				name={programField}
				label="Program"
				value={validation?.values?.[programField]}
				onChange={handleProgramChange}
				onBlur={validation?.handleBlur}
				options={programsHierarchy}
				loading={loadingPrograms}
				emptyMessage="no_programs_available"
				disabled={
					loadingPrograms ||
					programsHierarchy.length === 0 ||
					!validation?.values?.[sectorField] ||
					disabled
				}
				lang={lang}
				nameFields={{
					en: "pri_name_en",
					or: "pri_name_or",
					am: "pri_name_am",
				}}
			/>

			{/* Sub Program */}
			<Dropdown
				name={subProgramField}
				label="sub_program"
				value={validation?.values?.[subProgramField]}
				onChange={handleSubProgramChange}
				onBlur={validation?.handleBlur}
				options={subPrograms}
				loading={false}
				emptyMessage="no_sub_programs_available"
				disabled={
					subPrograms.length === 0 ||
					!validation?.values?.[programField] ||
					disabled
				}
				lang={lang}
				nameFields={{
					en: "pri_name_en",
					or: "pri_name_or",
					am: "pri_name_am",
				}}
			/>

			{/* Output */}
			<Dropdown
				name={outputField}
				label="Output"
				value={validation?.values?.[outputField]}
				onChange={handleOutputChange}
				onBlur={validation?.handleBlur}
				options={outputs}
				loading={false}
				emptyMessage="no_outputs_available"
				disabled={
					outputs.length === 0 ||
					!validation?.values?.[subProgramField] ||
					disabled
				}
				lang={lang}
				nameFields={{
					en: "pri_name_en",
					or: "pri_name_or",
					am: "pri_name_am",
				}}
			/>
		</>
	);

	// Horizontal layout with rows
	const renderHorizontalLayout = () => (
		<>
			<Row>
				<Col {...colSizes}>
					<Dropdown
						name={regionField}
						label={regionField}
						value={validation?.values?.[regionField]}
						onChange={handleRegionChange}
						onBlur={validation?.handleBlur}
						options={[{ id: "1", name: "Oromia" }]}
						loading={false}
						emptyMessage="no_regions_available"
						disabled={disabled}
					/>
				</Col>
				<Col {...colSizes}>
					<Dropdown
						name={zoneField}
						label={zoneField}
						value={validation?.values?.[zoneField]}
						onChange={handleZoneChange}
						onBlur={validation?.handleBlur}
						options={zones}
						loading={loadingZones}
						emptyMessage="no_zones_available"
						disabled={loadingZones || zones.length === 0 || disabled}
					/>
				</Col>
			</Row>

			<Row>
				<Col {...colSizes}>
					<Dropdown
						name={woredaField}
						label={woredaField}
						value={validation?.values?.[woredaField]}
						onChange={handleWoredaChange}
						onBlur={validation?.handleBlur}
						options={woredas}
						loading={loadingWoredas}
						emptyMessage="no_woredas_available"
						disabled={loadingWoredas || woredas.length === 0 || disabled}
					/>
				</Col>
				<Col {...colSizes}>
					<Dropdown
						name={clusterField}
						label="Cluster"
						value={validation?.values?.[clusterField]}
						onChange={handleClusterChange}
						onBlur={validation?.handleBlur}
						options={clustersWithId}
						loading={loadingClustersSectors}
						emptyMessage="no_clusters_available"
						disabled={
							loadingClustersSectors ||
							clustersWithSectors.length === 0 ||
							!validation?.values?.[woredaField] ||
							disabled
						}
						lang={lang}
						nameFields={{
							en: "psc_name",
							or: "psc_name",
							am: "psc_name",
						}}
					/>
				</Col>
			</Row>

			<Row>
				<Col {...colSizes}>
					<Dropdown
						name={sectorField}
						label={sectorField}
						value={validation?.values?.[sectorField]}
						onChange={handleSectorChange}
						onBlur={validation?.handleBlur}
						options={sectorsForSelectedCluster}
						loading={false}
						emptyMessage="no_sectors_available"
						disabled={
							sectorsForSelectedCluster.length === 0 ||
							!validation?.values?.[clusterField] ||
							disabled
						}
						lang={lang}
						nameFields={{
							en: "sci_name_en",
							or: "sci_name_or",
							am: "sci_name_am",
						}}
					/>
				</Col>
				<Col {...colSizes}>
					<Dropdown
						name={programField}
						label="Program"
						value={validation?.values?.[programField]}
						onChange={handleProgramChange}
						onBlur={validation?.handleBlur}
						options={programsHierarchy}
						loading={loadingPrograms}
						emptyMessage="no_programs_available"
						disabled={
							loadingPrograms ||
							programsHierarchy.length === 0 ||
							!validation?.values?.[sectorField] ||
							disabled
						}
						lang={lang}
						nameFields={{
							en: "pri_name_en",
							or: "pri_name_or",
							am: "pri_name_am",
						}}
					/>
				</Col>
			</Row>

			<Row>
				<Col {...colSizes}>
					<Dropdown
						name={subProgramField}
						label="sub_program"
						value={validation?.values?.[subProgramField]}
						onChange={handleSubProgramChange}
						onBlur={validation?.handleBlur}
						options={subPrograms}
						loading={false}
						emptyMessage="no_sub_programs_available"
						disabled={
							subPrograms.length === 0 ||
							!validation?.values?.[programField] ||
							disabled
						}
						lang={lang}
						nameFields={{
							en: "pri_name_en",
							or: "pri_name_or",
							am: "pri_name_am",
						}}
					/>
				</Col>
				<Col {...colSizes}>
					<Dropdown
						name={outputField}
						label="Output"
						value={validation?.values?.[outputField]}
						onChange={handleOutputChange}
						onBlur={validation?.handleBlur}
						options={outputs}
						loading={false}
						emptyMessage="no_outputs_available"
						disabled={
							outputs.length === 0 ||
							!validation?.values?.[subProgramField] ||
							disabled
						}
						lang={lang}
						nameFields={{
							en: "pri_name_en",
							or: "pri_name_or",
							am: "pri_name_am",
						}}
					/>
				</Col>
			</Row>
		</>
	);

	return layout === "horizontal"
		? renderHorizontalLayout()
		: renderVerticalLayout();
};

export default ProgramCascadingDropdowns;
