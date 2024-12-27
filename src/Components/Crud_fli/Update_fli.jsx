import { useEffect, useState } from "react";
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
  Grid,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// CustomTimePicker Component
function CustomTimePicker({ label, value, onChange }) {
  const now = dayjs();

  const handleDateTimeChange = (e) => {
    const selectedDateTime = dayjs(e.target.value);
    if (selectedDateTime.isBefore(now)) {
      return;
    }
    onChange(selectedDateTime);
  };

  const handleHourChange = (e) => {
    const hour = e.target.value;
    const selectedDateTime = value.hour(hour);
    if (selectedDateTime.isBefore(now)) {
      return;
    }
    onChange(selectedDateTime);
  };

  const handleMinuteChange = (e) => {
    const minute = e.target.value;
    const selectedDateTime = value.minute(minute);
    if (selectedDateTime.isBefore(now)) {
      return;
    }
    onChange(selectedDateTime);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <TextField
          label={label}
          type="datetime-local"
          value={value.format('YYYY-MM-DDTHH:mm')}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={handleDateTimeChange}
          inputProps={{
            min: now.format('YYYY-MM-DDTHH:mm'), // Set minimum date and time to now
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          select
          label="Hour"
          value={value.format('HH')}
          onChange={handleHourChange}
          fullWidth
        >
          {[...Array(24).keys()].map((hour) => (
            <MenuItem
              key={hour}
              value={hour.toString().padStart(2, '0')}
              disabled={value.isBefore(now, 'hour') && hour < now.hour()}
            >
              {hour.toString().padStart(2, '0')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={3}>
        <TextField
          select
          label="Minute"
          value={value.format('mm')}
          onChange={handleMinuteChange}
          fullWidth
        >
          {[...Array(60).keys()].map((minute) => (
            <MenuItem
              key={minute}
              value={minute.toString().padStart(2, '0')}
              disabled={value.isSame(now, 'hour') && minute < now.minute()}
            >
              {minute.toString().padStart(2, '0')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}


CustomTimePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired, // Expecting a Dayjs object
  onChange: PropTypes.func.isRequired,
};

// Update_fli Component
function Update_fli({ openModify, handleCloseModify, selectedFlight, onSuccess }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedFlight) {
      setFormData({
        ...selectedFlight,
        Departure_time: selectedFlight.Departure_time ? dayjs(selectedFlight.Departure_time) : null,
      });
    }
  }, [selectedFlight]);

  const departureAirports = ["Fianarantsoa", "Antananarivo", "Toliara", "Toamasina", "Antsiranana", "Mahajanga"];
  const arrivalAirports = ["Fianarantsoa", "Antananarivo", "Toliara", "Toamasina", "Antsiranana", "Mahajanga"];
  const statusOptions = ["Available", "Unavailable"];

  const handleSubmit = async () => {
    if (!formData) {
      handleCloseModify();
      return;
    }
    if (
      formData.Id_fli === selectedFlight?.Id_fli &&
      formData.Departure_airport === selectedFlight?.Departure_airport &&
      formData.Arrival_airport === selectedFlight?.Arrival_airport &&
      formData.Departure_time === selectedFlight?.Departure_time &&
      formData.Departure_airport === selectedFlight?.Departure_airport &&
      formData.Status === selectedFlight?.Status &&
      formData.Price === selectedFlight?.Price &&
      formData.Total_seats === selectedFlight?.Total_seats
    ) {
      handleCloseModify();
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please modify at least one data before submitting.",
      });
      return;
    }

    if (formData.Departure_airport === formData.Arrival_airport) {
      handleCloseModify();
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Departure and arrival airports cannot be the same.",
      });
      return;
    }

    if (formData.Price <= 1) {
      handleCloseModify();
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Price must be more than 1.",
      });
      return;
    }

    if (formData.Total_seats == 0) {
      handleCloseModify();
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Total seats must be more than 1.",
      });
      return;
    }

    if (formData.Total_seats >= 401) {
      handleCloseModify();
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Total seats must be less than 401.",
      });
      return;
    }

    try {
      const formattedDepartureTime = formData.Departure_time.format('YYYY-MM-DD HH:mm:ss');
      await axios.put(`http://localhost:8081/Update_fli/Update_fli/${formData.Id_fli}`, {
        ...formData,
        Departure_time: formattedDepartureTime,
      });
      handleCloseModify();
      Swal.fire({
        icon: "success",
        title: "Update Successful!",
        text: "The flight has been updated successfully.",
      }).then(() => {
        if (onSuccess) {
          onSuccess();  // Trigger the success callback to refresh the data
        }
      });
    } catch (error) {
      console.error("Error updating flight:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while updating the flight. Please try again later.",
      });
      handleCloseModify();
    }
  };

  return (
    <Dialog
      open={openModify}
      onClose={handleCloseModify}
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: { backdropFilter: "blur(5px)" },
      }}
    >
      <DialogTitle style={{ textAlign: "center", marginTop: "0px" }}>
        Update a Flight
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
                value={formData.Id_fli || ""}
                onChange={(e) => setFormData({ ...formData, Id_fli: e.target.value })}
              />
              <Autocomplete
                fullWidth
                value={formData.Departure_airport || ""}
                onChange={(e, value) => setFormData({ ...formData, Departure_airport: value })}
                options={departureAirports}
                renderInput={(params) => (
                  <TextField {...params} margin="normal" label="Departure airport" size="small" />
                )}
              />
              <Autocomplete
                fullWidth
                value={formData.Arrival_airport || ""}
                onChange={(e, value) => setFormData({ ...formData, Arrival_airport: value })}
                options={arrivalAirports}
                renderInput={(params) => (
                  <TextField {...params} margin="normal" label="Arrival airport" size="small" />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CustomTimePicker
                  label="Departure time"
                  value={formData.Departure_time}
                  onChange={(value) => setFormData({ ...formData, Departure_time: value })}
                />
              </LocalizationProvider>
              <Autocomplete
                fullWidth
                value={formData.Status || ""}
                onChange={(e, value) => setFormData({ ...formData, Status: value })}
                options={statusOptions}
                renderInput={(params) => (
                  <TextField {...params} margin="normal" label="Status of airplane" size="small" />
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
                value={formData.Price || ""}
                onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Number of places"
                name="Total_seats"
                type="number"
                autoComplete="Number of places"
                size="small"
                value={formData.Total_seats || ""}
                onChange={(e) => setFormData({ ...formData, Total_seats: e.target.value })}
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                }}
              />
            </Box>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button variant="outlined" color="info" onClick={handleSubmit}>
                <EditIcon /> Update
              </Button>
            </div>
          </Container>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

Update_fli.propTypes = {
  openModify: PropTypes.bool.isRequired,
  handleCloseModify: PropTypes.func.isRequired,
  selectedFlight: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default Update_fli;
