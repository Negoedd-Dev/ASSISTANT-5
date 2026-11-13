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
import dicas from "../../Dados/dicas.json";

export default function List() {
  return (
    <div style={{ maxHeight: 400, overflowY: "auto" }}>
      {dicas.map((dica) => (
        <div
          key={dica.id}
          style={{ padding: 12, borderBottom: "1px solid #eee" }}
        >
          <strong>{dica.titulo}</strong>
          <span style={{ marginLeft: 8, color: "#666" }}>
            {dica.programa} · {dica.tipo}
          </span>
          <p style={{ margin: "6px 0" }}>{dica.descricao}</p>
          <code>{dica.exemplo}</code>
        </div>
      ))}
    </div>
  );
}
