import {
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

const className = {
  colors: [
    "bg-green-600",
    "bg-green-500",
    "bg-green-400",
    "bg-green-300",
    "bg-green-200",
    "bg-green-100",
  ],
};

const Block = ({
  cached,
  a,
  empty,
}: {
  cached?: boolean;
  a?: number;
  empty?: boolean;
}) => {
  const hoverColor =
    a != null ? className.colors[a] || "bg-white" : "bg-blue-500";

  return (
    <div
      className={`h-1 flex-1 rounded-sm font-mono text-xs group-hover:h-2
      ${
        empty
          ? "invisible bg-blue-700 group-hover:visible group-hover:opacity-20"
          : `${
              cached ? "bg-fuchsia-600" : "bg-blue-600"
            } group-hover:${hoverColor} visible group-hover:opacity-90`
      }`}
    ></div>
  );
};

const Result = ({ a, children }: { a: number; children: ReactNode }) => {
  const { setMax, max } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <div className="group flex h-1 w-full items-center gap-1 py-1">
      <div className={`flex w-2 justify-end font-mono text-xs`}>
        <div
          className={`rounded-full ${
            a === max ? "bg-lime-500" : "bg-indigo-500"
          } h-1 w-1 group-hover:h-2 group-hover:w-2 group-hover:rounded-sm`}
        />
      </div>
      <div className="flex h-1 flex-1 items-center justify-center gap-1">
        {children}
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

type LISProps = {
  children?: ReactNode;
  i: number;
  j: number | null;
  a: number;
};

const LIS = ({ children, i, j, a }: LISProps) => {
  const { inputs } = useRunContext();

  if (i === inputs.length) {
    return <Result a={a}>{children}</Result>;
  }

  return (
    <>
      {j == null || inputs[i] >= inputs[j] ? (
        <CacheMark i={i}>
          <LIS i={i + 1} j={i} a={a + 1}>
            {children}
            <Block cached={solved.has(i)} a={a} />
          </LIS>
        </CacheMark>
      ) : null}
      <LIS i={i + 1} j={j} a={a}>
        {children}
        <Block a={a} empty />
      </LIS>
    </>
  );
};

const initState = (base: number[] = []) =>
  Array(base.length || 14)
    .fill(15)
    .map((m, i) => n(m + i, m + i));

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
          LIS O(2^n)
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
        <h2 className="pointer-events-none sticky top-0 z-10 w-20 text-center font-mono text-lg text-blue-200">
          → {max.toFixed(2)}
        </h2>
      </div>

      <div className="sticky top-8 z-10 flex w-full max-w-xs flex-wrap justify-start text-blue-300">
        <div className="flex w-full flex-wrap rounded-sm border-blue-900">
          <div className="flex w-full gap-1 pl-3 pr-1">
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

      <div className="flex max-w-xs flex-wrap justify-start text-blue-300">
        <div className="flex w-full flex-wrap rounded-sm border-blue-900">
          <RunContext.Provider value={{ setMax, max, inputs }}>
            <LIS a={0} i={0} j={null} />
          </RunContext.Provider>
        </div>
      </div>
    </div>
  );
}
