import { ReactNode } from "react";
import { Button } from "./Button";

export const Layout = ({
  title,
  onReset,
  controls,
  headers,
  children,
}: {
  title: string;
  controls: ReactNode;
  headers: ReactNode;
  children: ReactNode;
  onReset?: () => void;
}) => {
  return (
    <div className="flex h-screen select-none flex-col items-center justify-start gap-1 overflow-scroll p-4">
      <h1 className="pb-2 font-mono text-xl text-blue-100">
        <div>
          <h1 className="inline pb-2 align-middle font-mono text-xl text-blue-100">
            {title}
          </h1>
          {onReset && (
            <span className="ml-2">
              <Button variant="lime" onClick={onReset}>
                ♺
              </Button>
            </span>
          )}
        </div>
      </h1>
      <div className="sticky top-0 z-10 flex items-center gap-2 rounded-sm bg-slate-900 px-2">
        {controls}
      </div>
      <div className="sticky top-8 z-10 mb-1 h-auto w-full max-w-xs rounded-sm py-1 pl-8 pr-6 text-blue-100">
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
