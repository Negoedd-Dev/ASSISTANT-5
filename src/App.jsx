import { useState, useMemo } from "react";
import "./App.css";
import GlobalStyles from "./styles/GlobalSyles";
import Header from "./components/Header";
import List from "./components/List";
import Cards from "./components/Cards";
import FiltroProgramas from "./components/Filtro";
import Busca from "./components/Busca";
import LinhaAprendizado from "./components/Aprendizado";
import FormDica from "./components/FormDica";
import Chat from "./components/Chat";
import useStatusDicas from "./useStatus/useStatusDicas";
import useDicas from "./useDicas/useDicas";
import filtrarDicas from "./utils/filtrarDicas";
import calcularProgresso from "./utils/calcularProgresso";
import Footer from "./components/Footer";

// Modo editor: liga sozinho quando você roda o projeto com "npm run dev".
// No site publicado (build) ele nunca aparece. Para ver como o visitante vê
// enquanto desenvolve, abra localhost:5173/?leitor
const modoEditor =
  import.meta.env.DEV &&
  !new URLSearchParams(window.location.search).has("leitor");

export default function App() {
  const { statusDe, marcarVista, alternarLida } = useStatusDicas();
  const {
    dicas,
    adicionar,
    editar,
    excluir,
    restaurarOriginais,
    exportarJSON,
    temAlteracoes,
  } = useDicas();

  // O card aberto é guardado pelo id da dica (e não pelo índice na lista).
  const [idAberto, setIdAberto] = useState(null);
  const [programa, setPrograma] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [idioma, setIdioma] = useState("pt");
  // null = formulário fechado | "nova" = nova dica | dica = editando
  const [formulario, setFormulario] = useState(null);

  const programas = useMemo(
    () => [...new Set(dicas.map((d) => d.programa))],
    [dicas],
  );
  const apps = ["Todos", ...programas];

  const list = useMemo(
    () => filtrarDicas(dicas, { programa, busca, idioma }),
    [dicas, programa, busca, idioma],
  );

  const indiceAberto =
    idAberto === null ? -1 : list.findIndex((d) => d.id === idAberto);
  const dicaAberta = indiceAberto >= 0 ? list[indiceAberto] : null;

  function filtrar(novoPrograma) {
    setPrograma(novoPrograma);
    setIdAberto(null);
  }

  function buscar(texto) {
    setBusca(texto);
    setIdAberto(null);
  }

  function abrir(indice) {
    const dica = list[indice];
    setIdAberto(dica.id);
    marcarVista(dica.id);
  }

  // Usado pelo chat: busca em todos os programas e devolve quantas dicas achou
  function buscarPeloChat(texto) {
    setPrograma("Todos");
    buscar(texto);
    return filtrarDicas(dicas, { programa: "Todos", busca: texto, idioma })
      .length;
  }

  function salvar(dica) {
    if (formulario === "nova") {
      adicionar(dica);
    } else {
      editar(dica);
    }
    setFormulario(null);
    // mostra a dica salva: limpa filtros que poderiam escondê-la
    setBusca("");
    setPrograma("Todos");
    setIdAberto(dica.id);
  }

  function iniciarEdicao(dica) {
    setIdAberto(null);
    setFormulario(dica);
  }

  function confirmarExclusao(dica) {
    if (window.confirm(`Excluir a dica "${dica.pt.titulo}"?`)) {
      excluir(dica.id);
      if (idAberto === dica.id) setIdAberto(null);
      if (formulario && formulario !== "nova" && formulario.id === dica.id) {
        setFormulario(null);
      }
    }
  }

  function confirmarRestaurar() {
    if (
      window.confirm("Descartar todas as alterações feitas neste navegador?")
    ) {
      restaurarOriginais();
      setIdAberto(null);
      setPrograma("Todos");
    }
  }

  return (
    <>
      <GlobalStyles />
      <Header />
      <div className="principal">
        <div className="layout">
          <h2 className="area-titulo-filtro titulo-coluna">
            Otimize sua busca
          </h2>
          <div className="area-busca barra-topo">
            <Busca valor={busca} onMudar={buscar} />
            {modoEditor && (
              <>
                <button
                  className="btn-nova-dica"
                  type="button"
                  onClick={() => {
                    setFormulario("nova");
                    setIdAberto(null);
                  }}
                >
                  Nova dica
                </button>
                <button
                  className="btn-exportar-json"
                  type="button"
                  onClick={exportarJSON}
                >
                  Exportar JSON
                </button>
                <button
                  className="btn-restaurar-originais"
                  type="button"
                  onClick={confirmarRestaurar}
                  disabled={!temAlteracoes}
                >
                  Restaurar originais
                </button>
              </>
            )}
          </div>
          <h2 className="area-titulo-progresso titulo-coluna">Seu progresso</h2>

          <aside className="area-filtro">
            <FiltroProgramas
              apps={apps}
              atual={programa}
              onSelecionar={filtrar}
            />
          </aside>

          <main className="area-lista">
            <List
              dicas={list}
              idioma={idioma}
              statusDe={statusDe}
              onSelecionar={abrir}
              onEditar={modoEditor ? iniciarEdicao : undefined}
              onExcluir={modoEditor ? confirmarExclusao : undefined}
            />

            {dicaAberta && !formulario && (
              <Cards
                dica={dicaAberta}
                idioma={idioma}
                lida={statusDe(dicaAberta) === "lida"}
                temProxima={indiceAberto < list.length - 1}
                onAlternarLida={() => alternarLida(dicaAberta.id)}
                onProxima={() => abrir(indiceAberto + 1)}
                onFechar={() => setIdAberto(null)}
                onTrocarIdioma={setIdioma}
              />
            )}

            {formulario && (
              <FormDica
                key={formulario === "nova" ? "nova" : formulario.id}
                dica={formulario === "nova" ? null : formulario}
                programas={programas}
                onSalvar={salvar}
                onCancelar={() => setFormulario(null)}
              />
            )}
          </main>

          <aside className="area-progresso">
            <LinhaAprendizado dicas={dicas} statusDe={statusDe} />
          </aside>
        </div>
      </div>
      <Footer />
      <Chat
        programas={programas}
        progresso={calcularProgresso(dicas, statusDe)}
        onBuscar={buscarPeloChat}
        onFiltrar={filtrar}
        editor={
          modoEditor
            ? {
                onNovaDica: () => {
                  setFormulario("nova");
                  setIdAberto(null);
                },
                onExportar: exportarJSON,
              }
            : undefined
        }
      />
    </>
  );
}
