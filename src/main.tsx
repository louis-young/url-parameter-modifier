import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Application } from "./components/Application/index.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <Application />
  </StrictMode>
);
