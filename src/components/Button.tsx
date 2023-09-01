import { ReactNode } from "react";

type Variant = "blue" | "yellow" | "lime";

type Props = {
  onClick: () => void;
  children: ReactNode;
  variant?: Variant;
};

const className: Record<Variant, string> = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
};

export const Button = ({ onClick, variant, children }: Props) => {
  return (
    <button
      className={`h-4 w-4 rounded-sm text-xs font-bold text-slate-900 ${
        variant ? className[variant] : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
