import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <header className="App-header">
      <img src="profile.jpeg" className="App-logo-static" alt="profile" />
      <h1 className="title">ANÁLISIS Y DISEÑO DE SOFTWARE</h1>
      <h2 className="subtitle">Alumno(a): Alondra Abigail Sánchez Rodríguez</h2>

      <div className="links-container">
        <a
          href="https://www.linkedin.com/in/s%C3%A1nchez-rodr%C3%ADguez-s%C3%A1nchez-rodr%C3%ADguez-5aa50238a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          LINKED IN DE MI PROFILE
        </a>

        <button
          onClick={() => navigate("/documentacion")}
          className="text-link-btn"
        >
          DOCUMENTACION PARCIAL 1
        </button>

        {/* Nuevo botón para el Parcial 2 */}
        <button
          onClick={() => navigate("/parcial_2")}
          className="text-link-btn"
        >
          DOCUMENTACION PARCIAL 2
        </button>
      </div>
    </header>
  );
};

export default MainPage;
