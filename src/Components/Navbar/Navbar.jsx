import "./Navbar.css";
import ENI from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const MenuLinks = [
  {
    name: "Home",
    link: "/Primo",
  },
  {
    name: "Search flight",
    link: "/Search",
  },
  {
    name: "Do reservation",
    link: "/Primo",
  },
  {
    name: "Help",
    link: "/Help",
  },
];
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div data-aos="fade-down" className="container py-4">
        <div className="flex items-center justify-between">
          {/* logo section */}
          <div className="flex items-center gap-4">
            <img src={ENI} className="w-1/6 h-auto" />
            <div className="flex flex-col font-bold text-gray-600 leading-5">
              <span>Ticket Airline</span>
            </div>
          </div>
          {/* links section */}
          <div className="hidden md:block">
            <ul className="center" style={{ whiteSpace: "nowrap" }}>
              {MenuLinks.map((data, index) => {
                return (
                  <li key={index}>
                    <a
                      className="navlink cursor-pointer"
                      onClick={() => navigate(`${data.link}`)}
                    >
                      {" "}
                      {data.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Search section */}
          <div className="flex items-center gap-6">
            <div
              className="center navlink cursor-pointer"
              onClick={() => navigate("/")}
            >
              Se connecter
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
