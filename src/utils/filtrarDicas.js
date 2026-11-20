// Remove acentos e ignora maiúsculas/minúsculas: "média" e "MEDIA" são iguais
const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// "teclas" pode ser uma lista ou { pt: [...], en: [...] }
function teclasDoIdioma(teclas, idioma) {
  return Array.isArray(teclas) ? teclas : (teclas[idioma] ?? teclas.pt);
}

// Junta tudo o que pode ser pesquisado em uma dica, no idioma escolhido
function textoPesquisavel(dica, idioma) {
  const texto = dica[idioma] ?? dica.pt;
  const formula = dica.formula ? (dica.formula[idioma] ?? dica.formula.pt) : "";
  const atalhos = (dica.atalhos ?? []).map(
    (a) => `${a.descricao} ${teclasDoIdioma(a.teclas, idioma).join("+")}`,
  );

  return normalizar(
    [
      dica.programa,
      texto.titulo,
      texto.explicacao,
      texto.exemplo,
      texto.extra ?? "",
      formula,
      ...atalhos,
    ].join(" "),
  );
}

const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A palavra precisa começar uma palavra do texto: "media" acha "média", mas não "imediato".
// Se for um atalho (tem "+"), tem que ser exato: "ctrl+s" não acha "ctrl+shift".
// Obs.: em [^0-9a-z] o "^" vem antes de um número, e não de uma vogal. No teclado ABNT2,
// digitar ^ seguido de "a" vira "â" (tecla morta) e quebra a expressão.
function criarRegex(palavra) {
  const fim = palavra.includes("+") ? "(?![0-9a-z+])" : "";
  return new RegExp(`(^|[^0-9a-z])${escapar(palavra)}${fim}`);
}

export default function filtrarDicas(dicas, { programa, busca, idioma }) {
  // cada palavra digitada precisa aparecer na dica ("excel soma" acha a dica da SOMA)
  const regras = normalizar(busca.trim())
    .split(/\s+/)
    .filter(Boolean)
    .map(criarRegex);

  return dicas.filter((dica) => {
    if (programa !== "Todos" && dica.programa !== programa) return false;
    if (regras.length === 0) return true;

    const alvo = textoPesquisavel(dica, idioma);
    return regras.every((regra) => regra.test(alvo));
  });
}
