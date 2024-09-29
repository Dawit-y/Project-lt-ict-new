// import PropTypes from "prop-types";
// import React, { useEffect, useRef } from "react";

// // //Import Scrollbar
// import SimpleBar from "simplebar-react";

// // MetisMenu
// import MetisMenu from "metismenujs";
// import { Link, useLocation } from "react-router-dom";
// import withRouter from "../Common/withRouter";

// //i18n
// import { withTranslation } from "react-i18next";
// import { useCallback } from "react";

// const SidebarContent = (props) => {
//   const ref = useRef();
//   const path = useLocation();

//   const activateParentDropdown = useCallback((item) => {
//     item.classList.add("active");
//     const parent = item.parentElement;
//     const parent2El = parent.childNodes[1];
//     if (parent2El && parent2El.id !== "side-menu") {
//       parent2El.classList.add("mm-show");
//     }

//     if (parent) {
//       parent.classList.add("mm-active");
//       const parent2 = parent.parentElement;

//       if (parent2) {
//         parent2.classList.add("mm-show"); // ul tag

//         const parent3 = parent2.parentElement; // li tag

//         if (parent3) {
//           parent3.classList.add("mm-active"); // li
//           parent3.childNodes[0].classList.add("mm-active"); //a
//           const parent4 = parent3.parentElement; // ul
//           if (parent4) {
//             parent4.classList.add("mm-show"); // ul
//             const parent5 = parent4.parentElement;
//             if (parent5) {
//               parent5.classList.add("mm-show"); // li
//               parent5.childNodes[0].classList.add("mm-active"); // a tag
//             }
//           }
//         }
//       }
//       scrollElement(item);
//       return false;
//     }
//     scrollElement(item);
//     return false;
//   }, []);

//   const removeActivation = (items) => {
//     for (var i = 0; i < items.length; ++i) {
//       var item = items[i];
//       const parent = items[i].parentElement;

//       if (item && item.classList.contains("active")) {
//         item.classList.remove("active");
//       }
//       if (parent) {
//         const parent2El =
//           parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
//             ? parent.childNodes[1]
//             : null;
//         if (parent2El && parent2El.id !== "side-menu") {
//           parent2El.classList.remove("mm-show");
//         }

//         parent.classList.remove("mm-active");
//         const parent2 = parent.parentElement;

//         if (parent2) {
//           parent2.classList.remove("mm-show");

//           const parent3 = parent2.parentElement;
//           if (parent3) {
//             parent3.classList.remove("mm-active"); // li
//             parent3.childNodes[0].classList.remove("mm-active");

//             const parent4 = parent3.parentElement; // ul
//             if (parent4) {
//               parent4.classList.remove("mm-show"); // ul
//               const parent5 = parent4.parentElement;
//               if (parent5) {
//                 parent5.classList.remove("mm-show"); // li
//                 parent5.childNodes[0].classList.remove("mm-active"); // a tag
//               }
//             }
//           }
//         }
//       }
//     }
//   };

//   const activeMenu = useCallback(() => {
//     const pathName = path.pathname;
//     let matchingMenuItem = null;
//     const ul = document.getElementById("side-menu");
//     const items = ul.getElementsByTagName("a");
//     removeActivation(items);

//     for (let i = 0; i < items.length; ++i) {
//       if (pathName === items[i].pathname) {
//         matchingMenuItem = items[i];
//         break;
//       }
//     }
//     if (matchingMenuItem) {
//       activateParentDropdown(matchingMenuItem);
//     }
//   }, [path.pathname, activateParentDropdown]);

//   useEffect(() => {
//     ref.current.recalculate();
//   }, []);

//   useEffect(() => {
//     new MetisMenu("#side-menu");
//     activeMenu();
//   }, []);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     activeMenu();
//   }, [activeMenu]);

//   function scrollElement(item) {
//     if (item) {
//       const currentPosition = item.offsetTop;
//       if (currentPosition > window.innerHeight) {
//         ref.current.getScrollElement().scrollTop = currentPosition - 300;
//       }
//     }
//   }

