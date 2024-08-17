import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userServices from "../../services/userService";
import { useUser } from "../../utils/userContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton, Avatar, Menu, MenuItem, Button } from "@mui/material";

export const ResponsiveAppBarHomepage = ({ purchaseProductLength }) => {
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

  const handleViewCart = () => {
    navigate("/purchaseCart");
  };

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
        <NavLink to="/products" style={styles.navLink}>
          Products
        </NavLink>
        <NavLink to="/contact" style={styles.navLink}>
          Contact
        </NavLink>
      </div>
      <div style={styles.userSection}>
        {user.user.role === "user" && (
          <IconButton onClick={handleViewCart} style={styles.cartButton}>
            <Badge badgeContent={purchaseProductLength} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}
        <Button onClick={handleMenuClick} style={styles.userButton}>
          <Avatar src={`https://localhost:3005/profile/${loginUser.picture}`} alt="Profile" />
          <span style={styles.userName}>Hi, {loginUser.fullName}</span>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          style={styles.menu}
        >
          {user.user.role === "user" && (
            <MenuItem onClick={() => navigate("/home")}>Dashboard</MenuItem>
          )}
          {user.user.role === "admin" && (
            <MenuItem onClick={() => navigate("/addProduct")}>Add Product</MenuItem>
          )}
          <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
          {user.user.role === "user" && (
            <MenuItem onClick={() => navigate("/purchaseHistory")}>Purchase History</MenuItem>
          )}
          {user.user.role === "admin" && (
            <MenuItem onClick={() => navigate("/viewAllProducts")}>View All Products</MenuItem>
          )}
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
  cartButton: {
    color: "#ffffff",
  },
  userButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#ffffff",
    textTransform: "none",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  userName: {
    marginLeft: "10px",
    fontWeight: "bold",
  },
  menu: {
    marginTop: "40px",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
  },
};

export default ResponsiveAppBarHomepage;
