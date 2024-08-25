import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Tooltip from './Tooltip'; // Import the Tooltip component

const SideNav = () => {
  const [show, setShow] = useState(true);

  const toggleSidenav = () => {
    setShow(!show);
  };

  return (
    <>
      <div
        className={`d-flex flex-column flex-shrink-0 p-3 ${
          show ? "d-block" : "d-none"
        } d-block`}
        style={{ width: "max-content", height: "90vh", zIndex: 1000 }}
      >
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Tooltip text="Home">
              <NavLink
                to="/"
                className="nav-link side-nav-link rounded-4 link-dark"
                activeClassName="active"
              >
                <i className="bi bi-house-door"></i>
              </NavLink>
            </Tooltip>
          </li>
          <li>
            <Tooltip text="All Blogs">
              <NavLink
                to="/posts"
                className="nav-link side-nav-link rounded-4 link-dark"
                activeClassName="active"
              >
                <i className="bi bi-journals"></i>
              </NavLink>
            </Tooltip>
          </li>
          <li>
            <Tooltip text="New Blog">
              <NavLink
                to="/new-post"
                className="nav-link side-nav-link rounded-4 link-dark"
                activeClassName="active"
              >
                <i className="bi bi-pencil"></i>
              </NavLink>
            </Tooltip>
          </li>
          <li>
            <Tooltip text="My Blogs">
              <NavLink
                to="/myblogs"
                className="nav-link side-nav-link rounded-4 link-dark"
                activeClassName="active"
              >
                <i className="bi bi-briefcase"></i>
              </NavLink>
            </Tooltip>
          </li>
        </ul>
        <hr />

        <button
          className="btn btn-custom-primary mb-3 px-1 pb-2"
          onClick={toggleSidenav}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 18 18"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.54805 12.5865V5.41348L4.95193 8.99998L8.54805 12.5865ZM13 16H16V1.99998H13V16ZM1.99997 16H11.5V1.99998H1.99997V16ZM0.5 17.5V0.5H17.5V17.5H0.5Z"
            />
          </svg>
        </button>
      </div>

      {!show && (
        <button
          className="btn btn-custom-primary px-2 mb-3 ms-2"
          onClick={toggleSidenav}
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 18 18"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 5 13 L 5 5 L 9 9 L 5 13 Z M 13 16 L 16 16 L 16 2 L 13 2 L 13 16 Z M 2 16 L 11.5 16 L 11.5 2 L 2 2 L 2 16 Z M 0.5 17.5 L 0.5 0.5 L 17.5 0.5 L 17.5 17.5 L 0.5 17.5 Z" />
          </svg>
        </button>
      )}
    </>
  );
};

export default SideNav;
