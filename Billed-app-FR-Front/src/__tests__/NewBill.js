/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import { ROUTES } from "../constants/routes"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js";

import mockStore from "../__mocks__/store";
jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see the new bill form", () => {
      document.body.innerHTML = NewBillUI()
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeTruthy()
    })
  })
  describe("Given I upload a file", () => {
    test("Then function handleChangeFile should be called", () => {
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
      
      
      const handleChangeFile = jest.fn(newBill.handleChangeFile)

      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile, { target: { files: [new File(["test.jpg"], "test.jpg", {type : "image/jpeg"})] } });

      expect(handleChangeFile).toHaveBeenCalled()
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
      test("Then updateBill should be called", () => {
        // jest.spyOn(mockStore, "bills")
        // mockStore.bills(bills)
        // document.body.innerHTML = NewBillUI();
        // window.localStorage.setItem('user', JSON.stringify({
        //   type: 'Employee',
        // }))
        // const onNavigate = (pathname) => {
        //   document.body.innerHTML = ROUTES({ pathname });
        // };

        // let PREVIOUS_LOCATION = "";

        // const store = mockStore.bills(bills);

        // const newBill = new NewBill({
        //   document,
        //   localStorage: window.localStorage,
        //   onNavigate,
        //   PREVIOUS_LOCATION,
        //   store,
        // });

        // const handleSubmit = jest.fn(newBill.handleSubmit)

        // const filePath = screen.getByTestId("file");
        // fireEvent.change(filePath, { target: { value: "" } });

        // const inputType = screen.getByTestId("expense-type");
        // fireEvent.change(inputType, { target: { value: 'Transports' } });

        // const inputName = screen.getByTestId("expense-name");
        // fireEvent.change(inputName, { target: { value: 'Test' } });

        // const inputCommentary = screen.getByTestId("commentary");
        // fireEvent.change(inputCommentary, { target: { value: '' } });

        // const inputDate = screen.getByTestId("datepicker");
        // fireEvent.change(inputDate, { target: { value: '2022-04-04' } });

        // const inputAmount = screen.getByTestId("amount");
        // fireEvent.change(inputAmount, { target: { value: 1 } });

        // const inputVat = screen.getByTestId("vat");
        // fireEvent.change(inputVat, { target: { value: '1' } });

        // const inputPCT = screen.getByTestId("pct");
        // fireEvent.change(inputPCT, { target: { value: 1 } });

        // const newBillForm = screen.getByTestId("form-new-bill")
        // newBillForm.addEventListener("submit", handleSubmit)
        // fireEvent.submit(newBillForm)
    })
  })
 })
})
