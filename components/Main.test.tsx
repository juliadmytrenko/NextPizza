import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Main } from "./Main";

describe("Main", () => {
  it("renders children content", () => {
    render(
      <Main>
        <div>Test Content</div>
      </Main>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <Main className="custom-class">
        <div>Content</div>
      </Main>
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("custom-class");
  });

  it("renders with default relative positioning", () => {
    const { container } = render(
      <Main>
        <div>Content</div>
      </Main>
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("relative");
  });

  it("renders top SVG border", () => {
    const { container } = render(
      <Main>
        <div>Content</div>
      </Main>
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2); // Top and bottom borders
  });

  it("renders bottom SVG border", () => {
    const { container } = render(
      <Main>
        <div>Content</div>
      </Main>
    );

    const svgs = container.querySelectorAll("svg");
    const bottomSvg = svgs[1];
    expect(bottomSvg).toHaveClass("absolute", "bottom-0");
  });

  it("wraps content with padding", () => {
    const { container } = render(
      <Main>
        <div data-testid="content">Content</div>
      </Main>
    );

    const contentWrapper = screen.getByTestId("content").parentElement;
    expect(contentWrapper).toHaveClass("py-4");
  });
});
