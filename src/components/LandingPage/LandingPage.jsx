import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyProductData from "../../data/data";
import productServices from "../../services/productService";
import { ResponsiveAppBarLandingPage } from "../AppBar/ResponsiveAppBarLandingPage";

function LandingPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newReleasedProduct, setNewReleasedProduct] = useState({});
  const [hottestProduct, setHottestProduct] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
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
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = () => {
    if (isLogin) {
      navigate("/singleProduct");
    } else {
      window.alert("Not authorized. Please, login!");
      navigate("/login");
    }
  };

  const addSaleBadge = () => {
    const saleProducts = new Set();
    while (saleProducts.size < Math.min(products.length, 5)) {
      const randomIndex = Math.floor(Math.random() * products.length);
      saleProducts.add(randomIndex);
    }
    return Array.from(saleProducts);
  };

  const saleProducts = addSaleBadge();

  const addNormalBadge = () => {
    const normalProducts = new Set();
    while (normalProducts.size < Math.min(products.length, 5)) {
      const randomIndex = Math.floor(Math.random() * products.length);
      normalProducts.add(randomIndex);
    }
    return Array.from(normalProducts);
  };

  const normalProducts = addNormalBadge();

  return (
    <div style={styles.pageContainer}>
      <ResponsiveAppBarLandingPage />
      <div style={styles.carouselContainer}>
        <div className="carousel carousel-section" style={styles.carousel}>
          <div id="item1" className="carousel-item active" style={styles.carouselItem}>
            <img
              src="/images/s24.webp"
              className="w-full h-full object-cover rounded-lg"
              alt="slider1"
              style={styles.carouselImage}
            />
          </div>
          <div id="item2" className="carousel-item" style={styles.carouselItem}>
            <img
              src="/images/iphone.jpg"
              className="w-full h-full object-cover rounded-lg"
              alt="slider2"
              style={styles.carouselImage}
            />
          </div>
          <div id="item3" className="carousel-item" style={styles.carouselItem}>
            <img
              src="/images/honor.webp"
              className="w-full h-full object-cover rounded-lg"
              alt="slider3"
              style={styles.carouselImage}
            />
          </div>
        </div>
        <div className="flex justify-center w-full py-2 gap-2" style={styles.carouselIndicators}>
          <a href="#item1" className="btn btn-xs btn-secondary">
            1
          </a>
          <a href="#item2" className="btn btn-xs btn-secondary">
            2
          </a>
          <a href="#item3" className="btn btn-xs btn-secondary">
            3
          </a>
        </div>
      </div>

      <div style={styles.featuredSection}>
        <div style={styles.productCard}>
          <img
            src={`https://localhost:3005/product/${newReleasedProduct.picture}`}
            alt="New Released"
            style={styles.productImage}
          />
          <div style={styles.productDetails}>
            <h2 style={styles.productTitle}>New Released!</h2>
            <p style={styles.productDescription}>
              {newReleasedProduct.description}
            </p>
            <Button
              onClick={handleAddToCart}
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              style={styles.addButton}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>All Products</h2>

      <div style={styles.productsGrid}>
        {products.map((product, index) => (
          <div key={product.id} style={styles.productCard}>
            <div style={styles.productImageContainer}>
              <img
                src={`https://localhost:3005/product/${product.picture}`}
                alt="Product"
                style={styles.productImage}
              />
              {saleProducts.includes(index) && (
                <LocalOfferIcon style={styles.saleBadge} />
              )}
              {normalProducts.includes(index) && (
                <LocalOfferIcon style={styles.normalBadge} />
              )}
            </div>
            <div style={styles.productDetails}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productDescription}>
                {product.description.substring(0, 99)}...
              </p>
              <Button
                onClick={() => navigate(`/singleProduct/${product.id}`)}
                variant="contained"
                startIcon={<VisibilityIcon />}
                style={styles.viewButton}
              >
                View
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                style={styles.addButton}
              >
                Add to cart
              </Button>
              <div style={styles.productInfo}>
                <span style={styles.productCategory}>{product.category}</span>
                <span style={styles.productAvailability}>Available</span>
                <span style={styles.productPrice}>Rs {product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.hottestProductSection}>
        <div style={styles.hottestProductContent}>
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
              onClick={handleAddToCart}
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
  carouselContainer: {
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
  carouselIndicators: {
    marginTop: "10px",
  },
  featuredSection: {
    marginBottom: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    padding: "20px",
    marginBottom: "20px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-10px)",
    },
  },
  productImageContainer: {
    position: "relative",
    marginBottom: "15px",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "10px",
  },
  productDetails: {
    textAlign: "left",
  },
  productTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "10px",
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
  viewButton: {
    backgroundColor: "#1e88e5",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "10px",
    marginBottom: "10px",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
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
  productInfo: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
  },
  productCategory: {
    color: "#ff6f00",
    fontWeight: "bold",
  },
  productAvailability: {
    color: "#1e88e5",
    fontWeight: "bold",
  },
  productPrice: {
    color: "#43a047",
    fontWeight: "bold",
  },
  saleBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "red",
    fontSize: "2rem",
  },
  normalBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "blue",
    fontSize: "2rem",
  },
  hottestProductSection: {
    backgroundColor: "#ffffff",
    padding: "40px 20px",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  hottestProductContent: {
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

export default LandingPage;
