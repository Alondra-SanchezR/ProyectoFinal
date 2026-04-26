import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MetodologiasSW() {
  const navigate = useNavigate();
  // Estado para controlar qué imagen se muestra en el modal
  const [modalImage, setModalImage] = useState(null);

  // Función para abrir el modal con una imagen específica (Solo el nombre del archivo)
  const openModal = (imageName) => {
    setModalImage(imageName);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="dark-layout">
      <div
        className="metodologias-container"
        style={{ textAlign: "center", maxWidth: "900px", position: "relative" }}
      >
        <h1>METODOLOGÍAS DE DESARROLLO DE SW</h1>
        <h2 style={{ fontWeight: "normal" }}>
          ¿Qué es una metodología de desarrollo de software?
        </h2>
        <p style={{ color: "#ccc", margin: "20px 0" }}>
          Las metodologías de desarrollo de software son un conjunto de técnicas
          y métodos organizativos que se aplican para diseñar soluciones de
          software informático. El objetivo de las distintas metodologías es el
          de intentar organizar los equipos de trabajo para que estos
          desarrollen las funciones de un programa de la mejor manera posible.
        </p>

        <h2>TIPOS DE METODOLOGÍAS</h2>
        <hr style={{ borderColor: "#444", margin: "30px 0" }} />

        {/* Primera Fila: Rutas limpias sin "src/" */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <button
            className="btn-met"
            style={{ backgroundColor: "#0d6efd" }}
            onClick={() => openModal("cascada.png")}
          >
            CASCADA
          </button>
          <button
            className="btn-met"
            style={{ backgroundColor: "#6c757d" }}
            onClick={() => openModal("modelov.png")}
          >
            MODELO V
          </button>
          <button
            className="btn-met"
            style={{ backgroundColor: "#198754" }}
            onClick={() => openModal("agiles.png")}
          >
            ÁGILES
          </button>
          <button
            className="btn-met"
            style={{ backgroundColor: "#dc3545" }}
            onClick={() => openModal("scrum.png")}
          >
            SCRUM
          </button>
        </div>

        {/* Segunda Fila */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            className="btn-met"
            style={{ backgroundColor: "#ffc107", color: "black" }}
            onClick={() => openModal("kanban.png")}
          >
            KANBAN
          </button>
          <button
            className="btn-met"
            style={{ backgroundColor: "#0dcaf0", color: "black" }}
            onClick={() => openModal("xp.png")}
          >
            XP
          </button>
          <button
            className="btn-met btn-outline"
            onClick={() => openModal("hibridas.png")}
          >
            HÍBRIDAS
          </button>
        </div>

        <hr className="my-5" />

        {/* Enlaces y Footer */}
        <h3>LINK A TABLERO DE TRABAJO</h3>
        <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
          <a
            href="https://ingreyeslara.atlassian.net/jira/software/projects/KT/boards/290"
            className="btn btn-outline-primary"
            target="_blank"
            rel="noreferrer"
          >
            ---- JIRA ----
          </a>
        </div>

        <hr style={{ borderColor: "#444", margin: "40px 0" }} />

        <button className="text-link-btn" onClick={() => navigate("/")}>
          ---- REGRESAR MENÚ PRINCIPAL ----
        </button>

        <div className="mt-5">
          <h3 className="text-muted">
            "UN GRAN PODER CONLLEVA UNA GRAN RESPONSABILIDAD "
          </h3>
          <h2 className="mt-4">Alumno: Sánchez Rodríguez Alondra Abigail</h2>
        </div>

        <hr className="my-5" />

        {/* --- MODAL PARA MOSTRAR IMÁGENES --- */}
        {modalImage && (
          <div
            className="modal-overlay"
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: "80%",
                maxHeight: "80%",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: 0,
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✕ Cerrar
              </button>
              <img
                src={`./${modalImage}`}
                alt="Metodología"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "2px solid #444",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetodologiasSW;
