import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SelectedCar from "./pages/SelectedCar";
import CarsPage from "./pages/CarsPage";
import SparesPage from "./pages/SparesPage";
import EVsPage from "./pages/EVsPage";
import AboutPage from "./pages/AboutPage";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import { URL } from "./constants";

function App() {

  const [cars, setCars] = useState([])

  useEffect(() => {
    fetch(`${URL}/cars`, {
      'methods': 'GET',
      headers: {
        'Content-Type': 'applications/json'
      }
    })
      .then(res => res.json())
      .catch(error => console.log(error))
  })

  return (
    <Router>
      <ScrollToTop />
      <div className="body-width">
        <Navigation />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/spares" element={<SparesPage />} />
          <Route path="/evs" element={<EVsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cars/:id" element={<SelectedCar />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;