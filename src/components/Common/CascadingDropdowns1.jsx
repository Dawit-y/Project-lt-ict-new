import React, { useEffect } from "react";
import { FormGroup, Label, Input, FormFeedback, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { post } from "../../helpers/api_Lists";

const fetchAddressByParent = async (parentId) => {
  const response = await post(`addressbyparent?parent_id=${parentId}`);
  return response?.data || [];
};

const CascadingDropdowns1 = ({
  validation,
  dropdown1name,
  dropdown2name,
  dropdown3name,
  isEdit,
  required = false,
  disabled,
  layout = "vertical", // 'vertical' or 'horizontal'
  colSizes = { md: 4 }, // default column sizes for horizontal layout
}) => {
  const { t } = useTranslation();
  const OROMIA_ID = "1";

  // Set default region value to Oromia on initial load
  useEffect(() => {
    if (!validation.values[dropdown1name]) {
      validation.setFieldValue(dropdown1name, OROMIA_ID);
    }
  }, [dropdown1name, validation]);

  // Fetch zones for the selected region
  const {
    data: zones = [],
    isLoading: loadingZones,
    refetch: refetchZones,
  } = useQuery({
    queryKey: ["zones", validation.values[dropdown1name]],
    queryFn: () => fetchAddressByParent(validation.values[dropdown1name]),
    enabled: !!validation.values[dropdown1name],
  });

  // Fetch woredas for the selected zone
  const {
    data: woredas = [],
    isLoading: loadingWoredas,
    refetch: refetchWoredas,
  } = useQuery({
    queryKey: ["woredas", validation.values[dropdown2name]],
    queryFn: () => fetchAddressByParent(validation.values[dropdown2name]),
    enabled: !!validation.values[dropdown2name],
  });

  // Handle region change
  const handleRegionChange = (e) => {
    validation.handleChange(e);
    validation.setFieldValue(dropdown2name, "");
    validation.setFieldValue(dropdown3name, "");
    refetchZones();
  };

  // Handle zone change
  const handleZoneChange = (e) => {
    validation.handleChange(e);
    validation.setFieldValue(dropdown3name, "");
    refetchWoredas();
  };

  // Render dropdown group
  const renderDropdownGroup = () => (
    <>
      {/* Region Dropdown */}
      <FormGroup>
        <Label for={dropdown1name}>
          {t("region")} {required && <span className="text-danger">*</span>}
        </Label>
        <Input
          type="select"
          name={dropdown1name}
          id={dropdown1name}
          value={validation.values[dropdown1name]}
          onChange={handleRegionChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched[dropdown1name] &&
            validation.errors[dropdown1name]
              ? true
              : false
          }
          disabled={disabled}
        >
          <option value="">{t("select_region")}</option>
          <option value="1">Oromia</option>
          {/* Add more regions as needed */}
        </Input>
        {validation.touched[dropdown1name] &&
        validation.errors[dropdown1name] ? (
          <FormFeedback>{validation.errors[dropdown1name]}</FormFeedback>
        ) : null}
      </FormGroup>

      {/* Zone Dropdown */}
      <FormGroup>
        <Label for={dropdown2name}>
          {t("zone")} {required && <span className="text-danger">*</span>}
        </Label>
        <Input
          type="select"
          name={dropdown2name}
          id={dropdown2name}
          value={validation.values[dropdown2name]}
          onChange={handleZoneChange}
          onBlur={validation.handleBlur}
          invalid={
            validation.touched[dropdown2name] &&
            validation.errors[dropdown2name]
              ? true
              : false
          }
          disabled={loadingZones || zones.length === 0 || disabled}
        >
          <option value="">{t("select_zone")}</option>
          {loadingZones ? (
            <option disabled>{t("Loading...")}</option>
          ) : zones.length === 0 ? (
            <option disabled>{t("no_zones_available")}</option>
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

      {/* Woreda Dropdown */}
      <FormGroup>
        <Label for={dropdown3name}>
          {t("woreda")} {required && <span className="text-danger">*</span>}
        </Label>
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
          disabled={loadingWoredas || woredas.length === 0 || disabled}
        >
          <option value="">{t("select_woreda")}</option>
          {loadingWoredas ? (
            <option disabled>{t("Loading...")}</option>
          ) : woredas.length === 0 ? (
            <option disabled>{t("no_woredas_available")}</option>
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
    </>
  );

  // Render horizontal layout
  const renderHorizontalLayout = () => (
    <Row>
      <Col {...colSizes}>
        <FormGroup>
          <Label for={dropdown1name}>
            {t("region")} {required && <span className="text-danger">*</span>}
          </Label>
          <Input
            type="select"
            name={dropdown1name}
            id={dropdown1name}
            value={validation.values[dropdown1name]}
            onChange={handleRegionChange}
            onBlur={validation.handleBlur}
            invalid={
              validation.touched[dropdown1name] &&
              validation.errors[dropdown1name]
                ? true
                : false
            }
            disabled={disabled}
          >
            <option value="">{t("select_region")}</option>
            <option value="1">Oromia</option>
          </Input>
          {validation.touched[dropdown1name] &&
          validation.errors[dropdown1name] ? (
            <FormFeedback>{validation.errors[dropdown1name]}</FormFeedback>
          ) : null}
        </FormGroup>
      </Col>
      <Col {...colSizes}>
        <FormGroup>
          <Label for={dropdown2name}>
            {t("zone")} {required && <span className="text-danger">*</span>}
          </Label>
          <Input
            type="select"
            name={dropdown2name}
            id={dropdown2name}
            value={validation.values[dropdown2name]}
            onChange={handleZoneChange}
            onBlur={validation.handleBlur}
            invalid={
              validation.touched[dropdown2name] &&
              validation.errors[dropdown2name]
                ? true
                : false
            }
            disabled={loadingZones || zones.length === 0 || disabled}
          >
            <option value="">{t("select_zone")}</option>
            {loadingZones ? (
              <option disabled>{t("Loading...")}</option>
            ) : zones.length === 0 ? (
              <option disabled>{t("no_zones_available")}</option>
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
      <Col {...colSizes}>
        <FormGroup>
          <Label for={dropdown3name}>
            {t("woreda")} {required && <span className="text-danger">*</span>}
          </Label>
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
            disabled={loadingWoredas || woredas.length === 0 || disabled}
          >
            <option value="">{t("select_woreda")}</option>
            {loadingWoredas ? (
              <option disabled>{t("Loading...")}</option>
            ) : woredas.length === 0 ? (
              <option disabled>{t("no_woredas_available")}</option>
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
  );

  return layout === "horizontal"
    ? renderHorizontalLayout()
    : renderDropdownGroup();
};

export default CascadingDropdowns1;
