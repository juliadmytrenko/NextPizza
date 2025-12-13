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

  // Validation Tests
  describe("Form Validation", () => {
    it("shows error when first name is empty on blur", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const firstNameInput = screen.getByLabelText(/First Name/i);
      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
      });
    });

    it("shows error when first name is too short", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const firstNameInput = screen.getByLabelText(/First Name/i);
      fireEvent.change(firstNameInput, { target: { value: "A" } });
      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(
          screen.getByText("First name must be at least 2 characters")
        ).toBeInTheDocument();
      });
    });

    it("shows error when first name contains numbers", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const firstNameInput = screen.getByLabelText(/First Name/i);
      fireEvent.change(firstNameInput, { target: { value: "John123" } });
      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(
          screen.getByText("First name can only contain letters")
        ).toBeInTheDocument();
      });
    });

    it("shows error when last name is empty on blur", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const lastNameInput = screen.getByLabelText(/Last Name/i);
      fireEvent.blur(lastNameInput);

      await waitFor(() => {
        expect(screen.getByText("Last name is required")).toBeInTheDocument();
      });
    });

    it("shows error when email format is invalid", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address")
        ).toBeInTheDocument();
      });
    });

    it("shows error when phone number is too short", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      fireEvent.change(phoneInput, { target: { value: "12345" } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(
          screen.getByText("Phone number must be at least 9 digits")
        ).toBeInTheDocument();
      });
    });

    it("shows error when phone number is too long", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      fireEvent.change(phoneInput, { target: { value: "1234567890123456" } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(
          screen.getByText("Phone number is too long")
        ).toBeInTheDocument();
      });
    });

    it("shows error when street address is too short", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const streetInput = screen.getByLabelText(/Street Address/i);
      fireEvent.change(streetInput, { target: { value: "123" } });
      fireEvent.blur(streetInput);

      await waitFor(() => {
        expect(
          screen.getByText("Street address must be at least 5 characters")
        ).toBeInTheDocument();
      });
    });

    it("shows error when city contains numbers", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const cityInput = screen.getByLabelText(/City/i);
      fireEvent.change(cityInput, { target: { value: "City123" } });
      fireEvent.blur(cityInput);

      await waitFor(() => {
        expect(
          screen.getByText("City name can only contain letters")
        ).toBeInTheDocument();
      });
    });

    it("shows error when postal code is too short", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const postalCodeInput = screen.getByLabelText(/Postal Code/i);
      fireEvent.change(postalCodeInput, { target: { value: "12" } });
      fireEvent.blur(postalCodeInput);

      await waitFor(() => {
        expect(
          screen.getByText("Postal code is too short")
        ).toBeInTheDocument();
      });
    });

    it("clears error when invalid field is corrected", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const emailInput = screen.getByLabelText(/Email/i);

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address")
        ).toBeInTheDocument();
      });

      // Correct the email
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });

      await waitFor(() => {
        expect(
          screen.queryByText("Please enter a valid email address")
        ).not.toBeInTheDocument();
      });
    });

    it("prevents form submission when validation fails", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      // Submit without filling any fields
      const submitButton = screen.getByRole("button", {
        name: /Continue to Checkout/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
        expect(screen.getByText("Last name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it("validates all fields on form submission", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const submitButton = screen.getByRole("button", {
        name: /Continue to Checkout/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
        expect(screen.getByText("Last name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(
          screen.getByText("Phone number is required")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Street address is required")
        ).toBeInTheDocument();
        expect(screen.getByText("City is required")).toBeInTheDocument();
        expect(screen.getByText("Postal code is required")).toBeInTheDocument();
        expect(screen.getByText("Country is required")).toBeInTheDocument();
      });
    });

    it("applies error styling to invalid fields", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const firstNameInput = screen.getByLabelText(/First Name/i);
      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(firstNameInput).toHaveClass("border-red-500");
      });
    });

    it("accepts valid email formats", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.queryByText("Please enter a valid email address")
        ).not.toBeInTheDocument();
      });
    });

    it("accepts valid phone numbers with non-digit characters", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      fireEvent.change(phoneInput, { target: { value: "+1 (555) 123-4567" } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(
          screen.queryByText("Phone number must be at least 9 digits")
        ).not.toBeInTheDocument();
      });
    });

    it("validates postal code format", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      const postalCodeInput = screen.getByLabelText(/Postal Code/i);
      fireEvent.change(postalCodeInput, { target: { value: "12345" } });
      fireEvent.blur(postalCodeInput);

      await waitFor(() => {
        expect(
          screen.queryByText("Please enter a valid postal code")
        ).not.toBeInTheDocument();
      });
    });

    it("submits form only when all validations pass", async () => {
      render(
        <AddressProvider>
          <AddressPage />
        </AddressProvider>
      );

      // Fill in all fields with valid data
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
        target: { value: "123 Main Street" },
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
  });
});
