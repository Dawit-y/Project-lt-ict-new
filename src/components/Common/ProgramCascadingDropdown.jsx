import React, { useEffect, useState, useMemo } from "react";
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

const ProgramCascadingDropdowns = ({
	validation,
	regionField = "region_id",
	zoneField = "zone_id",
	woredaField = "woreda_id",
	clusterField = "c_id",
	sectorField = "s_id",
	programField = "program_id",
	subProgramField = "sub_program_id",
	outputField = "output_id",
	required = false,
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const { userId } = useAuthUser();

	// 1. SELECTORS FROM FORMIK STATE
	const selectedRegion = validation.values[regionField];
	const selectedZone = validation.values[zoneField];
	const selectedWoreda = validation.values[woredaField];
	const selectedCluster = validation.values[clusterField];
	const selectedSector = validation.values[sectorField];
	const selectedProgram = validation.values[programField];
	const selectedSubProgram = validation.values[subProgramField];

	const { data: clustersWithSectors = [], isLoading: loadingClustersSectors } =
		getUserSectorListTree(userId);

	const { data: zones = [], isLoading: loadingZones } = useQuery({
		queryKey: ["zones", selectedRegion],
		queryFn: () => fetchAddressByParent(selectedRegion),
		enabled: !!selectedRegion,
		staleTime: 1000 * 60 * 5,
	});

	const { data: woredas = [], isLoading: loadingWoredas } = useQuery({
		queryKey: ["woredas", selectedZone],
		queryFn: () => fetchAddressByParent(selectedZone),
		enabled: !!selectedZone,
		staleTime: 1000 * 60 * 5,
	});

	const { data: programTreeData = [], isLoading: loadingPrograms } = useQuery({
		queryKey: ["program-tree", selectedSector],
		queryFn: () => fetchProgramTree(selectedSector),
		enabled: !!selectedSector,
		staleTime: 1000 * 60 * 5,
	});

	// 3. DERIVED DATA (useMemo)
	const clustersWithId = useMemo(
		() => clustersWithSectors.map((c) => ({ ...c, id: c.psc_id })),
		[clustersWithSectors]
	);
	const programsHierarchy = useMemo(
		() => extractProgramHierarchy(programTreeData),
		[programTreeData]
	);

	const sectorsForSelectedCluster = useMemo(() => {
		const cluster = clustersWithSectors.find(
			(c) => c.psc_id == selectedCluster
		);
		return (cluster?.children || []).map((s) => ({ ...s, id: s.sci_id }));
	}, [clustersWithSectors, selectedCluster]);

	const subPrograms = useMemo(() => {
		const prog = programsHierarchy.find((p) => p.id == selectedProgram);
		return prog?.children || [];
	}, [programsHierarchy, selectedProgram]);

	const outputs = useMemo(() => {
		const sub = subPrograms.find((s) => s.id == selectedSubProgram);
		return sub?.children || [];
	}, [subPrograms, selectedSubProgram]);

	const createHandler = (currentField, fieldsToReset) => (e) => {
		const newValue = e.target.value;

		// Set the current field and trigger validation immediately
		validation.setFieldValue(currentField, newValue, true);
		validation.setFieldTouched(currentField, true, false);

		// Reset dependent fields
		fieldsToReset.forEach((field) => {
			validation.setFieldValue(field, "", false);
			validation.setFieldTouched(field, false, false);
		});
	};

	const getBestNameField = (item, lang, nameFields = {}) => {
		const {
			en = "pri_name_en",
			am = "pri_name_am",
			or = "pri_name_or",
		} = nameFields;

		const priorityOrder =
			lang === "en"
				? [en, or, am, "name"]
				: lang === "or"
					? [or, en, am, "name"]
					: [am, en, or, "name"];

		for (const field of priorityOrder) {
			const value = item[field];
			if (value && !/^-{3,}$/.test(value)) {
				return value;
			}
		}

		for (const field of priorityOrder) {
			const value = item[field];
			if (value) {
				return value;
			}
		}

		return item.name || "";
	};

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


	const INDENT_STEP = 25;

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
		nameFields = {},
		level = 0, 
	}) => (
		<FormGroup
			style={{
				paddingLeft: `${level * INDENT_STEP}px`,
				borderLeft: level > 0 ? "2px solid #dee2e6" : "none",
				marginLeft: level > 0 ? "10px" : "0px",
				marginBottom: "1.5rem",
			}}
		>
			<Label for={name} className={level > 0 ? "ps-2" : ""}>
				{level > 0 && "↳ "} {t(label)}{" "}
				{required && <span className="text-danger">*</span>}
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
				className="ms-2"
			>
				<option value="">{t(`select_${label.toLowerCase()}`)}</option>
				{renderOptions(options, loading, emptyMessage, lang, nameFields)}
			</Input>
			{validation?.touched?.[name] && validation?.errors?.[name] ? (
				<FormFeedback className="ms-2">
					{validation?.errors?.[name]}
				</FormFeedback>
			) : null}
		</FormGroup>
	);

	return (
		<>
			<Dropdown
				level={0}
				name={regionField}
				label="owner_region"
				value={selectedRegion}
				onChange={createHandler(regionField, [zoneField, woredaField])}
				options={[{ id: "1", name: "Oromia" }]}
				loading={false}
			/>

			<Dropdown
				level={1}
				name={zoneField}
				label="owner_zone"
				value={selectedZone}
				onChange={createHandler(zoneField, [woredaField])}
				options={zones}
				loading={loadingZones}
				disabled={!selectedRegion || loadingZones}
			/>

			<Dropdown
				level={2}
				name={woredaField}
				label="owner_woreda"
				value={selectedWoreda}
				onChange={createHandler(woredaField, [])}
				options={woredas}
				loading={loadingWoredas}
				disabled={!selectedZone || loadingWoredas}
			/>

			<Dropdown
				level={0}
				name={clusterField}
				label="Cluster"
				value={selectedCluster}
				onChange={createHandler(clusterField, [
					sectorField,
					programField,
					subProgramField,
					outputField,
				])}
				options={clustersWithId}
				loading={loadingClustersSectors}
				disabled={loadingClustersSectors}
				nameFields={{ en: "psc_name", or: "psc_name", am: "psc_name" }}
			/>

			<Dropdown
				level={1}
				name={sectorField}
				label="Sector"
				value={selectedSector}
				onChange={createHandler(sectorField, [
					programField,
					subProgramField,
					outputField,
				])}
				options={sectorsForSelectedCluster}
				disabled={!selectedCluster}
				nameFields={{ en: "sci_name_en", or: "sci_name_or", am: "sci_name_am" }}
			/>

			<Dropdown
				level={2}
				name={programField}
				label="Program"
				value={selectedProgram}
				onChange={createHandler(programField, [subProgramField, outputField])}
				options={programsHierarchy}
				loading={loadingPrograms}
				disabled={!selectedSector || loadingPrograms}
			/>

			<Dropdown
				level={3}
				name={subProgramField}
				label="sub_program"
				value={selectedSubProgram}
				onChange={createHandler(subProgramField, [outputField])}
				options={subPrograms}
				disabled={!selectedProgram}
			/>

			<Dropdown
				level={4}
				name={outputField}
				label="Output"
				value={validation.values[outputField]}
				onChange={(e) => {
					validation.setFieldValue(outputField, e.target.value, true);
					validation.setFieldTouched(outputField, true, false);
				}}
				options={outputs}
				disabled={!selectedSubProgram}
			/>
		</>
	);
};

export default ProgramCascadingDropdowns;
