import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const NavBar = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav w-100">
            {!currentUser?.isSuperUser ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/projects"
                  >
                    Projects
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/filterLogs"
                  >
                    Filter Logs
                  </NavLink>
                </li>
              </>
            ) : null}

            <li className="nav-item ms-auto">
              <NavLink
                className="nav-link"
                to="/"
                onClick={() => {
                  dispatch({ type: "PURGE_AUTH" });
                  toast.error("Logout Successfully");
                }}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
