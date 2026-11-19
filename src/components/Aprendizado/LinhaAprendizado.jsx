import "./LinhaAprendizado.css";
import calcularProgresso from "../../utils/calcularProgresso";

const doisDigitos = (n) => String(n).padStart(2, 0);

export default function LinhaAprendizado({ dicas, statusDe }) {
  const progresso = calcularProgresso(dicas, statusDe);

  return (
    <section className="LinhaAprendizado" aria-label="Progresso de aprendizado">
      <ul>
        {progresso.map(({ programa, lidas, total }) => (
          <li key={programa}>
            <div className="LinhaAprendizado-nome">{programa}</div>
            <div className="LinhaAprendizado-numeros">
              {doisDigitos(lidas)} de {total} dicas
            </div>
            <progress
              value={lidas}
              max={total}
              aria-label={`${programa}: ${lidas} de ${total} dicas lidas`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
