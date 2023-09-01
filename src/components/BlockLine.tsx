import { ReactNode } from "react";

type Props = {
  highlight?: boolean;
  children: ReactNode;
  note: ReactNode;
};

export const BlockLine = ({ children, highlight, note }: Props) => {
  return (
    <div className="group flex h-1 w-full items-center gap-1 py-1">
      <div className={`flex w-2 justify-end font-mono text-xs`}>
        <div
          className={`rounded-full ${
            highlight ? "bg-lime-500" : "bg-indigo-500"
          } h-1 w-1 group-hover:h-2 group-hover:w-2 group-hover:rounded-sm`}
        />
      </div>
      <div className="flex h-1 flex-1 items-center justify-center gap-[2px]">
        {children}
      </div>
      <div className="invisible w-0 font-mono text-xs group-hover:visible">
        {note}
      </div>
    </div>
  );
};
