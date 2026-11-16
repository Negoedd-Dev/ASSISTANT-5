// import { useState } from "react";
// import GlobalStyles from "./styles/GlobalSyles";
// import Header from "./components/Header";
// import List from "./components/List";
// import Footer from "./components/Footer";

// import "./App.css";

// function App() {
//   return (
//     <>
//       <GlobalStyles />
//       <Header />
//       <div className="principal">
//         <List />
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default App;
// * =====================================================================================================
// import { useState } from "react";
// import GlobalStyles from "./styles/GlobalSyles";
// import Header from "./components/Header";
// import dicas from "./Dados/dicas.json";
// import List from "./components/List";
// import Cards from "./components/Cards";
// import useStatusDicas from "./useStatus/useStatusDicas";
// import Footer from "./components/Footer";

// export default function App() {
//   const { statusDe, marcarVista, alternarLida } = useStatusDicas();
//   const [indiceAberto, setIndiceAberto] = useState(null);
//   const idioma = "pt"; // na Versão 2 vira um estado com os botões PT/EN

//   // Na Versão 2, esta será a lista já filtrada pela busca e pelo tipo
//   const list = dicas;

//   function abrir(indice) {
//     setIndiceAberto(indice);
//     marcarVista(list[indice].id);
//   }

//   const dicaAberta = indiceAberto !== null ? list[indiceAberto] : null;

//   return (
//     <>
//       <GlobalStyles />
//       <Header />
//       <div className="principal">
//         <div>
//           <List
//             dicas={list}
//             idioma={idioma}
//             statusDe={statusDe}
//             onSelecionar={abrir}
//           />

//           {dicaAberta && (
//             <Cards
//               dica={dicaAberta}
//               idioma={idioma}
//               lida={statusDe(dicaAberta) === "lida"}
//               temProxima={indiceAberto < list.length - 1}
//               onAlternarLida={() => alternarLida(dicaAberta.id)}
//               onProxima={() => abrir(indiceAberto + 1)}
//               onFechar={() => setIndiceAberto(null)}
//             />
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
// * ================================================================================================================
import { useState } from "react";
import GlobalStyles from "./styles/GlobalSyles";
import Header from "./components/Header";
import dicas from "./Dados/dicas.json";
import List from "./components/List";
import Cards from "./components/Cards";
import useStatusDicas from "./useStatus/useStatusDicas";
import Footer from "./components/Footer";

export default function App() {
  const { statusDe, marcarVista, alternarLida } = useStatusDicas();
  const [indiceAberto, setIndiceAberto] = useState(null);
  const [programa, setPrograma] = useState("Todos");
  const idioma = "pt"; // na Versão 2 vira um estado com os botões PT/EN

  const apps = ["Todos", ...new Set(dicas.map((d) => d.programa))];

  // Na Versão 2, esta será a lista já filtrada pela busca e pelo tipo
  const list =
    programa === "Todos" ? dicas : dicas.filter((d) => d.programa === programa);

  function filtrar(novoPrograma) {
    setPrograma(novoPrograma);
    setIndiceAberto(null);
  }

  function abrir(indice) {
    setIndiceAberto(indice);
    marcarVista(list[indice].id);
  }

  const dicaAberta = indiceAberto !== null ? list[indiceAberto] : null;

  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="principal">
        <div>
          <List
            dicas={list}
            apps={apps}
            programa={programa}
            onFiltrar={filtrar}
            idioma={idioma}
            statusDe={statusDe}
            onSelecionar={abrir}
          />

          {dicaAberta && (
            <Cards
              dica={dicaAberta}
              idioma={idioma}
              lida={statusDe(dicaAberta) === "lida"}
              temProxima={indiceAberto < list.length - 1}
              onAlternarLida={() => alternarLida(dicaAberta.id)}
              onProxima={() => abrir(indiceAberto + 1)}
              onFechar={() => setIndiceAberto(null)}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
