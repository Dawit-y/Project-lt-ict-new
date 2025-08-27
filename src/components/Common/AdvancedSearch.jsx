import React, { useState, useEffect, useRef } from "react";
import {
	Card,
	CardBody,
	Col,
	Row,
	Collapse,
	Label,
	Input,
	InputGroup,
	UncontrolledTooltip,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import FetchErrorHandler from "./FetchErrorHandler";

import { formatDate } from "./DatePicker";
import { parseDateString } from "../../utils/commonMethods";
import { EtCalendar } from "react-ethiopian-calendar";
import "react-ethiopian-calendar/dist/index.css";

const AdvancedSearch = ({
	searchHook,
	textSearchKeys,
	dropdownSearchKeys,
	checkboxSearchKeys,
	dateSearchKeys,
	Component,
	component_params = {},
	additionalParams,
	setAdditionalParams,
	onSearchResult,
	setIsSearchLoading,
	setSearchResults,
	setShowSearchResult,
	children,
}) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const [params, setParams] = useState({});
	const [searchParams, setSearchParams] = useState({});
	const {
		data = [],
		isLoading,
		isFetching,
		refetch,
		isError,
		error,
	} = searchHook(searchParams);

	const initialValues = component_params
		? Object.keys(component_params).reduce((acc, key) => {
				acc[component_params[key]] = ""; // Default value for form fields
				return acc;
			}, {})
		: {};
	// Initialize useFormik with dynamically generated initialValues
	const validation = useFormik({
		initialValues,
		onSubmit: (values) => {},
	});
	// Handle updates for all input types
	const handleSearchKey = (key, value, type = "text") => {
		setParams((prevParams) => {
			if (type === "checkbox") {
				const currentValues = prevParams[key] || [];
				const updatedValues = Array.isArray(currentValues)
					? currentValues.includes(value)
						? currentValues.filter((v) => v !== value)
						: [...currentValues, value]
					: [value];
				return { ...prevParams, [key]: updatedValues };
			}

			if (value === "") {
				const updatedParams = { ...prevParams };
				delete updatedParams[key];
				return updatedParams;
			}

			return { ...prevParams, [key]: value };
		});
	};

	const handleSearch = () => {
		validation.handleSubmit();
		const transformedValues = Object.fromEntries(
			Object.entries(validation.values)
				.filter(([key, value]) => value !== "") // Exclude entries with empty string values
				.map(([key, value]) => [
					key,
					/^\d+$/.test(value) ? parseInt(value, 10) : value,
				])
		);

		const combinedParams = {
			...params,
			...(additionalParams && additionalParams),
			...transformedValues,
		};

		setSearchParams(combinedParams);
	};

	// Refetch whenever searchParams changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsSearchLoading(true);
				const result = await refetch();
				const { data, error } = result;
				onSearchResult({ data, error });
			} catch (error) {
				console.error("Error during search:", error);
			} finally {
				setIsSearchLoading(false);
			}
		};

		if (Object.keys(searchParams).length > 0) {
			fetchData();
		}
	}, [searchParams]);

	useEffect(() => {
		if (dropdownSearchKeys) {
			const defaultParams = {};
			dropdownSearchKeys.forEach(({ key, defaultValue }) => {
				if (defaultValue !== undefined) {
					defaultParams[key] = defaultValue;
				}
			});
			setParams((prev) => ({ ...defaultParams, ...prev }));
		}
	}, []);

	const handleClear = () => {
		setParams({});
		setSearchParams({});
		setSearchResults([]);
		setShowSearchResult(false);
		validation.resetForm();

		// Clear date range parameters
		if (dateSearchKeys) {
			dateSearchKeys.forEach((key) => {
				handleSearchKey(`${key}_start`, "");
				handleSearchKey(`${key}_end`, "");
			});
		}
		if (setAdditionalParams) {
			setAdditionalParams({});
		}
	};

	const isButtonDisabled = () => {
		// Check if params have any valid values
		const hasParamsValue = Object.values(params).some((value) => {
			if (Array.isArray(value)) {
				return value?.length > 0;
			}
			return value != null && value !== "";
		});

		const hasComponentValue = () => {
			if (!validation?.values || !component_params) return false;
			const secondPropKey = Object.values(component_params)[1];
			if (!secondPropKey) return false;
			const value = validation.values[secondPropKey];
			return value != null && value !== "";
		};

		const hasAdditionalParamsValue = () => {
			if (additionalParams) {
				const keys = Object.keys(additionalParams);

				if (keys.length === 1 && keys[0] === "include") {
					return false;
				}

				return keys.some(
					(key) => additionalParams[key] != null && additionalParams[key] !== ""
				);
			}
			return false;
		};

		return !(
			hasParamsValue ||
			hasComponentValue() ||
			hasAdditionalParamsValue()
		);
	};

	const inputStyles = { width: "100%", maxWidth: "100%" }; // Let grid control sizing

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}
	return (
		<React.Fragment>
			<Card className="p-0 m-0 mb-3">
				<CardBody className="p-1">
					<form action="#">
						<Row
							xxl={12}
							lg={12}
							className="pt-2 d-flex flex-row flex-wrap justify-content-center align-items-center gap-1"
						>
							<Row xxl={12} lg={12}>
								<Col xxl={10} lg={10}>
									<div
										className="d-grid gap-2 mb-1"
										style={{
											display: "grid",
											gridTemplateColumns:
												"repeat(auto-fill, minmax(220px, 1fr))",
											gap: "1rem",
										}}
									>
										{/* Text Inputs */}
										{dateSearchKeys &&
											dateSearchKeys.map((key) => (
												<div key={key}>
													<div className="">
														<InputGroup style={inputStyles} className="rounded">
															<EtCalendar
																calendarType={true}
																lang="en"
																dateRange={true}
																placeholder={t(key)}
																onChange={(dateRange) => {
																	if (
																		dateRange &&
																		dateRange.startDate &&
																		dateRange.endDate
																	) {
																		handleSearchKey(
																			`${key}_start`,
																			formatDate(dateRange.startDate)
																		);
																		handleSearchKey(
																			`${key}_end`,
																			formatDate(dateRange.endDate)
																		);
																	} else {
																		handleSearchKey(`${key}_start`, "");
																		handleSearchKey(`${key}_end`, "");
																	}
																}}
																value={
																	params[`${key}_start`] && params[`${key}_end`]
																		? {
																				startDate: parseDateString(
																					params[`${key}_start`]
																				),
																				endDate: parseDateString(
																					params[`${key}_end`]
																				),
																			}
																		: null
																}
																style={inputStyles}
															/>
														</InputGroup>
													</div>
												</div>
											))}

										{textSearchKeys &&
											textSearchKeys.map((key) => (
												<div key={key}>
													<div className="">
														<Input
															type="text"
															id={key}
															name={key}
															autoComplete="off"
															placeholder={t(key)}
															value={params[key] || ""}
															onChange={(e) => {
																handleSearchKey(key, e.target.value);
															}}
															style={inputStyles}
														/>
													</div>
												</div>
											))}
										{/* Dropdown Inputs */}
										{dropdownSearchKeys &&
											dropdownSearchKeys.map(({ key, options }) => (
												<div key={key}>
													<div className="">
														<Input
															name={key}
															id={key}
															type="select"
															className="form-select"
															onChange={(event) =>
																handleSearchKey(key, event.target.value)
															}
															value={params[key] || ""}
															style={inputStyles}
														>
															<option value={""}>
																{t("Select") + " " + t(`${key}`)}
															</option>
															{options.map((option) => (
																<option
																	key={`${option.value}-${key}`}
																	value={option.value}
																>
																	{t(`${option.label}`)}
																</option>
															))}
														</Input>
													</div>
												</div>
											))}
									</div>
								</Col>
								<Col
									xxl={2}
									lg={2}
									md={2}
									sm={12}
									className="d-flex flex-row flex-wrap justify-content-center align-items-start gap-1"
								>
									<div
										id="search-icon-wrapper"
										className=" flex-grow-1 mb-2"
										style={{ display: "flex" }}
									>
										<button
											id="search-icon"
											type="button"
											className="btn btn-primary h-100 w-100 p-2"
											onClick={handleSearch}
											disabled={isButtonDisabled()}
										>
											<i className="bx bx-search-alt align-middle"></i>
										</button>
										<UncontrolledTooltip
											placement="top"
											target={"search-icon-wrapper"}
										>
											{t("srch_search")}
										</UncontrolledTooltip>
									</div>
									<div className=" flex-grow-1 mb-2">
										<button
											type="button"
											className="btn btn-outline-danger align-middle h-100 w-100 p-2"
											onClick={handleClear}
											id="clear-button"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												fill="currentColor"
												className="bi bi-x-square"
												viewBox="0 0 16 16"
											>
												<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
												<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
											</svg>
										</button>
										<UncontrolledTooltip
											placement="top"
											target={"clear-button"}
										>
											{t("srch_clear")}
										</UncontrolledTooltip>
									</div>

									{(checkboxSearchKeys?.length > 0 || Component) && (
										<div className=" flex-grow-1 mb-2">
											<button
												id="more-filter-icon"
												onClick={toggle}
												className="btn btn-secondary h-100 w-100 p-2"
											>
												<i className="bx bx-filter-alt align-middle"></i>
											</button>
											<UncontrolledTooltip
												placement="top"
												target={"more-filter-icon"}
											>
												{t("srch_more")}
											</UncontrolledTooltip>
										</div>
									)}
								</Col>
							</Row>

							<Collapse isOpen={isOpen} id="collapseExample">
								<div>
									<Row className="">
										<Col>
											{Component && (
												<Component
													{...component_params}
													validation={validation}
													isEdit={false}
												/>
											)}
										</Col>
									</Row>
									<Row className="g-3">
										{checkboxSearchKeys &&
											checkboxSearchKeys.map(({ key, options }) => (
												<Col key={key} xxl={4} lg={6}>
													<div>
														<Label
															htmlFor={key}
															className="form-label fw-semibold"
														>
															{key}
														</Label>
													</div>
													{(options || []).map((item, index) => (
														<div
															className="form-check form-check-inline"
															key={index}
														>
															<Input
																className="form-check-input"
																type="checkbox"
																id={`inlineCheckbox${index}`}
																value={item.value}
																checked={(params[key] || []).includes(
																	item.value
																)} // Controlled checkbox
																onChange={(e) =>
																	handleSearchKey(
																		key,
																		e.target.checked ? item.value : null,
																		"checkbox"
																	)
																}
															/>
															<Label
																className="form-check-label"
																htmlFor={`inlineCheckbox${index}`}
															>
																{item.label}
															</Label>
														</div>
													))}
												</Col>
											))}
									</Row>
								</div>
							</Collapse>
						</Row>
					</form>
				</CardBody>
			</Card>
			<div>
				{children &&
					React.cloneElement(children, { data, isLoading: isFetching })}
			</div>
		</React.Fragment>
	);
};

export default AdvancedSearch;
