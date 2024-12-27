import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import axios from "axios";

function Home() {
  const [datao, setData] = useState([]);
  const [client, setClient] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [revenue, setRevenue] = useState({ totalRevenue: 0 });

  const totalVol = datao.length;
  const totalClient = client.length;
  const totalReservation = reservation.length;
  const totalRevenue = revenue.totalRevenue;

  const fetchVols = () => {
    axios
      .get("http://localhost:8081/fetch_fli/fetch_fli")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de vol:",
          error
        );
      });
  };

  const fetchClient = () => {
    axios
      .get("http://localhost:8081/fetch_clie/fetch_clie")
      .then((response) => {
        setClient(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de client:",
          error
        );
      });
  };

  const fetchReservation = () => {
    axios
      .get("http://localhost:8081/fetch_res/fetch_res")
      .then((response) => {
        setReservation(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de réservation:",
          error
        );
      });
  };

  const fetchRevenue = () => {
    axios
      .get("http://localhost:8081/fetch_rev/fetch_rev")
      .then((response) => {
        if (response.data.length > 0) {
          const totalRevenue = response.data[0].totalRevenue;
          setRevenue({ totalRevenue });
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de revenu:",
          error
        );
      });
  };

  useEffect(() => {
    fetchVols();
    fetchClient();
    fetchReservation();
    fetchRevenue();
  }, []);

  return (
    <div className="mb-3">
      <div className="container-fluid p-3 bg-neutral-300 mb-0">
        <div className="row">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3 bg-white">
            <div className="d-flex justify-content-between p-4 align-items-center bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-people fs-1 text-success"></i>
              <div>
                <span>Clients</span>
                <h2>{totalClient}</h2>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3 bg-white">
            <div className="d-flex justify-content-between p-4 align-items-center bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-airplane fs-1 text-secondary"></i>
              <div>
                <span>Vols</span>
                <h2>{totalVol}</h2>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3 bg-white">
            <div className="d-flex justify-content-between p-4 align-items-center bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-calendar-event fs-1 text-info"></i>
              <div>
                <span>Réservation</span>
                <h1>{totalReservation}</h1>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3 bg-white">
            <div className="d-flex justify-content-between p-4 align-items-center bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-currency-dollar fs-1 text-warning"></i>
              <div>
                <span>Revenu Total</span>
                <h4>{totalRevenue} €</h4>
              </div>
            </div>
          </div>
         
        </div>
      </div>
      <div className="row">
      <div className="col-12 col-md-8 p-3">
          <LineChart></LineChart>
        </div>
        <div className="col-12 col-md-4 p-3">
          <PieChart></PieChart>
        </div>
      </div>
    </div>
  );
}

export default Home;
