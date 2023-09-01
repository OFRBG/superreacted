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
import { Block } from "../components/Block";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { BlockLine } from "../components/BlockLine";

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

// const className = {
//   colors: [
//     "bg-green-600",
//     "bg-green-500",
//     "bg-green-400",
//     "bg-green-300",
//     "bg-green-200",
//     "bg-green-100",
//   ],
// };

const Result = ({ a, children }: { a: number; children: ReactNode }) => {
  const { setMax, max } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <BlockLine highlight={a === max} note={a}>
      {children}
    </BlockLine>
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
            <Block cached={solved.has(i)} />
          </LIS>
        </CacheMark>
      ) : null}
      <LIS i={i + 1} j={j} a={a}>
        {children}
        <Block empty />
      </LIS>
    </>
  );
};

const initState = (base: number[] = []) =>
  Array(base.length || 14)
    .fill(15)
    .map((m, i) => Math.floor(n(m + i, m + i)));

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
    <Layout
      title="LIS O(2^n)"
      onReset={() => setInputs(initState)}
      controls={
        <>
          <Button
            variant="blue"
            onClick={() => setInputs((i) => i.slice(0, -1))}
          >
            -
          </Button>
          <h2 className="pointer-events-none w-6 text-center font-mono text-lg text-blue-200">
            {inputs.length}
          </h2>
          <Button
            variant="yellow"
            onClick={() => setInputs((i) => [...i, n(15)])}
          >
            +
          </Button>
          <h2 className="pointer-events-none sticky top-0 z-10 w-20 text-center font-mono text-lg text-blue-200">
            → {max.toFixed(2)}
          </h2>
        </>
      }
      headers={inputs.map((p, index) => (
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
    >
      <RunContext.Provider value={{ setMax, max, inputs }}>
        <LIS a={0} i={0} j={null} />
      </RunContext.Provider>
    </Layout>
  );
}
