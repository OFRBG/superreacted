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

type MaxProfitProps = {
  a: number;
  w: number;
  children?: ReactNode;
};

type BlockProps = number;

const Block = ({ w, cached }: { w: BlockProps; cached?: boolean }) => (
  <div
    style={{ flex: w + 1 }}
    className={`h-1 rounded-sm font-mono text-xs group-hover:h-2 group-hover:bg-blue-500 group-hover:opacity-100 ${
      cached ? "bg-emerald-700" : "bg-blue-600"
    }`}
  ></div>
);

const Result = ({ a, children }: Omit<MaxProfitProps, "w">) => {
  const { max, setMax } = useRunContext();

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
      <div className="flex h-1 flex-1 items-center justify-center gap-[2px]">
        {children}
      </div>
      <div className="invisible w-0 font-mono text-xs group-hover:visible">
        {Number(a).toFixed(2)}
      </div>
    </div>
  );
};

const CacheMark = ({ w, children }: { w: number; children: ReactNode }) => {
  solved.add(w);

  return <>{children}</>;
};

const MaxProfit = ({ a, w, children }: MaxProfitProps) => {
  const { inputs } = useRunContext();
  if (w === 0)
    return (
      <Result key={`${w}-${a.toFixed(2)}`} a={a}>
        {children}
      </Result>
    );

  return (
    <CacheMark w={w}>
      {inputs.map((price, i) =>
        w - i - 1 < 0 ? null : (
          <MaxProfit
            key={`${w}-${a.toFixed(2)}-${i}`}
            w={w - i - 1}
            a={a + price}
          >
            {children}
            <Block w={i} cached={solved.has(w)} />
          </MaxProfit>
        ),
      )}
    </CacheMark>
  );
};

const initState = (base: number[] = []) =>
  Array(base.length || 10)
    .fill(-1)
    .map((_, i) => n(i + 1, (i + 1) * 0.2));

type DefaultValues = {
  w: number;
  inputs: number[] | (() => number[]);
};

type RunProps<T> = {
  defaultValues?: T;
};

export default function Run({
  defaultValues = { w: 6, inputs: initState },
}: RunProps<DefaultValues>) {
  const [max, setMax] = useState(0);
  const [w, setW] = useState(defaultValues.w);
  const [inputs, setInputs] = useState(defaultValues.inputs);

  useLayoutEffect(() => {
    solved.clear();
  });

  useLayoutEffect(() => {
    setMax(0);
  }, [w, inputs]);

  return (
    <div className="flex h-screen select-none flex-col items-center justify-start gap-1 overflow-scroll p-4">
      <div>
        <h1 className="pb-2 inline align-middle font-mono text-xl text-blue-100">
          Copper Rods
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
          onClick={() => setW((w) => w - 1)}
        >
          -
        </button>
        <h2 className="pointer-events-none w-6 text-center font-mono text-lg text-blue-200">
          {w}
        </h2>
        <button
          className="h-4 w-4 rounded-sm bg-yellow-500 text-xs font-bold text-slate-900"
          onClick={() => setW((w) => w + 1)}
        >
          +
        </button>
        <h2 className="pointer-events-none sticky top-0 z-10 w-20 text-center font-mono text-lg text-blue-200">
          →{" "}
          <span data-testid="result" className="contents">
            {max.toFixed(2)}
          </span>
        </h2>
      </div>

      <div className="flex max-w-xs flex-wrap justify-start text-blue-300">
        <div className="flex w-full relative flex-wrap rounded-sm border-blue-900 p-1">
          {inputs.map((p, index) => (
            <div
              key={index}
              className={`group flex w-full items-center font-mono text-xs h-4 ${
                index + 1 > w ? "hidden" : ""
              }`}
            >
              <span className="mr-2">{Number(p).toFixed(2)}</span>
              <div
                style={{
                  width: ((index + 1) / (w + 1)) * 100 + "%",
                }}
                className={`h-1`}
              >
                <Block w={index} />
              </div>
            </div>
          ))}
        </div>
        <RunContext.Provider value={{ setMax, max, inputs }}>
          <MaxProfit a={0} w={w} />
        </RunContext.Provider>
      </div>
    </div>
  );
}
