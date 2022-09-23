import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
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
  //verifies the document contains the option 'husky'
  //-> findBy queries are used when asynchronous code needs to be tested
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

//testing the search feature
test("should be able to search and display dog image results", async () => {
   render(<App />);
   
   //Simulate selecting an option and verifying its value
   //getByRole() grabs the selected element and assigns it to the select variable
   const select = screen.getByRole("combobox");
   expect(await screen.findByRole("option", { name: "cattledog"})).toBeInTheDocument();
   userEvent.selectOptions(select, "cattledog");
   expect(select).toHaveValue("cattledog");

   //Simulate initiating the search request
   const searchBtn = screen.getByRole("button", { name: "Search" });
   expect(searchBtn).not.toBeDisabled();
   userEvent.click(searchBtn);

   //Loading state displays and gets removed once results are displayed
   await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

   //Verify image display and results count 
   //getAllBy can return more that 1 element
   const dogImages = screen.getAllByRole("img");
   //check 2 img's are returned
   expect(dogImages).toHaveLength(2);
   expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
   //verifies appropriate alt text associated with img's
   expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2");
   expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");

})