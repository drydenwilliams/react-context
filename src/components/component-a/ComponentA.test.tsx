import React from "react";
import { render } from "../../utils/test-utils";
import ComponentA from "./ComponentA";

describe("ComponentA", () => {
  it("should render with content", () => {
    const { getByText } = render(<ComponentA />, {});
    expect(getByText("ComponentA")).toBeInTheDocument();
  });
});
