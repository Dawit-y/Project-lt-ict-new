import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAddUserSector, useFetchUserSectors } from "../../queries/usersector_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import { useTranslation } from "react-i18next";
import { Button, Row, Form, Input, Label, FormGroup, Spinner, Container } from "reactstrap";
import { toast } from "react-toastify";
import { createSelectOptions } from "../../utils/commonMethods";

const UserSectorModel = ({ passedId, isActive }) => {
  const { t } = useTranslation();

  const { data: sectorData, isLoading: sectorLoading } = useFetchSectorCategorys();
  const { data: userSectorsData, isLoading: userSectorsLoading } = useFetchUserSectors({ usc_user_id: passedId }, isActive);

  const addUserSector = useAddUserSector();
  const sectorOptions = createSelectOptions(sectorData?.data || [], "psc_id", "psc_name");

  const getUserSectorMap = () => {
    if (!userSectorsData?.data) return {};
    return userSectorsData.data.reduce((acc, sector) => {
      acc[sector.usc_sector_id] = sector.usc_status === 1;
      return acc;
    }, {});
  };

  const [initialSectors, setInitialSectors] = useState({});

  useEffect(() => {
    if (userSectorsData?.data) {
      setInitialSectors(getUserSectorMap());
    }
  }, [userSectorsData]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      sectors: initialSectors,
    },
    validationSchema: Yup.object({
      sectors: Yup.object().required(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = Object.entries(values.sectors).map(([id, checked]) => ({
          usc_sector_id: id,
          usc_user_id: passedId,
          usc_status: checked ? 1 : 0,
        }));
        await addUserSector.mutateAsync(payload);
        toast.success(t("update_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(t("update_failure"), {
          autoClose: 2000,
        });
      }
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Form onSubmit={validation.handleSubmit} className="w-50 p-4 border rounded shadow bg-white">
        <Row className="d-flex flex-column align-items-center">
          {sectorLoading || userSectorsLoading ? (
            <Spinner />
          ) : (
            sectorOptions.map(({ value, label }) => (
              <FormGroup key={value} className="d-flex align-items-center gap-2 w-100">
                <Label className="me-2 my-auto">{label}</Label>
                <Input
                  type="checkbox"
                  className="form-check-input form-check-input-lg"
                  checked={validation.values.sectors[value] || false}
                  onChange={(e) =>
                    validation.setFieldValue("sectors", {
                      ...validation.values.sectors,
                      [value]: e.target.checked,
                    })
                  }
                  bsSize="lg"
                />
              </FormGroup>
            ))
          )}
        </Row>
        <div className="text-center mt-3">
          <Button type="submit" color="success" disabled={addUserSector.isPending}>
            {addUserSector.isPending && <Spinner size="sm" className="me-2" />}
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

UserSectorModel.propTypes = {
  passedId: PropTypes.number.isRequired,
};

export default UserSectorModel;
