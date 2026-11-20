import "./Cards.css";
import SeletorIdioma from "../Idioma";
import Button, { BUTTON_VARIANTS } from "../Button";

// "teclas" pode ser uma lista (igual nos dois idiomas) ou { pt: [...], en: [...] }
function teclasDoIdioma(teclas, idioma) {
  return Array.isArray(teclas) ? teclas : (teclas[idioma] ?? teclas.pt);
}

export default function Cards({
  dica,
  idioma,
  lida,
  temProxima,
  onAlternarLida,
  onProxima,
  onFechar,
  onTrocarIdioma,
}) {
  const { titulo, exemplo, explicacao, extra } = dica[idioma] ?? dica.pt;
  const formula = dica.formula && (dica.formula[idioma] ?? dica.formula.pt);

  return (
    <div className="card-overlay" onClick={onFechar}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="card-topo">
          <span className="card-topo-rotulo">Teclas e fórmulas em: </span>
          <SeletorIdioma idioma={idioma} onSelecionar={onTrocarIdioma} />
        </div>

        <h2>{titulo}</h2>

        {dica.atalhos && (
          <ul className="card-atalhos">
            {dica.atalhos.map((a, i) => (
              <li key={i}>
                <span className="card-teclas">
                  {teclasDoIdioma(a.teclas, idioma).map((t, j) => (
                    <kbd key={j}>{t}</kbd>
                  ))}
                </span>
                <span>{a.descricao}</span>
              </li>
            ))}
          </ul>
        )}

        {formula && <code className="card-exemplo">{formula}</code>}

        <h4>Exemplo</h4>
        <pre className="card-exemplo">{exemplo}</pre>

        <h4>Explicação</h4>
        <p>{explicacao}</p>

        {extra && (
          <>
            <h4>Dica extra</h4>
            <p>{extra}</p>
          </>
        )}

        <div className="card-botoes">
          <Button
            variant={lida ? BUTTON_VARIANTS.SECONDARY : BUTTON_VARIANTS.SUCCESS}
            onClick={onAlternarLida}
          >
            {lida ? "Desmarcar como lida" : "Marcar como lida"}
          </Button>
          <Button
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={onProxima}
            disabled={!temProxima}
          >
            Próxima dica
          </Button>
          <Button variant={BUTTON_VARIANTS.DANGER} onClick={onFechar}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
