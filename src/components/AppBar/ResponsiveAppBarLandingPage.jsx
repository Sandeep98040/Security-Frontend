import React from "react";
import { Link, NavLink } from "react-router-dom";

export const ResponsiveAppBarLandingPage = () => {
  return (
    <div style={styles.navbarContainer}>
      <div style={styles.navbar}>
        <div style={styles.navbarStart}>
          <NavLink to={"/"}>
            <img style={styles.logo} src="/images/mobile.jpg" alt="App logo" />
          </NavLink>
        </div>
        <div style={styles.navbarCenter}>
          <ul style={styles.menu}>
            <li style={styles.menuItem}>
              <NavLink to={"/"} style={styles.navLink} activeStyle={styles.navLinkActive}>
                Home
              </NavLink>
            </li>
            <li style={styles.menuItem}>
              <NavLink to={"/contact"} style={styles.navLink} activeStyle={styles.navLinkActive}>
                Contact
              </NavLink>
            </li>
            <li style={styles.menuItem}>
              <NavLink to={"/about"} style={styles.navLink} activeStyle={styles.navLinkActive}>
                About
              </NavLink>
            </li>
          </ul>
        </div>
        <div style={styles.navbarEnd}>
          <NavLink to={"/login"} style={{ ...styles.button, ...styles.loginButton }}>
            LOGIN
          </NavLink>
          <NavLink to={"/signup"} style={{ ...styles.button, ...styles.signupButton }}>
            SIGNUP
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbarContainer: {
    width: "100%",
    backgroundColor: "#1a1a1a", // Dark theme to reflect tech products
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  navbarStart: {
    flex: 1,
  },
  logo: {
    height: "50px",
    cursor: "pointer",
  },
  navbarCenter: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
  },
  menu: {
    display: "flex",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    margin: "0 15px",
  },
  navLink: {
    textDecoration: "none",
    color: "#b0b0b0",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  navLinkActive: {
    color: "#FF6F00", // Highlighted color for active links
  },
  navLinkHover: {
    backgroundColor: "#FF6F00",
    color: "#fff",
  },
  navbarEnd: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    textDecoration: "none",
    padding: "8px 20px",
    borderRadius: "24px",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  loginButton: {
    border: "2px solid #FF6F00",
    color: "#FF6F00",
    marginRight: "10px",
    backgroundColor: "transparent",
  },
  loginButtonHover: {
    backgroundColor: "#FF6F00",
    color: "#fff",
  },
  signupButton: {
    border: "2px solid #00ACC1",
    color: "#00ACC1",
    backgroundColor: "transparent",
  },
  signupButtonHover: {
    backgroundColor: "#00ACC1",
    color: "#fff",
  },
};

