import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Layout.css";

function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div>
      <div>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <nav
          className="navbar fixed-top"
          style={{
            backgroundColor: "#00A36C",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            zIndex: "1024",
          }}
        >
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <i
                className="bi bi-wallet"
                style={{ color: "white", fontWeight: "bolder" }}
              ></i>
              <span className="" style={{ color: "white" }}>
                {" "}
                Wallet
              </span>
            </Link>
            <div className="d-flex gap-3 align-content-center">
              <Link
                to="/records"
                className="nav-link active fs-5"
                aria-current="page"
                style={{
                  textAlign: "center",
                  color: "white",
                  borderRight: "1px solid white",
                  paddingRight: "10px",
                }}
              >
                Records
              </Link>

              <div>
                <Link
                  to="/filter-records"
                  className="nav-link active"
                  aria-current="page"
                >
                  <i
                    className="bi bi-funnel-fill"
                    style={{ fontSize: "21px", color: "white" }}
                  ></i>
                </Link>
              </div>
            </div>

            {currentPath !== "/add_record" && (
              <div
                style={{
                  position: "fixed",
                  bottom: "1rem",
                  right: "1rem",
                  zIndex: "1000",
                  backgroundColor: "white",
                  width: "50px",
                  height: "50px",
                  padding: "0",
                  textAlign: "center",
                  borderRadius: "50%", // Ensure the div is circular
                  overflow: "visible", // Allow content to overflow the border
                  display: "flex", // Center content
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
                }}
                className="rounded-circle"
              >
                <Link to="/add_record" style={{ textDecoration: "none" }}>
                  <i
                    className="bi bi-plus-circle-fill"
                    style={{
                      color: "#0096FF",
                      fontSize: "60px", // Slightly larger than the div to overlap
                      marginTop: "-10px", // Adjust to control overlap
                      marginLeft: "-10px", // Adjust to control overlap
                    }}
                  ></i>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <Outlet />
    </div>
  );
}

export default Layout;
