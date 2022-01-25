import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {AppContext} from "../App";

import "../styles/Sidebar.css";

const Sidebar = () => {
  const {role} = useContext(AppContext);
  // console.log(role);

  return (
    <div className="Sidebar">
      <div className="side-menu">
        <ul>
          <li className="side-menuLI">
            <NavLink to="/mytasks" className="side-menuItems">
              <i style={{width: "33px"}} className="fas fa-tasks"></i>My Tasks
            </NavLink>
          </li>

          {role === "manager" && (
            <>
              <li className="side-menuLI">
                <NavLink to="/Assigned" className="side-menuItems">
                  <i style={{width: "33px"}} className="far fa-calendar-plus"></i>Assigned Tasks
                </NavLink>
              </li>
              <li className="side-menuLI">
                <NavLink to="/ManageEmployee" className="side-menuItems">
                  <i style={{width: "33px"}} className="fas fa-users"></i>Manage Employees
                </NavLink>
              </li>
              <li className="side-menuLI">
                <NavLink to="/ManageManager" className="side-menuItems">
                  <i style={{width: "33px"}} className="fas fa-user-tie"></i>Manage Managers
                </NavLink>
              </li>
            </>
          )}
          <li className="side-menuLI">
            <NavLink to="/Chats" className="side-menuItems">
              <i style={{width: "33px"}} className="fas fa-comments"></i>Chats
              {/* <i style={{width: "33px"}} className="fas fa-tasks"></i>Chats */}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
