import { useState } from "react";
import GlobalStyles from "./styles/GlobalSyles";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="principal">
        <h1>conteudo</h1>
      </div>
      <Footer />
    </>
  );
}

export default App;
