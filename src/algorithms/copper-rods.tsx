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

type MaxProfitProps = {
  a: number;
  w: number;
  children?: ReactNode;
};

const Result = ({ a, children }: Omit<MaxProfitProps, "w">) => {
  const { max, setMax } = useRunContext();

  useEffect(() => {
    setMax((m) => Math.max(m, a));
  });

  return (
    <BlockLine highlight={a === max} note={Number(a).toFixed()}>
      {children}
    </BlockLine>
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
            <Block style={{ flex: i + 1 }} cached={solved.has(w)} />
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

export default function CopperRods({
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
    <Layout
      title="Copper Rods"
      onReset={() => setInputs(initState)}
      controls={
        <span className="contents text-center font-mono text-lg text-blue-200">
          <Button variant="blue" onClick={() => setW((w) => w - 1)}>
            -
          </Button>
          <h2 className="pointer-events-none w-6 ">{w}</h2>
          <Button variant="yellow" onClick={() => setW((w) => w + 1)}>
            +
          </Button>
          <h2 className="pointer-events-none ">
            →{" "}
            <span data-testid="result" className="contents">
              {max.toFixed(2)}
            </span>
          </h2>
        </span>
      }
      headers={
        <div className="flex max-w-xs flex-wrap text-blue-300">
          {inputs.map((p, index) => (
            <InputValue index={index} w={w} p={p} />
          ))}
        </div>
      }
    >
      <RunContext.Provider value={{ setMax, max, inputs }}>
        <MaxProfit a={0} w={w} />
      </RunContext.Provider>
    </Layout>
  );
}

function InputValue({ index, w, p }: { index: number; w: number; p: number }) {
  return (
    <div
      key={index}
      className={`group flex h-4 w-full items-center font-mono text-xs ${
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
        <Block />
      </div>
    </div>
  );
}
