import { ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  title: string;
  controls: ReactNode;
  headers: ReactNode;
  children: ReactNode;
  onReset?: () => void;
};

export const Layout = ({
  title,
  onReset,
  controls,
  headers,
  children,
}: Props) => {
  return (
    <div className="flex h-screen select-none flex-col items-center justify-start gap-1 overflow-scroll p-4">
      <h1 className="sticky top-0 z-10 font-mono text-xl text-blue-200">
        <div className="rounded-sm bg-slate-900 px-1">
          <h1 className="inline align-middle">{title}</h1>
          {onReset && (
            <span className="ml-2 align-top">
              <Button variant="lime" onClick={onReset} className="align-middle">
                ♺
              </Button>
            </span>
          )}
        </div>
      </h1>
      <div className="sticky top-11 z-10 flex items-center gap-2 rounded-sm bg-slate-900 px-2">
        {controls}
      </div>
      <div className="sticky top-20 z-10 mb-1 h-auto w-full max-w-xs rounded-sm py-1 pl-8 pr-6 text-blue-100">
        <div className="flex gap-[2px] text-blue-300">{headers}</div>
      </div>
      <div className="flex w-full max-w-xs flex-wrap justify-start px-4 text-blue-300">
        <div className="flex w-full flex-wrap rounded-sm border-blue-900 p-1">
          {children}
        </div>
      </div>
    </div>
  );
};
