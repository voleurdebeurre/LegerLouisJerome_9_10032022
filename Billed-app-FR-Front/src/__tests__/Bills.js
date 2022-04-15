/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom";
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js"
import NewBill from "../containers/NewBill.js"
import { filteredBills} from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  // Adding test to check if all my bills are displayed
  describe('When I am on Bills page, there are bills, and there is one pending', () => {
    test('Then, getBills by pending status should return 1 bill', () => {
      const getAllBills = filteredBills(bills, "pending")
      expect(getAllBills.length).toBe(1)
    })
  })
  describe('When I am on Bills page, there are bills, and there is one accepted', () => {
    test('Then, getBills by accepted status should return 1 bill', () => {
      const getAllBills = filteredBills(bills, "accepted")
      expect(getAllBills.length).toBe(1)
    })
  })
  describe('When I am on Bills page, there are bills, and there is two refused', () => {
    test('Then, getBills by accepted status should return 2 bills', () => {
      const getAllBills = filteredBills(bills, "refused")
      expect(getAllBills.length).toBe(2)
    })
  })
  describe('When I am on Bills page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      document.body.innerHTML = BillsUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    //Adding test for checking if the eye icon displays the proof
    test("Then if employee clicks on eye icon it opens a modal", async () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({data: bills})
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const allBills = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      console.log(allBills)

      $.fn.modal = jest.fn();
      
      const eyes = screen.getAllByTestId('icon-eye')
      const handleClickIconEyeTest = jest.fn(allBills.handleClickIconEye(eyes[0]))
      
      eyes[0].addEventListener('click', handleClickIconEyeTest)
      userEvent.click(eyes[0])
      
      // const modale = screen.getByTestId('modaleFileEmployee')
      // expect(modale).toBeTruthy()
      expect(handleClickIconEyeTest).toHaveBeenCalled()
    })
  })
  describe("When I click on the new bill button", () => {
    test("It opens the new bill page", () => {
      document.body.innerHTML = BillsUI({data : bills});
      
      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const newBill = new Bills({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });
      
      const handleClickNewBill = jest.fn(newBill.handleClickNewBill)

      const newBillBtn = screen.getByTestId("btn-new-bill")
      newBillBtn.addEventListener("click", handleClickNewBill)
      userEvent.click(newBillBtn)
      console.log(newBillBtn)
      
      expect(handleClickNewBill).toHaveBeenCalled()
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
    })
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})