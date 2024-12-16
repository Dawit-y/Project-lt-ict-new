import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import { Col, Row, Form, Card, CardBody, CardSubtitle } from "reactstrap";

const FileUploadField = ({
  validation,
  fileKey,
  filePathKey,
  fileSizeKey,
  fileExtesionKey,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

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

      validation.setFieldValue(fileKey, file);
      validation.setFieldValue(filePathKey, file.name);
      validation.setFieldValue(fileExtesionKey, file.name.split(".").pop());
      validation.setFieldValue(fileSizeKey, `${fileSizeInKB} KB`);
    }
  };
  return (
    <Row>
      <Col className="col-12">
        <Card>
          <CardBody>
            <CardSubtitle className="mb-3">
              Attach or upload your PDF file here!
            </CardSubtitle>
            <Form>
              <Dropzone
                accept={{ "application/pdf": [] }}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  const maxSize = 5 * 1024 * 1024; // 5 MB limit

                  const validFiles = acceptedFiles.filter(
                    (file) => file.size <= maxSize
                  );
                  const oversizedFiles = acceptedFiles.filter(
                    (file) => file.size > maxSize
                  );

                  // Handle oversized files
                  if (oversizedFiles.length > 0) {
                    const oversizedFileNames = oversizedFiles
                      .map((file) => file.name)
                      .join(", ");
                    alert(
                      `The following files exceed the 5 MB size limit and were rejected: ${oversizedFileNames}`
                    );
                  }

                  // Handle rejected files (non-PDFs)
                  if (rejectedFiles.length > 0) {
                    const invalidFiles = rejectedFiles
                      .map((file) => file.file.name)
                      .join(", ");
                    alert(
                      `These files are not PDFs and were rejected: ${invalidFiles}`
                    );
                  }

                  // Proceed only with valid files that are PDFs and within size limit
                  if (validFiles.length > 0) {
                    handleAcceptedFiles(validFiles);
                    const syntheticEvent = {
                      target: {
                        files: validFiles,
                        name: fileKey,
                      },
                    };
                    handleFileChange(syntheticEvent);
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone">
                    <div
                      className="dz-message needsclick mt-2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps({ name: fileKey })} />
                      <div className="mb-3">
                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                      </div>
                      <h4>
                        Drop PDF files here or click to upload (Max size: 5 MB).
                      </h4>
                    </div>
                  </div>
                )}
              </Dropzone>
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
                          <Link to="#" className="text-muted font-weight-bold">
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
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default FileUploadField;
