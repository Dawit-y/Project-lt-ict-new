import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row, Collapse, Label, Input } from "reactstrap";
import Select from "react-select";

const AdvancedSearch = ({
  searchHook,
  textSearchKeys,
  dropdownSearchKeys,
  checkboxSearchKeys,
  onSearchResult,
  setIsSearchLoading,
  setSearchResults,
  setShowSearchResult,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [params, setParams] = useState({});
  const [searchParams, setSearchParams] = useState({});

  const { refetch } = searchHook(searchParams);

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
    setSearchParams(params);
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
    setSearchResults(null);
    setShowSearchResult(false);
  };
  const isButtonDisabled = () => {
    return !Object.values(params).some((value) => {
      if (Array.isArray(value)) {
        return value?.length > 0;
      }
      return value != null && value !== "";
    });
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card className="job-filter">
            <CardBody>
              <form action="#">
                <Row className="g-3">
                  {/* Text Inputs */}
                  {textSearchKeys.map((key) => (
                    <Col xxl={4} lg={4} key={key}>
                      <div className="position-relative">
                        <Input
                          type="text"
                          id={key}
                          name={key}
                          autoComplete="off"
                          placeholder={key}
                          value={params[key] || ""}
                          onChange={(e) => handleSearchKey(key, e.target.value)}
                        />
                      </div>
                    </Col>
                  ))}

                  {/* Dropdown Inputs */}
                  {dropdownSearchKeys.map(({ key, options }) => (
                    <Col xxl={2} lg={4} key={key}>
                      <div className="position-relative">
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
                  <Col xxl={2} lg={6}>
                    <div className="position-relative h-100 hstack gap-3">
                      <button
                        type="button"
                        className="btn btn-primary h-100 w-100"
                        onClick={handleSearch}
                        disabled={isButtonDisabled()}
                      >
                        <i className="bx bx-search-alt align-middle"></i> Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center h-100 w-100"
                        onClick={handleClear}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="currentColor"
                          className="bi bi-x-square me-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                        Clear
                      </button>

                      {checkboxSearchKeys.length > 0 && (
                        <a
                          onClick={toggle}
                          className="btn btn-secondary h-100 w-100"
                        >
                          <i className="bx bx-filter-alt align-middle"></i>{" "}
                          Advance
                        </a>
                      )}
                    </div>
                  </Col>

                  <Collapse isOpen={isOpen} id="collapseExample">
                    <div>
                      <Row className="g-3">
                        {checkboxSearchKeys.map(({ key, options }) => (
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
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AdvancedSearch;
