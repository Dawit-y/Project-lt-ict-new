import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Accordion,
  Table,
  Spinner,
} from "reactstrap";
import ActionForm from "./ActionForm";
import { useFetchBudgetRequestAmounts } from "../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../queries/budgetrequesttask_query";
import { useFetchBudgetExSources } from "../../queries/budgetexsource_query";

const modalStyle = {
  width: "100%",
  minHeight: "600px",
};

const ActionModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, data } = props;
  const [open, setOpen] = useState();
  const [selectedBrAmount, setSelectedBrAmount] = useState(null);

  const toggleAcc = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const [subOpen, setSubOpen] = useState();
  const toggleSubAcc = (id) => {
    if (subOpen === id) {
      setSubOpen();
    } else {
      setSubOpen(id);
    }
  };

  const id = data?.bdr_id;
  const param = { budget_request_id: id };
  const brAmounts = useFetchBudgetRequestAmounts(param, open === "1");
  const brTasks = useFetchBudgetRequestTasks(param, open === "2");
  const brExSources = useFetchBudgetExSources(param, open === "3");

  const handleSelectBrAmount = (amount) => {
    setSelectedBrAmount(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="modal-xl"
      tabIndex="-1"
      toggle={toggle}
      style={modalStyle}
    >
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={selectedBrAmount ? 8 : 12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Overview</CardTitle>
                  <Col>
                    <div className="mt-4">
                      <Accordion open={open} toggle={toggleAcc}>
                        <AccordionItem>
                          <AccordionHeader targetId="1">
                            Budget Request Amount
                          </AccordionHeader>
                          <AccordionBody accordionId="1">
                            <Accordion
                              flush
                              open={subOpen}
                              toggle={toggleSubAcc}
                            >
                              {brAmounts?.isLoading ? (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                  <Spinner size={"sm"} color="primary" />
                                </div>
                              ) : (
                                brAmounts?.data?.data.map((amount, index) => (
                                  <AccordionItem
                                    onClick={() => handleSelectBrAmount(amount)}
                                  >
                                    <AccordionHeader targetId={index}>
                                      {amount?.bra_expenditure_code_id}
                                    </AccordionHeader>
                                    <AccordionBody accordionId={index}>
                                      <Table>
                                        <tbody>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bra_current_year_expense`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  amount?.bra_current_year_expense
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bra_requested_amount`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {amount?.bra_requested_amount}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `bra_source_government_requested`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  amount?.bra_source_government_requested
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `bra_source_internal_requested`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  amount?.bra_source_internal_requested
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `bra_source_support_requested`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  amount?.bra_source_support_requested
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `bra_source_credit_requested`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  amount?.bra_source_credit_requested
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bra_source_credit_code`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {amount?.bra_source_credit_code}
                                              </span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </AccordionBody>
                                  </AccordionItem>
                                ))
                              )}
                            </Accordion>
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId="2">
                            Budget Request Task
                          </AccordionHeader>
                          <AccordionBody accordionId="2">
                            <Accordion
                              flush
                              open={subOpen}
                              toggle={toggleSubAcc}
                            >
                              {brTasks?.isLoading ? (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                  <Spinner size={"sm"} color="primary" />
                                </div>
                              ) : (
                                brTasks?.data?.data.map((task, index) => (
                                  <AccordionItem>
                                    <AccordionHeader targetId={index}>
                                      {task?.brt_task_name}
                                    </AccordionHeader>
                                    <AccordionBody accordionId={index}>
                                      <Table>
                                        <tbody>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`brt_measurement`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {task?.brt_measurement}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `brt_previous_year_physical`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  task?.brt_previous_year_physical
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `brt_previous_year_financial`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  task?.brt_previous_year_financial
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`brt_current_year_physical`)}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  task?.brt_current_year_physical
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(
                                                  `brt_current_year_financial`
                                                )}
                                                :
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {
                                                  task?.brt_current_year_financial
                                                }
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`brt_next_year_physical`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {task?.brt_next_year_physical}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`brt_next_year_financial`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {task?.brt_next_year_financial}
                                              </span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </AccordionBody>
                                  </AccordionItem>
                                ))
                              )}
                            </Accordion>
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId="3">
                            Budget Request External Source
                          </AccordionHeader>
                          <AccordionBody accordionId="3">
                            <Accordion
                              flush
                              open={subOpen}
                              toggle={toggleSubAcc}
                            >
                              {brExSources?.isLoading ? (
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                  <Spinner size={"sm"} color="primary" />
                                </div>
                              ) : (
                                brExSources?.data?.data.map((source, index) => (
                                  <AccordionItem>
                                    <AccordionHeader targetId={index}>
                                      {source?.bes_org_name}
                                    </AccordionHeader>
                                    <AccordionBody accordionId={index}>
                                      <Table>
                                        <tbody>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bes_org_name`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {source?.bes_org_name}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bes_organ_code`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {source?.bes_organ_code}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bes_support_amount`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {source?.bes_support_amount}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <strong>
                                                {t(`bes_credit_amount`)}:
                                              </strong>
                                            </td>
                                            <td>
                                              <span className="text-primary">
                                                {source?.bes_credit_amount}
                                              </span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </AccordionBody>
                                  </AccordionItem>
                                ))
                              )}
                            </Accordion>
                          </AccordionBody>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              {selectedBrAmount && <ActionForm amount={selectedBrAmount} />}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
ActionModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.object,
};
export default ActionModal;
