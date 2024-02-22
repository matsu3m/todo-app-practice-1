import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/src/App";
import { ChakraProvider } from "@chakra-ui/react";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("No root element found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
