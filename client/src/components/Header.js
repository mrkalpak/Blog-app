import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../img/logo.png";

const Header = ({token}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  

  
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home or login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={Logo} alt="ZUAI" style={{ height: "50px" }} />
        </Link>
        <div className="" id="navbarSupportedContent">
          <ul className="navbar-nav flex-row ms-auto me-0 mb-2 mb-lg-0">
            {!isLoggedIn ? (
              <>
                <li className="nav-item me-3">
                  <Link to="/login" className="nav-link active btn border border-2 border-light rounded-5 px-3">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link active btn btn-custom-primary rounded-5 px-3">
                    Join Now
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link active btn btn-custom-primary rounded-5 px-3">
                  Log Out <i className="bi bi-box-arrow-right"></i>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
