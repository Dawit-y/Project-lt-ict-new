import React, { useMemo, useState, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Badge,
  Card,
  CardBody,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
const TableContainer = lazy(() => import("../../components/Common/TableContainer"));
const BudgetRequestRegistration = lazy(() => import("../Csobudgetrequest/BudgetRequestRegistration"));

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};


const ProjectTabs = ({ projects, handleAddClick, handleEditClick }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null); // New state for selected project status
  const { t } = useTranslation();

  const toggleTab = useCallback((tab) => {
    if (activeTab !== tab) {
      setPassedSteps((prevSteps) => [...prevSteps, tab]);
      if (tab >= 1 && tab <= 4) {
        setActiveTab(tab);
      }
    }
  }, [activeTab]);

  const isNextButtonDisabled = useCallback(() => {
    return activeTab === 1 && !selectedProject;
  }, [activeTab, selectedProject]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: t("Select"),
        accessorKey: "Select",
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span>
            <input
              type="radio"
              name="selectedRow"
              checked={selectedProject === row.original.pri_id}
              onChange={() => {
                setSelectedProject(row.original.pri_id);
                // setSelectedProjectStatus(5); // Set selected project status
              }}
            />
          </span>
        ),
      },
      {
        header: '',
        accessorKey: 'pri_name_or',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_name_or, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'pri_name_am',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_name_am, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'pri_name_en',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_name_en, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'pri_program_code',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_program_code, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: t("view_details"),
        accessorKey: "view_details",
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => {
          if (row.original.footer) return "";
          const { pri_id } = row.original || {};
          return (
            <Link to={`/projectdetail_cso/${pri_id}`} target="_blank">
              <Button type="button" className="btn-sm mb-1 default" outline>
                <i className="fa fa-eye"></i>
              </Button>
            </Link>
          );
        },
      }
    ];
    if (
      projects?.previledge?.is_role_editable == 1 ||
      projects?.previledge?.is_role_deletable == 1
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable == 1 && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleEditClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
              {/* {cellProps.row.original.is_deletable == 9 && (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => {
                    const data = cellProps.row.original;
                    onClickDelete(data);
                  }}
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </Link>
              )} */}
            </div>
          );
        },
      });
    }
    return baseColumns;
  }, [projects, t, selectedProject]);


  return (
    <Col lg="12">
      <Card>
        <CardBody>
          <div className="wizard clearfix">
            <div className="actions clearfix">
              <ul>
                <li>
                  <Button
                    color="primary"
                    onClick={() => toggleTab(activeTab - 1)}
                    disabled={activeTab === 1}
                  >
                    Previous
                  </Button>
                </li>
                <li>
                  {activeTab === 2 ? (
                    <Button type="submit" color="primary" disabled>
                      Next
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() => toggleTab(activeTab + 1)}
                      disabled={isNextButtonDisabled()}
                    >
                      Next
                    </Button>
                  )}
                </li>
              </ul>
            </div>
            <div className="steps clearfix">
              <ul>
                <NavItem className={classnames({ current: activeTab === 1 })}>
                  <NavLink
                    className={classnames({ current: activeTab === 1 })}
                    onClick={() => setActiveTab(1)}
                    disabled={!passedSteps.includes(1)}
                  >
                    <span className="number">1.</span> Programs
                  </NavLink>
                </NavItem>
                <NavItem className={classnames({ current: activeTab === 2 })}>
                  <NavLink
                    className={classnames({ active: activeTab === 2 })}
                    onClick={() => setActiveTab(2)}
                    disabled={!passedSteps.includes(2)}
                  >
                    <span className="number">2.</span> Proposal Request
                  </NavLink>
                </NavItem>
              </ul>
            </div>
            <div className="content clearfix">
              <TabContent activeTab={activeTab} className="body">
                <TabPane tabId={1}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <TableContainer
                      columns={columns}
                      data={projects?.data || []}
                      isAddButton={projects?.previledge?.is_role_can_add === 1}
                      isCustomPageSize
                      handleUserClick={handleAddClick}
                      isPagination
                      isGlobalFilter
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={`${t("add")} ${t("project")}`}
                      tableClass="table-sm align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      excludeKey={["is_editable", "is_deletable", "Select"]}
                      tableName="Program Data"
                      isExcelExport
                      isPdfExport
                    />
                  </Suspense>
                </TabPane>
                <TabPane tabId={2}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <BudgetRequestRegistration
                      projectStatus={5}
                      projectId={selectedProject}
                      isActive={activeTab === 2} />
                  </Suspense>
                </TabPane>
              </TabContent>
            </div>

          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default ProjectTabs;