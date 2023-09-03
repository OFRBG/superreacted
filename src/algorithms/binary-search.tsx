import {
  Children,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { n } from "../n";
import { Block } from "../components/Block";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { BlockLine } from "../components/BlockLine";

const RunContext = createContext<{
  setMid: Dispatch<SetStateAction<number>>;
  mid: number;
  inputs: number[];
  v: number;
} | null>(null);

const useRunContext = () => {
  const context = useContext(RunContext);

  if (!context) {
    throw new Error("Context not in tree");
  }

  return context;
};

type SearchProps = {
  l: number;
  r: number;
  children?: ReactNode;
};

const Result = ({ l, r, children }: SearchProps) => {
  const { inputs, setMid, v } = useRunContext();

  const mid = Math.floor((r - l) / 2 + l);

  useEffect(() => {
    if (l === r) setMid(mid);
  });

  return (
    <BlockLine note={`${inputs[l]}-${inputs[r]}`} highlight={inputs[mid] === v}>
      {Children.toArray(children).slice(0, l)}
      {l !== mid && l < r && <Block className="bg-red-600" />}
      {Children.toArray(children).slice(l + 1, mid)}
      <Block className={"bg-yellow-500"} />
      {Children.toArray(children).slice(mid + 1, r)}
      {r !== mid && l < r && <Block className="bg-red-600" />}
      {Children.toArray(children).slice(r + 1, inputs.length)}
    </BlockLine>
  );
};

const Search = ({ l, r, children }: SearchProps) => {
  const { inputs, v } = useRunContext();

  const mid = Math.floor((r - l) / 2 + l);

  if (r - l <= 0 || inputs[mid] === v) {
    return (
      <Result l={l} r={r}>
        {children}
      </Result>
    );
  }

  return (
    <>
      <Result l={l} r={r}>
        {children}
      </Result>
      {v < inputs[mid] ? (
        <Search l={l} r={Math.max(mid - 1, l)}>
          {Children.toArray(children).slice(0, mid)}
          {inputs.slice(mid, r + 1).map((v, i) => (
            <Block dim key={`${v}-${i}`} />
          ))}
          {Children.toArray(children).slice(r + 1, inputs.length)}
        </Search>
      ) : (
        <Search l={Math.min(mid + 1, r)} r={r}>
          {Children.toArray(children).slice(0, l)}
          {inputs.slice(l, mid + 1).map((v, i) => (
            <Block dim key={`${v}-${i}`} />
          ))}
          {Children.toArray(children).slice(mid + 1, inputs.length)}
        </Search>
      )}
    </>
  );
};

const initState = (base: number[] = []) => {
  const array = Array(base.length || 25)
    .fill(-1)
    .map(() => Math.floor(Math.abs(n(100))));

  array.sort((a, b) => a - b);

  return array;
};

type DefaultValues = {
  v: number;
  inputs: number[] | (() => number[]);
};

type RunProps<T> = {
  defaultValues?: T;
};

export default function BinarySearch({
  defaultValues = { v: 100, inputs: initState },
}: RunProps<DefaultValues>) {
  const [mid, setMid] = useState(0);
  const [v, setV] = useState(defaultValues.v);
  const [inputs, setInputs] = useState(defaultValues.inputs);

  return (
    <Layout
      title="Binary Search"
      onReset={() => setInputs(initState)}
      controls={
        <span className="contents text-center font-mono text-lg text-blue-200">
          <Button variant="blue" onClick={() => setV((w) => w - 1)}>
            -
          </Button>
          <h2 className="pointer-events-none">{v}</h2>
          <Button variant="yellow" onClick={() => setV((w) => w + 1)}>
            +
          </Button>
          <h2 className="pointer-events-none w-32">
            →{" "}
            <span data-testid="result" className="contents">
              {inputs[mid] === v ? "Found" : "Not Found"}
            </span>
          </h2>
        </span>
      }
      headers={inputs.map((p, index) => (
        <div
          key={index}
          className={`w-0 flex-1 -rotate-90 overflow-visible text-center font-mono text-xs`}
        >
          {Math.abs(p)}
        </div>
      ))}
    >
      <RunContext.Provider value={{ setMid, mid, inputs, v }}>
        <Search l={0} r={inputs.length - 1}>
          {inputs.map((v, i) => (
            <Block key={`${v}-${i}`} />
          ))}
        </Search>
      </RunContext.Provider>
    </Layout>
  );
}
