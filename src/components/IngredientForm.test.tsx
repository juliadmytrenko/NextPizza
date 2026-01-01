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
    const { user, ingredientNameInput, addButton } = setupForm();
    await user.type(ingredientNameInput, "Tomato");
    await user.click(addButton);
    const successMessage = await screen.findByLabelText(/ingredient message/i);
    expect(successMessage).toBeInTheDocument();
  });
});
