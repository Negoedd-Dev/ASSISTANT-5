import React from "react";
import "./Footer.css";
import RedesSociais from "../RedesSocias";

export default function Footer() {
  return (
    <div className="footer">
      <footer className="description">
        &copy; Negoedd-Dev 2026. Todos os direitos reservados.
      </footer>
      <RedesSociais />
    </div>
  );
}
