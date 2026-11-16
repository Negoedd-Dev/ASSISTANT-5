// import { createGlobalStyle } from "styled-components";

// const GlobalStyles = createGlobalStyle`
// * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//     overflow: hide;

// }
// body {
//     font-family: 'poppins', sans-serif;
//     background-color: #07f5f5
// }
// .principal {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     min-height: calc(100vh - 200px);
//     padding: 20px;
// }
// `;
// export default GlobalStyles;
// * ==============================================================================================================================
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

.principal {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 200px);
    padding: 20px;
}

.principal > * {
    width: 100%;
    max-width: var(--largura-max);
}
`;
export default GlobalStyles;
