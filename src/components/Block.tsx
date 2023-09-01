type Props = {
  className?: string;
  empty?: boolean;
  variant: "primary" | "cached";
};

type BlockProps = {
  cached?: boolean;
  removed?: boolean;
  empty?: boolean;
  dim?: boolean;
};

const Block = ({ cached, removed, empty, dim }: BlockProps) => {
  return (
    <div
      className={`h-1 flex-1 rounded-sm font-mono text-xs group-hover:h-2 ${
        empty
          ? `invisible ${
              removed ? "bg-rose-700" : "bg-blue-700"
            } group-hover:visible group-hover:opacity-20`
          : `visible ${
              dim
                ? "opacity-30 group-hover:opacity-40 "
                : "opacity-100 group-hover:opacity-90 group-hover:bg-green-600"
            } ${
              removed
                ? "bg-indigo-700"
                : cached
                ? "bg-fuchsia-600"
                : "bg-blue-600"
            }`
      }`}
    ></div>
  );
};