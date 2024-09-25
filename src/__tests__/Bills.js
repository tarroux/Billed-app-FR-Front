/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom/"
import '@testing-library/jest-dom/extend-expect'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
// import mockStore from "../__mocks__/store.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
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
      expect(windowIcon).toHaveClass('active-icon')
      // expect(windowIcon.classList).toHaveClass('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      const datesExpect = ["2004-04-04", "2003-03-03", "2002-02-02", "2001-01-01"];

      expect(datesExpect).toEqual(datesSorted)
    })
    // test('handleClickNewBill should navigate to NewBill page', () => {
    //   const onNavigate = jest.fn();
    //   const billsInstance = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage });
    //   billsInstance.handleClickNewBill();
    //   expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    // })
    // test('handleClickIconEye should display modal with correct image', () => {
    //   document.body.innerHTML = `<div id="modalFile"><div class="modal-body"></div></div>`;
    //   $.fn.modal = jest.fn();

    //   const icon = { getAttribute: jest.fn(() => 'http://url.com') };
    //   const billsInstance = new Bills({ document, onNavigate: null, store: null, localStorage: window.localStorage });

    //   const img = document.querySelector('.bill-proof-container img');
    //   expect(img.src).tobe('http://url.com/');
    //   expect($.fn.modal).toHaveBeenCalledWith('show');
    // })
    // test('getBills should return formatted bills from API', async () => {
    //   const mockBills = [
    //     { date: '2021-07-20', status: 'pending' },
    //     { date: '2021-07-21', status: 'accepted' }
    //   ];
    //   const store = {
    //     bills: jest.fn(() => ({
    //       list: jest.fn(() => Promise.resolve(mockBills))
    //     }))
    //   };

    //   const billsInstance = new Bills({ document, onNavigate: null, store, localStorage: window.localStorage });
    //   const bills = await billsInstance.getBills();

    //   expect(bills.length).toBe(2);
    //   expect(bills[0].date).toBe('Jul 20, 2021');
    //   expect(bills[0].status).toBe('pending');
    // });
  })
})
describe("Given I am an employee", () => {
  describe("When I click on 'New Bill' button", () => {
    test('handleClickNewBill should navigate to NewBill page', () => {
      const onNavigate = jest.fn();
      const billsInstance = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage });
      billsInstance.handleClickNewBill();
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    })
  })
})

// describe("Given I am connected as Employee", () => {
//   describe("When I fetch bills", () => {
//     test("Then it should fetch bills from mock API GET", async () => {
//       const billsInstance = new Bills({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });
     
//       const getSpy = jest.spyOn(mockStore, 'bills');
//       const bills = await billsInstance.getBills();

//       expect(getSpy).toHaveBeenCalled();
//       expect(bills.length).toBeGreaterThan(0);
//     });
//   });
// });

