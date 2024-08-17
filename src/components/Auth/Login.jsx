import MailLockIcon from "@mui/icons-material/MailLock";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { isEmail } from "../../lib/input-validation";
import recaptchKeys from "../../services/recaptcha";
import userServices from "../../services/userService";
import { useAuth } from "../../utils/authContext";
import { useUser } from "../../utils/userContext";
import { ResponsiveAppBarLandingPage } from "../AppBar/ResponsiveAppBarLandingPage";

function Login() {
  const auth = useAuth();
  const user = useUser();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [userVerified, setUserVerified] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formError, setFormError] = useState("");
  const [formWarning, setFormWarning] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleEmailError = () => {
    if (!credentials.email || !isEmail(credentials.email)) {
      setEmailError(true);
      setFormError("Please, enter a valid email address.");
      return;
    }
    setEmailError(false);
    setFormError("");
  };

  const handlePasswordError = () => {
    if (!credentials.password) {
      setPasswordError(true);
      setFormError("Please, enter a valid password.");
      return;
    }
    setPasswordError(false);
    setFormError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setFormError("");
    setFormWarning("");

    if (credentials.email === "" || credentials.password === "") {
      setFormError("Please, enter all the fields.");
      return;
    }

    userServices
      .login(credentials)
      .then((res) => {
        auth.setEmail(credentials.email);
        window.localStorage.setItem("token", res.data.token);
        user.setUser(res.data.user);
        setUserVerified(false);

        userServices
          .passwordNeedChange()
          .then((responseFromServer) => {
            if (responseFromServer.data.message) {
              if (responseFromServer.data.message === true) {
                navigate("/changePassword");
              }
            }
          })
          .catch((err) => window.alert(err.response.data.error));

        if (res.data.user.role === "user") {
          navigate("/home");
        } else if (res.data.user.role === "admin") {
          navigate("/viewAllProducts");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        setFormError(err.response.data.error);
        setOpen(true);

        if (err.response.data.error === "Invalid email or password.") {
          setFormWarning("Invalid email or password. Please try again.");
        }

        if (err.response.data.error === "Your account has been locked due to multiple failed login attempts. Please try again later.") {
          setFormWarning("Your account has been locked due to multiple failed login attempts. Please try again later.");
          setDialogOpen(true);
        }

        if (err.response.data.error === "Account has not been registered.") {
          setFormWarning("Account has not been registered. Please sign up.");
        }
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  function onChange(value) {
    if (value) {
      setUserVerified(true);
    }
  }

  return (
    <Box
      sx={{
        bgcolor: "#E3F2FD",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <ResponsiveAppBarLandingPage />
      <Paper
        elevation={12}
        sx={{
          padding: 6,
          borderRadius: "24px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          backgroundImage: "url('/path-to-your-background-image.jpg')", // Add your background image
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: "#FF6F00",
              borderRadius: "50%",
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneIphoneIcon sx={{ color: "white", fontSize: 36 }} />
          </Box>
        </Box>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#333" }}>
          Welcome to MobileHub
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Please sign in to explore the latest mobile phones
        </Typography>
        <form onSubmit={handleLogin}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <OutlinedInput
                type="email"
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    email: e.target.value,
                  })
                }
                placeholder="Email Address"
                onBlur={handleEmailError}
                fullWidth
                error={emailError}
                startAdornment={
                  <InputAdornment position="start">
                    <MailLockIcon />
                  </InputAdornment>
                }
                sx={{
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                }}
              />
              {emailError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Please enter a valid email address.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
                onBlur={handlePasswordError}
                fullWidth
                error={passwordError}
                startAdornment={
                  <InputAdornment position="start">
                    <PasswordIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                }}
              />
              {passwordError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Please enter a valid password.
                </Typography>
              )}
            </Grid>
            {formError && (
              <Grid item xs={12}>
                <Alert severity="error">{formError}</Alert>
              </Grid>
            )}
            {formWarning && (
              <Grid item xs={12}>
                <Alert severity="warning">{formWarning}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <ReCAPTCHA sitekey={recaptchKeys.siteKey} onChange={onChange} />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!userVerified}
                sx={{
                  padding: "12px 0",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  backgroundColor: "#FF6F00",
                  "&:hover": {
                    backgroundColor: "#E65100",
                  },
                }}
              >
                LOGIN
              </Button>
            </Grid>
          </Grid>
        </form>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: "#FF6F00" }}
          onClick={() => navigate("/ForgotPassword")}
        >
          Forgot Password?
        </Button>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="body2">Don't have an account?</Typography>
          <Button
            variant="text"
            sx={{ ml: 1, color: "#FF6F00" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Error: {formError}
        </Alert>
      </Snackbar>
      {/* Dialog for account lock notification */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Account Locked</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Your account has been locked due to multiple failed login attempts. Please try again later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Login;
