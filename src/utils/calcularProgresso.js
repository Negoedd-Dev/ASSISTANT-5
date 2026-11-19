// Conta quantas dicas existem e quantas foram lidas, por programa.
// "statusDe" é a função do hook useStatusDicas ("lida" | "vista" | "nova" | "padrao").
export default function calcularProgresso(dicas, statusDe) {
  const porPrograma = new Map();

  for (const dica of dicas) {
    if (!porPrograma.has(dica.programa)) {
      porPrograma.set(dica.programa, {
        programa: dica.programa,
        lidas: 0,
        total: 0,
      });
    }
    const item = porPrograma.get(dica.programa);
    item.total += 1;
    if (statusDe(dica) === "lida") item.lidas += 1;
  }

  const programas = [...porPrograma.values()];
  const geral = {
    programa: "Total",
    lidas: programas.reduce((soma, p) => soma + p.lidas, 0),
    total: programas.reduce((soma, p) => soma + p.total, 0),
  };

  return [geral, ...programas];
}
