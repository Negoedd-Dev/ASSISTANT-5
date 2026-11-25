export const EDICOES_VAZIAS = { adicionadas: [], editadas: {}, excluidas: [] };

export function aplicarEdicoes(base, edicoes) {
  const idsBase = new Set(base.map((d) => d.id));

  const originais = base
    .filter((d) => !edicoes.excluidas.includes(d.id))
    .map((d) => edicoes.editadas[d.id] ?? d);

  const novas = edicoes.adicionadas.filter((d) => !idsBase.has(d.id));

  return [...originais, ...novas];
}

export function adicionarDica(edicoes, dica) {
  return { ...edicoes, adicionadas: [...edicoes.adicionadas, dica] };
}

export function editarDica(edicoes, dica) {
  const eAdicionada = edicoes.adicionadas.some((d) => d.id === dica.id);

  if (eAdicionada) {
    return {
      ...edicoes,
      adicionadas: edicoes.adicionadas.map((d) =>
        d.id === dica.id ? dica : d,
      ),
    };
  }
  return { ...edicoes, editadas: { ...edicoes.editadas, [dica.id]: dica } };
}

export function excluirDica(edicoes, id) {
  const eAdicionada = edicoes.adicionadas.some((d) => d.id === id);

  if (eAdicionada) {
    return {
      ...edicoes,
      adicionadas: edicoes.adicionadas.filter((d) => d.id !== id),
    };
  }

  const editadas = { ...edicoes.editadas };
  delete editadas[id];
  return { ...edicoes, editadas, excluidas: [...edicoes.excluidas, id] };
}

export const temAlteracoes = (edicoes) =>
  edicoes.adicionadas.length > 0 ||
  edicoes.excluidas.length > 0 ||
  Object.keys(edicoes.editadas).length > 0;
