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
  l: number[];
  a: number;
  backtrack?: boolean;
};

const Result = ({ a, i, children }: Omit<LISProps, "l">) => {
  const { setMax, max, inputs } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <BlockLine highlight={a === max} note={a}>
      {children}
      {i
        ? Array(inputs.length - i)
            .fill(true)
            .map(() => <Block empty />)
        : null}
    </BlockLine>
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
    <Layout
      title="LIS O(n^2)"
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
            onClick={() => setInputs((i) => [...i, Math.floor(n(15))])}
          >
            +
          </Button>
          <h2 className="pointer-events-none sticky top-0 z-10 w-12 text-center font-mono text-lg text-blue-200">
            → {max}
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
        <LIS a={0} i={0} l={[]} />
      </RunContext.Provider>
    </Layout>
  );
}
