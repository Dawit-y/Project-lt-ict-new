import React, { useMemo, useState, useEffect } from "react";
import TreeTableContainer from "./TreeTable";
import {
  FaChevronRight,
  FaChevronDown,
  FaPen,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Button, Card, Spinner, UncontrolledTooltip } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useFetchProgramTree } from "../../queries/programinfo_query";
import FormModal from "./FormModal";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import Spinners from "../../components/Common/Spinner";

const transformData = (data) => {
  return data.map((item) => {
    return {
      ...item,
      p_id: item.sci_id,
      id: `sector-${item.sci_id}`,
      level: "sector",
      children: [],
    };
  });
};

const levelMap = {
  1: "program",
  2: "program",
  3: "sub_program",
  4: "output",
  5: "project",
};

const formatProgramRow = (program) => {
  const level = levelMap[program.pri_object_type_id] || "unknown";
  return {
    ...program,
    p_id: program.id,
    id: `${level}-${program.id}`,
    name: program.name,
    sci_name_or: program.pri_name_or,
    sci_name_am: program.pri_name_am,
    sci_name_en: program.name,
    level,
    children: (program.children || [])
      .filter((child) => child.pri_object_type_id !== 5)
      .map((child) => formatProgramRow(child)),
  };
};

const updateNodeChildren = (treeData, parentId, level, newChildren) => {
  if (!newChildren) return treeData;
  return treeData.map((row) => {
    if (row.id === parentId && row.level === level) {
      const existingChildrenMap = new Map(
        row.children.map((child) => [child.id, child]),
      );
      const newChildrenIds = new Set(newChildren.map((child) => child.id));
      const updatedChildren = newChildren.map((newChild) => {
        if (existingChildrenMap.has(newChild.id)) {
          return {
            ...existingChildrenMap.get(newChild.id),
            ...newChild,
          };
        }
        return newChild;
      });
      for (const [id, child] of existingChildrenMap) {
        if (!newChildrenIds.has(id)) {
          continue;
        }
        if (!newChildren.some((newChild) => newChild.id === id)) {
          updatedChildren.push(child);
        }
      }

      return {
        ...row,
        children: updatedChildren,
      };
    }

    if (row.children) {
      row.children = updateNodeChildren(
        row.children,
        parentId,
        level,
        newChildren,
      );
    }

    return row;
  });
};

