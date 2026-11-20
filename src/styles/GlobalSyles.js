//* GlobalStyles ajustado. Hoje o (.principal) não define largura, então o conteúdo ocupa só o espaço que precisa e as três colunas ficariam espremidas
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
    --largura-max: 1200px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'poppins', sans-serif;
    background-color: #07f5f5;
}

#root {
min-height: 100vh;
display: flex;
flex-direction: column;
}

.principal {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    padding: 20px;
}

.principal > * {
    width: 100%;
    max-width: var(--largura-max);
}
`;
export default GlobalStyles;
