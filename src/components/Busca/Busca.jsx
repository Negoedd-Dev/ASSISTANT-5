import "./Busca.css";

export default function Busca({ valor, onMudar }) {
  return (
    <div className="busca" role="search">
      <input
        type="search"
        value={valor}
        onChange={(e) => onMudar(e.target.value)}
        placeholder="Pesquisar dica, atalho ou fórmula..."
        aria-label="Pesquisar dicas"
      />
    </div>
  );
}
