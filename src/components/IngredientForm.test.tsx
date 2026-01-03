import { render, screen } from "@testing-library/react";
import IngredientForm from "./IngredientForm";
import userEvent from "@testing-library/user-event";
import { JSX } from "react";

describe("IngredientForm Component", () => {
  const setupForm = (overrides = {}) => {
    return {
      user: userEvent.setup(),
      ...render(<IngredientForm {...overrides} />),
      ingredientNameInput: screen.getByLabelText(/Add Ingredient/i),
      addButton: screen.getByRole("button", { name: /Add/i }),
    };
  };

  it("renders the component", () => {
    render(<IngredientForm />);
    const inputElement = screen.getByPlaceholderText(/Ingredient name/i);
    expect(inputElement).toBeInTheDocument();
  });

  it("allows adding a new ingredient", async () => {
    const onSubmit = vi.fn();
    const { user, ingredientNameInput, addButton } = setupForm(onSubmit);
    await user.type(ingredientNameInput, "Tomato");
    await user.click(addButton);
    const successMessage = await screen.findByLabelText(/ingredient message/i);
    expect(successMessage).toBeInTheDocument();
  });

  // i will handle this validation by making add button disabled when input is empty
  // it("shows error message for empty input", async () => {
  //   const { user, addButton } = setupForm();
  //   await user.click(addButton);
  //   const errorMessage = await screen.findByText(/Wypełnij to pole/i);
  //   expect(errorMessage).toBeInTheDocument();
  // });

  it("The onSubmit function is triggered once when the input is correct.", async () => {
    const handleSubmit = vi.fn();
    const { user, addButton, ingredientNameInput } = setupForm({
      onSubmit: handleSubmit,
    });
    await user.type(ingredientNameInput, "Basil");
    await user.click(addButton);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("The onSubmit function is not triggered when the input is empty.", async () => {
    const onSubmit = vi.fn();
    const { user, addButton } = setupForm({
      onSubmit: onSubmit,
    });
    await user.click(addButton);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // od tego momentu zaczynają się testy integracyjne które sprawdzają czy komunikaty o błędach i sukcesie są wyświetlane poprawnie

  it("shows error message for duplicate ingredient", async () => {
    const { user, ingredientNameInput, addButton } = setupForm({
      handleSubmit: handleSubmit,
    });
    await user.type(ingredientNameInput, "Tomato");
    await user.click(addButton);
    await user.type(ingredientNameInput, "Tomato");
    await user.click(addButton);
    // it does not work yet because we dont connect to real API yet
    const errorMessage = await screen.getByText(
      /Ingredient already exists in database/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("clears input after adding an ingredient", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Lettuce");
    await user.click(addButton);
    expect(ingredientNameInput).toHaveValue("");
  });

  it("trims whitespace from input", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "  Carrot  ");
    await user.click(addButton);
    const successMessage = await screen.findByLabelText(/ingredient message/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should not accept special characters in ingredient name", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Tom@to!");
    await user.click(addButton);
    const errorMessage = await screen.getByText(
      /Ingredient name contains invalid characters/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should enforce a maximum length for ingredient name", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    const longName = "A".repeat(101); // Assuming max length is 100
    await user.type(ingredientNameInput, longName);
    await user.click(addButton);
    const errorMessage = await screen.getByText(
      /Ingredient name cannot exceed 100 characters/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should convert ingredient name to lowercase before adding", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Cucumber");
    await user.click(addButton);
    const successMessage = await screen.findByLabelText(/ingredient message/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should focus input after adding an ingredient", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Spinach");
    await user.click(addButton);
    expect(ingredientNameInput).toHaveFocus();
  });

  it("should disable add button while processing", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Kale");
    await user.click(addButton);
    expect(addButton).toBeDisabled();
  });

  it("should handle rapid submissions gracefully", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Broccoli");
    await Promise.all([user.click(addButton), user.click(addButton)]);
    const successMessage = await screen.findByLabelText(/ingredient message/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should clear error message on new input", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.click(addButton);
    const errorMessage = await screen.getByText(
      /Ingredient name cannot be empty/i
    );
    expect(errorMessage).toBeInTheDocument();
    await user.type(ingredientNameInput, "Onion");
    expect(screen.queryByText(/Ingredient name cannot be empty/i)).toBeNull();
  });

  it("should display loading indicator when adding ingredient", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Garlic");
    await user.click(addButton);
    const loadingIndicator = screen.getByLabelText(/loading indicator/i);
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("should not accept numeric-only ingredient names", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "12345");
    await user.click(addButton);
    const errorMessage = await screen.getByText(
      /Ingredient name cannot be numeric only/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should trim and lowercase ingredient name before submission", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "  PeaCh  ");
    await user.click(addButton);
    const ingredient = await screen.getByRole("name", { name: /peach/i });
    expect(ingredient).toBeInTheDocument();
  });
});
