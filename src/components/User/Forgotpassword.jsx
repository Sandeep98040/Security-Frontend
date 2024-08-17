import axios from "axios";
import React, { useRef, useState } from "react";
import { Puff } from "react-loader-spinner";
import { toast } from "react-toastify";

const PasswordResetRequest = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  const handleForgotPasswordEmail = (e) => {
    setForgotPasswordEmail(e.target.value);
    setErrors(""); // Clear errors on input change
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const forgotPassword = (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setErrors("Email is required");
      emailRef.current.focus();
      return;
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setErrors("Please enter a valid email address");
      emailRef.current.focus();
      return;
    }

    const data = { email: forgotPasswordEmail };

    setLoading(true);

    axios
      .post("https://localhost:3005/users/forgot-password", data)
      .then((res) => {
        if (res.data.success) {
          setErrors("");
          setForgotPasswordEmail("");
          toast.success(res.data.message);
        } else {
          setErrors(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrors(err.response?.data?.message || "Internal server error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const styles = {
    diagnoseBtn: {
      padding: "10px 20px",
      backgroundColor: "#0066cc",
      color: "#fff",
      border: "none",
      borderRadius: "25px",
      fontFamily: "Merriweather, sans-serif",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      textTransform: "none",
    },
    diagnoseBtnHover: {
      backgroundColor: "#004d99",
      transform: "scale(1.05)",
    },
    loaderContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
  };

  const zoomKeyframes = `
    @keyframes zoom {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `;

  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(zoomKeyframes, styleSheet.cssRules.length);

  return (
    <div className="wave-section" style={{ backgroundColor: "#f4f7fc", minHeight: "100vh", paddingTop: "10vh" }}>
      <div
        className="form-container d-flex justify-content-center align-items-center"
        style={{ minHeight: "30vh", padding: "20px" }}
      >
        <div
          className="border rounded p-5"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: "15px",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ color: "#0066cc", fontSize: "1.75rem", fontWeight: "bold" }}
          >
            Forgot Password?
          </h2>
          <p className="text-center mb-4" style={{ fontSize: "1rem", color: "#555" }}>
            Don’t worry, it happens to all of us. Enter your email below to recover your password.
          </p>
          <form onSubmit={forgotPassword}>
            <div className="mb-3">
              <label htmlFor="email" style={{ fontSize: "1rem", color: "#555" }}>
                Email
              </label>
              <input
                ref={emailRef}
                onChange={handleForgotPasswordEmail}
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                aria-label="Enter your email to reset password"
                style={{
                  fontSize: "1rem",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
              {errors && (
                <div
                  className="text-danger mt-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {errors}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-100"
              style={{
                ...styles.diagnoseBtn,
                display: "inline-block",
              }}
              disabled={loading}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  styles.diagnoseBtnHover.backgroundColor;
                e.currentTarget.style.transform = styles.diagnoseBtnHover.transform;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor =
                  styles.diagnoseBtn.backgroundColor;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <Puff
                    height="20"
                    width="20"
                    radius="9"
                    color="#ffffff"
                    ariaLabel="loading"
                  />
                  <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                    Generating reset password link...
                  </span>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
