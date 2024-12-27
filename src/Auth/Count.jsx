import  { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Count() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    Confirm: "",
    Image: null,
    Name: "",
    FirstName: "",
    Address: "",
    Phone: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("../../public/Person.jpeg");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyUp = (e) => {
      setCapsLockActive(e.getModifierState("CapsLock"));
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    if (e.target.name === "Image") {
      const image = e.target.files[0];
      setFormData({
        ...formData,
        Image: image,
      });
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(image);
      } else {
        setImagePreview("../../public/Person.jpeg");
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });

      if (e.target.name === "Password") {
        const password = e.target.value;
        if (!password) {
          setPasswordError("");
        } else if (password.length < 6) {
          setPasswordError("Password must be at least 6 characters long");
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
          setPasswordError(
            "Password must contain at least one digit, one lowercase and one uppercase letter"
          );
        } else {
          setPasswordError("");
        }
      }

      if (e.target.name === "Confirm") {
        const confirm = e.target.value;
        if (!confirm) {
          setConfirmError("");
        } else if (confirm !== formData.Password) {
          setConfirmError("Passwords do not match");
        } else {
          setConfirmError("");
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Username ||
      !formData.Email ||
      !formData.Password ||
      !formData.Confirm ||
      !formData.Image ||
      !formData.Name ||
      !formData.FirstName ||
      !formData.Address ||
      !formData.Phone
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill out all the required fields.",
      });
      return;
    }

    if (formData.Password !== formData.Confirm) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "The password and confirm password fields do not match.",
      });
      return;
    }

    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append("Username", formData.Username);
      formDataWithImage.append("Email", formData.Email);
      formDataWithImage.append("Password", formData.Password);
      formDataWithImage.append("Confirm", formData.Confirm);
      formDataWithImage.append("Image", formData.Image);
      formDataWithImage.append("Name", formData.Name);
      formDataWithImage.append("FirstName", formData.FirstName);
      formDataWithImage.append("Address", formData.Address);
      formDataWithImage.append("Phone", formData.Phone);

      const response = await fetch("http://localhost:8081/users", {
        method: "POST",
        body: formDataWithImage,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User created successfully.",
        });
        setFormData({
          Username: "",
          Email: "",
          Password: "",
          Confirm: "",
          Image: null,
          Name: "",
          FirstName: "",
          Address: "",
          Phone: "",
        });
        setImagePreview("../../public/Person.jpeg");
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create user.",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create user.",
      });
    }
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
          Create an Account
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h4 style={{ marginLeft: "240px"}}>Please choose an image</h4>
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
                src={imagePreview}
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
            onChange={handleChange}
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
                value={formData.Name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="First Name"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Username"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Password"
                name="Password"
                type={showPassword ? "text" : "password"}
                value={formData.Password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: passwordError && (
                    <ErrorOutlineIcon
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      color="error"
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Phone Number"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Address"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Email Address"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                size="small"
                margin="normal"
                label="Confirm Password"
                name="Confirm"
                type={showPassword ? "text" : "password"}
                value={formData.Confirm}
                onChange={handleChange}
                error={!!confirmError}
                helperText={confirmError}
                InputProps={{
                  endAdornment: confirmError && (
                    <ErrorOutlineIcon
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      color="error"
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
          {capsLockActive && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
                <Typography variant="body2" color="error">
                  Caps Lock is On
                </Typography>
              </Box>
            )}
          <div style={{ marginLeft: "280px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={handleShowPassword}
                  color="primary"
                />
              }
              label="Show Password"
            />
           
            <br />
            <Button type="submit" variant="contained" sx={{ textTransform: "none"}}>
              Save
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => navigate("/")}
              variant="contained"
              sx={{ textTransform: "none"}}
            >
              Back
            </Button>
          </div>
        </Box>
      </Paper>
    </Container>
  );
}

export default Count;
