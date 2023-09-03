import {
  Children,
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
import { Block as SystemBlock } from "../components/Block";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
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

const className = {
  colors: [
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-lime-500",
  ],
};

type BlockProps = {
  empty?: boolean;
  step?: number;
  dim?: boolean;
};

type MaximumSubArrayProps = {
  step?: number;
  i: number;
  j: number;
  a: number;
  children?: ReactNode;
};

const Block = ({ step = 0, ...props }: BlockProps) => {
  const color = className.colors[Math.max(Math.min(step + 3, 6), 0)];

  return <SystemBlock {...props} className={props.empty ? "" : color} />;
};

const Result = ({ i, j, a, children }: Omit<MaximumSubArrayProps, "step">) => {
  const { setMax, max, inputs } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <BlockLine highlight={a === max} note={Number(a).toFixed()}>
      {i
        ? Array(i - 1)
            .fill(true)
            .map(() => <SystemBlock empty />)
        : null}
      {children}
      {j
        ? Array(inputs.length - j)
            .fill(true)
            .map(() => <SystemBlock empty />)
        : null}
    </BlockLine>
  );
};

const MaximumSubArray = ({
  step = 0,
  i,
  j,
  a,
  children,
}: MaximumSubArrayProps) => {
  const { inputs } = useRunContext();

  if (j === inputs.length) {
    return (
      <Result i={i} j={j} a={a}>
        {children}
      </Result>
    );
  }

  return (
    <>
      <Result i={i} j={j} a={a}>
        {children}
      </Result>
      {a > 0 ? (
        <MaximumSubArray
          i={i}
          j={j + 1}
          a={a + inputs[j]}
          step={inputs[j] > 0 ? step + 1 : step - 1}
        >
          {Children.count(children) > 1 &&
            Children.toArray(children).slice(0, -1)}
          {Children.count(children) > 1 && <Block step={step} dim />}
          {Children.count(children) <= 1 && children}
          <Block step={inputs[j] > 0 ? step + 1 : step - 1} />
        </MaximumSubArray>
      ) : (
        <MaximumSubArray i={j + 1} j={j + 1} a={inputs[j]} step={0}>
          <Block step={0} />
        </MaximumSubArray>
      )}
    </>
  );
};

const initState = (base: number[] = []) =>
  Array(base.length || 20)
    .fill(-1)
    .map(() => Math.floor(n(10, 30)));

const MIN = -1000;

type DefaultValues = {
  inputs: number[] | (() => number[]);
};

type RunProps<T> = {
  defaultValues?: T;
};

export default function MaximumSubarrayN({
  defaultValues = { inputs: initState },
}: RunProps<DefaultValues>) {
  const [max, setMax] = useState(MIN);
  const [inputs, setInputs] = useState(defaultValues.inputs);

  useLayoutEffect(() => {
    setMax(MIN);
  }, [inputs]);

  return (
    <Layout
      title="Maximum Subarray O(n)"
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
            onClick={() => setInputs((i) => [...i, Math.floor(n(0, 10))])}
          >
            +
          </Button>
          <h2 className="pointer-events-none flex-1">→</h2>
          <h2 className="pointer-events-none flex-1">
            {max === MIN ? "..." : max}
          </h2>
        </span>
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
        <MaximumSubArray i={0} j={0} a={0} />
      </RunContext.Provider>
    </Layout>
  );
}
