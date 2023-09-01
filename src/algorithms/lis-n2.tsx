import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { n } from "../n";

const RunContext = createContext<{
  setMax: Dispatch<SetStateAction<number>>;
  max: number;
  inputs: number[];
} | null>(null);

const useRunContext = () => {
  const context = useContext(RunContext);

  if (!context) {
    throw new Error("Context not in tree");
  }

  return context;
};

const solved = new Set();

type LISProps = {
  children?: ReactNode;
  i: number;
  l: number[];
  a: number;
  backtrack?: boolean;
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

const Result = ({ a, i, children }: Omit<LISProps, "l">) => {
  const { setMax, max, inputs } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <div className="group flex h-1 w-full items-center gap-1 py-1">
      <div
        className={`flex w-2 justify-end font-mono text-xs opacity-[${
          a / max
        }]`}
      >
        <div
          className={`rounded-full ${
            a === max ? "bg-lime-500" : "bg-indigo-500"
          } h-1 w-1 group-hover:h-2 group-hover:w-2 group-hover:rounded-sm`}
        />
      </div>
      <div className="flex h-1 flex-1 items-center justify-center gap-[2px]">
        {children}
        {i
          ? Array(inputs.length - i)
              .fill(true)
              .map(() => <Block empty />)
          : null}
      </div>
      <div className="invisible w-0 font-mono text-xs group-hover:visible">
        {Number(a)}
      </div>
    </div>
  );
};

const CacheMark = ({ i, children }: { i: number; children: ReactNode }) => {
  solved.add(i);

  return <>{children}</>;
};

const LIS = ({ children, i, l, a, backtrack }: LISProps) => {
  const { inputs } = useRunContext();

  if (i === inputs.length) {
    return (
      <Result a={a} i={i}>
        {children}
      </Result>
    );
  }

  const j = l[l.length - 1];

  return (
    <>
      {!backtrack && (
        <Result a={a} i={i}>
          {children}
        </Result>
      )}
      {inputs[i] >= inputs[j] || l.length === 0 ? (
        <CacheMark i={i}>
          <LIS i={i + 1} l={[...l, i]} a={a + 1}>
            {children}
            <Block cached={solved.has(i)} />
          </LIS>
        </CacheMark>
      ) : (
        <>
          {!backtrack && (
            <LIS i={i + 1} l={l} a={a}>
              {children}
              <Block dim />
            </LIS>
          )}
          <LIS i={i} l={l.slice(0, -1)} backtrack a={a - 1}>
            {React.Children.toArray(children)?.slice(0, j)}
            <Block dim removed />
            {React.Children.toArray(children)?.slice(j + 1, i)}
          </LIS>
        </>
      )}
    </>
  );
};

const initState = (base: number[] = []) =>
  Array(base.length || 4)
    .fill(15)
    .map((m, i) => Math.floor(n(m, m + i)));

type DefaultValues = {
  max: number;
  inputs: number[] | (() => number[]);
};

type RunProps<T> = {
  defaultValues?: T;
};

export default function Run({
  defaultValues = { inputs: initState, max: 0 },
}: RunProps<DefaultValues>) {
  const [max, setMax] = useState(defaultValues.max);
  const [inputs, setInputs] = useState(defaultValues.inputs);

  useLayoutEffect(() => {
    solved.clear();
  });

  useLayoutEffect(() => {
    setMax(0);
  }, [inputs]);

  return (
    <div className="flex h-screen select-none flex-col items-center justify-start gap-1 overflow-scroll p-4">
      <div>
        <h1 className="inline pb-2  align-middle font-mono text-xl text-blue-100">
          LIS
        </h1>
        <button
          className="ml-2 inline h-4 w-4 rounded-sm bg-lime-500 align-middle text-xs text-slate-900"
          onClick={() => setInputs(initState)}
        >
          ♺
        </button>
      </div>
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-slate-900 px-2">
        <button
          className="h-4 w-4 rounded-sm bg-blue-500 text-xs font-bold text-slate-900"
          onClick={() => setInputs((i) => i.slice(0, -1))}
        >
          -
        </button>
        <h2 className="pointer-events-none w-6 text-center font-mono text-lg text-blue-200">
          {inputs.length}
        </h2>
        <button
          className="h-4 w-4 rounded-sm bg-yellow-500 text-xs font-bold text-slate-900"
          onClick={() => setInputs((i) => [...i, n(15)])}
        >
          +
        </button>
        <h2 className="pointer-events-none sticky top-0 z-10 w-12 text-center font-mono text-lg text-blue-200">
          → {max}
        </h2>
      </div>

      <div className="sticky top-8 z-10 flex w-full max-w-xs flex-wrap justify-start text-blue-300">
        <div className="flex w-full flex-wrap rounded-sm border-blue-900">
          <div className="flex w-full gap-[2px] pl-3 pr-1">
            {inputs.map((p, index) => (
              <div
                key={index}
                className={`w-[2ch] flex-1 rounded-sm bg-slate-900 text-center font-mono text-xs ${
                  p < 0 ? "text-rose-600" : ""
                }`}
              >
                {Math.abs(p)}
                <Block />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-wrap justify-start text-blue-300">
        <div className="flex w-full flex-wrap rounded-sm border-blue-900">
          <RunContext.Provider value={{ setMax, max, inputs }}>
            <LIS a={0} i={0} l={[]} />
          </RunContext.Provider>
        </div>
      </div>
    </div>
  );
}
