import { Row, Col, Card, CardBody, Spinner } from "reactstrap";
import FileList from "../../../Projectdocument/FileManager/FileList";
import { useFetchProjectDocuments } from "../../../../queries/projectdocument_query";
import { PAGE_ID } from "../../../../constants/constantFile";
import FetchErrorHandler from "../../../../components/Common/FetchErrorHandler";

export default function AttachedFiles({ requestData, isActive }) {
  const ownerTypeId = PAGE_ID.PROJ_BUDGET_REQUEST;
  const param = {
    project_id: requestData?.bdr_project_id,
    prd_owner_type_id: ownerTypeId,
    prd_owner_id: requestData?.bdr_id,
  };
  const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(
    param,
    isActive,
  );

  const files = data?.data || [];

  const totalFiles = files.length;

  const totalSize =
    files.reduce((sum, file) => sum + (file.prd_size || 0), 0) / (1024 * 1024);
  const totalSizeFormatted = `${totalSize.toFixed(2)} MB`;

  const categories = new Set(files.map((f) => f.prd_document_type_id));
  const totalCategories = categories.size;

  const lastUpload = files.length
    ? new Date(
        Math.max(
          ...files.map((f) =>
            f.prd_create_time ? new Date(f.prd_create_time).getTime() : 0,
          ),
        ),
      )
    : null;
  const lastUploadLabel = lastUpload
    ? lastUpload.toDateString() === new Date().toDateString()
      ? "Today"
      : lastUpload.toLocaleDateString()
    : "-";

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-full d-flex align-items-center justify-content-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-start-primary h-100">
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted mb-1">Total Files</h6>
                      <h4 className="mb-0 text-primary">{totalFiles}</h4>
                    </div>
                    <div className="text-primary">
                      <i className="bi bi-files fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-start-success h-100">
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted mb-1">Total Size</h6>
                      <h4 className="mb-0 text-success">
                        {totalSizeFormatted}
                      </h4>
                    </div>
                    <div className="text-success">
                      <i className="bi bi-hdd fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-start-info h-100">
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted mb-1">Categories</h6>
                      <h4 className="mb-0 text-info">{totalCategories}</h4>
                    </div>
                    <div className="text-info">
                      <i className="bi bi-tags fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-start-warning h-100">
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted mb-1">Last Upload</h6>
                      <h4 className="mb-0 text-warning">{lastUploadLabel}</h4>
                    </div>
                    <div className="text-warning">
                      <i className="bi bi-clock fs-2"></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Files List */}
          <Card>
            <CardBody>
              <FileList files={files} actions={false} />
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
