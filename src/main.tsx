import React from "react";
import ReactDOM from "react-dom/client";
import LIS2N from "./algorithms/lis-2n";
import LISN2 from "./algorithms/lis-n2";
import MaximumSubarray2N from "./algorithms/maximum-subarray-simple";
import MaximumSubarrayN from "./algorithms/maximum-subarray-kadane";
import CopperRods from "./algorithms/copper-rods";
import BinarySearch from "./algorithms/binary-search";

import "./index.css";

type LinkProps = {
  href: string;
  name: string;
};

const LinkItem = ({ href, name }: LinkProps) => (
  <li className="text-sm transition-all duration-100 hover:translate-x-1 hover:text-blue-400">
    <a href={href}>{name}</a>
  </li>
);

const entries: LinkProps[] = [
  { href: "lis-2n", name: "Longest Increasing Subsequence O(2ⁿ)" },
  { href: "lis-n2", name: "Longest Increasing Subsequence O(n²)" },
  { href: "msa-2n", name: "Maximum Subarray O(2ⁿ)" },
  { href: "msa-n", name: "Maximum Subarray O(n)" },
  { href: "copper-rods", name: "Dividing Rods (DP)" },
  { href: "binary-search", name: "Binary Search" },
];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex h-screen w-screen max-sm:flex-col">
      <div className="bg-slate-800 p-8 font-mono text-blue-300">
        <h1 className="mb-4 text-2xl font-bold text-blue-200">Superreacted</h1>
        <ul className="space-y-2">
          {entries.map((props) => (
            <LinkItem key={props.href} {...props} />
          ))}
        </ul>
      </div>

      <div className="w-full bg-slate-900 sm:pt-20 overflow-scroll">
        {window.location.pathname === "/lis-n2" && <LISN2 />}
        {window.location.pathname === "/lis-2n" && <LIS2N />}
        {window.location.pathname === "/msa-2n" && <MaximumSubarray2N />}
        {window.location.pathname === "/msa-n" && <MaximumSubarrayN />}
        {window.location.pathname === "/copper-rods" && <CopperRods />}
        {window.location.pathname === "/binary-search" && <BinarySearch />}
      </div>
    </div>
  </React.StrictMode>,
);
