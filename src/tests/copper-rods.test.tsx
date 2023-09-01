import { render, screen } from "@testing-library/react";
import CopperRods from "../algorithms/copper-rods";

describe("Copper Rods", () => {
  it("renders the algorithm", () => {
    render(<CopperRods />);
  });

  it("calculates the result correctly", () => {
    render(<CopperRods defaultValues={{ inputs: [3, 4, 5], w: 4 }} />);

    expect(screen.getByTestId("result")).toHaveTextContent("12");
  });
});
