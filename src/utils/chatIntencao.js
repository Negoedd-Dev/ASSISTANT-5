// Descobre o que a pessoa quis dizer ao digitar no chat.
// Devolve { acao, valor? } ou null quando não entende.
// Ações: menu, tour, buscar, filtrar, filtro-aplicar, progresso, doc, nova, exportar

const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace("power point", "powerpoint")
    .trim();

const tem = (texto, padrao) => padrao.test(texto);

export default function detectarIntencao(entrada, programas) {
  const t = normalizar(entrada);
  if (!t) return null;

  if (tem(t, /\b(sair|fechar|tchau|ate logo|adeus)\b/)) return { acao: "sair" };

  if (tem(t, /\b(tour|tutorial|como usar|como funciona|ajuda|comecar)\b/)) {
    return { acao: "tour" };
  }
  if (tem(t, /\b(progresso|quanto (eu )?(li|lido))\b/))
    return { acao: "progresso" };
  if (tem(t, /\b(documentacao|manual|readme)\b/)) return { acao: "doc" };
  if (tem(t, /\b(exportar|json)\b/)) return { acao: "exportar" };
  if (tem(t, /\b(nova dica|criar dica|adicionar dica|cadastrar dica)\b/)) {
    return { acao: "nova" };
  }

  // nome de um programa: "excel", "quero ver word"...
  for (const programa of programas) {
    const nome = normalizar(programa).replace(/[.*+?${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${nome}\\b`).test(t)) {
      return { acao: "filtro-aplicar", valor: programa };
    }
  }
  if (tem(t, /\b(todos|todas|tudo)\b/))
    return { acao: "filtro-aplicar", valor: "Todos" };

  if (tem(t, /\b(filtrar|filtro|programa|programas)\b/))
    return { acao: "filtrar" };
  if (tem(t, /\b(buscar|busca|pesquisar|procurar)\b/))
    return { acao: "buscar" };
  if (tem(t, /\b(oi|ola|bom dia|boa tarde|boa noite|menu|inicio|voltar)\b/)) {
    return { acao: "menu" };
  }

  return null;
}
