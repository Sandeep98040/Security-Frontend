import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Button, Typography } from "@mui/material"; // Added Typography here
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import sound from "../../assets/sound.wav";
import productServices from "../../services/productService";
import { MySnackbar } from "../MySnackbar";
import { AdminAppBar } from "../AppBar/AdminAppBar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1e88e5",
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontSize: "1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
    color: "#333333",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5",
  },
  "&:hover": {
    backgroundColor: "#e3f2fd",
  },
}));

export const ViewAllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const [snack, setSnack] = useState({
    type: "",
    message: "",
  });
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const play = () => new Audio(sound).play();

  useEffect(() => {
    productServices
      .getAllProudcts()
      .then((res) => setAllProducts(res.data))
      .catch((err) => window.alert(err.response.data.error));
  }, []);

  const handleProductDelete = (e, id) => {
    e.preventDefault();

    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirm) {
      productServices
        .deleteProduct(id)
        .then((res) => {
          const otherProducts = allProducts.filter((item) => item.id !== id);
          setAllProducts(otherProducts);

          play();
          setSnack({
            type: "success",
            message: "Product deleted successfully.",
          });
          setOpen(true);
        })
        .catch((err) => {
          play();
          setSnack({
            type: "error",
            message: err.response.data.error,
          });
          setOpen(true);
        });
    }
  };

  return (
    <div style={styles.pageContainer}>
      <AdminAppBar />
      <div style={styles.contentContainer}>
        <div style={styles.headerContainer}>
          <h1 style={styles.pageTitle}>All Products List</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={styles.addButton}
            onClick={() => navigate("/addProduct")}
          >
            Add Product
          </Button>
        </div>
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Category</StyledTableCell>
                <StyledTableCell align="right">Stock</StyledTableCell>
                <StyledTableCell align="right">Description</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProducts.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell component="th" scope="row">
                    <div style={styles.productInfoContainer}>
                      <div style={styles.productImageWrapper}>
                        <img
                          src={`https://localhost:3005/product/${item.picture}`}
                          alt="Product"
                          style={styles.productImage}
                        />
                      </div>
                      <div>
                        <Typography variant="subtitle2" sx={styles.productName}>
                          {item.name}
                        </Typography>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">{item.price}</StyledTableCell>
                  <StyledTableCell align="right">
                    {item.category}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {item.totalStockNumber}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {item.description.length > 30
                      ? `${item.description.substring(0, 30)}...`
                      : item.description}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/editProduct/${item.id}`)}
                      sx={styles.editButton}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleProductDelete(e, item.id)}
                      sx={styles.deleteButton}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <MySnackbar
        open={open}
        handleClose={handleClose}
        type={snack.type}
        message={snack.message}
      />
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    padding: "20px",
  },
  contentContainer: {
    margin: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  pageTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#003366",
  },
  addButton: {
    backgroundColor: "#1e88e5",
    color: "white",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
  tableContainer: {
    borderRadius: "12px",
    overflow: "hidden",
  },
  productInfoContainer: {
    display: "flex",
    alignItems: "center",
  },
  productImageWrapper: {
    marginRight: "10px",
  },
  productImage: {
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  productName: {
    fontWeight: "bold",
    color: "#003366",
  },
  editButton: {
    color: "#1e88e5",
  },
  deleteButton: {
    color: "#e53935",
  },
};

export default ViewAllProducts;
