import { render, screen } from "@testing-library/react";
import mockFetch from "./mocks/mockFetch"
import App from "./App";

test("renders the landing page",async () => {
  render(<App />);
  //expect used to verify a certain outcome.
  // -> accepts a single argument representing the value that the code produces
  // -> typically paired with a matcher function -> matchers provided by jest-dom

  //expect element with heading role to have a substring match of 'Doggy Directory'
  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);
  //expect select input to have an exact display value of 'Select a breed'
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");

  expect(await screen.findByRole("option", { name: "husky"})).toBeInTheDocument();
  //expect the search button to be disabled since a selection has not been made
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  //expect the placeholder image to be present since the search hasn't taken place
  expect(screen.getByRole("img")).toBeInTheDocument();

});

  //code below to test fetch by setting up and tearing down the mock implementations

  //creates a mock function that will track calls to the fetch method attached to the global window variable in the DOM
  beforeEach(()=> {
    //.mockImplementation() accepts a function that will be used to implement the mock method. 
    //-> overrides the original fetch implementation and runs whenever fetch is called within the app code
    jest.spyOn(window, "fetch").mockImplementation(mockFetch);
  })
  afterEach(() => {
    jest.restoreAllMocks()
 });