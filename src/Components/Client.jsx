import  { useState, useEffect } from "react";
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
  TextField,
} from "@mui/material";
import axios from "axios";

function Client() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch clients data when component mounts
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/fetch_cli/fetch_cli");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter((client) =>
    Object.values(client)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4 style={{ textAlign: "center" }}>List of clients</h4>

      <Paper>
        <TextField
          size="small"
          sx={{ width: "300px", marginLeft: "60%" }}
          margin="normal"
          id="search"
          label="Search for a client"
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
          // Mettre à jour la valeur de recherche lors du changement
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <TableContainer
        elevation={3}
        component={Paper}
        style={{ marginTop: "20px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Email address</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.Id_cli}>
                <TableCell>{client.Name}</TableCell>
                <TableCell>{client.FirstName}</TableCell>
                <TableCell>{client.Email}</TableCell>
                <TableCell>{client.Address}</TableCell>
                <TableCell>{client.Phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Client;
