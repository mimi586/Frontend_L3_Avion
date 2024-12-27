import { useState, useEffect } from "react";
import dayjs from "dayjs"; // Import Day.js
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Box,
  Container,
  CssBaseline,
  Backdrop,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Swal from "sweetalert2";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomTimePicker from "./CustomTimePicker"; // Import CustomTimePicker

function Add_fli({ open, handleClose, onSuccess }) {
  const [formData, setFormData] = useState({
    Id_fli: "",
    Departure_airport: "",
    Arrival_airport: "",
    Departure_time: dayjs(), // Set initial value to current date and time
    Status: "Available",
    Total_seats: "",
    Price: "",
  });

  const [userModifiedTime, setUserModifiedTime] = useState(false);

  useEffect(() => {
    if (!userModifiedTime) {
      const interval = setInterval(() => {
        setFormData((prevData) => ({
          ...prevData,
          Departure_time: dayjs(),
        }));
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [userModifiedTime]);

  const handleChange = (e, value, fieldName) => {
    setFormData({ ...formData, [fieldName]: value });
    if (fieldName === "Departure_time") {
      setUserModifiedTime(true); // User modified the date/time
    }
  };

  const departureAirports = [
    "Fianarantsoa",
    "Antananarivo",
    "Toliara",
    "Toamasina",
    "Antsiranana",
    "Mahajanga",
  ];
  const arrivalAirports = [
    "Fianarantsoa",
    "Antananarivo",
    "Toliara",
    "Toamasina",
    "Antsiranana",
    "Mahajanga",
  ];

  const status = ["Available", "Unavailable"];

  const handleSubmit = async () => {
    try {
      // Field validation
      if (
        !formData.Id_fli ||
        !formData.Departure_airport ||
        !formData.Arrival_airport ||
        !formData.Departure_time ||
        !formData.Status ||
        !formData.Total_seats ||
        !formData.Price
      ) {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please fill in all fields",
        });
        return;
      }

      // Check if departure and arrival airports are the same
      if (formData.Departure_airport === formData.Arrival_airport) {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Departure and arrival airports cannot be the same",
        });
        return;
      }
      if (formData.Price == 0) {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Price must be more than 0",
        });
        return;
      }

      const formattedDepartureTime = dayjs(formData.Departure_time).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      await axios.post("http://localhost:8081/add_fli/add_fli", {
        ...formData,
        Departure_time: formattedDepartureTime,
      });

      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Flight added successfully",
        showConfirmButton: false,
        timer: 1250,
      });
      // Call onSuccess to update client data in the parent component
      if (onSuccess) {
        onSuccess();
      }

      setFormData({
        Id_fli: "",
        Departure_airport: "",
        Arrival_airport: "",
        Departure_time: dayjs(), // Reset to current date and time
        Status: "Available",
        Total_seats: "",
        Price: "",
      });
      setUserModifiedTime(false); // Reset userModifiedTime
    } catch (err) {
      console.error("Error during POST request:", err);
      if (err.response && err.response.status === 409) {
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Flight number already exists",
        });
      } else {
        handleClose(); // Otherwise, display a generic error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding this flight",
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: { backdropFilter: "blur(5px)" },
      }}
    >
      <DialogTitle style={{ textAlign: "center", marginTop: "0px" }}>
        Add a Flight
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Container>
            <CssBaseline />
            <Box component="form" noValidate sx={{ mt: 0 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Airplane number"
                name="Id_fli"
                type="text"
                autoComplete="Airplane number"
                autoFocus
                size="small"
                value={formData.Id_fli}
                onChange={(e) => handleChange(e, e.target.value, "Id_fli")}
              />
              <Autocomplete
                fullWidth
                value={formData.Departure_airport}
                onChange={(e, value) =>
                  handleChange(e, value, "Departure_airport")
                }
                options={departureAirports}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Departure airport"
                    size="small"
                  />
                )}
              />
              <Autocomplete
                fullWidth
                value={formData.Arrival_airport}
                onChange={(e, value) =>
                  handleChange(e, value, "Arrival_airport")
                }
                options={arrivalAirports}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Arrival airport"
                    size="small"
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CustomTimePicker
                  label="Departure time"
                  value={formData.Departure_time}
                  onChange={(value) => handleChange(null, value, "Departure_time")}
                />
              </LocalizationProvider>

              <Autocomplete
                fullWidth
                value={formData.Status}
                onChange={(e, value) => handleChange(e, value, "Status")}
                options={status}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Status of airplane"
                    size="small"
                  />
                )}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Price"
                name="Price"
                type="number"
                autoComplete="Price"
                size="small"
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                }}
                value={formData.Price}
                onChange={(e) => handleChange(e, e.target.value, "Price")}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Number of places"
                name="Total_seats"
                type="text"
                autoComplete="Number of places"
                size="small"
                value={formData.Total_seats}
                onChange={(e) => handleChange(e, e.target.value, "Total_seats")}
              />
            </Box>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button variant="outlined" color="info" onClick={handleSubmit}>
                <AddIcon /> Add
              </Button>
            </div>
          </Container>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

Add_fli.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default Add_fli;
