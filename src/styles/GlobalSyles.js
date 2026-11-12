import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hide;

}
body {
    font-family: 'poppins', sans-serif;
    background-color: #07f5f5
}
.principal {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    padding: 20px; 
}
`;
export default GlobalStyles;
