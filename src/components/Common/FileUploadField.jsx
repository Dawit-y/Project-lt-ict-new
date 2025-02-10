import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import {
  Col,
  Row,
  Form,
  Card,
  CardBody,
  CardSubtitle,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { useFetchDocumentTypes } from "../../queries/documenttype_query";
import { createSelectOptions } from "../../utils/commonMethods";
import { useTranslation } from "react-i18next";

const MAX_SIZE_MB = 75;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const FileUploadField = ({ validation }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { data: documentTypeData } = useFetchDocumentTypes();
  const documentTypeOptions = createSelectOptions(
    documentTypeData?.data || [],
    "pdt_id",
    "pdt_doc_name_en"
  );
  const { t } = useTranslation();

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  function handleAcceptedFiles(files) {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(updatedFiles);
  }

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);

      validation.setFieldValue("prd_file", file);
      validation.setFieldValue("prd_file_path", file.name);
      validation.setFieldValue(
        "prd_file_extension",
        file.name.split(".").pop()
      );
      validation.setFieldValue("prd_size", `${fileSizeInKB}`);
    }
  };

  const [fileErrors, setFileErrors] = useState([]);

  const handleRejectedFiles = (rejectedFiles) => {
    const errors = rejectedFiles.map(({ file, errors }) => {
      return {
        fileName: file.path,
        fileSize: (file.size / (1024 * 1024)).toFixed(2),
        errorMessages: errors.map((e) =>
          e.code === "file-too-large"
            ? `File is too large (${(file.size / (1024 * 1024)).toFixed(
              2
            )} MB). Max size allowed is ${MAX_SIZE_MB} MB.`
            : e.message
        ),
      };
    });
    setFileErrors(errors);
  };
  return (
    <Row>
      {/* Document Type (Unchanged) */}
      <Col className="col-md-6 mb-3">
        <Label>
          {t("prd_document_type_id")} <span className="text-danger">*</span>
        </Label>
        <Input
          name="prd_document_type_id"
          id="prd_document_type_id"
          type="select"
          className="form-select"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.prd_document_type_id || ""}
          invalid={
            validation.touched.prd_document_type_id &&
              validation.errors.prd_document_type_id
              ? true
              : false
          }
        >
          <option value={null}>Select Document Type</option>
          {documentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(`${option.label}`)}
            </option>
          ))}
        </Input>
        {validation.touched.prd_document_type_id &&
          validation.errors.prd_document_type_id ? (
          <FormFeedback type="invalid">
            {validation.errors.prd_document_type_id}
          </FormFeedback>
        ) : null}
      </Col>

      {/* Name */}
      <Col className="col-md-6 mb-3">
        <Label>
          {t("prd_name")} <span className="text-danger">*</span>
        </Label>
        <Input
          name="prd_name"
          type="text"
          placeholder={t("prd_name")}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.prd_name || ""}
          invalid={
            validation.touched.prd_name && validation.errors.prd_name
              ? true
              : false
          }
          maxLength={20}
        />
        {validation.touched.prd_name && validation.errors.prd_name ? (
          <FormFeedback type="invalid">
            {validation.errors.prd_name}
          </FormFeedback>
        ) : null}
      </Col>

      <Col className="col-12">
        <Card>
          <>
            <CardSubtitle className="mb-3">
              Attach or upload your PDF file here!
            </CardSubtitle>
            <>
              <Dropzone
                maxSize={MAX_SIZE_BYTES}
                accept={{ "application/pdf": [] }}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  const maxSize = MAX_SIZE_BYTES
                  const validFiles = acceptedFiles.filter(
                    (file) => file.size <= maxSize
                  );

                  handleRejectedFiles(rejectedFiles);

                  // Proceed only with valid files that are PDFs and within size limit
                  if (validFiles.length > 0) {
                    handleAcceptedFiles(validFiles);
                    const syntheticEvent = {
                      target: {
                        files: validFiles,
                        name: "prd_file",
                      },
                    };
                    handleFileChange(syntheticEvent);
                    setFileErrors(null);
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    className={`dropzone ${validation.touched.prd_file && validation.errors.prd_file
                      ? "border border-danger"
                      : ""
                      }`}
                  >
                    <div
                      className="dz-message needsclick mt-2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps({ name: "prd_file" })} />
                      <div className="mb-3">
                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                      </div>
                      <h4>
                        {` Drop PDF files here or click to upload (Max size: ${MAX_SIZE_MB} MB).`}
                      </h4>
                    </div>
                  </div>
                )}
              </Dropzone>
              {!fileErrors && (
                <div className="dropzone-previews mt-3" id="file-previews">
                  {selectedFiles.map((f, i) => (
                    <Card
                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                      key={i + "-file"}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col className="col-auto">
                            <i
                              className="bx bxs-file-pdf text-danger"
                              style={{ fontSize: "80px" }}
                            />
                          </Col>
                          <Col>
                            <Link
                              to="#"
                              className="text-muted font-weight-bold"
                            >
                              {f.name}
                            </Link>
                            <p className="mb-0">
                              <strong>{f.formattedSize}</strong>
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          </>
        </Card>

        {validation.touched.prd_file && validation.errors.prd_file && (
          <div className="text-danger small mt-1">
            {validation.errors.prd_file}
          </div>
        )}

        {fileErrors && fileErrors?.length > 0 && (
          <ul>
            {fileErrors.map((error, index) => (
              <li key={index}>
                {error.fileName} - {error.fileSize} bytes
                <ul>
                  {error.errorMessages.map((message, i) => (
                    <li className="text-danger" key={i}>
                      {message}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Col>
    </Row>
  );
};

export default FileUploadField;