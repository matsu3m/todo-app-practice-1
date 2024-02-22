import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/src/App";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("No root element found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
