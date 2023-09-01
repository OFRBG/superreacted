import { CSSProperties } from "react";

type Props = {
  cached?: boolean;
  removed?: boolean;
  empty?: boolean;
  dim?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const Block = ({
  cached,
  removed,
  empty,
  dim,
  className,
  style,
}: Props) => {
  return (
    <div
      style={style}
      className={`h-1 flex-1 rounded-sm font-mono text-xs group-hover:h-2 ${
        empty
          ? `invisible group-hover:visible group-hover:opacity-20 ${
              removed ? "bg-rose-700" : "bg-blue-700"
            }`
          : `visible ${
              dim
                ? "opacity-30 group-hover:opacity-40"
                : "opacity-100 group-hover:bg-green-600 group-hover:opacity-90"
            } ${
              removed
                ? "bg-indigo-700"
                : cached
                ? "bg-fuchsia-600"
                : "bg-blue-600"
            }`
      } ${className}`}
    ></div>
  );
};
