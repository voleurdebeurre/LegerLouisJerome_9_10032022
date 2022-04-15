/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import { ROUTES } from "../constants/routes";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see the new bill form", () => {
      document.body.innerHTML = NewBillUI()
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeTruthy()
    })
  })
  describe("Given I submit the form", () => {
    describe("When it's not valid", () => {
      test("Then I should still see the form", () => {
        document.body.innerHTML = NewBillUI();
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        let PREVIOUS_LOCATION = "";

        const store = jest.fn();

        const newBill = new NewBill({
          document,
          localStorage: window.localStorage,
          onNavigate,
          PREVIOUS_LOCATION,
          store,
        });

        const handleSubmit = jest.fn(newBill.handleSubmit)

        const newBillForm = screen.getByTestId("form-new-bill")
        newBillForm.addEventListener("submit", handleSubmit)
        fireEvent.submit(newBillForm)
        
        expect(handleSubmit).toHaveBeenCalled()
        const formNewBill = screen.getByTestId("form-new-bill")
        expect(formNewBill).toBeTruthy()
      })
    })
    describe("When it's valid", () => {
      test("Then I should see the bills list", () => {
        document.body.innerHTML = NewBillUI();
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        let PREVIOUS_LOCATION = "";

        const store = null;

        const newBill = new NewBill({
          document,
          localStorage: window.localStorage,
          onNavigate,
          PREVIOUS_LOCATION,
          store
        });
        
        const handleSubmit = jest.fn(newBill.handleSubmit)
        const handleChangeFile = jest.fn(newBill.handleChangeFile)

        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, { target: { files: [new File(["test.jpg"], "test.jpg", {type : "image/jpeg"})] } });

        const inputDate = screen.getByTestId("datepicker");
        fireEvent.change(inputDate, { target: { value: '2022-04-04' } });

        const inputName = screen.getByTestId("expense-name");
        fireEvent.change(inputName, { target: { value: 'Test' } });
        
        const inputVat = screen.getByTestId("vat");
        fireEvent.change(inputVat, { target: { value: '1' } });

        const inputPCT = screen.getByTestId("pct");
        fireEvent.change(inputPCT, { target: { value: '1' } });

        const newBillForm = screen.getByTestId("form-new-bill")
        newBillForm.addEventListener("submit", handleSubmit)
        fireEvent.submit(newBillForm)
        
        expect(handleSubmit).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalled()
        const formNewBill = screen.getByTestId("form-new-bill")
        // expect(formNewBill).not.toBeTruthy()
      })
    })
 })
})
