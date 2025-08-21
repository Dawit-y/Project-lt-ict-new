import React, { useState, memo, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Spinner,
} from "reactstrap";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useUpdateAddressStructures } from "../../queries/address_structure_query";
import { toast } from "react-toastify";
import { FaArrowsAlt } from "react-icons/fa";

const TreeTableContainer = ({ data, columns, setData, refetch }) => {
  const [expanded, setExpanded] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [dragInfo, setDragInfo] = useState(null);
  const updateFolder = useUpdateAddressStructures();

  const table = useReactTable({
    data,
    defaultColumn: {
      minSize: 100,
      maxSize: 800,
    },
    columns,
    state: {
      expanded,
    },
    columnResizeMode: "onChange",
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    filterFromLeafRows: true,
  });

  const [activeId, setActiveId] = useState(null);
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const draggedWoreda = findNodeById(data, active.id);
    const overNode = findNodeById(data, over.id);

    if (!draggedWoreda || !overNode) return;

    const currentZone = findParentZone(data, draggedWoreda.id);
    const targetZone =
      overNode.level === "zone" ? overNode : findParentZone(data, overNode.id);

    if (!targetZone || !currentZone) return;

    if (currentZone.id === targetZone.id) return;

    setDragInfo({
      woreda: draggedWoreda,
      oldZone: currentZone,
      newZone: targetZone,
    });
    setConfirmModal(true);
  };
  const handleUpdateFolder = async (values) => {
    try {
      const response = await updateFolder.mutateAsync(values);
      toast.success(t("Data updated successfully"), { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error(t("Failed to update data"), { autoClose: 3000 });
      throw error; // Re-throw to allow handling in confirmMove
    }
  };

  const confirmMove = async () => {
    if (!dragInfo) return;

    try {
      // Optimistic update
      setData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));

        // Remove from old parent
        const oldZone = findNodeById(newData, dragInfo.oldZone.id);
        if (oldZone) {
          oldZone.children = oldZone.children.filter(
            (child) => child.id !== dragInfo.woreda.id,
          );
        }

        // Add to new parent
        const newZone = findNodeById(newData, dragInfo.newZone.id);
        if (newZone) {
          newZone.children = [...(newZone.children || []), dragInfo.woreda];
        }

        return newData;
      });

      // Perform the actual update
      await handleUpdateFolder({
        id: dragInfo.woreda.id,
        rootId: dragInfo.newZone.id,
      });

      // Refetch to ensure data consistency
      await refetch();
    } catch (error) {
      // If there's an error, refetch to revert optimistic update
      await refetch();
    } finally {
      setConfirmModal(false);
      setDragInfo(null);
    }
  };

  const handleCancel = () => {
    setConfirmModal(false);
    setDragInfo(null);
  };

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        sensors={useSensors(
          useSensor(MouseSensor),
          useSensor(TouchSensor),
          useSensor(KeyboardSensor),
        )}
      >
        <div
          className="table-responsive"
          style={{ maxHeight: "80vh", overflow: "auto", minHeight: "400px" }}
        >
          <Table
            hover
            bordered
            size="sm"
            style={{
              ...columnSizeVars,
              width: "100%",
            }}
          >
            <thead
              className="sticky-top table-light p-3"
              style={{
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 2,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        position: "relative",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanFilter() && (
                            <div className="mt-1">
                              <Filter column={header.column} table={table} />
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`,
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <MemoizedDraggableRow
                  key={row.id}
                  row={row}
                  isDraggable={row.original.level === "woreda"}
                  isDroppable={row.original.level === "zone"}
                />
              ))}
            </tbody>
          </Table>
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="d-flex align-items-center gap-3 p-2 bg-white border rounded shadow-sm min-w-250">
              <div className="text-muted fs-5">
                <FaArrowsAlt />
              </div>
              <div>
                <strong className="text-dark me-2">
                  {findNodeById(data, activeId)?.name || "Dragging..."}
                </strong>
                <span className="text-secondary small me-2">
                  Level: {findNodeById(data, activeId)?.level || "N/A"}
                </span>
                {findNodeById(data, activeId)?.zone && (
                  <span className="text-muted small">
                    Zone: {findNodeById(data, activeId)?.zone}
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Confirmation Modal */}
      <Modal Modal isOpen={confirmModal} toggle={handleCancel}>
        <ModalHeader>Confirm Zone Change</ModalHeader>
        <ModalBody>
          {dragInfo && (
            <>
              <p>
                Are you sure you want to move{" "}
                <strong>{dragInfo.woreda.name}</strong> from{" "}
                <strong>{dragInfo.oldZone.name}</strong> to{" "}
                <strong>{dragInfo.newZone.name}</strong>?
              </p>
              <p>This will change the administrative relationship.</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={confirmMove}>
            {updateFolder.isPending ? (
              <Spinner size={"sm"} className="me-2" />
            ) : (
              ""
            )}
            Confirm Move
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TreeTableContainer;

// Helper functions
function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentZone(nodes, childId) {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((child) => child.id === childId)) {
        return node;
      }
      const found = findParentZone(node.children, childId);
      if (found) return found;
    }
  }
  return null;
}

const DraggableRow = ({ row, isDraggable, isDroppable }) => {
  const sortable = useSortable({
    id: row.id,
    disabled: !isDraggable,
  });

  const { setNodeRef, transform, transition, isDragging } = sortable;

  const droppable = useDroppable({
    id: row.id,
    disabled: !isDroppable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    backgroundColor: isDragging
      ? "#f8f9fa"
      : droppable.isOver
        ? "#e2f0ff"
        : "inherit",
  };

  return (
    <tr
      ref={(node) => {
        if (isDroppable && droppable.setNodeRef) droppable.setNodeRef(node);
        if (isDraggable && setNodeRef) setNodeRef(node);
      }}
      style={style}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{
            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.isDraggable === nextProps.isDraggable &&
    prevProps.isDroppable === nextProps.isDroppable &&
    prevProps.row.original === nextProps.row.original &&
    prevProps.row.getIsExpanded() === nextProps.row.getIsExpanded() &&
    prevProps.row.getToggleExpandedHandler() ===
      nextProps.row.getToggleExpandedHandler()
  );
};

export const MemoizedDraggableRow = memo(DraggableRow, areEqual);

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return (
    <input
      type="text"
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="form-control form-control-sm"
    />
  );
}
