import { render, screen } from "@testing-library/react";
import Run from "../algorithms/copper-rods";

describe("Copper Rods", () => {
  it("renders the algorithm", () => {
    render(<Run />);
  });

  it("calculates the result correctly", () => {
    render(<Run defaultValues={{ inputs: [3, 4, 5], w: 4 }} />);

    expect(screen.getByTestId("result")).toHaveTextContent("12");
  });
});
