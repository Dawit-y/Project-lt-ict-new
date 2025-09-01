import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchImplementingAreas,
	useAddImplementingArea,
	useDeleteImplementingArea,
	useUpdateImplementingArea,
} from "../../queries/implementingarea_query";
import ImplementingAreaModal from "./ImplementingAreaModal";
import { useTranslation } from "react-i18next";
import {
	Button,
	Col,
	Row,
	UncontrolledTooltip,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Card,
	CardBody,
	FormFeedback,
	Label,
	Input,
	FormGroup,
} from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns1";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import InputField from "../../components/Common/InputField";
import { implementingAreaExportColumns } from "../../utils/exportColumnsForDetails";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useFetchAddressStructures } from "../../queries/address_structure_query";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";

const ETHIOPIA_BOUNDS = {
	minLat: 3.397,
	maxLat: 14.894,
	minLng: 32.997,
	maxLng: 47.989,
};

// Helper function to validate Ethiopia bounds
const validateEthiopiaBounds = (latitude, longitude) => {
	const lat = parseFloat(latitude);
	const lng = parseFloat(longitude);

	if (isNaN(lat) || isNaN(lng)) return false;

	return (
		lat >= ETHIOPIA_BOUNDS.minLat &&
		lat <= ETHIOPIA_BOUNDS.maxLat &&
		lng >= ETHIOPIA_BOUNDS.minLng &&
		lng <= ETHIOPIA_BOUNDS.maxLng
	);
};

// Helper function to parse geo location string
const parseGeoLocation = (geoLocation) => {
	if (!geoLocation) return { latitude: "", longitude: "" };
	const stringLocation = String(geoLocation);
	const [latitude, longitude] = stringLocation.split(",");
	return {
		latitude: latitude ? latitude.trim() : "",
		longitude: longitude ? longitude.trim() : "",
	};
};

