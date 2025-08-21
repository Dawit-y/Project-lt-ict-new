const data = [
  {
    link_name: "project",
    link_icon: "fa fa-home",
    link_url: "Project",
    parent_menu: "project",
  },
  {
    link_name: "project_payment",
    link_icon: "fa fa-home",
    link_url: "project_payment",
    parent_menu: "project",
  },
  {
    link_name: "project_contractor",
    link_icon: "fa fa-home",
    link_url: "project_contractor",
    parent_menu: "project",
  },
  {
    link_name: "project_stakeholder",
    link_icon: "fa fa-home",
    link_url: "project_stakeholder",
    parent_menu: "project",
  },
  {
    link_name: "budget_year",
    link_icon: "fa fa-edit",
    link_url: "budget_year",
    parent_menu: "lookup",
  },
  {
    link_name: "projects-status",
    link_icon: "fa fa-arrow-right",
    link_url: "projects-status",
    parent_menu: "lookup",
  },
  {
    link_name: "department",
    link_icon: "fa fa-bed",
    link_url: "department",
    parent_menu: "lookup",
  },
  {
    link_name: "budget_source",
    link_icon: "fa fa-print",
    link_url: "budget_source",
    parent_menu: "lookup",
  },
];

// Group data by `parent_menu`
const groupedData = data.reduce((acc, curr) => {
  const { parent_menu, link_name, link_url, link_icon } = curr;
  if (!acc[parent_menu]) {
    acc[parent_menu] = {
      title: parent_menu.charAt(0).toUpperCase() + parent_menu.slice(1),
      icon: link_icon,
      submenu: [],
    };
  }
  acc[parent_menu].submenu.push({
    //   name: link_name.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase()),
    name: link_name.replace(/-/g, " "),
    path: `/${link_url}`,
  });
  return acc;
}, {});

// Convert object to array format for `sidedata`
const sidedata = Object.values(groupedData);

export default sidedata;
