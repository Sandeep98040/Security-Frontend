import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productServices from "../../services/productService";
import { usePurchase } from "../../utils/purchaseContext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Button } from "@mui/material";
import dummyProductData from "../../data/data";
import { ResponsiveAppBarHomepage } from "../AppBar/ResponsiveAppBarHomepage";

function HomePage() {
  const purchase = usePurchase();
  const navigate = useNavigate();
  const [purchaseProduct, setPurchaseProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [newReleasedProduct, setNewReleasedProduct] = useState({});
  const [hottestProduct, setHottestProduct] = useState({});
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(window.localStorage.getItem("userId"));

    setPurchaseProduct({
      items: purchase.purchase,
      payment: "pending",
    });

    productServices
      .getAllProudcts()
      .then((res) => {
        if (res.data.length === 0) {
          const dummyProduct = dummyProductData;
          setProducts(dummyProduct);
          setNewReleasedProduct(dummyProduct[1]);
          setHottestProduct(dummyProduct[dummyProduct.length - 1]);
          return;
        }

        setProducts(res.data);
        setNewReleasedProduct(res.data[0]);
        setHottestProduct(res.data[res.data.length - 1]);
      })
      .catch((err) => window.alert(err.response.data.error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeItem = document.querySelector(
        ".carousel .carousel-item.active"
      );
      if (activeItem) {
        const nextItem =
          activeItem.nextElementSibling ||
          document.querySelector(".carousel .carousel-item:first-child");
        activeItem.classList.remove("active");
        nextItem.classList.add("active");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearPurchaseContext = () => {
    purchase.setPurchase([]);
    setPurchaseProduct({});
    console.log("Purchase context cleared");
  };

  const handlePurchaseCancellation = (e) => {
    e.preventDefault();
    const confirmation = window.confirm(
      "Are you sure you want to cancel the purchase?"
    );
    if (confirmation) {
      clearPurchaseContext();
    }
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    if (purchase.purchase.length === 0) {
      window.alert("Please, add to cart first");
    } else {
      const finalPurchaseProduct = { ...purchaseProduct, payment: "success" };
      clearPurchaseContext();
    }
  };

  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category || "Others";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  return (
    <div style={styles.pageContainer}>
      <ResponsiveAppBarHomepage
        purchaseProductLength={purchase.purchase.length}
      />
      <div style={styles.heroSection}>
        <div className="carousel carousel-section" style={styles.carousel}>
          <div id="item1" className="carousel-item active" style={styles.carouselItem}>
            <img
              src="/images/s24.webp"
              alt="Slider 1"
              style={styles.carouselImage}
            />
          </div>
          <div id="item2" className="carousel-item" style={styles.carouselItem}>
            <img
              src="/images/iphone.jpg"
              alt="Slider 2"
              style={styles.carouselImage}
            />
          </div>
          <div id="item3" className="carousel-item" style={styles.carouselItem}>
            <img
              src="/images/honor.webp"
              alt="Slider 3"
              style={styles.carouselImage}
            />
          </div>
        </div>
      </div>

      <div style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Latest Arrivals</h2>
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <img
                src={`https://localhost:3005/product/${product.picture}`}
                alt={product.name}
                style={styles.productImage}
              />
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productDescription}>
                {product.description.substring(0, 60)}...
              </p>
              <div style={styles.productPrice}>
                <strong>Rs {product.price}</strong>
              </div>
              <Button
                onClick={() => navigate(`/singleProduct/${product.id}`)}
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                style={styles.addButton}
              >
                Add to cart
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.highlightSection}>
        <div style={styles.hottestProductSection}>
          <img
            src={`https://localhost:3005/product/${hottestProduct.picture}`}
            alt="Hottest Product"
            style={styles.hottestProductImage}
          />
          <div style={styles.hottestProductDetails}>
            <h1 style={styles.hottestProductTitle}>Hottest!</h1>
            <p style={styles.hottestProductDescription}>
              {hottestProduct.description}
            </p>
            <Button
              onClick={() => navigate(`/singleProduct/${hottestProduct.id}`)}
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              style={styles.addButton}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .carousel .carousel-item {
          display: none;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        .carousel .carousel-item.active {
          display: block;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#f4f6f8",
    color: "black",
    minHeight: "100vh",
    padding: "20px",
  },
  heroSection: {
    backgroundColor: "#e0f7fa",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "40px",
  },
  carousel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "15px",
  },
  carouselItem: {
    flex: "0 0 100%",
    maxHeight: "400px",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "15px",
  },
  productsSection: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-10px)",
    },
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  productName: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  productDescription: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "1.25rem",
    color: "#ff6f00",
    marginBottom: "15px",
  },
  addButton: {
    backgroundColor: "#ff6f00",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "#e65100",
    },
  },
  highlightSection: {
    backgroundColor: "#ffffff",
    padding: "40px 20px",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  hottestProductSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    maxWidth: "1000px",
    margin: "0 auto",
    gap: "20px",
  },
  hottestProductImage: {
    width: "300px",
    height: "300px",
    objectFit: "contain",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  hottestProductDetails: {
    maxWidth: "500px",
    textAlign: "left",
  },
  hottestProductTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  hottestProductDescription: {
    fontSize: "1.25rem",
    color: "#666",
    marginBottom: "20px",
  },
};

export default HomePage;