const ImplementingAreaModel = (props) => {
	document.title = "Implementing Area";
	const { passedId, isActive, totalActualBudget } = props;
	const param = {
		pia_project_id: passedId,
		request_type: "single",
		prj_total_actual_budget: totalActualBudget,
	};
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [implementingArea, setImplementingArea] = useState(null);
	const [geoLocation, setGeoLocation] = useState({
		latitude: "",
		longitude: "",
	});

	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchImplementingAreas(param, isActive);
	const addImplementingArea = useAddImplementingArea();
	const updateImplementingArea = useUpdateImplementingArea();
	const deleteImplementingArea = useDeleteImplementingArea();

	// Fetch sector data
	const {
		data: sectorInformationData,
		isLoading: isSectorLoading,
		isError: isSectorError,
	} = useFetchSectorInformations();

	const sectorInformationMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			sectorInformationData?.data || [],
			"sci_id",
			{
				en: "sci_name_en",
				am: "sci_name_am",
				or: "sci_name_or",
			},
			lang
		);
	}, [sectorInformationData, lang]);

	const { userId } = useAuthUser();
	const {
		regions,
		zones,
		woredas,
		isLoading: isAddressLoading,
	} = useFetchAddressStructures(userId);

	const regionMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			regions ?? [],
			"id",
			{
				en: "name",
				am: "name",
				or: "name",
			},
			lang
		);
	}, [regions, lang]);

	const zoneMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			zones ?? [],
			"id",
			{
				en: "name",
				am: "name",
				or: "name",
			},
			lang
		);
	}, [zones, lang]);

	const woredaMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			woredas ?? [],
			"id",
			{
				en: "name",
				am: "name",
				or: "name",
			},
			lang
		);
	}, [woredas, lang]);

	const handleAddImplementingArea = async (data) => {
		try {
			await addImplementingArea.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
			setGeoLocation({ latitude: "", longitude: "" });
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateImplementingArea = async (data) => {
		try {
			await updateImplementingArea.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleDeleteImplementingArea = async () => {
		if (implementingArea && implementingArea.pia_id) {
			try {
				const id = implementingArea.pia_id;
				await deleteImplementingArea.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
			} catch (error) {
				toast.success(t("delete_failure"), {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	};

	const calculateCurrentTotal = (
		currentData,
		editingId = null,
		newAmount = 0
	) => {
		if (!currentData || !currentData.data) return 0;

		return currentData.data.reduce((total, item) => {
			// If editing, exclude the item being edited from the total
			if (editingId && item.pia_id === editingId) {
				return total + Number(newAmount || 0);
			}
			return total + Number(item.pia_budget_amount || 0);
		}, 0);
	};

	// Form validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			pia_project_id: passedId,
			pia_region_id: (implementingArea && implementingArea.pia_region_id) || "",
			pia_zone_id_id:
				(implementingArea && implementingArea.pia_zone_id_id) || "",
			pia_woreda_id: (implementingArea && implementingArea.pia_woreda_id) || "",
			pia_sector_id: (implementingArea && implementingArea.pia_sector_id) || "",
			pia_budget_amount:
				(implementingArea && implementingArea.pia_budget_amount) || "",
			pia_site: (implementingArea && implementingArea.pia_site) || "",
			pia_geo_location:
				(implementingArea && implementingArea.pia_geo_location) || "",
			pia_description:
				(implementingArea && implementingArea.pia_description) || "",
			pia_is_other_region:
				(implementingArea && implementingArea.pia_is_other_region) || 0,
		},
		validationSchema: Yup.object({
			pia_region_id: Yup.string().test(
				"region-required",
				t("pia_region_id"),
				function (value) {
					const { pia_is_other_region } = this.parent;
					if (pia_is_other_region === 0 || pia_is_other_region === "0") {
						return !!value && value.trim() !== "";
					}
					return true;
				}
			),
			pia_zone_id_id: Yup.string().test(
				"zone-required",
				t("pia_zone_id_id"),
				function (value) {
					const { pia_is_other_region } = this.parent;
					if (pia_is_other_region === 0 || pia_is_other_region === "0") {
						return !!value && value.trim() !== "";
					}
					return true;
				}
			),
			pia_woreda_id: Yup.string().test(
				"woreda-required",
				t("pia_woreda_id"),
				function (value) {
					const { pia_is_other_region } = this.parent;
					if (pia_is_other_region === 0 || pia_is_other_region === "0") {
						return !!value && value.trim() !== "";
					}
					return true;
				}
			),
			pia_sector_id: Yup.string().required(t("pia_sector_id")),
			pia_site: Yup.string().required(t("pia_site")),
			pia_geo_location: Yup.string()
				.required(t("pia_geo_location"))
				.test(
					"ethiopia-bounds",
					"Location must be within Ethiopia boundaries",
					function (value) {
						if (!value) return true;

						const [latitude, longitude] = value.split(",");
						if (!latitude || !longitude) return false;

						return validateEthiopiaBounds(latitude.trim(), longitude.trim());
					}
				)
				.test(
					"valid-coordinates",
					"Invalid coordinates format",
					function (value) {
						if (!value) return true;

						const [latitude, longitude] = value.split(",");
						if (!latitude || !longitude) return false;

						const lat = parseFloat(latitude.trim());
						const lng = parseFloat(longitude.trim());

						return !isNaN(lat) && !isNaN(lng);
					}
				),
			pia_budget_amount: Yup.number()
				.required(t("pia_budget_amount"))
				.positive("Amount must be positive")
				.test(
					"total-budget",
					"Amount exceeds remaining project budget",
					function (value) {
						if (!value || isNaN(value)) return true;

						const currentData = data;
						const editingId = isEdit ? implementingArea?.pia_id : null;

						// Calculate total without the current edited item
						const currentTotalWithoutThis =
							currentData?.data?.reduce((total, item) => {
								if (editingId && item.pia_id === editingId) return total;
								return total + Number(item.pia_budget_amount || 0);
							}, 0) || 0;

						// Calculate new total if this amount is added/updated
						const newTotal = currentTotalWithoutThis + Number(value);

						return newTotal <= totalActualBudget;
					}
				),
			pia_is_other_region: Yup.number().required(),
			pia_description: Yup.string().test(
				"description-required",
				"Please specify the region name in the description when project is outside Oromia",
				function (value) {
					const { pia_is_other_region } = this.parent;
					if (pia_is_other_region === 1 || pia_is_other_region === "1") {
						return !!value && value.trim() !== "";
					}
					return true;
				}
			),
		}),
		validateOnBlur: true,
		validateOnChange: true,
		onSubmit: (values) => {
			if (isEdit) {
				const updateImplementingArea = {
					pia_id: implementingArea?.pia_id,
					pia_project_id: passedId,
					pia_region_id: values.pia_is_other_region
						? null
						: values.pia_region_id,
					pia_zone_id_id: values.pia_is_other_region
						? null
						: values.pia_zone_id_id,
					pia_woreda_id: values.pia_is_other_region
						? null
						: values.pia_woreda_id,
					pia_sector_id: values.pia_sector_id,
					pia_budget_amount: values.pia_budget_amount,
					pia_site: values.pia_site,
					pia_geo_location: values.pia_geo_location,
					pia_description: values.pia_description,
					pia_is_other_region: values.pia_is_other_region,
				};
				handleUpdateImplementingArea(updateImplementingArea);
			} else {
				const newImplementingArea = {
					pia_project_id: passedId,
					pia_region_id: values.pia_is_other_region
						? null
						: values.pia_region_id,
					pia_zone_id_id: values.pia_is_other_region
						? null
						: values.pia_zone_id_id,
					pia_woreda_id: values.pia_is_other_region
						? null
						: values.pia_woreda_id,
					pia_sector_id: values.pia_sector_id,
					pia_budget_amount: values.pia_budget_amount,
					pia_site: values.pia_site,
					pia_geo_location: values.pia_geo_location,
					pia_description: values.pia_description,
					pia_is_other_region: values.pia_is_other_region,
				};
				handleAddImplementingArea(newImplementingArea);
			}
		},
	});

	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);

	useEffect(() => {
		if (implementingArea && implementingArea.pia_geo_location) {
			const parsed = parseGeoLocation(implementingArea.pia_geo_location);
			setGeoLocation(parsed);
		}
	}, [implementingArea]);

	const toggle = () => {
		if (modal) {
			setModal(false);
			setImplementingArea(null);
			setGeoLocation({ latitude: "", longitude: "" });
		} else {
			setModal(true);
		}
	};

	const handleImplementingAreaClick = (arg) => {
		const implementingArea = arg;
		setImplementingArea({
			pia_id: implementingArea.pia_id,
			pia_project_id: implementingArea.pia_project_id,
			pia_region_id: implementingArea.pia_region_id,
			pia_zone_id_id: implementingArea.pia_zone_id_id,
			pia_woreda_id: implementingArea.pia_woreda_id,
			pia_sector_id: implementingArea.pia_sector_id,
			pia_budget_amount: implementingArea.pia_budget_amount,
			pia_site: implementingArea.pia_site,
			pia_geo_location: implementingArea.pia_geo_location,
			pia_description: implementingArea.pia_description,
			pia_is_other_region: implementingArea.pia_is_other_region,
		});
		setIsEdit(true);
		toggle();
	};

	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (implementingArea) => {
		setImplementingArea(implementingArea);
		setDeleteModal(true);
	};

	const handleImplementingAreaClicks = () => {
		setIsEdit(false);
		setImplementingArea("");
		setGeoLocation({ latitude: "", longitude: "" });
		toggle();
	};

	// Handle geo location input changes
	const handleGeoLocationChange = (field, value) => {
		const updatedGeoLocation = {
			...geoLocation,
			[field]: value,
		};

		setGeoLocation(updatedGeoLocation);

		// Combine latitude and longitude with comma and update formik value
		const combinedValue = `${updatedGeoLocation.latitude},${updatedGeoLocation.longitude}`;
		validation.setFieldValue("pia_geo_location", combinedValue);
		validation.setFieldTouched("pia_geo_location", true);
	};

	// Handle checkbox change
	const handleCheckboxChange = (e) => {
		const isChecked = e.target.checked ? 1 : 0;
		validation.setFieldValue("pia_is_other_region", isChecked);

		// Clear region fields when checked
		if (isChecked) {
			validation.setFieldValue("pia_region_id", "");
			validation.setFieldValue("pia_zone_id_id", "");
			validation.setFieldValue("pia_woreda_id", "");
		}
	};

	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: t("region"),
				accessorKey: "pia_region_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue, row }) => {
					const value = getValue();
					if (row.original.pia_is_other_region === 1) {
						return "Outside Oromia";
					}
					return regionMap[value] || value || "-";
				},
			},
			{
				header: t("zone"),
				accessorKey: "pia_zone_id_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue, row }) => {
					const value = getValue();
					if (row.original.pia_is_other_region === 1) {
						return "-";
					}
					return zoneMap[value] || value || "-";
				},
			},
			{
				header: t("woreda"),
				accessorKey: "pia_woreda_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue, row }) => {
					const value = getValue();
					if (row.original.pia_is_other_region === 1) {
						return "-";
					}
					return woredaMap[value] || value || "-";
				},
			},
			{
				header: t("sector"),
				accessorKey: "pia_sector_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => {
					const value = getValue();
					return sectorInformationMap[value] || value || "-";
				},
			},
			{
				header: t("pia_budget_amount"),
				accessorKey: "pia_budget_amount",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => parseFloat(getValue()).toLocaleString() ?? "-",
			},
			{
				header: t("site"),
				accessorKey: "pia_site",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => getValue() ?? "-",
			},
			{
				header: t("pia_geo_location"),
				accessorKey: "pia_geo_location",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => getValue() ?? "-",
			},
			{
				header: t("Outside Oromia"),
				accessorKey: "pia_is_other_region",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => (getValue() === 1 ? "Yes" : "No"),
			},
			{
				header: t("view_detail"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<Button
							type="button"
							color="primary"
							className="btn-sm"
							onClick={() => {
								toggleViewModal();
								setTransaction(cellProps.row.original);
							}}
						>
							{t("view_detail")}
						</Button>
					);
				},
			},
		];

		if (
			data?.previledge?.is_role_editable == 1 ||
			data?.previledge?.is_role_deletable == 1
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: t("Action"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-1">
							{cellProps.row.original.is_editable == 1 && (
								<Button
									size="sm"
									color="None"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleImplementingAreaClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}
							{cellProps.row.original.is_deletable == 1 && (
								<Button
									size="sm"
									color="None"
									className="text-danger"
									onClick={() => {
										const data = cellProps.row.original;
										onClickDelete(data);
									}}
								>
									<i
										className="mdi mdi-delete font-size-18"
										id="deletetooltip"
									/>
									<UncontrolledTooltip placement="top" target="deletetooltip">
										Delete
									</UncontrolledTooltip>
								</Button>
							)}
						</div>
					);
				},
			});
		}
		return baseColumns;
	}, [
		handleImplementingAreaClick,
		toggleViewModal,
		onClickDelete,
		t,
		regionMap,
		zoneMap,
		woredaMap,
		sectorInformationMap,
		data,
	]);

	if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

	return (
		<React.Fragment>
			<ImplementingAreaModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
				regionMap={regionMap}
				zoneMap={zoneMap}
				woredaMap={woredaMap}
				sectorInformationMap={sectorInformationMap}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteImplementingArea}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteImplementingArea.isPending}
			/>
			{isLoading || isSectorLoading || isAddressLoading ? (
				<Spinners />
			) : (
				<Row>
					<Col xs="12">
						<TableContainer
							columns={columns}
							data={data?.data || []}
							isGlobalFilter={true}
							isAddButton={data?.previledge?.is_role_can_add == 1}
							isCustomPageSize={true}
							handleUserClick={handleImplementingAreaClicks}
							isPagination={true}
							SearchPlaceholder={26 + " " + t("Results") + "..."}
							buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
							buttonName={t("add")}
							tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
							theadClass="table-light"
							pagination="pagination"
							paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
							refetch={refetch}
							isFetching={isFetching}
							exportColumns={[
								{
									key: "pia_region_id",
									label: "region",
									format: (val, row) =>
										row.pia_is_other_region === 1
											? "Outside Oromia"
											: val === 1
												? "Oromia"
												: `Region ID: ${val}`,
								},
								{
									key: "pia_zone_id_id",
									label: "zone",
									format: (val, row) =>
										row.pia_is_other_region === 1
											? "-"
											: (zoneMap[val] ?? `Zone ID: ${val}`),
								},
								{
									key: "pia_woreda_id",
									label: "woreda",
									format: (val, row) =>
										row.pia_is_other_region === 1
											? "-"
											: (woredaMap[val] ?? `Woreda ID: ${val}`),
								},
								...implementingAreaExportColumns,
								{
									key: "pia_is_other_region",
									label: "Outside Oromia",
									format: (val) => (val === 1 ? "Yes" : "No"),
								},
							]}
						/>
					</Col>
				</Row>
			)}
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("implementing_area")
						: t("add") + " " + t("implementing_area")}
				</ModalHeader>
				<ModalBody>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							validation.handleSubmit();
							return false;
						}}
					>
						<Row>
							<Col className="col-12 mb-3">
								<Card>
									<CardBody>
										<div className="d-flex justify-content-between">
											<div>
												<strong>{t("Total_Project_Budget")} : </strong>{" "}
												{totalActualBudget
													? totalActualBudget.toLocaleString()
													: "0"}
											</div>
											<div>
												<strong>{t("Allocated")} : </strong>{" "}
												{calculateCurrentTotal(data)
													? calculateCurrentTotal(data).toLocaleString()
													: "0"}
											</div>
											<div
												className={
													calculateCurrentTotal(data) > (totalActualBudget || 0)
														? "text-danger"
														: "text-success"
												}
											>
												<strong>{t("Remaining")} : </strong>{" "}
												{(
													(totalActualBudget || 0) -
													(calculateCurrentTotal(data) || 0)
												).toLocaleString()}
											</div>
										</div>
									</CardBody>
								</Card>
							</Col>
						</Row>

						{/* Outside Oromia Checkbox */}
						<Row>
							<Col xl={12} className="mb-3">
								<FormGroup check>
									<Input
										type="checkbox"
										id="pia_is_other_region"
										name="pia_is_other_region"
										checked={validation.values.pia_is_other_region === 1}
										onChange={handleCheckboxChange}
									/>
									<Label check for="pia_is_other_region" className="ms-2">
										{t("Outside Oromia Region")}
									</Label>
								</FormGroup>
								<small className="text-muted">
									{t("project_outside_oromia")}
								</small>
							</Col>
						</Row>

						{validation.values.pia_is_other_region === 0 && (
							<Row>
								<Col xl={12} className="mb-3">
									<CascadingDropdowns
										validation={validation}
										dropdown1name="pia_region_id"
										dropdown2name="pia_zone_id_id"
										dropdown3name="pia_woreda_id"
										required={true}
										layout="horizontal"
										colSizes={{ md: 6, sm: 12, lg: 4 }}
									/>
								</Col>
							</Row>
						)}

						<Row>
							<AsyncSelectField
								fieldId="pia_sector_id"
								validation={validation}
								isRequired
								className="col-md-4 mb-3"
								optionMap={sectorInformationMap}
								isLoading={isSectorLoading}
								isError={isSectorError}
							/>
							<Col className="col-md-4 mb-3">
								<FormattedAmountField
									validation={validation}
									fieldId="pia_budget_amount"
									label={t("pia_budget_amount")}
									isRequired={true}
									max={totalActualBudget}
								/>

								<small className="text-muted">
									Available budget:{" "}
									{(
										(totalActualBudget || 0) -
										(calculateCurrentTotal(
											data,
											isEdit ? implementingArea?.pia_id : null
										) || 0)
									).toLocaleString()}
								</small>
							</Col>

							<InputField
								validation={validation}
								fieldId={"pia_site"}
								isRequired={true}
								className="col-md-4 mb-3"
								maxLength={400}
							/>

							{/* Geo Location Fields - Split into Latitude and Longitude */}
							<Col className="col-md-4 mb-3">
								<Label htmlFor="latitude" className="form-label">
									{t("Latitude")} <span className="text-danger">*</span>
								</Label>
								<Input
									id="latitude"
									name="latitude"
									type="number"
									step="any"
									className="form-control"
									placeholder="e.g., 9.145"
									value={geoLocation.latitude}
									onChange={(e) =>
										handleGeoLocationChange("latitude", e.target.value)
									}
									invalid={
										validation.touched.pia_geo_location &&
										!!validation.errors.pia_geo_location
									}
									onBlur={() => validation.validateField("pia_geo_location")}
								/>
								{validation.touched.pia_geo_location &&
									validation.errors.pia_geo_location && (
										<FormFeedback type="invalid">
											{validation.errors.pia_geo_location}
										</FormFeedback>
									)}
								<small className="text-muted">
									Ethiopia bounds: {ETHIOPIA_BOUNDS.minLat}° to{" "}
									{ETHIOPIA_BOUNDS.maxLat}°
								</small>
							</Col>

							<Col className="col-md-4 mb-3">
								<Label htmlFor="longitude" className="form-label">
									{t("Longitude")} <span className="text-danger">*</span>
								</Label>
								<Input
									id="longitude"
									name="longitude"
									type="number"
									step="any"
									className="form-control"
									placeholder="e.g., 40.4897"
									value={geoLocation.longitude}
									onChange={(e) =>
										handleGeoLocationChange("longitude", e.target.value)
									}
									invalid={
										validation.touched.pia_geo_location &&
										!!validation.errors.pia_geo_location
									}
									onBlur={() => validation.validateField("pia_geo_location")}
								/>
								{validation.touched.pia_geo_location &&
									validation.errors.pia_geo_location && (
										<FormFeedback type="invalid">
											{validation.errors.pia_geo_location}
										</FormFeedback>
									)}
								<small className="text-muted">
									Ethiopia bounds: {ETHIOPIA_BOUNDS.minLng}° to{" "}
									{ETHIOPIA_BOUNDS.maxLng}°
								</small>
							</Col>

							<InputField
								type="textarea"
								validation={validation}
								fieldId={"pia_description"}
								isRequired={validation.values.pia_is_other_region === 1}
								className="col-md-12 mb-3"
								maxLength={1000}
								placeholder={
									validation.values.pia_is_other_region === 1
										? t("specify_region_details")
										: "Description"
								}
							/>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									{addImplementingArea.isPending ||
									updateImplementingArea.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addImplementingArea.isPending ||
												updateImplementingArea.isPending ||
												!validation.dirty
											}
										>
											<Spinner size={"sm"} color="light" className="me-2" />
											{t("Save")}
										</Button>
									) : (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addImplementingArea.isPending ||
												updateImplementingArea.isPending ||
												!validation.dirty
											}
										>
											{t("Save")}
										</Button>
									)}
								</div>
							</Col>
						</Row>
					</Form>
				</ModalBody>
			</Modal>
		</React.Fragment>
	);
};

ImplementingAreaModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default ImplementingAreaModel;
