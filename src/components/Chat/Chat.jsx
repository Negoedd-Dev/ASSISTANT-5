import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import tour from "../../Dados/tour";
import detectarIntencao from "../../utils/chatIntencao";
import {
  LINK_DOCUMENTACAO,
  NOME_ASSISTENTE,
  SELETOR_RODAPE,
} from "./chatConfig";

const CHAVE_VISTO = "chat-visto";

function jaVisitou() {
  try {
    return localStorage.getItem(CHAVE_VISTO) === "1";
  } catch {
    return false;
  }
}

function marcarVisitou() {
  try {
    localStorage.setItem(CHAVE_VISTO, "1");
  } catch {}
}

let proximoId = 1;
const msg = (autor, texto, opcoes = []) => ({
  id: proximoId++,
  autor,
  texto,
  opcoes,
});

export default function Chat({
  programas,
  progresso,
  onBuscar,
  onFiltrar,
  editor,
}) {
  const [aberto, setAberto] = useState(false);
  const [primeiraVisita] = useState(() => !jaVisitou());
  const [mensagens, setMensagens] = useState([]);
  const [modoBusca, setModoBusca] = useState(false);
  const [texto, setTexto] = useState("");
  const fimRef = useRef(null);
  const [folga, setFolga] = useState(0);

  useEffect(() => {
    const rodape = document.querySelector(SELETOR_RODAPE);
    if (!rodape) return undefined;

    const medir = () => {
      const topo = rodape.getBoundingClientRect().top;
      setFolga(Math.max(0, Math.round(window.innerHeight - topo)));
    };

    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);

  const menuOpcoes = () => [
    { rotulo: "Fazer um tour", acao: "tour", valor: 0 },
    { rotulo: "Buscar uma dica", acao: "buscar" },
    { rotulo: "Filtrar por programa", acao: "filtrar" },
    { rotulo: "Ver meu progresso", acao: "progresso" },
    { rotulo: "Documentação", acao: "doc" },
    ...(editor
      ? [
          { rotulo: "Nova dica", acao: "nova" },
          { rotulo: "Exportar JSON", acao: "exportar" },
        ]
      : []),
    { rotulo: "Sair", acao: "sair" },
  ];

  const boasVindas = () => [
    msg(
      "bot",
      `Olá! Eu sou o ${NOME_ASSISTENTE}. O que você deseja fazer?`,
      menuOpcoes(),
    ),
  ];

  function abrir() {
    setAberto(true);
    marcarVisitou();
    setMensagens((atuais) => (atuais.length === 0 ? boasVindas() : atuais));
  }

  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (e) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  useEffect(() => {
    fimRef.current?.scrollIntoView?.({ block: "end" });
  }, [mensagens, aberto]);

  const adicionar = (...novas) =>
    setMensagens((atuais) => [...atuais, ...novas]);

  const voltarMenu = (texto = "O que mais você deseja fazer?") =>
    msg("bot", texto, menuOpcoes());

  function executar(acao, valor) {
    setModoBusca(false);

    switch (acao) {
      case "menu":
        adicionar(voltarMenu("O que você deseja fazer?"));
        break;

      case "sair":
        adicionar(msg("bot", "Até logo! Estarei aqui quando você precisar."));

        setTimeout(() => {
          setAberto(false);
          setMensagens([]);
        }, 1200);
        break;

      case "tour": {
        const passo = valor ?? 0;
        const ultimo = passo >= tour.length - 1;
        adicionar(
          msg(
            "bot",
            `(${passo + 1}/${tour.length}) ${tour[passo]}`,
            ultimo
              ? [{ rotulo: "Voltar ao menu", acao: "menu" }]
              : [
                  { rotulo: "Próximo", acao: "tour", valor: passo + 1 },
                  { rotulo: "Sair do tour", acao: "menu" },
                ],
          ),
        );
        break;
      }

      case "buscar":
        setModoBusca(true);
        adicionar(
          msg(
            "bot",
            "O que você quer aprender? Digite uma palavra, um atalho ou uma fórmula.",
            [{ rotulo: "Voltar ao menu", acao: "menu" }],
          ),
        );
        break;

      case "filtrar":
        adicionar(
          msg("bot", "Qual programa você quer ver?", [
            ...programas.map((p) => ({
              rotulo: p,
              acao: "filtro-aplicar",
              valor: p,
            })),
            { rotulo: "Todos", acao: "filtro-aplicar", valor: "Todos" },
          ]),
        );
        break;

      case "filtro-aplicar":
        onFiltrar(valor);
        adicionar(
          voltarMenu(
            valor === "Todos"
              ? "Pronto! Mostrando as dicas de todos os programas. O que mais?"
              : `Pronto! Mostrando só as dicas de ${valor}. O que mais?`,
          ),
        );
        break;

      case "progresso": {
        const linhas = progresso.map(
          (p) => `${p.programa}: ${p.lidas} de ${p.total}`,
        );
        adicionar(
          voltarMenu(`Seu progresso (dicas lidas):\n${linhas.join("\n")}`),
        );
        break;
      }

      case "doc":
        if (LINK_DOCUMENTACAO) {
          adicionar(
            msg("bot", "A documentação está neste link:", [
              { rotulo: "Abrir documentação", href: LINK_DOCUMENTACAO },
              { rotulo: "Voltar ao menu", acao: "menu" },
            ]),
          );
        } else {
          adicionar(
            voltarMenu(
              "A documentação ainda não está disponível. O que mais você deseja fazer?",
            ),
          );
        }
        break;

      case "nova":
        if (editor) {
          editor.onNovaDica();
          adicionar(voltarMenu("Abri o formulário de nova dica."));
        } else {
          adicionar(voltarMenu("Não entendi. Escolha uma das opções:"));
        }
        break;

      case "exportar":
        if (editor) {
          editor.onExportar();
          adicionar(voltarMenu("Baixei o dicas.json com as alterações."));
        } else {
          adicionar(voltarMenu("Não entendi. Escolha uma das opções:"));
        }
        break;

      default:
        adicionar(voltarMenu("Não entendi. Escolha uma das opções:"));
    }
  }

  function clicarOpcao(opcao) {
    adicionar(msg("usuario", opcao.rotulo));
    executar(opcao.acao, opcao.valor);
  }

  function enviar(e) {
    e.preventDefault();
    const digitado = texto.trim();
    if (!digitado) return;
    setTexto("");
    adicionar(msg("usuario", digitado));

    if (modoBusca) {
      const quantidade = onBuscar(digitado);
      setModoBusca(false);
      adicionar(
        msg(
          "bot",
          quantidade > 0
            ? `Encontrei ${quantidade} ${quantidade === 1 ? "dica" : "dicas"} para "${digitado}". Elas estão na lista.`
            : `Não encontrei dicas para "${digitado}". Tente outra palavra.`,
          [
            { rotulo: "Buscar outra", acao: "buscar" },
            { rotulo: "Voltar ao menu", acao: "menu" },
          ],
        ),
      );
      return;
    }

    const intencao = detectarIntencao(digitado, programas);
    if (intencao) {
      executar(
        intencao.acao,
        intencao.valor ?? (intencao.acao === "tour" ? 0 : undefined),
      );
    } else {
      executar("desconhecido");
    }
  }

  return (
    <div className="Chat" style={{ "--chat-folga": `${folga}px` }}>
      {aberto ? (
        <section
          className="Chat-janela"
          aria-label={`Chat com o ${NOME_ASSISTENTE}`}
        >
          <header className="Chat-cabecalho">
            <strong>{NOME_ASSISTENTE}</strong>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar chat"
            >
              ✕
            </button>
          </header>

          <div className="Chat-mensagens" aria-live="polite">
            {mensagens.map((m, i) => {
              const ativa = i === mensagens.length - 1;
              return (
                <div key={m.id} className={`Chat-msg Chat-msg-${m.autor}`}>
                  <p>{m.texto}</p>
                  {ativa && m.opcoes.length > 0 && (
                    <div className="Chat-opcoes">
                      {m.opcoes.map((o) =>
                        o.href ? (
                          <a
                            key={o.rotulo}
                            href={o.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {o.rotulo}
                          </a>
                        ) : (
                          <button
                            key={o.rotulo + (o.valor ?? "")}
                            type="button"
                            onClick={() => clicarOpcao(o)}
                          >
                            {o.rotulo}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={fimRef} />
          </div>

          <form className="Chat-entrada" onSubmit={enviar}>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={
                modoBusca ? "O que você quer aprender?" : "Digite aqui..."
              }
              aria-label="Mensagem para o assistente"
            />
            <button type="submit">Enviar</button>
          </form>
        </section>
      ) : (
        <>
          {primeiraVisita && <p className="Chat-balao">Olá! Posso ajudar?</p>}
          <button
            type="button"
            className="Chat-botao"
            onClick={abrir}
            aria-label={`Abrir chat com o ${NOME_ASSISTENTE}`}
          >
            💬
          </button>
        </>
      )}
    </div>
  );
}
