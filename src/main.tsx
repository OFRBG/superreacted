import React from "react";
import ReactDOM from "react-dom/client";
import LIS2N from "./algorithms/lis-2n";
import LISN2 from "./algorithms/lis-n2";
import MaximumSubarray2N from "./algorithms/maximum-subarray-simple";
import MaximumSubarrayN from "./algorithms/maximum-subarray-kadane";
import CopperRods from "./algorithms/copper-rods";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex h-screen w-screen max-sm:flex-col">
      <div className="shrink basis-1/5 bg-slate-800 p-2 px-12 py-20 font-mono text-blue-300">
        <h1 className="mb-4 text-2xl font-bold text-blue-200">No Business</h1>
        <ul className="ml-0 flex list-none flex-col">
          <li className="hover:ml-2 hover:text-blue-400">
            <a href="lis-2n">LIS 2^n</a>
          </li>
          <li className="hover:ml-2 hover:text-blue-400">
            <a href="lis-n2">LIS n^2</a>
          </li>
          <li className="hover:ml-2 hover:text-blue-400">
            <a href="msa-2n">Maximum Subarray 2^n</a>
          </li>
          <li className="hover:ml-2 hover:text-blue-400">
            <a href="msa-n">Maximum Subarray n</a>
          </li>
          <li className="hover:ml-2 hover:text-blue-400">
            <a href="copper-rods">Copper Rods</a>
          </li>
        </ul>
      </div>
      <div className="grow overflow-scroll bg-slate-900 pt-20">
        {window.location.pathname === "/lis-n2" && <LISN2 />}
        {window.location.pathname === "/lis-2n" && <LIS2N />}
        {window.location.pathname === "/msa-2n" && <MaximumSubarray2N />}
        {window.location.pathname === "/msa-n" && <MaximumSubarrayN />}
        {window.location.pathname === "/copper-rods" && <CopperRods />}
      </div>
      <div className="shrink"></div>
    </div>
  </React.StrictMode>,
);
