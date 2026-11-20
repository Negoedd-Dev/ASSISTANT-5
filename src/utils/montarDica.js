import { parseTeclas, formatarTeclas } from "./teclas.js";

export const atalhoVazio = () => ({
  teclasPt: "",
  teclasEn: "",
  descricao: "",
});

// data de hoje no formato AAAA-MM-DD, no fuso do usuário
function hoje() {
  const d = new Date();
  const dois = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^0-9a-z]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function criarId(programa, titulo) {
  return `${slug(programa)}-${slug(titulo)}-${Date.now().toString(36)}`;
}

// Preenche o formulário: vazio (nova dica) ou com os dados de uma dica existente
export function estadoInicial(dica) {
  if (!dica) {
    return {
      programa: "",
      tipo: "atalho",
      titulo: "",
      exemplo: "",
      explicacao: "",
      extra: "",
      atalhos: [atalhoVazio()],
      formulaPt: "",
      formulaEn: "",
    };
  }

  const atalhos = (dica.atalhos ?? []).map((a) =>
    Array.isArray(a.teclas)
      ? {
          teclasPt: formatarTeclas(a.teclas),
          teclasEn: "",
          descricao: a.descricao,
        }
      : {
          teclasPt: formatarTeclas(a.teclas.pt),
          teclasEn: formatarTeclas(a.teclas.en),
          descricao: a.descricao,
        },
  );

  return {
    programa: dica.programa,
    tipo: dica.tipo,
    titulo: dica.pt.titulo,
    exemplo: dica.pt.exemplo,
    explicacao: dica.pt.explicacao,
    extra: dica.pt.extra ?? "",
    atalhos: atalhos.length ? atalhos : [atalhoVazio()],
    formulaPt: dica.formula?.pt ?? "",
    formulaEn: dica.formula?.en ?? "",
  };
}

const linhaPreenchida = (a) =>
  a.teclasPt.trim() || a.teclasEn.trim() || a.descricao.trim();

// Devolve a mensagem de erro, ou "" se estiver tudo certo
export function validar(c) {
  if (!c.programa.trim()) return "Informe o programa.";
  if (!c.titulo.trim()) return "Informe o título (a dúvida).";
  if (!c.exemplo.trim()) return "Informe um exemplo.";
  if (!c.explicacao.trim()) return "Informe a explicação.";

  if (c.tipo === "formula") {
    if (!c.formulaPt.trim()) return "Informe a fórmula.";
    return "";
  }

  const linhas = c.atalhos.filter(linhaPreenchida);
  if (linhas.length === 0) return "Informe pelo menos um atalho.";

  for (const [i, a] of linhas.entries()) {
    if (parseTeclas(a.teclasPt).length === 0 || !a.descricao.trim()) {
      return `Atalho ${i + 1}: preencha as teclas e o que ele faz (ou remova a linha).`;
    }
  }
  return "";
}

// Transforma o que foi digitado em uma dica no formato do dicas.json
export function montarDica(c, dicaInicial) {
  const pt = {
    titulo: c.titulo.trim(),
    exemplo: c.exemplo.replace(/^\n+|\s+$/g, ""), // mantém o recuo da primeira linha (tabelas)
    explicacao: c.explicacao.trim(),
  };
  if (c.extra.trim()) pt.extra = c.extra.trim();

  // ...dicaInicial preserva o que o formulário não mostra (por exemplo, um bloco "en")
  const dica = {
    ...(dicaInicial ?? {}),
    id: dicaInicial?.id ?? criarId(c.programa, c.titulo),
    programa: c.programa.trim(),
    tipo: c.tipo,
    criadaEm: dicaInicial?.criadaEm ?? hoje(),
    pt,
  };
  delete dica.atalhos;
  delete dica.formula;

  if (c.tipo === "atalho") {
    dica.atalhos = c.atalhos.filter(linhaPreenchida).map((a) => {
      const teclasPt = parseTeclas(a.teclasPt);
      const teclasEn = parseTeclas(a.teclasEn);
      const iguais = formatarTeclas(teclasPt) === formatarTeclas(teclasEn);
      return {
        teclas:
          teclasEn.length && !iguais
            ? { pt: teclasPt, en: teclasEn }
            : teclasPt,
        descricao: a.descricao.trim(),
      };
    });
  } else {
    dica.formula = { pt: c.formulaPt.trim() };
    if (c.formulaEn.trim()) dica.formula.en = c.formulaEn.trim();
  }

  return dica;
}
