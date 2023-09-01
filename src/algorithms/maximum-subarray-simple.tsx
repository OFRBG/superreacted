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
import { Block } from "../components/Block";
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

const solved = new Set();

type MaximumSubArrayProps = {
  step?: number;
  i: number;
  j: number;
  a: number;
  children?: ReactNode;
};

const Result = ({ i, j, a, children }: MaximumSubArrayProps) => {
  const { setMax, max, inputs } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <BlockLine highlight={a === max} note={Number(a).toFixed(2)}>
      {i
        ? Array(i - 1)
            .fill(-1)
            .map(() => <Block empty />)
        : null}
      {children}
      {Array(inputs.length - j)
        .fill(-1)
        .map(() => (
          <Block empty />
        ))}
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
      <MaximumSubArray i={i} j={next} a={a + item}>
        {Children.count(children) > 1 &&
          Children.toArray(children).slice(0, -1)}
        {Children.count(children) > 1 && <Block dim />}
        {Children.count(children) <= 1 && children}
        <Block cached={solved.has(`${j}-${inputs.length - 1}`)} />
      </MaximumSubArray>
      <MaximumSubArray i={next} j={next} a={item}>
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

export default function MaximumSubarray2N({
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
    <Layout
      title="Maximum Subarray O(2^n)"
      controls={
        <span className="contents text-center font-mono text-lg text-blue-200">
          <Button
            variant="blue"
            onClick={() => setInputs((i) => i.slice(0, -1))}
          >
            -
          </Button>
          <h2 className="pointer-events-none w-6 ">{inputs.length}</h2>
          <Button variant="yellow" onClick={() => setInputs((i) => [...i, 1])}>
            +
          </Button>
          <h2 className="pointer-events-none flex-1 ">→</h2>
          <h2 className="pointer-events-none flex-1 ">
            {max === MIN ? "..." : max}
          </h2>
        </span>
      }
      headers={inputs.map((p, index) => (
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
    >
      <RunContext.Provider value={{ setMax, max, inputs }}>
        <MaximumSubArray i={0} j={0} a={0} />
      </RunContext.Provider>
    </Layout>
  );
}
