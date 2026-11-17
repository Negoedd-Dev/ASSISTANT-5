import "./SeletorIdioma.css";
import Button, { BUTTON_VARIANTS } from "../Button";

const IDIOMAS = [
  { codigo: "pt", rotulo: "PT" },
  { codigo: "en", rotulo: "EN" },
];

export default function SeletorIdioma({ idioma, onSelecionar }) {
  return (
    <div className="SeletorIdioma" role="group" aria-label="Idioma das dicas">
      {IDIOMAS.map(({ codigo, rotulo }) => (
        <Button
          key={codigo}
          variant={
            idioma === codigo
              ? BUTTON_VARIANTS.PRIMARY
              : BUTTON_VARIANTS.SECONDARY
          }
          aria-pressed={idioma === codigo}
          onClick={() => onSelecionar(codigo)}
        >
          {rotulo}
        </Button>
      ))}
    </div>
  );
}
