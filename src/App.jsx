import { useState } from "react";
import GlobalStyles from "./styles/GlobalSyles";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="principal">
        <h1>conteudo</h1>
      </div>
    </>
  );
}

export default App;
