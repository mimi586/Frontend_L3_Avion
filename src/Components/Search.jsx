import {  TextField, Autocomplete, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function Search() {
  const [flights, setFlights] = useState([]);
  const [, setSelectedFlight] = useState(null);
  const [price, setPrice] = useState([]);
  const [departure, setDeparture] = useState("");

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/fetch_fl/fetch_fl"
      );
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleFlightChange = (event, value) => {
    setSelectedFlight(value);
    if (value) {
      setDeparture(value.Departure_time);
      setPrice(value.Price);
    }
  };

  return (
    <div >
      < >
       <div style={{ marginTop: "150px" }} >
       <Typography style={{ textAlign: "center" }}>Search a flight available</Typography>
        <Autocomplete
          fullWidth
          name="Airport"
          options={flights}
          getOptionLabel={(option) =>
            `${option.Departure_airport} to ${option.Arrival_airport}`
          }
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
       </div>
      </>
    </div>
  );
}

export default Search;
