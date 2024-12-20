import React, { useState } from "react";
import { Card, CardBody, CardSubtitle, Form, Row, Col } from "reactstrap";
import Dropzone from "react-dropzone";

const ImageUploader = ({ validation }) => {
  // Define max size constants within the component
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const [selectedImages, setSelectedImages] = useState([]);
  const [fileErrors, setFileErrors] = useState(null);

  const handleAcceptedFiles = (files) => {
    console.log(files);
    const formattedFiles = files.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file), // Generate preview URL for images
      name: file.name,
      size: file.size,
    }));
    setSelectedImages(formattedFiles);

    // Set the selected image on Formik's validation instance
    if (validation) {
      validation.setFieldValue("usr_picture", files[0]); // Use the first file if multiple are selected
    }
  };

  const handleRejectedFiles = (rejectedFiles) => {
    const errors = rejectedFiles.map((file) => ({
      fileName: file.file.name,
      fileSize: file.file.size,
      errorMessages: file.errors.map((error) => error.message),
    }));
    setFileErrors(errors);
  };

  console.log(validation.values);
  return (
    <Col className="col-12">
      <Card>
        <CardBody>
          <CardSubtitle className="mb-3">
            Attach or upload your image file here!
          </CardSubtitle>
          <Form>
            <Dropzone
              maxSize={MAX_SIZE_BYTES}
              accept={{ "image/*": [] }}
              onDrop={(acceptedFiles, rejectedFiles) => {
                const validFiles = acceptedFiles.filter(
                  (file) => file.size <= MAX_SIZE_BYTES
                );

                handleRejectedFiles(rejectedFiles);

                // Proceed only with valid image files within size limit
                if (validFiles.length > 0) {
                  handleAcceptedFiles(validFiles);
                  setFileErrors(null);
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone">
                  <div
                    className="dz-message needsclick mt-2"
                    {...getRootProps()}
                  >
                    <input {...getInputProps({ name: "usr_picture" })} />
                    <div className="mb-3">
                      <i className="display-4 text-muted bx bxs-cloud-upload" />
                    </div>
                    <h4>
                      {`Drop an image file here or click to upload (Max size: ${MAX_SIZE_MB} MB).`}
                    </h4>
                  </div>
                </div>
              )}
            </Dropzone>

            {/* Previews */}
            <div className="dropzone-previews mt-3" id="image-previews">
              {selectedImages.map((img, i) => (
                <Card
                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                  key={i + "-image"}
                >
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <img
                          src={img.preview}
                          alt={img.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col>
                        <p className="text-muted font-weight-bold mb-0">
                          {img.name}
                        </p>
                        <p className="mb-0">
                          <strong>{(img.size / 1024).toFixed(2)} KB</strong>
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

      {/* Errors */}
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
  );
};

export default ImageUploader;
