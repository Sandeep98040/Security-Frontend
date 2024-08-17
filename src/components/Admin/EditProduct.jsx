import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import sound from "../../assets/sound.wav";
import productServices from "../../services/productService";
import userServices from "../../services/userService";
import { AdminAppBar } from "../AppBar/AdminAppBar";
import { MySnackbar } from "../MySnackbar";

export const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [imageName, setImageName] = useState("productDefaultImage.png");
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productStock, setProductStock] = useState("");

  useEffect(() => {
    productServices
      .getSingleProductById(productId)
      .then((res) => {
        setImageName(res.data.picture);
        setProductName(res.data.name);
        setProductPrice(res.data.price);
        setProductDescription(res.data.description);
        setProductCategory(res.data.category);
        setProductStock(res.data.totalStockNumber);
      })
      .catch((err) => window.alert(err.response.data.error));
  }, [productId]);

  const [snack, setSnack] = useState({
    type: "",
    message: "",
  });
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const play = () => new Audio(sound).play();

  const handleUpload = (e) => {
    e.preventDefault();

    if (!file) {
      play();
      setSnack({
        type: "error",
        message: "Please, select a file",
      });
      setOpen(true);
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to change your product picture?"
    );
    if (confirmation) {
      userServices
        .uploadProductImage(productId, file)
        .then((res) => {
          setImageName(res.data.filename);
          play();
          setSnack({
            type: "success",
            message: "Product picture updated successfully",
          });
          setOpen(true);
          setFile(null);
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

  const handleEditProduct = (e) => {
    e.preventDefault();

    const sanitizedProductName = DOMPurify.sanitize(productName.trim());
    const sanitizedProductDescription = DOMPurify.sanitize(
      productDescription.trim()
    );
    const sanitizedProductCategory = DOMPurify.sanitize(productCategory);

    if (
      sanitizedProductName === "" ||
      sanitizedProductCategory === "" ||
      sanitizedProductDescription === "" ||
      isNaN(productPrice) ||
      productPrice < 100 ||
      isNaN(productStock) ||
      productStock <= 0
    ) {
      play();
      setSnack({
        type: "error",
        message:
          "All fields are required and must be valid. Price must be at least 100.",
      });
      setOpen(true);
      return;
    }

    const updatedProduct = {
      name: sanitizedProductName,
      price: parseFloat(productPrice),
      description: sanitizedProductDescription,
      category: sanitizedProductCategory,
      totalStockNumber: parseInt(productStock, 10),
    };

    const confirmation = window.confirm(
      "Are you sure you want to edit this product?"
    );
    if (confirmation) {
      productServices
        .editProduct(productId, updatedProduct)
        .then(() => {
          play();
          setSnack({
            type: "success",
            message: "Product updated successfully",
          });
          setOpen(true);
          navigate("/viewAllProducts");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setImageName(URL.createObjectURL(file));
    }
  };

  return (
    <div style={styles.pageContainer}>
      <AdminAppBar />
      <div style={styles.formContainer}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/viewAllProducts")}
          sx={styles.backButton}
        >
          Back to Products
        </Button>
        <h2 style={styles.formTitle}>Edit Product</h2>
        <form onSubmit={handleEditProduct} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              placeholder="Enter product name"
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Price:</label>
            <input
              type="number"
              placeholder="Enter product price"
              onChange={(e) => setProductPrice(e.target.value)}
              value={productPrice}
              style={styles.input}
              required
              min="100"
              step="0.01"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Stock Quantity:</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              onChange={(e) => setProductStock(e.target.value)}
              value={productStock}
              style={styles.input}
              required
              min="1"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category:</label>
            <select
              onChange={(e) => setProductCategory(e.target.value)}
              value={productCategory}
              style={styles.select}
              required
            >
              <option disabled value="">
                Choose product category
              </option>
              <option value="Mobile Phones">Mobile Phones</option>
              <option value="Earbuds">Earbuds</option>
              <option value="Watches">Watches</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              placeholder="Write product description"
              onChange={(e) => setProductDescription(e.target.value)}
              value={productDescription}
              style={styles.textarea}
              required
            ></textarea>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Image:</label>
            <input
              type="file"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={styles.submitButton}
          >
            Edit Product
          </Button>
        </form>

        {file && (
          <div style={styles.imagePreviewContainer}>
            <img src={imageName} alt="Product Preview" style={styles.imagePreview} />
          </div>
        )}

        <MySnackbar
          open={open}
          handleClose={handleClose}
          type={snack.type}
          message={snack.message}
        />
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "30px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    color: "#1e88e5",
    marginBottom: "20px",
    textTransform: "none",
  },
  formTitle: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",  // White background for better contrast
    color: "#000000",  // Black text color for better visibility
    outline: "none",
    transition: "border-color 0.3s",
    "&:focus": {
      borderColor: "#1e88e5",
    },
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",  // White background for better contrast
    color: "#000000",  // Black text color for better visibility
    outline: "none",
    transition: "border-color 0.3s",
    "&:focus": {
      borderColor: "#1e88e5",
    },
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",  // White background for better contrast
    color: "#000000",  // Black text color for better visibility
    outline: "none",
    transition: "border-color 0.3s",
    "&:focus": {
      borderColor: "#1e88e5",
    },
  },
  fileInput: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",  // White background for better contrast
    color: "#000000",  // Black text color for better visibility
    outline: "none",
  },
  submitButton: {
    backgroundColor: "#1e88e5",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
  imagePreviewContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  imagePreview: {
    width: "100%",
    maxWidth: "200px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default EditProduct;
