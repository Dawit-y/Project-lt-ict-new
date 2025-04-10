import React, { useMemo, useState } from 'react'
import TreeTableContainer from '../../components/Common/TreeTableContainer'
import { FaChevronRight, FaChevronDown, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import { Button, Card, CardBody, UncontrolledTooltip } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  useFetchAddressStructures,
} from "../../queries/address_structure_query";
import FormModal from './FormModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import Spinners from "../../components/Common/Spinner"

const AddressStructure = () => {
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;
  const { data, isLoading, isError, error, refetch } = useFetchAddressStructures(userId);
  const [selectedRow, setSelectedRow] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [formModal, setFormModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "add" or "edit"

  const toggleFormModal = (action = null) => {
    setModalAction(action);
    setFormModal(prev => !prev);
  };
  const toggleDeleteModal = () => setDeleteModal(!deleteModal)

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => <>Name</>,
        cell: ({ row, getValue }) => {
          const hasChildren = row.getCanExpand();
          const depth = row.depth;
          const indent = `${depth * 3}rem`;
          const shouldAddOffset = !hasChildren && depth !== 2;

          return (
            <div style={{ paddingLeft: indent }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {hasChildren ? (
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
                ) : shouldAddOffset ? (
                  <span style={{ display: 'inline-block', width: '1.5rem', marginRight: '0.5rem' }} />
                ) : null}
                {getValue()}
              </div>
            </div>
          );
        },
        footer: props => props.column.id,
      },
      {
        accessorKey: 'add_name_am',
        header: () => <>Name (Amharic)</>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'add_name_en',
        header: () => <>Name (English)</>,
        footer: props => props.column.id,
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
      },
      {
        id: 'actions',
        header: "Actions",
        cell: props =>
          <RowActions
            row={props.row}
            toggleForm={toggleFormModal}
            toggleDelete={toggleDeleteModal}
            setSelectedRow={setSelectedRow}
          />,
      }
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
                data={data}
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
