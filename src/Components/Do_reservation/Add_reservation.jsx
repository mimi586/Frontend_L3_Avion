import  { useState, useEffect } from "react";
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
import Add from "@mui/icons-material/Add";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";

function AddReservation({ open, handleClose, onSuccess }) {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [departure, setDeparture] = useState("");

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get("http://localhost:8081/fetch_fl/fetch_fl");
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching flights!',
      });
    }
  };

  const handleFlightChange = (event, value) => {
    console.log("Selected flight:", value);
    setSelectedFlight(value);
    if (value) {
      const calculatedPrice = value.Price * numberOfSeats;
      const formattedDeparture = format(new Date(value.Departure_time), "dd-MM-yyyy HH:mm:ss");
      setDeparture(formattedDeparture);
      setPrice(value.Price);
      setTotalPrice(calculatedPrice);
    }
  };

  const handleSeatsChange = (event) => {
    const seats = parseInt(event.target.value, 10);
    setNumberOfSeats(seats);
    if (selectedFlight) {
      const calculatedPrice = selectedFlight.Price * seats;
      setTotalPrice(calculatedPrice);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    handleClose();
    if (!selectedFlight || numberOfSeats <= 0) {
      handleClose();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a flight and ensure the number of seats is greater than 0.',
      });
      return;
    }
    const departureAirport = selectedFlight ? selectedFlight.Departure_airport : '';
const arrivalAirport = selectedFlight ? selectedFlight.Arrival_airport : '';

    const reservationData = {
      Id_res: selectedFlight.Id_fli, 
      Airport: `${departureAirport} to ${arrivalAirport}`, 
      DepartureTime: departure,
      PriceOnce: price,
      NumberOfSeats: numberOfSeats,
      TotalPrice: totalPrice
    };

    try {
      await axios.post("http://localhost:8081/Add_res/Add_res", reservationData);
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Reservation added successfully!',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding reservation:", error);
      handleClose();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error adding reservation!',
      });
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
        Add a reservation
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Container>
            <CssBaseline />
            <Box component="form" noValidate sx={{ mt: 0 }} onSubmit={handleSubmit}>
              <Autocomplete
                fullWidth
                name="Airport"
                options={flights}
                getOptionLabel={(option) => `${option.Departure_airport} to ${option.Arrival_airport}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Select a flight"
                    size="small"
                    name="Airport"
                  />
                )}
                onChange={handleFlightChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Departure time"
                name="DepartureTime"
                type="text"
                autoComplete="departure"
                size="small"
                value={departure}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Price"
                name="PriceOnce"
                type="text"
                autoComplete="totalPrice"
                size="small"
                value={price}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Number of seats"
                name="NumberOfSeats"
                type="number"
                autoComplete="numberOfSeats"
                size="small"
                value={numberOfSeats}
                onChange={handleSeatsChange}
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Total price"
                name="TotalPrice"
                type="text"
                autoComplete="totalPrice"
                size="small"
                value={totalPrice}
                InputProps={{
                  readOnly: true,
                }}
              />
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Button type="submit" variant="outlined" color="info">
                  <Add /> Add
                </Button>
              </div>
            </Box>
          </Container>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

AddReservation.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddReservation;
