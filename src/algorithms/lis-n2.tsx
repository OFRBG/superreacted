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

type LISProps = {
  children?: ReactNode;
  i: number;
  j: number;
  l: number[];
  a: number;
};

const Result = ({ a, i: index }: Omit<LISProps, "l"> & { j: number }) => {
  const { setMax, max, inputs } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <BlockLine highlight={a === max} note={a}>
      {index != null
        ? inputs.slice(0, index).map((_, i) => <Block key={i} empty />)
        : null}
      <Block />
      {index != null
        ? inputs
          .slice(index + 1, inputs.length)
          .map((_, index) => <Block key={index} empty />)
        : null}
    </BlockLine>
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

const LIS = ({ children, i, j, l, a }: LISProps) => {
  const { inputs } = useRunContext();

  if (i === inputs.length) {
    return (
      <Result a={a} i={i} j={j}>
        {children}
      </Result>
    );
  }

  return (
    <CacheMark i={i} j={j}>
      <Result a={a} i={i} j={j}>
        {children}
      </Result>
      <LIS
        a={j === i ? 1 : inputs[i] > inputs[j] ? Math.max(l[j] + 1, a) : a}
        i={j < i ? i : i + 1}
        j={j < i ? j + 1 : 0}
        l={j === i ? [...l, a] : l}
      >
        {i !== j ? (
          <>
            {children}
            <Block key={`${j}-${i}`} />
          </>
        ) : null}
      </LIS>
    </CacheMark>
  );
};

const initState = (base: number[] = []) =>
  Array(base.length || 10)
    .fill(15)
    .map((m, i) => Math.floor(n(m, m + i)));

type DefaultValues = {
  max: number;
  inputs: number[] | (() => number[]);
};

type RunProps<T> = {
  defaultValues?: T;
};

export default function LISN2({
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
      title="LIS O(n^2)"
      onReset={() => setInputs(initState)}
      controls={
        <span className="contents text-center font-mono text-lg text-blue-200">
          <Button
            variant="blue"
            onClick={() => setInputs((i) => i.slice(0, -1))}
          >
            -
          </Button>
          <h2 className="pointer-events-none w-6">{inputs.length}</h2>
          <Button
            variant="yellow"
            onClick={() => setInputs((i) => [...i, Math.floor(n(15))])}
          >
            +
          </Button>
          <h2 className="pointer-events-none">→ {max}</h2>
        </span>
      }
      headers={inputs.map((p, index) => (
        <div
          key={index}
          className={`w-[2ch] flex-1 rounded-sm bg-slate-900 text-center font-mono text-xs ${p < 0 ? "text-rose-600" : ""
            }`}
        >
          {Math.abs(p)}
          <Block />
        </div>
      ))}
    >
      <RunContext.Provider value={{ setMax, max, inputs }}>
        <LIS a={1} i={0} j={0} l={[]} />
      </RunContext.Provider>
    </Layout>
  );
}
