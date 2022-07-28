import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

import "../styles/Sidebar.css";

const Sidebar = () => {
  const role = useSelector((state) => state.user.role);
  // console.log(role);

  return (
    <div className="Sidebar">
      {/* <div className="side-menu"> */}
      <ul style={{height: "100%", display: "flex", flexDirection: "column"}}>
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

        <li className="side-menuLI" style={{marginTop: "auto"}}>
          <NavLink to="/Settings" className="side-menuItems">
            <i style={{width: "33px"}} className="fa-solid fa-gear"></i>Settings
          </NavLink>
        </li>
      </ul>
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
