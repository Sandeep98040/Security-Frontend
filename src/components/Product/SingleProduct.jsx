import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { Alert, IconButton, Input, Snackbar, Button } from "@mui/material";
import sound from "../../assets/sound.wav";
import productServices from "../../services/productService";
import { useAuth } from "../../utils/authContext";
import { usePurchase } from "../../utils/purchaseContext";
import sanitizeInput from "../../utils/sanitizationInput";
import { useUser } from "../../utils/userContext";
import { ResponsiveAppBarHomepage } from "../AppBar/ResponsiveAppBarHomepage";
import { ResponsiveAppBarLandingPage } from "../AppBar/ResponsiveAppBarLandingPage";

function SingleProduct() {
  const purchase = usePurchase();
  const auth = useAuth();
  const navigate = useNavigate();
  const user = useUser();

  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [snack, setSnack] = useState({
    type: "",
    message: "",
  });
  const [userId, setUserId] = useState("");
  const [edit, setEdit] = useState({
    isEdit: false,
    reviewId: "",
    text: "",
  });
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (window.localStorage.getItem("token") !== "" || auth.email) {
      setIsUserLogin(true);
      setUserId(user.user.id);
    }

    productServices
      .getSingleProductById(productId)
      .then((res) => {
        setProduct(res.data);
        productServices
          .getAllReviews(productId)
          .then((res) => {
            setReviews(res.data);
          })
          .catch((err) => window.alert(err.response.data.error));
      })
      .catch((err) => window.alert(err.response.data.error));
  }, []);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    if (quantity >= 8) setQuantity(8);
  };

  const handleDecrement = () => {
    setQuantity(quantity - 1);
    if (quantity <= 0) setQuantity(0);
  };

  const play = () => new Audio(sound).play();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (quantity === 0) return window.alert("Please, select quantity first");

    const purchaseProduct = {
      name: product.name,
      quantity: quantity,
      price: product.price,
      picture: product.picture, // Ensure the picture is added to the cart item
    };

    purchase.setPurchase([...purchase.purchase, purchaseProduct]);
    play();
    setSnack({
      type: "success",
      message: "Product added to cart successfully!",
    });
    setOpen(true);
    setQuantity(0);
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!isUserLogin) {
      play();
      setSnack({ type: "error", message: "Please, login to write a review!" });
      setOpen(true);
      return;
    }

    if (feedback === "") {
      play();
      setSnack({ type: "error", message: "Please, write a review!" });
      setOpen(true);
      return;
    }

    const sanitizedReviewInput = sanitizeInput(feedback);
    const addedReview = { text: sanitizedReviewInput };

    productServices
      .addReview(productId, addedReview)
      .then((res) => {
        play();
        setSnack({ type: "success", message: "Review added successfully!" });
        setOpen(true);
        setFeedback("");
        setShowReviewInput(false);

        // Fetch reviews again to refresh the list
        productServices
          .getAllReviews(productId)
          .then((res) => {
            setReviews(res.data);
          })
          .catch((err) => window.alert(err.response.data.error));
      })
      .catch((err) => {
        play();
        setSnack({
          type: "error",
          message: `${err.response.data.error} It does not support HTML tags.`,
        });
        setOpen(true);
      });
  };

  const handleEdit = () => {
    const editedReview = { text: edit.text };

    productServices
      .updateReview(productId, edit.reviewId, editedReview)
      .then((res) => {
        play();
        setSnack({ type: "success", message: "Review updated successfully!" });
        setOpen(true);

        const updatedReview = reviews.map((review) =>
          review._id === edit.reviewId ? { ...review, text: edit.text } : review
        );
        setReviews(updatedReview);
        setEdit({ isEdit: false, reviewId: "", text: "" });
        setFeedback("");
      })
      .catch((err) => {
        play();
        setSnack({ type: "error", message: err.response.data.error });
        setOpen(true);
      });
  };

  const handleDelete = (reviewId) => {
    const confirmation = window.confirm("Are you sure to delete this review?");
    if (!confirmation) return;

    productServices
      .deleteReview(productId, reviewId)
      .then((res) => {
        play();
        setSnack({
          type: "success",
          message: "Review deleted successfully!",
        });
        setOpen(true);

        const updatedReview = reviews.filter(
          (review) => review._id !== reviewId
        );
        setReviews(updatedReview);
      })
      .catch((err) => {
        play();
        setSnack({ type: "error", message: err.response.data.error });
        setOpen(true);
      });
  };

  return (
    <div style={styles.pageContainer}>
      {isUserLogin ? (
        <ResponsiveAppBarHomepage
          purchaseProductLength={purchase.purchase.length}
        />
      ) : (
        <ResponsiveAppBarLandingPage />
      )}

      <div className="hero min-h-screen" style={styles.heroSection}>
        <div className="hero-content flex-col lg:flex-row">
          <img
            src={`https://localhost:3005/product/${product.picture}`}
            className="max-w-sm rounded-lg shadow-2xl"
            style={styles.productImage}
            alt={product.name}
          />

          <div style={styles.productDetails}>
            <h1 className="text-2xl font-bold" style={styles.productTitle}>
              {product.name}
            </h1>
            <p className="py-6" style={styles.productDescription}>
              {product.description}
            </p>
            <p className="text-bold mb-3" style={styles.productPrice}>
              Price: Rs {product.price}
            </p>
            {isUserLogin && (
              <>
                <div style={styles.quantityControls}>
                  <button onClick={handleDecrement} className="btn btn-outline">
                    -
                  </button>
                  <span style={styles.quantityText}>Quantity: {quantity}</span>
                  <button onClick={handleIncrement} className="btn btn-outline">
                    +
                  </button>
                </div>
                <Button
                  variant="contained"
                  style={styles.addToCartButton}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <hr />

      <div className="reviews-section" style={styles.reviewsSection}>
        <div className="view-reviews">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} style={styles.reviewItem}>
                <div className="chat chat-start mb-4">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={`https://localhost:3005/profile/${review.userPicture}`}
                        alt="User"
                        style={styles.userImage}
                      />
                    </div>
                  </div>
                  <div style={styles.reviewHeader}>{review.userName}</div>
                  <div className="chat-bubble" style={styles.reviewBubble}>
                    {review.text}
                    {review.userId === userId && (
                      <>
                        <div className="dropdown dropdown-bottom ml-3">
                          <label
                            tabIndex={0}
                            className="btn btn-outline btn-ghost btn-xs m-1"
                          >
                            ...
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            style={styles.dropdownMenu}
                          >
                            <li className="text-2xl">
                              <IconButton
                                onClick={() =>
                                  setEdit({
                                    isEdit: true,
                                    reviewId: review._id,
                                    text: review.text,
                                  })
                                }
                                style={styles.editButton}
                              >
                                <EditIcon /> Edit
                              </IconButton>
                            </li>
                            <div className="divider"></div>
                            <li>
                              <IconButton
                                onClick={() => handleDelete(review._id)}
                                style={styles.deleteButton}
                              >
                                <DeleteIcon /> Delete
                              </IconButton>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3 className="text-warning text-2xl m-4" style={styles.noReviews}>
              No Reviews
            </h3>
          )}
        </div>
        <Button
          variant="contained"
          onClick={() => setShowReviewInput(!showReviewInput)}
          style={styles.toggleReviewButton}
        >
          {showReviewInput ? "Cancel" : "Add a Review"}
        </Button>
        {showReviewInput && (
          <div style={styles.reviewInputContainer}>
            <Input
              type="text"
              placeholder="Write a comment ..."
              onChange={
                edit.isEdit
                  ? (e) => setEdit({ ...edit, text: e.target.value })
                  : (e) => setFeedback(e.target.value)
              }
              value={edit.isEdit ? edit.text : feedback}
              style={styles.reviewInput}
              endAdornment={
                edit.isEdit ? (
                  <IconButton onClick={handleEdit} style={styles.iconButton}>
                    <EditIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleReview} style={styles.iconButton}>
                    <SendIcon />
                  </IconButton>
                )
              }
            />
          </div>
        )}
      </div>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snack.type}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#f4f6f8",
    color: "#333",
    minHeight: "100vh",
    padding: "20px",
  },
  heroSection: {
    padding: "20px",
  },
  productImage: {
    borderRadius: "12px",
    objectFit: "cover",
  },
  productDetails: {
    marginLeft: "20px",
  },
  productTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#003366",
  },
  productDescription: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "20px",
  },
  productPrice: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: "20px",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  quantityText: {
    fontSize: "1.2rem",
    margin: "0 20px",
    color: "#333",
  },
  addToCartButton: {
    backgroundColor: "#003366",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#002244",
    },
  },
  reviewsSection: {
    margin: "20px 0",
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  userImage: {
    borderRadius: "50%",
  },
  reviewHeader: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#0073e6",
  },
  reviewBubble: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: "10px",
    borderRadius: "8px",
    position: "relative",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  editButton: {
    color: "#0073e6",
  },
  deleteButton: {
    color: "#d32f2f",
  },
  noReviews: {
    color: "#555",
    textAlign: "center",
  },
  toggleReviewButton: {
    backgroundColor: "#003366",
    color: "#fff",
    marginTop: "20px",
    "&:hover": {
      backgroundColor: "#002244",
    },
  },
  reviewInputContainer: {
    marginTop: "20px",
  },
  reviewInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    borderColor: "#ddd",
    color: "#333",
  },
  iconButton: {
    color: "#0073e6",
  },
};

export default SingleProduct;
