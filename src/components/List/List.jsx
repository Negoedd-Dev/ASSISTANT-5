import "./List.css";

// const itens = Array.from(({ length: 50 }, (__, i) => `Item ${i + 1}`));

// export default function List() {
//   return (
//     <div className="list-container">
//       <ul className="list">
//         {itens.map((item) => (
//           <li key={item} className="list-item">
//             {item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// * ======================================================================================================

// ListaDicas.jsx
// import dicas from "../../Dados/dicas.json";

// export default function List() {
//   return (
//     <div style={{ maxHeight: 400, overflowY: "auto" }}>
//       {dicas.map((dica) => (
//         <div
//           key={dica.id}
//           style={{ padding: 12, borderBottom: "1px solid #eee" }}
//         >
//           <strong>{dica.titulo}</strong>
//           <span style={{ marginLeft: 8, color: "#666" }}>
//             {dica.programa} · {dica.tipo}
//           </span>
//           <p style={{ margin: "6px 0" }}>{dica.descricao}</p>
//           <code>{dica.exemplo}</code>
//         </div>
//       ))}
//     </div>
//   );
// }
// * ========================================================================================================
// import "./List.css";

// export default function List({ dicas, idioma, statusDe, onSelecionar }) {
//   return (
//     <>
//       <div className="list-container">
//         {dicas.map((dica, indice) => {
//           // se a dica ainda não tem tradução, usa o texto em português
//           const texto = dica[idioma] ?? dica.pt;
//           return (
//             <button
//               key={dica.id}
//               className={`list-item borda-${statusDe(dica)}`}
//               onClick={() => onSelecionar(indice)}
//             >
//               <strong>{texto.titulo}</strong>
//               <span className="list-item-info">
//                 {dica.programa} · {dica.tipo}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </>
//   );
// }
// * =======================================================================================================================
// import "./List.css";
// import FiltroProgramas from "../Filtro"; // NOVO

// export default function List({
//   dicas,
//   apps, // NOVO
//   programa, // NOVO
//   onFiltrar, // NOVO
//   idioma,
//   statusDe,
//   onSelecionar,
// }) {
//   return (
//     <>
//       {/* NOVO: fora do div com rolagem, para ficar fixo no topo */}
//       <FiltroProgramas apps={apps} atual={programa} onSelecionar={onFiltrar} />

//       <div className="list-container">
//         {dicas.map((dica, indice) => {
//           // se a dica ainda não tem tradução, usa o texto em português
//           const texto = dica[idioma] ?? dica.pt;
//           return (
//             <button
//               key={dica.id}
//               className={`list-item borda-${statusDe(dica)}`}
//               onClick={() => onSelecionar(indice)}
//             >
//               <strong>{texto.titulo}</strong>
//               <span className="list-item-info">
//                 {dica.programa} · {dica.tipo}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </>
//   );
// }
// * ========================================================================================================================
// Alteração no layout do porjeto, reposicionando o filtro de programas
// import "./List.css";

// export default function List({ dicas, idioma, statusDe, onSelecionar }) {
//   return (
//     <>
//       <div className="list-container">
//         {dicas.lenght === 0 && (
//           <p className="list-vazio">Nenhuma dica encontrada!</p>
//         )}
//         {dicas.map((dica, indice) => {
//           // se a dica ainda não tem tradução, usa o texto em português
//           const texto = dica[idioma] ?? dica.pt;
//           return (
//             <button
//               key={dica.id}
//               className={`list-item borda-${statusDe(dica)}`}
//               onClick={() => onSelecionar(indice)}
//             >
//               <strong>{texto.titulo}</strong>
//               <span className="list-item-info">
//                 {dica.programa} · {dica.tipo}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </>
//   );
// }
// * ===============================================================================================================================
import "./List.css";

export default function List({
  dicas,
  idioma,
  statusDe,
  onSelecionar,
  onEditar, // opcional: só existe no modo editor
  onExcluir, // opcional: só existe no modo editor
}) {
  return (
    <>
      <div className="list-container">
        {dicas.length === 0 && (
          <p className="list-vazio">Nenhuma dica encontrada!</p>
        )}
        {dicas.map((dica, indice) => {
          // se a dica ainda não tem tradução, usa o texto em português
          const texto = dica[idioma] ?? dica.pt;
          return (
            // A borda colorida fica na div; o botão de abrir e os de editar/excluir
            // são irmãos (um botão dentro de outro botão não é permitido no HTML).
            <div key={dica.id} className={`list-item borda-${statusDe(dica)}`}>
              <button
                type="button"
                className="list-item-abrir"
                onClick={() => onSelecionar(indice)}
              >
                <strong>{texto.titulo}</strong>
                <span className="list-item-info">
                  {dica.programa} · {dica.tipo}
                </span>
              </button>

              {(onEditar || onExcluir) && (
                <div className="list-item-acoes">
                  {onEditar && (
                    <button
                      className="btn-editar"
                      type="button"
                      onClick={() => onEditar(dica)}
                    >
                      Editar
                    </button>
                  )}
                  {onExcluir && (
                    <button
                      className="btn-excluir"
                      type="button"
                      onClick={() => onExcluir(dica)}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