//   return (
//     <React.Fragment>
//       <SimpleBar className="h-100" ref={ref}>
//         <div id="sidebar-menu">
//           <ul className="metismenu list-unstyled" id="side-menu">
//             <li className="menu-title">{props.t("Menu")} </li>
//             {/* dashboards */}
           
//             <li>
//               <Link to="/#" className="has-arrow">
//                 <i className="bx bx-home-circle"></i>
//                 <span>{props.t("Dashboards")}</span>
//               </Link>
//               <ul className="sub-menu" aria-expanded="false">
//                 <li>
//                   <Link to="/dashboard">{props.t("Default")}</Link>
//                 </li>
//                 <li>
//                   <Link to="/dashboard-saas">{props.t("Saas")}</Link>
//                 </li>
//                 <li>
//                   <Link to="/dashboard-crypto">{props.t("Crypto")}</Link>
//                 </li>
//                 <li>
//                   <Link to="/blog">{props.t("Blog")}</Link>
//                 </li>
//                 <li>
//                   <Link to="/dashboard-job">{props.t("Job")}</Link>
//                 </li>
//               </ul>
//             </li>
//             <li className="menu-title">{props.t("Apps")}</li>

//            {/* Projects */}
//             <li>
//               <Link to="/#" className="has-arrow">
//                 <i className="bx bx-store"></i>
//                 <span>{props.t("Projects")}</span>
//               </Link>
//               <ul className="sub-menu" aria-expanded="false">
//                 <li>
//                     <Link to="/Project">{props.t("Project")}</Link>
//                 </li>
               
//                 <li>
//                   <Link to="/projects-status">
//                     {props.t("Projects Status")}
//                   </Link>
//                 </li>
//                 {/* Poject Payment */}
//                 <li>
//                   <Link to="/project_payment">
//                     {props.t("Poject Payment")}
//                   </Link>
//                 </li>
//                 {/* Project Document */}
//                 <li>
//                   <Link to="/project_document">
//                     {props.t("project_document")}
//                   </Link>
//                 </li>
               
              
//                 {/* Project Contractor*/}
//                 <li>
//                   <Link to="/project_contractor">{props.t("project_contractor")}</Link>
//                 </li>
//                 {/*Project Stakeholder  */} 
//                 <li>
//                   <Link to="/project_stakeholder">{props.t("project_stakeholder")}</Link>
//                 </li>

//                  {/* Budget Request */}
//                  <li>
//                   <Link to="/budget_request">{props.t("budget_request")}</Link>
//                 </li>
               
//               </ul>
//             </li>

//             <li>
//               <Link to="/#" className="has-arrow">
//                 <i className="bx bx-receipt"></i>
//                 <span>{props.t("address_structure")}</span>
//               </Link>
//               <ul className="sub-menu" aria-expanded="false">
              
//                 <li>
//                   <Link to="/address_structure">{props.t("address_structure")}</Link>
//                 </li>
                
//               </ul>
//             </li>

    
//              {/* LOOK UP */}
//              <li>
//               <Link to="/#" className="has-arrow">
//                 <i className="bx bx-receipt"></i>
//                 <span>{props.t("look_up")}</span>
//               </Link>
//               <ul className="sub-menu" aria-expanded="false">
              
//                 <li>
//                   <Link to="/department">{props.t("department")}</Link>
//                 </li>

//                  {/* Project Category */}
//                  <li>
//                   <Link to="/project_category">{props.t("project_category")}
//                   </Link>
//                 </li>

//                 <li>
//                   <Link to="/budget_source">{props.t("budget_source")}</Link>
//                 </li>
//                 {/* Document Type */}
//                 <li>
//                   <Link to="/document_type">{props.t("document_type")}</Link>
//                 </li>
               
