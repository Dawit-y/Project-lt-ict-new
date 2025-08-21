import { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  InputGroup,
  Input,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { useFetchConversationInformations } from "../../../../queries/conversationinformation_query";
import { PAGE_ID } from "../../../../constants/constantFile";
import FetchErrorHandler from "../../../../components/Common/FetchErrorHandler";

export default function TextNotes({ requestData, isActive }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const param = {
    cvi_object_type_id: PAGE_ID.PROJ_BUDGET_REQUEST,
    cvi_object_id: requestData?.bdr_id,
  };
  const { data, isFetching, isLoading, isError, error, refetch } =
    useFetchConversationInformations(param, isActive);

  const textNotes = data?.data || [];

  const filteredNotes = textNotes.filter(
    (note) =>
      note.cvi_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.cvi_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.created_by.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openNoteModal = (note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const closeNoteModal = () => {
    setSelectedNote(null);
    setModalOpen(false);
  };

  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-full d-flex align-items-center justify-content-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroupText>
                  <i className="bi bi-search"></i>
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Search notes by subject, content, attacher, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Notes List */}
          <Row>
            {filteredNotes.map((note) => (
              <Col md={12} key={note.cvi_id} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <CardHeader className="bg-light">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h6 className="mb-0 fw-bold">{note.cvi_title}</h6>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <p className="text-muted mb-3">
                      {note.cvi_description.length > 150
                        ? `${note.cvi_description.substring(0, 150)}...`
                        : note.cvi_description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          <i className="bi bi-person me-1"></i>
                          {note.created_by}
                        </small>
                        <small className="text-muted ms-3">
                          <i className="bi bi-clock me-1"></i>
                          {note.cvi_create_time}
                        </small>
                      </div>
                      <Button
                        color="primary"
                        size="sm"
                        outline
                        onClick={() => openNoteModal(note)}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Full Note
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-journal-x fs-1 text-muted"></i>
          <p className="text-muted mt-2">
            No notes found matching your search.
          </p>
        </div>
      )}

      {/* Note Detail Modal */}
      <Modal isOpen={modalOpen} toggle={closeNoteModal} size="lg">
        <ModalHeader toggle={closeNoteModal}>
          {selectedNote?.cvi_title}
        </ModalHeader>
        <ModalBody>
          {selectedNote && (
            <div>
              <div className="mb-3">
                <small className="text-muted">
                  <i className="bi bi-person me-1"></i>
                  Attached by: <strong>{selectedNote.created_by}</strong>
                </small>
                <small className="text-muted ms-3">
                  <i className="bi bi-clock me-1"></i>
                  Date: <strong>{selectedNote.cvi_create_time}</strong>
                </small>
              </div>
              <hr />
              <div className="mt-3">
                <h6>Content:</h6>
                <p className="text-justify">{selectedNote.cvi_description}</p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeNoteModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
