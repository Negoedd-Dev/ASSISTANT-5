import { useState, useEffect } from "react";

const CHAVE = "dicas-status";

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? {};
  } catch {
    return {};
  }
}

function ehRecente(data) {
  const dias = (Date.now() - new Date(data)) / 86400000;
  return dias < 7;
}

export default function useStatusDicas() {
  const [status, setStatus] = useState(carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(status));
    } catch {}
  }, [status]);

  function marcarVista(id) {
    setStatus((s) => (s[id] ? s : { ...s, [id]: "vista" }));
  }

  function alternarLida(id) {
    setStatus((s) => ({ ...s, [id]: s[id] === "lida" ? "vista" : "lida" }));
  }

  function statusDe(dica) {
    if (status[dica.id]) return status[dica.id];
    return ehRecente(dica.criadaEm) ? "nova" : "padrao";
  }

  return { statusDe, marcarVista, alternarLida };
}
