import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userServices from "../../services/userService";
import { useUser } from "../../utils/userContext";
import { Avatar, Button, Menu, MenuItem, Typography, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export const AdminAppBar = () => {
  const user = useUser();
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    userServices
      .getUser()
      .then((res) => {
        setLoginUser(res.data);
      })
      .catch((err) => window.alert(err.response.data.error));
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setLoginUser({});
    navigate("/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logoSection}>
        <NavLink to={"/"}>
          <img src="/images/mobile.jpg" alt="App logo" style={styles.logo} />
        </NavLink>
      </div>
      <div style={styles.navLinks}>
        <NavLink to="/" style={styles.navLink}>
          Home
        </NavLink>
        {user.user.role === "admin" && (
          <>
            <NavLink to="/addProduct" style={styles.navLink}>
              Add Product
            </NavLink>
            <NavLink to="/viewAllProducts" style={styles.navLink}>
              View All Products
            </NavLink>
          </>
        )}
      </div>
      <div style={styles.userSection}>
        <Typography style={styles.greeting}>
          Hi, {loginUser.fullName}
        </Typography>
        <IconButton onClick={handleMenuClick} style={styles.menuButton}>
          <Avatar src={`https://localhost:3005/profile/${loginUser.picture}`} alt="Profile" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          style={styles.menu}
        >
          <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "50px",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#ff6f00",
    },
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  greeting: {
    fontSize: "16px",
    color: "#ffffff",
    marginRight: "10px",
  },
  menuButton: {
    padding: "0",
  },
  menu: {
    marginTop: "40px",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
  },
};

export default AdminAppBar;
