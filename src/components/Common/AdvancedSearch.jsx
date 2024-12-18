import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Collapse,
  Label,
  Input,
  FormGroup,
  InputGroup,
  Button,
} from "reactstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { formatDateHyphen } from "../../utils/commonMethods";

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
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [params, setParams] = useState({});
  const [searchParams, setSearchParams] = useState({});
  const { refetch } = searchHook(searchParams);

  const flatpickrStartRef = useRef(null);
  const flatpickrEndRef = useRef(null);

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

  const handleClear = () => {
    setParams({});
    setSearchParams({});
    setSearchResults([]);
    setShowSearchResult(false);
    validation.resetForm();

    if (flatpickrStartRef.current) {
      flatpickrStartRef.current.flatpickr.clear();
    }
    if (flatpickrEndRef.current) {
      flatpickrEndRef.current.flatpickr.clear();
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
        const firstKey = Object.keys(additionalParams)[0];
        if (!firstKey) return false;
        const value = additionalParams[firstKey];
        return value != null && value !== "";
      }
    };

    return !(
      hasParamsValue ||
      hasComponentValue() ||
      hasAdditionalParamsValue()
    );
  };

  return (
    <React.Fragment>
      <Card className="job-filter">
        <CardBody>
          <form action="#">
            <Row className="g-3">
              <Col xxl={9} lg={9}>
                <Row>
                  {/* Text Inputs */}
                  {dateSearchKeys &&
                    dateSearchKeys.map((key) => (
                      <Col xxl={3} lg={3} key={key}>
                        <FormGroup>
                          <InputGroup>
                            <Flatpickr
                              ref={flatpickrStartRef}
                              id={`${key}Start`}
                              name={`${key}Start`}
                              className={`form-control`}
                              type="text"
                              placeholder={t(`${key}_start`)}
                              autoComplete="off"
                              options={{
                                altInput: true,
                                altFormat: "Y-m-d",
                                dateFormat: "Y-m-d",
                                enableTime: false,
                              }}
                              value={params[key] || null}
                              onChange={(e) => {
                                handleSearchKey(
                                  `${key}Start`,
                                  formatDateHyphen(e[0])
                                );
                              }}
                            />
                            <Flatpickr
                              ref={flatpickrEndRef}
                              id={`${key}End`}
                              name={`${key}End`}
                              className={`form-control`}
                              type="text"
                              placeholder={t(`${key}_end`)}
                              autoComplete="off"
                              options={{
                                altInput: true,
                                altFormat: "Y-m-d",
                                dateFormat: "Y-m-d",
                                enableTime: false,
                              }}
                              value={params[key] || null}
                              onChange={(date) => {
                                handleSearchKey(
                                  `${key}End`,
                                  formatDateHyphen(date[0])
                                );
                              }}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    ))}
                  {textSearchKeys &&
                    textSearchKeys.map((key) => (
                      <Col xxl={2} lg={2} key={key}>
                        <div className="position-relative mb-2">
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
                          />
                        </div>
                      </Col>
                    ))}

                  {/* Dropdown Inputs */}
                  {dropdownSearchKeys &&
                    dropdownSearchKeys.map(({ key, options }) => (
                      <Col xxl={3} lg={3} key={key}>
                        <div className="position-relative mb-2">
                          <Select
                            className="select2"
                            id={key}
                            name={key}
                            options={options}
                            value={
                              options.find(
                                (option) => option.value === params[key]
                              ) || null
                            }
                            onChange={(option) =>
                              handleSearchKey(key, option.value)
                            }
                          />
                        </div>
                      </Col>
                    ))}
                </Row>
              </Col>
              <Col xxl={3} lg={3}>
                <Row xxl={12} lg={12}>
                  <div className="position-relative h-100 hstack gap-3 pull-right">
                    <button
                      type="button"
                      className="btn btn-primary h-100 w-100"
                      onClick={handleSearch}
                      disabled={isButtonDisabled()}
                    >
                      <i className="bx bx-search-alt align-middle"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger align-middle h-100 w-100"
                      onClick={handleClear}
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

                    {(checkboxSearchKeys?.length > 0 || Component) && (
                      <a
                        onClick={toggle}
                        className="btn btn-secondary h-100 w-100"
                      >
                        <i className="bx bx-filter-alt align-middle"></i>{" "}
                      </a>
                    )}
                  </div>
                </Row>
              </Col>
              <Collapse isOpen={isOpen} id="collapseExample">
                <div>
                  <Row className="mt-2">
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
    </React.Fragment>
  );
};

export default AdvancedSearch;
