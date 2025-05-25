import React, { useEffect, useState } from "react";
import {
  Form,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormFeedback,
  Col,
  Row,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  UncontrolledTooltip
} from "reactstrap";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  useAddConversationInformation,
  useFetchConversationInformations,
} from "../../queries/conversationinformation_query";
import { useTranslation } from "react-i18next";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { FaRotate } from "react-icons/fa6";

const Conversation = ({
  isOpen,
  toggle,
  ownerId,
  ownerTypeId,
  title,
  canAdd = true,
  canEdit = true,
  canDelete = true
}) => {
  const param = { cvi_object_type_id: ownerTypeId, cvi_object_id: ownerId };
  const [conversationInformation, setConversationInformation] = useState(null);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useFetchConversationInformations(param, isOpen);
  const { t } = useTranslation();

  useEffect(() => {
    setConversationInformation(data);
  }, [data]);

  const handleAddConversationInformation = async (data) => {
    try {
      await addConversationInformation.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
  };
  const addConversationInformation = useAddConversationInformation();
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      cvi_title:
        (conversationInformation && conversationInformation.cvi_title) || "",
      cvi_object_id:
        (conversationInformation && conversationInformation.cvi_object_id) ||
        "",
      cvi_object_type_id:
        (conversationInformation &&
          conversationInformation.cvi_object_type_id) ||
        "",
      cvi_request_date_et:
        (conversationInformation &&
          conversationInformation.cvi_request_date_et) ||
        "",
      cvi_request_date_gc:
        (conversationInformation &&
          conversationInformation.cvi_request_date_gc) ||
        "",
      cvi_description:
        (conversationInformation && conversationInformation.cvi_description) ||
        "",
      cvi_status:
        (conversationInformation && conversationInformation.cvi_status) || "",

      is_deletable:
        (conversationInformation && conversationInformation.is_deletable) || 1,
      is_editable:
        (conversationInformation && conversationInformation.is_editable) || 1,
    },
    validationSchema: Yup.object({
      cvi_title: Yup.string().required(t("cvi_title")),
      cvi_description: Yup.string().required(t("cvi_description")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const newConversationInformation = {
        cvi_title: values.cvi_title,
        cvi_object_id: ownerId,
        cvi_object_type_id: ownerTypeId,
        cvi_request_date_et: "1",
        cvi_request_date_gc: "1",
        cvi_description: values.cvi_description,
      };
      // save new ConversationInformation
      handleAddConversationInformation(newConversationInformation);
    },
  });

  const formatTimeAgo = (timestamp) => {
    return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
  };

  const comments = data?.data || [];

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <Modal
        isOpen={isOpen}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="modal-xl"
        tabIndex="-1"
        toggle={toggle}
      >
        <div className="modal-xl">
          <ModalHeader toggle={toggle}>{title ? title : t("view_messages")}</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={12}>
                <div className="row justify-content-center">
                  <div className="col-xl-8">
                    <>
                      {canAdd &&
                        <Card className="">
                          <CardBody>
                            <CardTitle className="mb-3">
                              {t("leave_a_message")}
                            </CardTitle>
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                              }}
                            >
                              <div className="mb-3">
                                <Label>{t("subject")}</Label>
                                <Input
                                  name="cvi_title"
                                  type="text"
                                  placeholder={t("subject")}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.cvi_title || ""}
                                  invalid={
                                    validation.touched.cvi_title &&
                                      validation.errors.cvi_title
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.cvi_title &&
                                  validation.errors.cvi_title ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.cvi_title}
                                  </FormFeedback>
                                ) : null}
                              </div>
                              <div className="mb-3">
                                <Label>{t("Message")}</Label>
                                <Input
                                  name="cvi_description"
                                  className="form-control"
                                  id="commentmessage-input"
                                  rows="3"
                                  type="textarea"
                                  placeholder={t("Message")}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.cvi_description || ""}
                                  invalid={
                                    validation.touched.cvi_description &&
                                      validation.errors.cvi_description
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.cvi_description &&
                                  validation.errors.cvi_description ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.cvi_description}
                                  </FormFeedback>
                                ) : null}
                              </div>
                              <Row>
                                <Col>
                                  <div className="text-end">
                                    <Button
                                      color="success"
                                      type="submit"
                                      className="save-user"
                                      disabled={
                                        addConversationInformation.isPending ||
                                        !validation.dirty
                                      }
                                    >
                                      {addConversationInformation.isPending &&
                                        <Spinner
                                          size={"sm"}
                                          color="light"
                                          className="me-2"
                                        />}
                                      {"Submit"}
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Card>
                      }
                      <Card>
                        <CardBody>
                          <CardTitle className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <span><i className="bx bx-message-dots text-muted align-middle me-1"></i></span>
                              <span className="fw-bold fs-5">{t("conversations")}</span>
                            </div>
                            <Button
                              id="refresh_btn_message"
                              color="primary"
                              onClick={refetch}
                              outline
                              className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: "25px", height: "25px", fontSize: "10px" }}
                            >
                              {isFetching ? <Spinner color="light" size="sm" /> : <FaRotate />}
                            </Button>
                            <UncontrolledTooltip placement="top" target="refresh_btn_message">
                              Refresh
                            </UncontrolledTooltip>
                          </CardTitle>
                          <hr />
                          {comments.length > 0 ? (
                            comments.map((comment) => (
                              <div key={comment.cvi_id} className="d-flex py-3 border-top">
                                <div className="flex-shrink-0 me-3">
                                  <div className="avatar-xs">
                                    <div className="avatar-title rounded-circle bg-light text-primary">
                                      <i className="bx bxs-user"></i>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="font-size-14 mb-1">
                                    {comment?.created_by}{" "}
                                    <small className="text-muted float-end">
                                      {formatTimeAgo(comment.cvi_create_time)}
                                    </small>
                                  </h5>
                                  <h6 className="my-2"><strong>Subject: </strong> {comment?.cvi_title}</h6>
                                  <p className="text-muted">{comment.cvi_description}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted py-3">No Messages available.</p>
                          )}
                        </CardBody>
                      </Card>
                    </>
                  </div>
                </div>
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
    </React.Fragment>
  );
};

export default Conversation;
