import { useState } from "react";
import { useDispatch } from "react-redux";
import { PERFORM_SEARCH_REQUEST } from "../../store/search/actionTypes";
import { useTranslation } from "react-i18next";

const SearchComponent = ({
  data,
  dropdown,
  handleSearch,
  handleClearSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFields, setSelectedFields] = useState(dropdown.map(() => ""));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFieldChange = (index, e) => {
    const newSelectedFields = [...selectedFields];
    newSelectedFields[index] = e.target.value;
    setSelectedFields(newSelectedFields);
  };

  const resetForm = () => {
    setSearchTerm("");
    setSelectedFields(dropdown.map(() => ""));
  };

  const handleClear = () => {
    resetForm();
    handleClearSearch();
  };
  const performSearch = () => {
    handleSearch();
    const fieldKeys = ["status", "budgetYear"];
    const transformedData = {
      searchTerm: { search_en_value: searchTerm },
      selectedFields: selectedFields.map((field, index) => ({
        [fieldKeys[index]]: field,
      })),
    };
    dispatch({
      type: PERFORM_SEARCH_REQUEST,
      payload: transformedData,
    });
  };

  return (
    <div className="container-fluid mt-4">
      <form className="d-flex flex-wrap align-items-center mb-3">
        <div className="form-group me-2 mb-2 flex-grow-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('Search')+"..."}
            className="form-control"
          />
        </div>
        {dropdown.map((dropdownOptions, dropdownIndex) => (
          // console.log(dropdownOptions),
          <div key={dropdownIndex} className="form-group me-2 mb-2 flex-grow-1">
            <select
             
              value={selectedFields[dropdownIndex]}
              onChange={(e) => handleFieldChange(dropdownIndex, e)}
              className="form-select"
            >
              {dropdownOptions.map((opt, index) => (
                <option key={index} value={opt.value}>
                  {t(`${opt.label}`)}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="form-group mb-2 flex-shrink-0">
          <button
            type="button"
            onClick={performSearch}
            className="btn btn-success"
          >
            {t("Search")}
          </button>
        </div>
        <div className="form-group mb-2 flex-shrink-0 ms-2">
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-danger"
          >
            {t('Clear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
