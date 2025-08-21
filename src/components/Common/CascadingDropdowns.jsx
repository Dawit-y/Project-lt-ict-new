import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import axios from "axios";

const CascadingDropdowns = () => {
  const [firstDropdown, setFirstDropdown] = useState("1"); // Addis Ababa ID is 1
  const [secondDropdown, setSecondDropdown] = useState(""); // Initial value empty string
  const [thirdDropdown, setThirdDropdown] = useState(""); // Initial value empty string

  const [secondOptions, setSecondOptions] = useState([]); // Default to empty array
  const [thirdOptions, setThirdOptions] = useState([]); // Default to empty array

  const [loadingSecond, setLoadingSecond] = useState(false); // Loading state for second dropdown
  const [loadingThird, setLoadingThird] = useState(false); // Loading state for third dropdown

  // Fetch the second dropdown data when the first dropdown value changes
  useEffect(() => {
    if (firstDropdown) {
      setLoadingSecond(true); // Start loading state for the second dropdown
      axios
        .post(
          `${
            import.meta.env.VITE_BASE_API_URL
          }addressbyparent?parent_id=${firstDropdown}`,
        )
        .then((response) => {
          console.log(response);
          setSecondOptions(response.data.data || []); // Safeguard against undefined
          setSecondDropdown(""); // Reset second dropdown when new data is loaded
          setThirdDropdown(""); // Reset third dropdown
          setLoadingSecond(false); // End loading state for second dropdown
        })
        .catch((error) => {
          console.error("Error fetching second dropdown data:", error);
          setLoadingSecond(false); // End loading state on error
        });
    }
  }, [firstDropdown]);

  // Fetch the third dropdown data when the second dropdown value changes
  useEffect(() => {
    if (secondDropdown) {
      setLoadingThird(true); // Start loading state for third dropdown
      axios
        .post(
          `${
            import.meta.env.VITE_BASE_API_URL
          }addressbyparent?parent_id=${secondDropdown}`,
        )
        .then((response) => {
          setThirdOptions(response.data.data || []); // Safeguard against undefined
          setThirdDropdown(""); // Reset third dropdown when new data is loaded
          setLoadingThird(false); // End loading state for third dropdown
        })
        .catch((error) => {
          console.error("Error fetching third dropdown data:", error);
          setLoadingThird(false); // End loading state on error
        });
    }
  }, [secondDropdown]);
  console.log(secondOptions);

  return (
    <>
      {/* First Dropdown */}
      <FormGroup>
        <Label for="firstDropdown">City</Label>
        <Input
          type="select"
          name="firstDropdown"
          id="firstDropdown"
          value={firstDropdown}
          onChange={(e) => setFirstDropdown(e.target.value)}
        >
          <option value="1">Addis Ababa</option>
        </Input>
      </FormGroup>

      {/* Second Dropdown */}
      <FormGroup>
        <Label for="secondDropdown">Sub City</Label>
        <Input
          type="select"
          name="secondDropdown"
          id="secondDropdown"
          value={secondDropdown}
          onChange={(e) => setSecondDropdown(e.target.value)}
          disabled={loadingSecond || secondOptions.length === 0} // Disable if loading or no options
        >
          <option value="">Select Sub City</option>
          {loadingSecond ? (
            <option>Loading...</option>
          ) : (
            secondOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))
          )}
        </Input>
      </FormGroup>

      {/* Third Dropdown */}
      <FormGroup>
        <Label for="thirdDropdown">Woreda</Label>
        <Input
          type="select"
          name="thirdDropdown"
          id="thirdDropdown"
          value={thirdDropdown}
          onChange={(e) => setThirdDropdown(e.target.value)}
          disabled={loadingThird || thirdOptions.length === 0} // Disable if loading or no options
        >
          <option value="">Select Woreda</option>
          {loadingThird ? (
            <option>Loading...</option>
          ) : (
            thirdOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))
          )}
        </Input>
      </FormGroup>
    </>
  );
};

export default CascadingDropdowns;
