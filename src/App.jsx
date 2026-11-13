import { useState } from "react";
import GlobalStyles from "./styles/GlobalSyles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import List from "./components/List";

import "./App.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="principal">
        <List />
      </div>
      <Footer />
    </>
  );
}

export default App;
