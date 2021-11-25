import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Find all embedded divs
const embeddedDivs = document.querySelectorAll(".sb-embedded");

// Inject our React App into each class
embeddedDivs.forEach((div) => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    div
  );
});