const Programs = () => {
  document.title = "Programs";
  const [treeData, setTreeData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "add" or "edit"

  const [programParams, setProgramParams] = useState({});
  const [activeSectorId, setActiveSectorId] = useState(null);

  const toggleFormModal = (action = null) => {
    setModalAction(action);
    setFormModal((prev) => !prev);
  };
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const { data, isLoading, isError, error, refetch } =
    useFetchSectorInformations({}, true);

  const isValidParam =
    Object.keys(programParams).length > 0 &&
    Object.values(programParams).every(
      (value) => value !== null && value !== undefined,
    );
  const {
    data: programs,
    isLoading: isProgramLoading,
    isFetching,
    refetch: refetchPrograms,
  } = useFetchProgramTree(programParams, isValidParam);

  // handleSectorClick
  const handleSectorClick = (row) => {
    const { sci_id, id, level } = row.original;
    setSelectedRow(row.original);
    setActiveSectorId(sci_id);
    setProgramParams({ pri_sector_id: sci_id });
    row.toggleExpanded();
  };

  useEffect(() => {
    if (data?.data) {
      const newData = transformData(data.data);
      setTreeData(newData);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: programData } = await refetchPrograms();
        const formattedPrograms = programData?.data?.map((p) =>
          formatProgramRow(p),
        );
        const updatedTreeData = updateNodeChildren(
          treeData,
          selectedRow?.id,
          selectedRow?.level,
          formattedPrograms,
        );
        setTreeData(updatedTreeData);
      } catch (error) {
        console.error("Error during sector refetch:", error);
      }
    };

    if (isValidParam) {
      fetchData();
    }
  }, [programParams]);

  useEffect(() => {
    if (!programs?.data || !activeSectorId) {
      return;
    }
    const formatted = programs.data.map(formatProgramRow);
    setTreeData((prev) =>
      updateNodeChildren(prev, `sector-${activeSectorId}`, "sector", formatted),
    );
  }, [programs?.data, activeSectorId]);

  const columns = React.useMemo(
		() => [
			{
				accessorKey: "sci_name_or",
				header: "Name",
				cell: ({ row, getValue }) => {
					const hasChildren = row.original.level !== "output";
					const depth = row.depth;
					const indent = `${depth * 3}rem`;
					const shouldAddOffset = !hasChildren && depth !== 3;
					const showSpinner =
						(isProgramLoading || isFetching) &&
						row.id === selectedRow?.id &&
						row.getIsExpanded();

					const handleClick = () => {
						if (row.original.level === "sector") {
							handleSectorClick(row);
						} else {
							row.toggleExpanded();
						}
					};

					return (
						<div style={{ paddingLeft: indent }}>
							<div style={{ display: "flex", alignItems: "center" }}>
								{hasChildren ? (
									<Button
										onClick={handleClick}
										className="text-secondary"
										style={{
											background: "none",
											border: "none",
											padding: 2,
											marginRight: "0.5rem",
											cursor: "pointer",
										}}
										disabled={showSpinner}
									>
										{showSpinner ? (
											<Spinner size={"sm"} />
										) : row.getIsExpanded() ? (
											<FaChevronDown />
										) : (
											<FaChevronRight />
										)}
									</Button>
								) : shouldAddOffset ? (
									<span
										style={{
											display: "inline-block",
											width: "1.5rem",
											marginRight: "0.5rem",
										}}
									/>
								) : null}
								{getValue()}
							</div>
						</div>
					);
				},
				footer: (props) => props.column.id,
				size: 400,
			},
			{
				accessorKey: "sci_name_am",
				header: "Name (Amharic)",
				footer: (props) => props.column.id,
				size: 200,
			},
			{
				accessorKey: "sci_name_en",
				header: "Name (English)",
				footer: (props) => props.column.id,
				size: 200,
			},
			{
				accessorKey: "pri_program_code",
				header: "Code",
				footer: (props) => props.column.id,
				size: 200,
				enableColumnFilter: false,
			},
			{
				accessorKey: "level",
				header: () => <>Level</>,
				cell: ({ getValue }) => {
					const value = getValue();
					if (value === "sub_program") return "Sub Program";
					return value
						? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
						: "";
				},
				footer: (props) => props.column.id,
				enableColumnFilter: false,
				size: 200,
			},
			{
				id: "actions",
				header: "Actions",
				size: 120,
				cell: (props) => (
					<div
						style={{
							display: "flex",
							justifyContent: "start",
							alignItems: "center",
							height: "100%",
						}}
					>
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
		[handleSectorClick, isFetching, selectedRow?.id, isProgramLoading]
	);

  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  return (
    <>
      <FormModal
        show={formModal}
        toggle={() => toggleFormModal(null)}
        action={modalAction}
        selectedRow={selectedRow}
        data={treeData}
        deleteModal={deleteModal}
        toggleDelete={toggleDeleteModal}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs />
          {isLoading ? (
            <Spinners />
          ) : (
            <Card>
              <TreeTableContainer
                data={treeData || []}
                setData={setTreeData}
                columns={columns}
              />
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Programs;

function RowActions({ row, toggleForm, toggleDelete, setSelectedRow }) {
  const safeId = `action-${row.id}`;

  return (
		<div className="d-flex align-items-center justify-content-start gap-1">
			{row.original.level !== "output" && (
				<>
					<Button
						id={`${safeId}-add`}
						onClick={() => {
							setSelectedRow(row.original);
							toggleForm("add");
						}}
						className="text-primary"
						style={{
							background: "none",
							border: "none",
							padding: 2,
							marginRight: "0.5rem",
							cursor: "pointer",
						}}
					>
						<FaPlus />
					</Button>
					<UncontrolledTooltip placement="top" target={`${safeId}-add`}>
						Add
					</UncontrolledTooltip>
				</>
			)}

			{row.original.level !== "sector" && (
				<>
					<Button
						id={`${safeId}-edit`}
						onClick={() => {
							setSelectedRow(row.original);
							toggleForm("edit");
						}}
						className="text-success"
						style={{
							background: "none",
							border: "none",
							padding: 2,
							marginRight: "0.5rem",
							cursor: "pointer",
						}}
					>
						<FaPen />
					</Button>
					<UncontrolledTooltip placement="top" target={`${safeId}-edit`}>
						Edit
					</UncontrolledTooltip>
				</>
			)}
			{/* 
			{row.original.level !== "sector" && (
				<>
					<Button
						id={`${safeId}-delete`}
						onClick={() => {
							setSelectedRow(row.original);
							toggleDelete();
						}}
						className="text-danger"
						style={{
							background: "none",
							border: "none",
							padding: 2,
							marginRight: "0.5rem",
							cursor: "pointer",
						}}
					>
						<FaTrash />
					</Button>
					<UncontrolledTooltip placement="top" target={`${safeId}-delete`}>
						Delete
					</UncontrolledTooltip>
				</>
			)} */}
		</div>
	);
}
