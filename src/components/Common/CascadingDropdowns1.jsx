import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import axios from "axios";

const CascadingDropdowns1 = ({ validation, t }) => {
  // const [firstDropdown, setFirstDropdown] = useState("1"); // Addis Ababa ID is 1
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);

  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingWoredas, setLoadingWoredas] = useState(false);

  // Default to Addis Ababa (ID: 1)
  const ADDIS_ABABA_ID = "1";
  const [selectedRegion, setSelectedRegion] = useState(ADDIS_ABABA_ID);

  // Fetch regions on mount
  useEffect(() => {
    axios
      .post(
        `${
          import.meta.env.VITE_BASE_API_URL
        }addressbyparent?parent_id=${1}`
      )
      .then((response) => {
        setRegions(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching regions:", error);
      });
  }, []);

  // Fetch zones for the selected region (default is Addis Ababa)
  useEffect(() => {
    if (selectedRegion) {
      setLoadingZones(true);
      axios
        .post(
          `${import.meta.env.VITE_BASE_API_URL}addressbyparent?parent_id=${selectedRegion}`
        )
        .then((response) => {
          setZones(response.data.data || []);
          setLoadingZones(false);
        })
        .catch((error) => {
          console.error("Error fetching zones:", error);
          setLoadingZones(false);
        });
    }
  }, [selectedRegion]);

  // Fetch woredas based on the selected zone
  useEffect(() => {
    if (validation.values.dep_available_at_zone) {
      setLoadingWoredas(true);
      axios
        .post(
          `${import.meta.env.VITE_BASE_API_URL}addressbyparent?parent_id=${validation.values.dep_available_at_zone}`
        )
        .then((response) => {
          setWoredas(response.data.data || []);
          setLoadingWoredas(false);
        })
        .catch((error) => {
          console.error("Error fetching woredas:", error);
          setLoadingWoredas(false);
        });
    }
  }, [validation.values.dep_available_at_zone]);

  // Handle region change
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    validation.handleChange(e); // Continue handling validation changes
  };

  return (
    <>
      {/* Region Dropdown */}
      <FormGroup>
        <Label for="dep_available_at_region">{t("dep_available_at_region")}</Label>
        <Input
          type="select"
          name="dep_available_at_region"
          id="dep_available_at_region"
          value={selectedRegion}
          onChange={handleRegionChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched.dep_available_at_region &&
            validation.errors.dep_available_at_region
              ? true
              : false
          }
        >
          <option value="">{t("select_region")}</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </Input>
        {validation.touched.dep_available_at_region &&
        validation.errors.dep_available_at_region ? (
          <FormFeedback>{validation.errors.dep_available_at_region}</FormFeedback>
        ) : null}
      </FormGroup>

      {/* Zone Dropdown */}
      <FormGroup>
        <Label for="dep_available_at_zone">{t("dep_available_at_zone")}</Label>
        <Input
          type="select"
          name="dep_available_at_zone"
          id="dep_available_at_zone"
          value={validation.values.dep_available_at_zone}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched.dep_available_at_zone &&
            validation.errors.dep_available_at_zone
              ? true
              : false
          }
          disabled={loadingZones || zones.length === 0}
        >
          <option value="">{t("select_zone")}</option>
          {loadingZones ? (
            <option>{t("loading")}</option>
          ) : (
            zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))
          )}
        </Input>
        {validation.touched.dep_available_at_zone &&
        validation.errors.dep_available_at_zone ? (
          <FormFeedback>{validation.errors.dep_available_at_zone}</FormFeedback>
        ) : null}
      </FormGroup>

      {/* Woreda Dropdown */}
      <FormGroup>
        <Label for="dep_available_at_woreda">{t("dep_available_at_woreda")}</Label>
        <Input
          type="select"
          name="dep_available_at_woreda"
          id="dep_available_at_woreda"
          value={validation.values.dep_available_at_woreda}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched.dep_available_at_woreda &&
            validation.errors.dep_available_at_woreda
              ? true
              : false
          }
          disabled={loadingWoredas || woredas.length === 0}
        >
          <option value="">{t("select_woreda")}</option>
          {loadingWoredas ? (
            <option>{t("loading")}</option>
          ) : (
            woredas.map((woreda) => (
              <option key={woreda.id} value={woreda.id}>
                {woreda.name}
              </option>
            ))
          )}
        </Input>
        {validation.touched.dep_available_at_woreda &&
        validation.errors.dep_available_at_woreda ? (
          <FormFeedback>{validation.errors.dep_available_at_woreda}</FormFeedback>
        ) : null}
      </FormGroup>
    </>
  );
};

export default CascadingDropdowns1;
