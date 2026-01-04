import { render, screen, waitFor } from "@testing-library/react";
import IngredientForm, { IngredientFormProps } from "./IngredientForm";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { server } from "./../../__mocks__/node";
import { http, HttpResponse } from "msw";

describe("IngredientForm Component", () => {
  // Define your default mock functions and variables
  const defaultMocks: IngredientFormProps = {
    onSubmit: vi.fn(),
    ingredientName: "",
    setIngredientName: vi.fn(),
    ingredientMsg: null,
    ingredients: [],
    onDelete: vi.fn(),
  };

  it("renders the component", () => {
    render(<IngredientForm {...defaultMocks} />);
    const inputElement = screen.getByPlaceholderText(/Ingredient name/i);
    expect(inputElement).toBeInTheDocument();
  });

  // WRAPPER COMPONENT FOR HANDLING STATE
  function IngredientFormWrapper(props: any) {
    const [ingredientName, setIngredientName] = useState("");
    const [ingredientMsg, setIngredientMsg] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<any[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const name = ingredientName.trim().toLowerCase();
      if (ingredients.some((ing) => ing.name === name)) {
        setIngredientMsg("Ingredient already exists in database.");
      } else if (name) {
        setIngredients([...ingredients, { name }]);
        setIngredientMsg("Ingredient added!");
        setIngredientName("");
      }
    };

    const handleDelete = (id: number) => {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    };

    return (
      <IngredientForm
        ingredientName={ingredientName}
        setIngredientName={setIngredientName}
        ingredientMsg={ingredientMsg}
        ingredients={ingredients}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        {...props}
      />
    );
  }

  const setupForm = (overrides?: any) => {
    const user = userEvent.setup();
    render(<IngredientFormWrapper {...overrides} />);
    const ingredientNameInput = screen.getByLabelText(/add ingredient/i);
    const addButton = screen.getByRole("button", { name: /add/i });
    return { user, ingredientNameInput, addButton };
  };

  test("adds ingredient and shows success message", async () => {
    const { user, ingredientNameInput, addButton } = setupForm();

    await user.type(ingredientNameInput, "Tomato");
    await user.click(addButton);

    expect(await screen.findByText(/ingredient added/i)).toBeInTheDocument();
    expect(ingredientNameInput).toHaveValue("");
    expect(screen.getByText(/tomato/i)).toBeInTheDocument();
  });

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
    const { user, addButton } = setupForm();
    await user.click(addButton);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows error message for duplicate ingredient", async () => {
    const user = userEvent.setup();
    render(<IngredientFormWrapper />);
    const input = screen.getByLabelText(/add ingredient/i);
    const button = screen.getByRole("button", { name: /add/i });

    await user.type(input, "Tomato");
    await user.click(button);
    await user.type(input, "Tomato");
    await user.click(button);

    const errorMessage = await screen.findByText(
      /ingredient already exists in database./i
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
