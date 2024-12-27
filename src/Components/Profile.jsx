import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Profile() {
  const [userData, setUserData] = useState({
    Name: "",
    FirstName: "",
    Username: "",
    Phone: "",
    Address: "",
    Email: "",
  });
  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login page if not logged in
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch user data from backend
    const getUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(`http://localhost:8081/users/${userId}`);
        if (!response.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const data = await response.json();
        setUserData(data);
        setUserId(userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    // Fetch user image from backend
    const getUserImage = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(
          `http://localhost:8081/users/${userId}/image`
        );
        if (!response.ok) {
          console.error("Failed to fetch user image");
          return;
        }

        const data = await response.json();
        setUserImage(data.imageUrl);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    getUserImage();
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      axios.put(
        `http://localhost:8081/update_user/update_user/${userId}`,
        userData
      );
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("userId from localStorage:", userId);
      axios.delete(
        `http://localhost:8081/delete_user/delete_user/${userId}`,
        userData
      );
      Swal.fire({
        icon: "success",
        title: "User deleted successfully",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  const handleConfirmDelete = (userId) => {
    console.log("userId:", userId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProfile(userId);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "40px",
          width: "180%",
          marginLeft: "-150px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Your profile
        </Typography>
        <Box component="form" encType="multipart/form-data">
          <label htmlFor="imageInput">
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "inline-block",
                marginBottom: "20px",
                border: "2px solid #ccc",
                marginLeft: "280px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <img
                src={userImage}
                alt="Selected"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
          </label>

          <input
            type="file"
            name="Image"
            id="imageInput"
            style={{ display: "none" }}
          />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Last Name"
                name="Name"
                value={userData.Name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="First Name"
                name="FirstName"
                value={userData.FirstName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Username"
                name="Username"
                value={userData.Username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Phone Number"
                name="Phone"
                value={userData.Phone}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Address"
                name="Address"
                value={userData.Address}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Email Address"
                name="Email"
                type="email"
                value={userData.Email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 2, marginLeft: 23.5 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleConfirmDelete(userId)}
              sx={{ marginLeft: 2 }}
            >
              Delete Profile
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
