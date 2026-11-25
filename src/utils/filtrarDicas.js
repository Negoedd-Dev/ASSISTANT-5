const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function teclasDoIdioma(teclas, idioma) {
  return Array.isArray(teclas) ? teclas : (teclas[idioma] ?? teclas.pt);
}

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

function criarRegex(palavra) {
  const fim = palavra.includes("+") ? "(?![0-9a-z+])" : "";
  return new RegExp(`(^|[^0-9a-z])${escapar(palavra)}${fim}`);
}

export default function filtrarDicas(dicas, { programa, busca, idioma }) {
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
