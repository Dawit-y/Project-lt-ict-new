import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input,Row,Col,FormFeedback } from "reactstrap";

import axios from "axios";
import { useTranslation } from "react-i18next";

const CascadingDropdowns1 = ({
  validation,
  dropdown1name,
  dropdown2name,
  dropdown3name,
  isEdit
}) => {
  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);

  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingWoredas, setLoadingWoredas] = useState(false);

  const { t } = useTranslation();
  // Default to Addis Ababa (ID: 1)
  const ADDIS_ABABA_ID = "1";

  // On initial load, set Formik's value for dep_available_at_region to Addis Ababa's ID
  useEffect(() => {
    if (!validation.values[dropdown1name]) {
      validation.setFieldValue(dropdown1name, ADDIS_ABABA_ID); // Set default value in Formik
    }
  }, [dropdown1name, validation]);

  // Fetch zones for the selected region (default is Addis Ababa)
  useEffect(() => {
    const selectedRegion = validation.values[dropdown1name];
    if (selectedRegion) {
      setLoadingZones(true);
      axios
        .post(
          `${
            import.meta.env.VITE_BASE_API_URL
          }addressbyparent?parent_id=${selectedRegion}`
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
  }, [dropdown1name, validation.values[dropdown1name]]);

  // Fetch woredas based on the selected zone
  useEffect(() => {
    if (validation.values[dropdown2name]) {
      setLoadingWoredas(true);
      axios
        .post(
          `${import.meta.env.VITE_BASE_API_URL}addressbyparent?parent_id=${
            validation.values[dropdown2name]
          }`
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
  }, [dropdown2name, validation.values[dropdown2name]]);

  // Handle region change
  const handleRegionChange = (e) => {
    validation.handleChange(e); // Continue handling validation changes
  };

  return (
    <>
      {/* Region Dropdown */}
     <Row>

      {/* First Dropdown */}
       <Col md={4}>
      <FormGroup>
        <Label for={dropdown1name}>{t("region_dropdown")}</Label>
        <Input
          type="select"
          name={dropdown1name}
          id={dropdown1name}
          value={validation.values[dropdown1name]} // Bind to Formik's state
          onChange={handleRegionChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched[dropdown1name] &&
            validation.errors[dropdown1name]
              ? true
              : false
          }
        >
          <option value="">{t("select_region")}</option>
          <option value="1">Addis Ababa</option>
          {/* {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))} */}
        </Input>
        {validation.touched[dropdown1name] &&
        validation.errors[dropdown1name] ? (
          <FormFeedback>{validation.errors[dropdown1name]}</FormFeedback>
        ) : null}
      </FormGroup>
  </Col>
      <Col md={4}>
      {/* Zone Dropdown */}
      <FormGroup>
        <Label for={dropdown2name}>{t("zone_dropdown")}</Label>
        <Input
          type="select"
          name={dropdown2name}
          id={dropdown2name}
          value={validation.values[dropdown2name]}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched[dropdown2name] &&
            validation.errors[dropdown2name]
              ? true
              : false
          }
          disabled={loadingZones || zones.length === 0}
        >
          {/* <option value="">{t("select_zone")}</option>
          {loadingZones ? (
            <option>{t("loading")}</option>
          ) : (
            zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))
          )} */}
           <option value="" disabled={!isEdit}>
            {isEdit
              ? (validation.values[dropdown2name]
                  ? zones.find(zone => zone.id === validation.values[dropdown2name])?.id
                  : t("select_zone"))
              : t("select_zone")}
          </option>
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
        {validation.touched[dropdown2name] &&
        validation.errors[dropdown2name] ? (
          <FormFeedback>{validation.errors[dropdown2name]}</FormFeedback>
        ) : null}
      </FormGroup>
  </Col>
      <Col md={4}>
      {/* Woreda Dropdown */}
      <FormGroup>
        <Label for={dropdown3name}>{t("woreda_dropdown")}</Label>
        <Input
          type="select"
          name={dropdown3name}
          id={dropdown3name}
          value={validation.values[dropdown3name]}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched[dropdown3name] &&
            validation.errors[dropdown3name]
              ? true
              : false
          }
          disabled={loadingWoredas || woredas.length === 0}
        >
          {/* <option value="">{t("select_woreda")}</option>
          {loadingWoredas ? (
            <option>{t("loading")}</option>
          ) : (
            woredas.map((woreda) => (
              <option key={woreda.id} value={woreda.id}>
                {woreda.name}
              </option>
            ))
          )} */}
           <option value="" disabled={!isEdit}>
            {isEdit
              ? (validation.values[dropdown3name]
                  ? woredas.find(woreda => woreda.id === validation.values[dropdown3name])?.name
                  : t("select_woreda"))
              : t("select_woreda")}
          </option>
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
        {validation.touched[dropdown3name] &&
        validation.errors[dropdown3name] ? (
          <FormFeedback>{validation.errors[dropdown3name]}</FormFeedback>
        ) : null}
      </FormGroup>
       </Col>

      </Row>
    </>
  );
};

export default CascadingDropdowns1;
