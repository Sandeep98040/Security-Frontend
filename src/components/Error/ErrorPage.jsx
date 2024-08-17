import React from "react";
import { NavLink } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.content}>
          <h3 style={styles.title}>404, Page not found</h3>
          <p style={styles.description}>
            Sorry, the page you are looking for could not be found or has been
            removed.
          </p>
          <NavLink to={"/"} style={styles.homeLink}>
            Go to Home
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={styles.homeIcon}
            >
              <path
                fillRule="evenodd"
                d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                clipRule="evenodd"
              />
            </svg>
          </NavLink>
        </div>
      </div>
    </main>
  );
};

const styles = {
  main: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f6f8",
    padding: "20px",
  },
  container: {
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  content: {
    margin: "auto",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333333",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  description: {
    fontSize: "1rem",
    color: "#666666",
    marginBottom: "30px",
  },
  homeLink: {
    fontSize: "1rem",
    color: "#1e88e5",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#e3f2fd",
    transition: "background-color 0.3s, color 0.3s",
    "&:hover": {
      backgroundColor: "#1e88e5",
      color: "#ffffff",
    },
  },
  homeIcon: {
    width: "20px",
    height: "20px",
  },
};

export default ErrorPage;
