import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MailLockIcon from "@mui/icons-material/MailLock";
import PasswordIcon from "@mui/icons-material/Password";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sound from "../../assets/sound.wav";
import { allLetter } from "../../lib/input-validation";
import userServices from "../../services/userService";
import { usePurchase } from "../../utils/purchaseContext";
import { ResponsiveAppBarHomepage } from "../AppBar/ResponsiveAppBarHomepage";
import { MySnackbar } from "../MySnackbar";

export const Profile = () => {
  const purchase = usePurchase();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [newName, setNewName] = useState("");
  const [file, setFile] = useState(null);
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

  useEffect(() => {
    userServices
      .getUser()
      .then((res) => setUser(res.data))
      .catch((err) => window.alert(err.response.data.error));
  }, []);

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
      "Are you sure you want to change your profile picture?"
    );
    if (confirmation) {
      userServices
        .uploadProfileImage(file)
        .then((res) => {
          setUser({ ...user, picture: res.data.filename });

          play();
          setSnack({
            type: "success",
            message: "Profile picture changed successfully",
          });
          setOpen(true);

          setFile(null);
        })
        .catch((err) => {
          play();
          setSnack({
            type: "error",
            message:
              "Failed to upload images. Only support jpg, jpeg, png format.",
          });
          setOpen(true);
        });
    }
  };

  const handleChangeName = (e) => {
    e.preventDefault();
    if (!allLetter(newName)) {
      play();
      setSnack({
        type: "error",
        message: "Please, enter a valid name",
      });
      setOpen(true);
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to change your name?"
    );
    if (confirmation) {
      userServices
        .changeName({ fullName: newName })
        .then((res) => {
          setUser({ ...user, fullName: newName });

          play();
          setSnack({
            type: "success",
            message: "Name changed successfully",
          });
          setOpen(true);

          setNewName("");
          window.name_modal.close();
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
      <ResponsiveAppBarHomepage
        purchaseProductLength={purchase.purchase.length}
      />
      <div style={styles.profileContainer}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            <img
              src={`https://localhost:3005/profile/${user.picture}`}
              alt="Profile"
              style={styles.avatarImage}
            />
          </div>
        </div>
        <div style={styles.userInfoContainer}>
          <div style={styles.userInfo}>
            <h3 style={styles.userName}>
              <span style={styles.boldText}>Name: </span>
              {user.fullName}
            </h3>
            <h3 style={styles.userEmail}>
              <span style={styles.boldText}>Email: </span>
              {user.email}
            </h3>
          </div>
          <form style={styles.uploadForm} onSubmit={handleUpload}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={styles.fileInput}
            />
            <Button
              variant="contained"
              type="submit"
              startIcon={<CloudUploadIcon />}
              sx={styles.uploadButton}
            >
              Upload Picture
            </Button>
          </form>
        </div>
      </div>
      <div style={styles.actionsContainer}>
        <Button
          variant="contained"
          onClick={() => document.getElementById("name_modal").showModal()}
          startIcon={<MailLockIcon />}
          sx={styles.actionButton}
        >
          Change full name
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/changePassword")}
          startIcon={<PasswordIcon />}
          sx={styles.actionButton}
        >
          Change password
        </Button>
      </div>
      <MySnackbar
        open={open}
        handleClose={handleClose}
        type={snack.type}
        message={snack.message}
      />

      <dialog id="name_modal" style={styles.modal}>
        <div style={styles.modalBox}>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 style={styles.modalTitle} align="left">
            New full name:
          </h3>
          <form onSubmit={handleChangeName}>
            <input
              type="text"
              style={styles.nameInput}
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              required
            />
            <input
              type="submit"
              value="Change name"
              style={styles.changeNameButton}
            />
          </form>
        </div>
      </dialog>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#f4f6f8",
    color: "#333",
    minHeight: "100vh",
    padding: "20px",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "40px",
    gap: "20px",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "5px solid #003366",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  userInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  userInfo: {
    marginBottom: "20px",
    textAlign: "center",
  },
  userName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#003366",
  },
  userEmail: {
    fontSize: "1.5rem",
    color: "#003366",
  },
  boldText: {
    fontWeight: "bold",
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fileInput: {
    marginBottom: "10px",
    fontSize: "1rem",
  },
  uploadButton: {
    backgroundColor: "#003366",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#002244",
    },
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    gap: "20px",
  },
  actionButton: {
    backgroundColor: "#003366",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#002244",
    },
  },
  modal: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  modalBox: {
    padding: "20px",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  nameInput: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #cccccc",
  },
  changeNameButton: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#003366",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#002244",
    },
  },
};

export default Profile;
