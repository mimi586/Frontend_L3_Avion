import { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Add_reservation from "./Do_reservation/Add_reservation";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState(""); // Récupérer le rôle de l'utilisateur depuis le stockage local

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis le stockage local lors du chargement de la page
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    fetchReservations();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/fetch_res/fetch_res"
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservation:", error);
    }
  };

  const handleDelete = async (reservationId) => {
    try {
       axios.delete(`http://localhost:8081/delete_res/delete_res/${reservationId}`);
      Swal.fire({
        icon: "success",
        title: "Reservation deleted successfully",
      });
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const handleConfirmDelete = async (reservationId) => {
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
        handleDelete(reservationId);
      }
    });
  };


  return (
    <div>
      <h4 style={{ textAlign: "center" }}>List of reservation</h4>
      <Paper>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "10px",
            marginLeft: "10px",
            marginBottom: "10px",
            textTransform: "none",
          }}
          onClick={handleOpen}
        >
          <AddIcon />
          Add a reservation
        </Button>
      </Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Airport</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Price Once</TableCell>
              <TableCell>Number Of Seats</TableCell>
              <TableCell>Total Price</TableCell>
              {userRole === "admin" && <TableCell>Action</TableCell>} {/* Condition pour afficher la colonne Action */}
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.Id_res}>
                <TableCell>{reservation.Airport}</TableCell>
                <TableCell>
                  {dayjs(reservation.DepartureTime).format(
                    "DD-MM-YYYY HH:mm:ss"
                  )}
                </TableCell>
                <TableCell>{reservation.PriceOnce}</TableCell>
                <TableCell>{reservation.NumberOfSeats}</TableCell>
                <TableCell>{reservation.TotalPrice}</TableCell>
                {userRole === "admin" && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleConfirmDelete(reservation.Id_res)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Add_reservation
        open={open}
        handleClose={handleClose}
        onSuccess={fetchReservations}
      />
    </div>
  );
}

export default Reservation;
