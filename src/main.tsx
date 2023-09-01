import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Run from "./algorithms/lis-2n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-screen w-screen bg-slate-900">
      <Run />
    </div>
  </React.StrictMode>,
);
