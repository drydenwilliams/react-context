import React, { FunctionComponent } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "../theme";

interface IAllProviderProps {
  children: any;
}

const AllTheProviders: FunctionComponent<IAllProviderProps> = ({
  children,
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

const customRender = (ui: any, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
