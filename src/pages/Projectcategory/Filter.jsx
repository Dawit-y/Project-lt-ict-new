import { Col, Input, Row, UncontrolledTooltip } from "reactstrap";
import { useTranslation } from "react-i18next";
import { OwnerTypeLabels } from ".";
import { useState } from "react";

const Filter = ({ onFilterChange, onClear }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearch = () => {
    onFilterChange({ owner_type: category });
  };

  const handleClear = () => {
    setCategory("");
    onClear();
  };

  return (
    <>
      <Row className="mb-3 border-light">
        <Col md={3}>
          <Input
            name={"pct_owner_type_id"}
            type="select"
            className="form-select"
            id={"pct_owner_type_id"}
            onChange={handleCategoryChange}
            value={category}
          >
            {" "}
            <>
              <option value="">
                {t("Select")} {t("Owner Type")}
              </option>
              {Object.entries(OwnerTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {t(label)}
                </option>
              ))}
            </>
          </Input>
        </Col>
        <Col md={7}></Col>
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
              disabled={!category}
            >
              <i className="bx bx-search-alt align-middle"></i>
            </button>
            <UncontrolledTooltip placement="top" target={"search-icon-wrapper"}>
              {t("srch_search")}
            </UncontrolledTooltip>
          </div>
          <div className=" flex-grow-1 mb-2">
            <button
              type="button"
              className="btn btn-outline-danger align-middle h-100 w-100 p-2"
              id="clear-button"
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
            <UncontrolledTooltip placement="top" target={"clear-button"}>
              {t("srch_clear")}
            </UncontrolledTooltip>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Filter;
