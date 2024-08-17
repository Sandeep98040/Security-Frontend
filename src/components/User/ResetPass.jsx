import React, { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import { Puff } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../apis/Api";
import AnimatedWave from "../components/AnimatedWave";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
    setError("");
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("Please enter a new password.");
      passwordRef.current.focus();
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      passwordRef.current.focus();
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      confirmPasswordRef.current.focus();
      return;
    }

    const data = { password: newPassword };

    setLoading(true);

    resetPasswordApi(data, token)
      .then((res) => {
        if (res.data && res.data.success) {
          toast.success(res.data.message);
          navigate("/");
        } else {
          setError(res.data.message || "Failed to update password");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Internal server error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const styles = {
    diagnoseBtn: {
      padding: "7px 17px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontFamily: "merriweather",
      cursor: "pointer",
      fontSize: "0.95rem",
      transition: "transform 0.2s ease",
      textDecoration: "none",
      textTransform: "none", // Ensure the text is not transformed to uppercase
      position: "relative", // Ensure the position is set to relative for the zoom effect
    },
    diagnoseBtnHover: {
      backgroundColor: "#0056b3",
      animation: "zoom 0.6s infinite", // Add this line to apply the zoom animation on hover
    },
    loaderContainer: {
      display: "flex",
      justifyContent: "center", // Center horizontally
      alignItems: "flex-start", // Align to the top
      height: "100vh", // Full viewport height
      paddingTop: "20vh", // Add some padding from the top to position it nicely
    },
  };
  // Add the keyframes for the zoom animation
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

  // Append the keyframes to the document's stylesheet
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(zoomKeyframes, styleSheet.cssRules.length);

  return (
    <div className="wave-section">
    
    
        <div
          className="form-container d-flex justify-content-center align-items-center border rounded"
          style={{ minHeight: "40vh", backgroundColor: "#ffffff" }}
        >
          <div
            className="border rounded p-4"
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2
              className="text-center mb-3"
              style={{ color: "#3586ff", fontSize: "1.5rem" }}
            >
              Reset Password
            </h2>
            <p className="text-center" style={{ fontSize: "0.9rem" }}>
              Your previous password has been reset. Please set a new password
              for your account.
            </p>

            <form onSubmit={handleResetPassword}>
              <div className="mb-3 position-relative">
                <label htmlFor="newPassword" style={{ fontSize: "0.9rem" }}>
                  New Password
                </label>
                <input
                  ref={passwordRef}
                  onChange={handleNewPassword}
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Enter your new password"
                  value={newPassword}
                  aria-label="Enter your new password"
                  style={{
                    fontSize: "0.9rem",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    fontFamily: "Arial, sans-serif",
                  }}
                />
                <div
                  onClick={toggleShowPassword}
                  style={{
                    position: "absolute",
                    top: "35px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="confirmPassword" style={{ fontSize: "0.9rem" }}>
                  Confirm Password
                </label>
                <input
                  ref={confirmPasswordRef}
                  onChange={handleConfirmPassword}
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  aria-label="Confirm your new password"
                  style={{
                    fontSize: "0.9rem",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    fontFamily: "Arial, sans-serif",
                  }}
                />
                <div
                  onClick={toggleShowPassword}
                  style={{
                    position: "absolute",
                    top: "35px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {error && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {error}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="custom-button border rounded btn w-100"
                style={{
                  backgroundColor: "#3586ff",
                  color: "#ffffff",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  transition: "transform 0.2s",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    styles.diagnoseBtnHover.backgroundColor;
                  e.currentTarget.style.animation =
                    styles.diagnoseBtnHover.animation;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    styles.diagnoseBtn.backgroundColor;
                  e.currentTarget.style.animation = "none"; // Remove the animation
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
                      Saving your new password...
                    </span>
                  </div>
                ) : (
                  "Set Password"
                )}
              </button>
            </form>
          </div>
        </div>
     
    </div>
  );
};

export default ResetPassword;
