import { render, screen } from "@testing-library/react";
import App from "./App";

test("renderiza la seccion principal de Verdant", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /plantas y macetas para tu hogar/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /buscar/i })
  ).toBeInTheDocument();
});
