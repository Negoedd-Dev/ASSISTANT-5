export function parseTeclas(texto) {
  const t = texto.trim();
  if (!t) return [];
  if (t === "+") return ["+"];

  const teclas = t.endsWith("++")
    ? [...t.slice(0, -2).split("+"), "+"]
    : t.split("+");

  return teclas.map((tecla) => tecla.trim()).filter(Boolean);
}

export const formatarTeclas = (teclas) => (teclas ?? []).join("+");
