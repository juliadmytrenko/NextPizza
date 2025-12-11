import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("displays opening hours", () => {
    render(<Banner />);
    expect(screen.getByText("11:00 - 23:00")).toBeInTheDocument();
  });
});
