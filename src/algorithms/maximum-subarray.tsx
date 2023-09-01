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

type BlockProps = {
  empty?: boolean;
  cached?: boolean;
};

type MaximumSubArrayProps = {
  step?: number;
  i: number;
  j: number;
  a: number;
  children?: ReactNode;
};

const Block = ({ cached, empty }: BlockProps) => {
  return (
    <div
      className={`h-1 flex-1 rounded-sm font-mono text-xs group-hover:h-2 ${
        empty
          ? "invisible bg-blue-700 group-hover:visible group-hover:opacity-10"
          : `visible ${
              cached ? "bg-fuchsia-500" : "bg-blue-600"
            } group-hover:bg-green-600 group-hover:opacity-90`
      }`}
    ></div>
  );
};

const Result = ({ i, j, a, children }: MaximumSubArrayProps) => {
  const { setMax, max, inputs } = useRunContext();

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
        {i
          ? Array(i - 1)
              .fill(true)
              .map(() => <Block />)
          : null}
        {children}
        {Array(inputs.length - j)
          .fill(true)
          .map(() => (
            <Block empty />
          ))}
      </div>
      <div className="invisible w-0 font-mono text-xs group-hover:visible">
        {Number(a).toFixed(2)}
      </div>
    </div>
  );
};

const CacheMark = ({
  i,
  j,
  children,
}: {
  i: number;
  j: number;
  children: ReactNode;
}) => {
  solved.add(`${i}-${j}`);

  return <>{children}</>;
};

const MaximumSubArray = ({ i, j, a, children }: MaximumSubArrayProps) => {
  const { inputs } = useRunContext();

  if (j === inputs.length) {
    return (
      <Result i={i} j={j} a={a}>
        {children}
      </Result>
    );
  }

  const next = j + 1;
  const item = inputs[j];

  return (
    <CacheMark i={i} j={j}>
      <Result i={i} j={j} a={a}>
        {children}
      </Result>
      <MaximumSubArray i={next} j={next} a={item}>
        <Block cached={solved.has(`${j}-${inputs.length - 1}`)} />
      </MaximumSubArray>
      <MaximumSubArray i={i} j={next} a={a + item}>
        {children}
        <Block cached={solved.has(`${j}-${inputs.length - 1}`)} />
      </MaximumSubArray>
    </CacheMark>
  );
};

const MIN = -1000;

type DefaultValues = {
  inputs: number[] | (() => number[]);
};

type RunProps<T> = {
  defaultValues?: T;
};

export default function Run({
  defaultValues = { inputs: [-2, 1, -3, 4, 5, 7] },
}: RunProps<DefaultValues>) {
  const [max, setMax] = useState(MIN);
  const [inputs, setInputs] = useState(defaultValues.inputs);

  useLayoutEffect(() => {
    solved.clear();
  });

  useLayoutEffect(() => {
    setMax(MIN);
  }, [inputs]);

  return (
    <div className="flex h-screen select-none flex-col items-center justify-start gap-1 overflow-scroll p-4">
      <h1 className="pb-2 font-mono text-xl text-blue-100">Maximum Subarray</h1>
      <div className="sticky top-0 z-10 flex items-center gap-2 rounded-sm bg-slate-900 px-2">
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
          onClick={() => setInputs((i) => [...i, 1])}
        >
          +
        </button>
        <h2 className="pointer-events-none sticky top-0 z-10 flex-1 text-center font-mono text-lg text-blue-200">
          →
        </h2>
        <h2 className="pointer-events-none sticky top-0 z-10 flex-1 text-center font-mono text-lg text-blue-200">
          {max === MIN ? "..." : max}
        </h2>
      </div>
      <div className="sticky top-8 z-10 mb-1 h-auto max-w-xs rounded-sm py-1 pl-4 pr-2 text-blue-100">
        <div className="flex px-4 gap-[2px]">
          {inputs.map((p, index) => (
            <div key={index} className="flex-1 text-center font-mono text-xs">
              <input
                className={`w-full rounded-sm bg-transparent text-center ${
                  p < 0 ? "text-red-600" : ""
                }`}
                step="1"
                type="number"
                value={p}
                onChange={(event) => {
                  setInputs(
                    (i) => (
                      i.splice(index, 1, Number(event.target.value)), i.slice()
                    ),
                  );
                }}
              />
              <Block />
            </div>
          ))}
        </div>
      </div>

      <div className="flex max-w-xs flex-wrap justify-start px-4 text-blue-300">
        <div className="flex w-full flex-wrap rounded-sm border-blue-900 p-1">
          <RunContext.Provider value={{ setMax, max, inputs }}>
            <MaximumSubArray i={0} j={0} a={0} />
          </RunContext.Provider>
        </div>
      </div>
    </div>
  );
}
