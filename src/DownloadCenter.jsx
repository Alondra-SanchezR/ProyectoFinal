import React from "react";
import { useNavigate } from "react-router-dom";

function DownloadCenter() {
  const navigate = useNavigate();

  const downloadFile = (fileName) => {
    const link = document.createElement("a");
    link.href = `/${fileName}`;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="dark-layout">
      <div className="download-card">
        <h1 className="download-title">Centro de Descargas</h1>
        <p className="download-desc">
          Haz clic en los botones para obtener tus archivos PDF.
        </p>

        <div className="button-group">
          <button
            className="btn btn-blue"
            onClick={() => downloadFile("comandos.pdf")}
          >
            COMANDOS BÁSICOS DE REACT
          </button>

          <button
            className="btn btn-green"
            onClick={() => downloadFile("ieee.pdf")}
          >
            ISO / ESTANDAR IEEE
          </button>

          <button
            className="btn btn-dark"
            onClick={() => downloadFile("requerimientos.pdf")}
          >
            REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES
          </button>

          <button
            className="btn btn-dark"
            onClick={() => downloadFile("sha_256.pdf")}
          >
            CÓDIGO PYTHON ALGORITMO SHA-256
          </button>

          <button className="btn btn-dark-exit" onClick={() => navigate("/")}>
            REGRESAR AL PROYECTO PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadCenter;
