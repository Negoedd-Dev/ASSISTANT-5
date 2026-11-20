import { useState, useEffect, useMemo } from "react";
import dicasOriginais from "../Dados/dicas.json";
import {
  EDICOES_VAZIAS,
  aplicarEdicoes,
  adicionarDica,
  editarDica,
  excluirDica,
  temAlteracoes,
} from "../utils/edicoes";

const CHAVE = "dicas-edicoes";

function carregar() {
  try {
    return { ...EDICOES_VAZIAS, ...JSON.parse(localStorage.getItem(CHAVE)) };
  } catch {
    return EDICOES_VAZIAS;
  }
}

export default function useDicas() {
  const [edicoes, setEdicoes] = useState(carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(edicoes));
    } catch {
      /* sem localStorage, o app continua funcionando */
    }
  }, [edicoes]);

  const dicas = useMemo(
    () => aplicarEdicoes(dicasOriginais, edicoes),
    [edicoes],
  );

  // Baixa o dicas.json com todas as alterações, pronto para substituir o do projeto
  function exportarJSON() {
    const conteudo = JSON.stringify(dicas, null, 2) + "\n";
    const blob = new Blob([conteudo], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dicas.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return {
    dicas,
    adicionar: (dica) => setEdicoes((e) => adicionarDica(e, dica)),
    editar: (dica) => setEdicoes((e) => editarDica(e, dica)),
    excluir: (id) => setEdicoes((e) => excluirDica(e, id)),
    restaurarOriginais: () => setEdicoes(EDICOES_VAZIAS),
    exportarJSON,
    temAlteracoes: temAlteracoes(edicoes),
  };
}