//                 {/* Budget Year */}
//                 <li>
//                   <Link to="/budget_year">{props.t("budget_year")}</Link>
//                 </li>
//                 {/* Contractor Type */}
//                 <li>
//                   <Link to="/contractor_type">{props.t("contractor_type")}</Link>
//                 </li>
//                 {/* Contract Termination Reason */}
//                 <li>
//                   <Link to="/contract_termination_reason">{props.t("contract_termination_reason")}</Link>
//                 </li>
//                 {/* Sector Information  */}
//                 <li>
//                   <Link to="/Sector_information">{props.t("Sector_information ")}</Link>
//                 </li>
//                 {/* Stakeholder Type */}
//                 <li>
//                   <Link to="/stakeholder_type">{props.t("stakeholder_type ")}</Link>
//                 </li>
//                 {/* Sector Categor */}
//                 <li>
//                   <Link to="/sector_category">{props.t("sector_category ")}</Link>
//                 </li>
//               </ul>
//             </li>
            // {/* User  Admin*/}
            // <li>
            //   <Link to="/#" className="has-arrow">
            //     <i className="bx bx-receipt"></i>
            //     <span>{props.t("user_administration")}</span>
            //   </Link>
            //   <ul className="sub-menu" aria-expanded="false">
              
            //     <li>
            //       <Link to="/users">{props.t("users")}</Link>
            //     </li>
            //     <li>
            //       <Link to="/user_role">{props.t("user_role")}</Link>
            //     </li>
            //     <li>
            //       <Link to="/Roles">{props.t("Roles")}</Link>
            //     </li>
            //     <li>
            //       <Link to="/pages">{props.t("pages")}</Link>
            //     </li>
            //     <li>
            //       <Link to="/permission">{props.t("permission")}</Link>
            //     </li>
            //     <li>
            //       <Link to="/access_log">{props.t("access_log")}</Link>
            //     </li>
                
               
            //   </ul>
            // </li>

//           </ul>
//         </div>
//       </SimpleBar>
//     </React.Fragment>
//   );
// };

// SidebarContent.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

// export default withRouter(withTranslation()(SidebarContent));


import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();
  const metisMenuRef = useRef();

  const activateParentDropdown = useCallback((item) => {
    if (!item) return;

    item.classList.add("active");

    let parent = item.parentElement;
    while (parent && parent.id !== "side-menu") {
      if (parent.tagName === "LI") {
        parent.classList.add("mm-active");
        const subMenu = parent.querySelector("ul");
        if (subMenu) subMenu.classList.add("mm-show");
      }
      parent = parent.parentElement;
    }

    scrollElement(item);
  }, []);

  const removeActivation = () => {
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");

    Array.from(items).forEach((item) => {
      item.classList.remove("active");

      let parent = item.parentElement;
      while (parent && parent.id !== "side-menu") {
        if (parent.tagName === "LI") {
          parent.classList.remove("mm-active");
          const subMenu = parent.querySelector("ul");
          if (subMenu) subMenu.classList.remove("mm-show");
        }
        parent = parent.parentElement;
      }
    });
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");

    removeActivation();
    for (let item of items) {
      if (pathName === item.pathname) {
        activateParentDropdown(item);
        break;
      }
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    metisMenuRef.current = new MetisMenu("#side-menu", {
      // Optional: Customize MetisMenu behavior if needed
      toggle: true,  // This will handle the toggle functionality
      onShow: (element) => {
        // Close other open submenus
        const otherSubmenus = document.querySelectorAll("#side-menu .mm-show");
        otherSubmenus.forEach(submenu => {
          if (submenu !== element) {
            submenu.classList.remove("mm-show");
            submenu.parentElement.classList.remove("mm-active");
          }
        });
      }
    });
    activeMenu();
    return () => {
      metisMenuRef.current && metisMenuRef.current.dispose();
    };
  }, [activeMenu]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  const scrollElement = (item) => {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  };

  const renderMenu = (menuData) => {
    
    return menuData.map((menu, index) => (
      <li key={index}>
        <Link to="/#" className="has-arrow">
          <i className={menu.icon}></i>
          <span>{props.t(menu.title)}</span>
        </Link>
        {menu.submenu && (
          <ul className="sub-menu" aria-expanded="false">
            {menu.submenu.map((submenu, subIndex) => (
              <li key={subIndex}>
                <Link to={submenu.path}>{props.t(submenu.name)}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {renderMenu(props.sidedata)}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
  sidedata: PropTypes.array.isRequired,
};

export default withRouter(withTranslation()(SidebarContent));


