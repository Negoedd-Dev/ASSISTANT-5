import { useState, useEffect } from "react";
import "./FormDica.css";
import {
  estadoInicial,
  atalhoVazio,
  validar,
  montarDica,
} from "../../utils/montarDica";

export default function FormDica({ dica, programas, onSalvar, onCancelar }) {
  const [campos, setCampos] = useState(() => estadoInicial(dica));
  const [erro, setErro] = useState("");

  useEffect(() => {
    const aoTeclar = (e) => e.key === "Escape" && onCancelar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onCancelar]);

  const mudar = (nome, valor) => setCampos((c) => ({ ...c, [nome]: valor }));

  const mudarAtalho = (i, nome, valor) =>
    setCampos((c) => ({
      ...c,
      atalhos: c.atalhos.map((a, j) => (j === i ? { ...a, [nome]: valor } : a)),
    }));

  const adicionarAtalho = () =>
    setCampos((c) => ({ ...c, atalhos: [...c.atalhos, atalhoVazio()] }));

  const removerAtalho = (i) =>
    setCampos((c) => ({
      ...c,
      atalhos:
        c.atalhos.length > 1 ? c.atalhos.filter((_, j) => j !== i) : c.atalhos,
    }));

  function enviar(e) {
    e.preventDefault();
    const msg = validar(campos);
    if (msg) {
      setErro(msg);
      return;
    }
    onSalvar(montarDica(campos, dica));
  }

  return (
    <div className="FormDica-fundo">
      <form
        className="FormDica"
        onSubmit={enviar}
        role="dialog"
        aria-modal="true"
      >
        <h3>{dica ? "Editar dica" : "Nova dica"}</h3>

        <label>
          Programa
          <input
            list="FormDica-programas"
            value={campos.programa}
            onChange={(e) => mudar("programa", e.target.value)}
            placeholder="Excel, Word, AutoCAD..."
          />
          <datalist id="FormDica-programas">
            {programas.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>

        <label>
          Tipo
          <select
            value={campos.tipo}
            onChange={(e) => mudar("tipo", e.target.value)}
          >
            <option value="atalho">Atalho de teclado</option>
            <option value="formula">Fórmula</option>
          </select>
        </label>

        <label>
          Título (a dúvida)
          <input
            value={campos.titulo}
            onChange={(e) => mudar("titulo", e.target.value)}
          />
        </label>

        {campos.tipo === "atalho" ? (
          <fieldset>
            <legend>Atalhos</legend>
            <p className="FormDica-ajuda">
              Separe as teclas com +. Exemplo: Ctrl+Shift+L. Para a tecla "+",
              use Ctrl++. Teclas em inglês: preencha só se forem diferentes das
              do português.
            </p>
            {campos.atalhos.map((a, i) => (
              <div className="FormDica-atalho" key={i}>
                <input
                  aria-label={`Teclas em português do atalho ${i + 1}`}
                  placeholder="Teclas (PT)"
                  value={a.teclasPt}
                  onChange={(e) => mudarAtalho(i, "teclasPt", e.target.value)}
                />
                <input
                  aria-label={`Teclas em inglês do atalho ${i + 1}`}
                  placeholder="Teclas (EN) – opcional"
                  value={a.teclasEn}
                  onChange={(e) => mudarAtalho(i, "teclasEn", e.target.value)}
                />
                <input
                  aria-label={`O que o atalho ${i + 1} faz`}
                  placeholder="O que faz"
                  value={a.descricao}
                  onChange={(e) => mudarAtalho(i, "descricao", e.target.value)}
                />
                <button
                  className="btn-remover"
                  type="button"
                  onClick={() => removerAtalho(i)}
                  aria-label="Remover atalho"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="btn-adicionar"
              type="button"
              onClick={adicionarAtalho}
            >
              + Adicionar atalho
            </button>
          </fieldset>
        ) : (
          <>
            <label>
              Fórmula (português)
              <input
                value={campos.formulaPt}
                onChange={(e) => mudar("formulaPt", e.target.value)}
                placeholder="=SOMA(B2:B10)"
              />
            </label>
            <label>
              Fórmula (inglês) – opcional
              <input
                value={campos.formulaEn}
                onChange={(e) => mudar("formulaEn", e.target.value)}
                placeholder="=SUM(B2:B10)"
              />
            </label>
          </>
        )}

        <label>
          Exemplo
          <textarea
            rows={4}
            value={campos.exemplo}
            onChange={(e) => mudar("exemplo", e.target.value)}
          />
        </label>

        <label>
          Explicação
          <textarea
            rows={3}
            value={campos.explicacao}
            onChange={(e) => mudar("explicacao", e.target.value)}
          />
        </label>

        <label>
          Dica extra – opcional
          <textarea
            rows={2}
            value={campos.extra}
            onChange={(e) => mudar("extra", e.target.value)}
          />
        </label>

        {erro && (
          <p className="FormDica-erro" role="alert">
            {erro}
          </p>
        )}

        <div className="FormDica-botoes">
          <button className="btn-salvar" type="submit">
            Salvar
          </button>
          <button btn-cancelar type="button" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
