import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import dayjs from "dayjs";
import Add_fli from "./Crud_fli/Add_fli";
import Update_fli from "./Crud_fli/Update_fli";
import Swal from "sweetalert2";

function Flight() {
  const [flights, setFlights] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModify = (flight) => {
    setSelectedFlight(flight);
    setOpenModify(true);
  };

  const handleCloseModify = () => {
    setOpenModify(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get("http://localhost:8081/fetch_fli/fetch_fli");
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleDeleteFlight = async (flightId) => {
    try {
       axios.delete(`http://localhost:8081/delete_fli/delete_fli/${flightId}`);
      Swal.fire({
        icon: "success",
        title: "Flight deleted successfully",
      });
      fetchFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
    }
  };

  const handleConfirmDelete = async (flightId) => {
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
        handleDeleteFlight(flightId);
      }
    });
  };

  // Filter flights based on the search term
  const filteredFlights = flights.filter((flight) =>
    Object.values(flight)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4 style={{ textAlign: "center" }}>List of flight</h4>

      <Paper>
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: "20px", marginLeft: "10px", textTransform: "none" }}
          onClick={handleOpen}
        >
          <AddIcon /> Add
        </Button>
        <Add_fli open={open} handleClose={handleClose} onSuccess={fetchFlights} />
        <Update_fli
          openModify={openModify}
          handleCloseModify={handleCloseModify}
          onSuccess={fetchFlights}
          selectedFlight={selectedFlight}
        />

        <TextField
          size="small"
          sx={{ width: "300px", marginLeft: "60%" }}
          margin="normal"
          id="search"
          label="Search for a flight"
          name="search"
          type="text"
          autoComplete="search"
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          // Update search term value on change
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <TableContainer elevation={3} component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ whiteSpace: "nowrap" }}>Airplane number</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Departure airport</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Arrival airport</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Departure time</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Price of a ticket</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Number of places</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFlights.map((flight) => (
              <TableRow key={flight.Id_fli}>
                <TableCell style={{ whiteSpace: "nowrap" }}>{flight.Id_fli}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>{flight.Departure_airport}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>{flight.Arrival_airport}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {dayjs(flight.Departure_time).format('DD-MM-YYYY HH:mm:ss')}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>{flight.Status}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>{flight.Price} Ar</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>{flight.Total_seats}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleOpenModify(flight)}
                    sx={{ textTransform: "none" }}
                  >
                    <EditIcon /> Edit
                  </Button>
                  <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    color="error"
                    onClick={() => handleConfirmDelete(flight.Id_fli)}
                    sx={{ textTransform: "none" }}
                  >
                    <DeleteIcon /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Flight;
