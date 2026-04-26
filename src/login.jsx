import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const navigate = useNavigate();

  const clientId =
    "518911621821-uhco07p64moks0p76ps53l49mc8q4684.apps.googleusercontent.com";
  const onSuccess = (response) => {
    console.log("Login Success:", response);
    // Aquí normalmente decodificarías el JWT (token) para obtener los datos del usuario
    navigate("/documentacion"); // Redirigir a la página de documentación después del login
  };

  const onError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <header className="App-header">
          <div>
            <img src="/profile.jpeg" width="30%" height="30%" />
          </div>
          <h1>ANÁLISIS Y DISEÑO DE SOFTWARE</h1>
          <h2>Alumno(a): Fernanda Sosa Pérez</h2>

          <a
            className="App-link"
            href="https://www.linkedin.com/..."
            target="_blank"
            rel="noopener noreferrer"
          >
            LINKED IN DE MI PROFILE
          </a>
          <br />
          <a
            className="App-link"
            href="https://www.medikt.com.mx/practicas/documentacion.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            DOCUMENTACION PARCIAL 1
          </a>
          <br />
          <a
            className="App-link"
            href="https://www.medikt.com.mx/practicas/parcial_2.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            DOCUMENTACION PARCIAL 2
          </a>
          <div style={{ margin: "20px" }}>
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              type="standard"
              size="large"
              theme="filled_blue"
              shape="pill"
              text="signin_with"
            />
          </div>
        </header>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
