import "./FiltroProgramas.css";
import Button, { BUTTON_VARIANTS } from "../Button";

export default function FiltroProgramas({ apps, atual, onSelecionar }) {
  return (
    <nav className="FiltroProgramas" aria-label="Filtrar por programa">
      {apps.map((app) => (
        <Button
          key={app}
          variant={
            atual === app ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.SECONDARY
          }
          aria-pressed={atual === app}
          onClick={() => onSelecionar(app)}
        >
          {app}
        </Button>
      ))}
    </nav>
  );
}
