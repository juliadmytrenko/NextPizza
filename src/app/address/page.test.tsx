import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import AddressPage from "./page";
import { AddressProvider } from "../../../context/AddressContext";

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Address Page", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders page heading", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Delivery Address", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders all required form fields", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it("renders optional additional information field", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    expect(
      screen.getByLabelText(/Additional Information/i)
    ).toBeInTheDocument();
  });

  it("renders section headings", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Personal Information" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delivery Address", level: 2 })
    ).toBeInTheDocument();
  });

  it("updates form fields when user types", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    const firstNameInput = screen.getByLabelText(
      /First Name/i
    ) as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: "John" } });

    expect(firstNameInput.value).toBe("John");
  });

  it("handles multiple field changes", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    const firstNameInput = screen.getByLabelText(
      /First Name/i
    ) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(
      /Last Name/i
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    expect(firstNameInput.value).toBe("John");
    expect(lastNameInput.value).toBe("Doe");
    expect(emailInput.value).toBe("john@example.com");
  });

  it("submits form with valid data and navigates to checkout", async () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Street Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "New York" },
    });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), {
      target: { value: "10001" },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: "USA" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Continue to Checkout/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/checkout");
    });
  });

  it("renders submit button with correct text", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    expect(
      screen.getByRole("button", { name: /Continue to Checkout/i })
    ).toBeInTheDocument();
  });

  it("handles textarea input for additional information", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    const textarea = screen.getByLabelText(
      /Additional Information/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: "Leave at door" },
    });

    expect(textarea.value).toBe("Leave at door");
  });

  it("has correct placeholder for additional info", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    const textarea = screen.getByPlaceholderText(
      /Apartment number, delivery instructions/i
    );
    expect(textarea).toBeInTheDocument();
  });

  it("all required fields have asterisk indicator", () => {
    render(
      <AddressProvider>
        <AddressPage />
      </AddressProvider>
    );

    expect(screen.getByText(/First Name \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Email \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone Number \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Street Address \*/i)).toBeInTheDocument();
    expect(screen.getByText(/City \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Postal Code \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Country \*/i)).toBeInTheDocument();
  });
});
