import React, { useMemo, useState, useEffect } from 'react'
import TreeTableContainer from '../../components/Common/TreeTableContainer'
import { FaChevronRight, FaChevronDown, FaPen, FaPlus, FaTrash, FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { Button, Card, CardBody, UncontrolledTooltip } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  useFetchAddressStructures,
} from "../../queries/address_structure_query";
import FormModal from './FormModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import Spinners from "../../components/Common/Spinner"
import { useSortable } from '@dnd-kit/sortable'

const AddressStructure = () => {
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const { data, isLoading, isError, error, refetch } = useFetchAddressStructures(userId);

  const [treeData, setTreeData] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [formModal, setFormModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "add" or "edit"

  useEffect(() => {
    setTreeData(data)
  }, [])

  useEffect(() => {
    setTreeData(data)
  }, [data])

  const toggleFormModal = (action = null) => {
    setModalAction(action);
    setFormModal(prev => !prev);
  };
  const toggleDeleteModal = () => setDeleteModal(!deleteModal)

  const columns = React.useMemo(
    () => [
      {
        id: 'drag-handle',
        header: 'Move',
        cell: ({ row }) =>
          String(row.original?.level).trim().toLowerCase() === "woreda" ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <RowDragHandleCell rowId={row.id} />
            </div>
          ) : (
            ""
          ),
        size: 40,
        maxSize: 40
      },
      {
        accessorKey: 'name',
        header: "Name",
        cell: ({ row, getValue }) => {
          const hasChildren = row.getCanExpand();
          const depth = row.depth;
          const indent = `${depth * 3}rem`;
          const shouldAddOffset = !hasChildren && depth !== 2;

          return (
            <div style={{ paddingLeft: indent }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {hasChildren ? (
                  <ExpandButton row={row} />
                ) : shouldAddOffset ? (
                  <span style={{ display: 'inline-block', width: '1.5rem', marginRight: '0.5rem' }} />
                ) : null}
                {getValue()}
              </div>
            </div>
          );
        },
        footer: props => props.column.id,
        size: 400,
      },
      {
        accessorKey: 'add_name_am',
        header: "Name (Amharic)",
        footer: props => props.column.id,
        size: 200,
      },
      {
        accessorKey: 'add_name_en',
        header: "Name (English)",
        footer: props => props.column.id,
        size: 200,
      },
      {
        accessorKey: "level",
        header: () => <>Level</>,
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
        },
        footer: props => props.column.id,
        enableColumnFilter: false,
        size: 200,
      },
      {
        id: 'actions',
        header: "Actions",
        size: 120, // or use 'width: 120' depending on the table library
        cell: props => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <RowActions
              row={props.row}
              toggleForm={toggleFormModal}
              toggleDelete={toggleDeleteModal}
              setSelectedRow={setSelectedRow}
            />
          </div>
        ),
      },

    ],
    []
  );

  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  return (
    <>
      <FormModal
        show={formModal}
        toggle={() => toggleFormModal(null)}
        action={modalAction}
        selectedRow={selectedRow}
        data={data}
        deleteModal={deleteModal}
        toggleDelete={toggleDeleteModal}
      />

      <div className='page-content'>
        <div className='container-fluid'>
          <Breadcrumbs />
          {isLoading ? <Spinners /> :
            <Card >
              <TreeTableContainer
                data={treeData || []}
                setData={setTreeData}
                columns={columns}
              />
            </Card>
          }
        </div>
      </div>
    </>
  )
}

export default AddressStructure

function RowActions({ row, toggleForm, toggleDelete, setSelectedRow }) {
  return (
    <div className="d-flex gap-1">
      {row.original.level !== "woreda" &&
        <Button
          onClick={() => {
            setSelectedRow(row.original)
            toggleForm("add")
          }}
          className='text-primary'
          style={{
            background: 'none',
            border: 'none',
            padding: 2,
            marginRight: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <FaPlus id='addtooltip' />
          <UncontrolledTooltip placement="top" target="addtooltip">
            Add
          </UncontrolledTooltip>
        </Button>
      }

      <Button
        onClick={() => {
          setSelectedRow(row.original)
          toggleForm("edit")
        }}
        className='text-success'
        style={{
          background: 'none',
          border: 'none',
          padding: 2,
          marginRight: '0.5rem',
          cursor: 'pointer',
        }}
      >
        <FaPen id='edittooltip' />
        <UncontrolledTooltip placement="top" target="edittooltip">
          Edit
        </UncontrolledTooltip>
      </Button>

      <Button
        onClick={() => {
          setSelectedRow(row.original)
          toggleDelete()
        }}
        className='text-danger'
        style={{
          background: 'none',
          border: 'none',
          padding: 2,
          marginRight: '0.5rem',
          cursor: 'pointer',
        }}
      >
        <FaTrash id='deletetooltip' />
        <UncontrolledTooltip placement="top" target="deletetooltip">
          Delete
        </UncontrolledTooltip>
      </Button>
    </div>
  )
}


// Cell Component
const RowDragHandleCell = ({ rowId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: rowId,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      style={{
        background: 'none',
        border: 'none',
        padding: 2,
        marginRight: '0.5rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      <FaArrowsUpDownLeftRight />
    </button>
  );
};

const ExpandButton = ({ row }) => {
  return (
    <Button
      onClick={row.getToggleExpandedHandler()}
      className='text-secondary'
      style={{
        background: 'none',
        border: 'none',
        padding: 2,
        marginRight: '0.5rem',
        cursor: 'pointer',
      }}
    >
      {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
    </Button>
  );
};