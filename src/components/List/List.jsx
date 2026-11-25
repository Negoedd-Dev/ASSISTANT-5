import "./List.css";

export default function List({
  dicas,
  idioma,
  statusDe,
  onSelecionar,
  onEditar,
  onExcluir,
}) {
  return (
    <>
      <div className="list-container">
        {dicas.length === 0 && (
          <p className="list-vazio">Nenhuma dica encontrada!</p>
        )}
        {dicas.map((dica, indice) => {
          const texto = dica[idioma] ?? dica.pt;
          return (
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
