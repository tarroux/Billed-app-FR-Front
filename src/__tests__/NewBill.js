
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store.js";
import '@testing-library/jest-dom/extend-expect'

/**
 * @jest-environment jsdom
 */

// jest.mock("../app/store", () => ({
//   bills: () => ({
//     create: jest.fn(() =>
//       Promise.resolve({
//         fileUrl: "https://localhost:3456/images/test.jpg",
//         key: "1234"
//       })
//     )
//   })
// }));

describe("handleChangeFile", () => {
  beforeEach(() => {
    // Mock de window.alert pour éviter les vrais alerts dans les tests
    window.alert = jest.fn();
  });

  test("should correctly handle file input with valid extension", async () => {
    // Charger l'UI de la nouvelle facture
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Instancier la classe NewBill (nécessaire pour appeler la méthode handleChangeFile)
    const newBill = new NewBill({ document, onNavigate: jest.fn(), store: jest.fn(), localStorage: window.localStorage });

    // Obtenir l'élément input de type file
    const fileInput = screen.getByTestId("file");

    // Créer un fichier valide avec extension png
    const validFile = new File(["dummy content"], "image.png", { type: "image/png" });

    // Mock de la propriété files
    Object.defineProperty(fileInput, 'files', {
      value: [validFile],
    });

    // Simuler l'événement de changement de fichier
    fireEvent.change(fileInput);

    // Appeler la méthode handleChangeFile depuis l'instance newBill
    const event = { target: fileInput, preventDefault: jest.fn() };
    newBill.handleChangeFile(event); // On appelle la méthode via l'instance newBill

    // Vérifier que le fichier est bien sélectionné dans fileInput.files
    await waitFor(() => {
      expect(fileInput.files.length).toBe(1); // Vérifier qu'un fichier est bien sélectionné
      expect(fileInput.files[0].name).toBe("image.png"); // Vérifier le nom du fichier sélectionné
    })
    // Vérifier que fileUrl et fileName sont bien définis après soumission
    // console.log("newBill.fileUrl après soumission:", newBill.fileUrl);
    // console.log("newBill.fileName après soumission:", newBill.fileName);
  });

  test("should reset file input and alert for invalid file extension", async () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Instancier la classe NewBill
    const newBill = new NewBill({ document, onNavigate: jest.fn(), store: jest.fn(), localStorage: window.localStorage });

    // Obtenir l'élément input de type file
    const fileInput = screen.getByTestId("file");

    // Créer un fichier invalide avec extension .pdf
    const invalidFile = new File(["dummy content"], "document.pdf", { type: "application/pdf" });

    // Mock de la propriété files
    Object.defineProperty(fileInput, 'files', {
      value: [invalidFile],
    });

    // Simuler l'événement de changement de fichier
    fireEvent.change(fileInput);

    // Appeler la méthode handleChangeFile depuis l'instance newBill
    const event = { target: fileInput, preventDefault: jest.fn() };
    newBill.handleChangeFile(event); // On appelle la méthode via l'instance newBill

    // Vérifier que l'alerte a été appelée
    expect(window.alert).toHaveBeenCalledWith("Seuls les fichiers au format .jpg, .jpeg ou .png sont acceptés.");

    // Vérifier que l'input file a été réinitialisé
    expect(fileInput.value).toBe(""); // Le champ file est réinitialisé
  });
  test("should call handleChangeFile when a file is uploaded", () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    const newBill = new NewBill({
      document,
      onNavigate: jest.fn(),
      store: mockStore,
      localStorage: window.localStorage
    });

    const handleChangeFile = jest.fn(newBill.handleChangeFile);
    const fileInput = screen.getByTestId("file");

    fileInput.addEventListener("change", handleChangeFile);

    // Simuler l'upload d'un fichier
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleChangeFile).toHaveBeenCalled();
  });
});

describe('Store mock', () => {
  test('should return the mocked bills', async () => {
    const bills = await mockStore.bills().list();
    expect(bills).toHaveLength(4);  // Obtenir 4 factures
    expect(bills[0].id).toBe('47qAXb6fIm2zOKkLzMro');  // Vérifie un champ de la première facture
  });

  test('should call create and return mocked fileUrl and key', async () => {
    const bill = { amount: 100, type: 'Transports' };
    const response = await mockStore.bills().create(bill);
    expect(response.fileUrl).toBe('https://localhost:3456/images/test.jpg');
    expect(response.key).toBe('1234');
  });
});

describe("Given I am on NewBill Page", () => {
  test("should render the NewBill form with all input fields", () => {
    // Charge l'interface utilisateur de la nouvelle facture
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Vérifie que le champ 'Type de dépense' est présent
    const expenseType = screen.getByTestId("expense-type");
    expect(expenseType).toBeTruthy();

    // Vérifie que le champ 'Nom de la dépense' est présent
    const expenseName = screen.getByTestId("expense-name");
    expect(expenseName).toBeTruthy();

    // Vérifie que le champ 'Date' est présent
    const datepicker = screen.getByTestId("datepicker");
    expect(datepicker).toBeTruthy();

    // Vérifie que le champ 'Montant TTC' est présent
    const amount = screen.getByTestId("amount");
    expect(amount).toBeTruthy();

    // Vérifie que le champ 'TVA' est présent
    const vat = screen.getByTestId("vat");
    expect(vat).toBeTruthy();

    // Vérifie que le champ 'Pourcentage' est présent
    const pct = screen.getByTestId("pct");
    expect(pct).toBeTruthy();

    // Vérifie que le champ 'Commentaire' est présent
    const commentary = screen.getByTestId("commentary");
    expect(commentary).toBeTruthy();

    // Vérifie que le champ 'Justificatif' (input de fichier) est présent
    const fileInput = screen.getByTestId("file");
    expect(fileInput).toBeTruthy();

    // Vérifie que le bouton 'Envoyer' est présent
    const submitButton = screen.getByTestId("form-new-bill");
    expect(submitButton).toBeTruthy();
  });

  test("should allow to fill out the form fields", () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Simuler le remplissage du champ 'Type de dépense'
    const expenseType = screen.getByTestId("expense-type");
    fireEvent.change(expenseType, { target: { value: "Transports" } });
    expect(expenseType.value).toBe("Transports");

    // Simuler le remplissage du champ 'Nom de la dépense'
    const expenseName = screen.getByTestId("expense-name");
    fireEvent.change(expenseName, { target: { value: "Vol Paris-Londres" } });
    expect(expenseName.value).toBe("Vol Paris-Londres");

    // Simuler le remplissage du champ 'Date'
    const datepicker = screen.getByTestId("datepicker");
    fireEvent.change(datepicker, { target: { value: "2022-09-21" } });
    expect(datepicker.value).toBe("2022-09-21");

    // Simuler le remplissage du champ 'Montant TTC'
    const amount = screen.getByTestId("amount");
    fireEvent.change(amount, { target: { value: "300" } });
    expect(amount.value).toBe("300");

    // Simuler le remplissage du champ 'TVA'
    const vat = screen.getByTestId("vat");
    fireEvent.change(vat, { target: { value: "70" } });
    expect(vat.value).toBe("70");

    // Simuler le remplissage du champ 'Pourcentage'
    const pct = screen.getByTestId("pct");
    fireEvent.change(pct, { target: { value: "20" } });
    expect(pct.value).toBe("20");

    // Simuler le remplissage du champ 'Commentaire'
    const commentary = screen.getByTestId("commentary");
    fireEvent.change(commentary, { target: { value: "Voyage d'affaires" } });
    expect(commentary.value).toBe("Voyage d'affaires");

    // Simuler le remplissage du champ 'Justificatif' (input de fichier)
    const fileInput = screen.getByTestId("file");
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpg" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files[0].name).toBe("test.jpg");
  });
});

describe("Given I am on NewBill Page", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => JSON.stringify({ email: "test@user.com" })),
      },
      writable: true,
    });
  });
  test("should call handleSubmit when the form is submitted", () => {
    // Charger l'UI de la nouvelle facture
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Instancier NewBill
    const newBill = new NewBill({
      document,
      onNavigate: jest.fn(),
      store: mockStore,
      localStorage: window.localStorage
    });

    // Simuler la soumission du formulaire
    const form = screen.getByTestId("form-new-bill");
    const handleSubmit = jest.fn(newBill.handleSubmit);

    form.addEventListener("submit", handleSubmit);
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
  test("should call updateBill when the form is submitted", async () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    const newBill = new NewBill({
      document,
      onNavigate: jest.fn(),
      store: mockStore,
      localStorage: window.localStorage
    });

    newBill.updateBill = jest.fn();  // Mock la méthode updateBill

    const form = screen.getByTestId("form-new-bill");
    fireEvent.submit(form);

    expect(newBill.updateBill).toHaveBeenCalled();  // Vérifie que updateBill est bien appelée
  });
  // test("should initialize the form correctly", () => {
  //   const html = NewBillUI();
  //   document.body.innerHTML = html;

  //   const form = screen.getByTestId("form-new-bill");
  //   const expenseType = screen.getByTestId("expense-type");
  //   const expenseName = screen.getByTestId("expense-name");
  //   const datepicker = screen.getByTestId("datepicker");
  //   const amount = screen.getByTestId("amount");
  //   const vat = screen.getByTestId("vat");
  //   const pct = screen.getByTestId("pct");
  //   const commentary = screen.getByTestId("commentary");
  //   const fileInput = screen.getByTestId("file");

  //   // Vérifier que tous les éléments du formulaire sont présents et initialisés
  //   expect(form).toBeTruthy();
  //   expect(expenseType.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(expenseName.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(datepicker.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(amount.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(vat.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(pct.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(commentary.value).toBe("");  // Le champ devrait être vide au départ
  //   expect(fileInput.value).toBe("");  // Le champ devrait être vide au départ
  // });
});

// describe("Given I am a user on NewBill Page", () => {
//   let onNavigate;
//   let store;

//   beforeEach(() => {
//     jest.clearAllMocks();// Nettoyer les mocks avant les test
//     // Mock du localStorage pour inclure un utilisateur avec un email
//     Object.defineProperty(window, "localStorage", {
//       value: {
//         getItem: jest.fn(() => JSON.stringify({ email: "test@user.com" })),
//       },
//       writable: true,
//     });

//     // Mock la fonction de navigation
//     onNavigate = jest.fn();

//     // Mock le store
//     store = mockStore;
//   });

//   test("should correctly handle valid file input", async () => {
//     // Charger l'UI de la nouvelle facture
//     const html = NewBillUI();
//     document.body.innerHTML = html;

//     // Instancier NewBill
//     const newBill = new NewBill({
//       document,
//       onNavigate: jest.fn(),
//       store: mockStore,
//       localStorage: window.localStorage
//     });
//     // console.log(newBill);

//     // Simuler un fichier valide
//     const fileInput = screen.getByTestId("file");
//     const validFile = new File(["dummy content"], "test.jpg", { type: "image/jpg" });
//     Object.defineProperty(fileInput, "files", { value: [validFile] });

//     // Simuler le changement de fichier
//     fireEvent.change(fileInput);

//     // Attendre la soumission du fichier et vérifier
//     // await waitFor(() => {
//     //   expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
//     //   expect(newBill.fileName).toBe("test.jpg");
//     // });
//     // Attendre que le fichier soit soumis et vérifier la mise à jour de fileUrl et fileName

//     // console.log(newBill);
//     await waitFor(() => {
//       expect(jest.isMockFunction(mockStore.bills().create)).toBe(true);
//       expect(mockStore.bills().create).toHaveBeenCalled();//normalement il devrait y avoir la connexion ici
//       expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
//       expect(newBill.fileName).toBe("test.jpg");
//     });
//   });

//   // test("should submit the form with valid data", async () => {
//   //   // Mocker explicitement la méthode bills().create
//   //   const createSpy = jest.spyOn(mockStore.bills(), 'create');
//   //   // Charger l'UI de la nouvelle facture
//   //   const html = NewBillUI();
//   //   document.body.innerHTML = html;

//   //   // Instancier NewBill
//   //   const newBill = new NewBill({ document, onNavigate: jest.fn(), store: mockStore, localStorage: window.localStorage });
//   //   console.log(newBill);//retourne null pour tout
//   //   // Remplir les champs obligatoires du formulaire
//   //   fireEvent.change(screen.getByTestId("expense-type"), { target: { value: "Transports" } });
//   //   fireEvent.change(screen.getByTestId("expense-name"), { target: { value: "Vol Paris-Londres" } });
//   //   fireEvent.change(screen.getByTestId("datepicker"), { target: { value: "2022-09-21" } });
//   //   fireEvent.change(screen.getByTestId("amount"), { target: { value: "300" } });
//   //   fireEvent.change(screen.getByTestId("vat"), { target: { value: "70" } });
//   //   fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
//   //   fireEvent.change(screen.getByTestId("commentary"), { target: { value: "Voyage d'affaires" } });

//   //   // Simuler un fichier valide
//   //   const fileInput = screen.getByTestId("file");
//   //   const validFile = new File(["dummy content"], "test.jpg", { type: "image/jpg" });
//   //   Object.defineProperty(fileInput, "files", { value: [validFile] });
//   //   fireEvent.change(fileInput);

//   //   // Simuler la soumission du formulaire
//   //   const form = screen.getByTestId("form-new-bill");
//   //   fireEvent.submit(form);

//   //   // Attendre et vérifier que create a été appelé
//   //   await waitFor(() => {
//   //     expect(createSpy).toHaveBeenCalled();
//   //   });
//   //   // createSpy.mockRestore();  // Restaurez après le test pour éviter les conflits dans les autres tests

//   //   await waitFor(() => {
//   //     expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
//   //     expect(newBill.fileName).toBe("test.jpg");
//   //   });

//   //   // console.log(fileUrl, fileName);
//   //   // Attendre que la requête POST soit effectuée
//   //   await waitFor(() => {
//   //     expect(store.bills).toHaveBeenCalled();
//   //     expect(store.bills().create).toHaveBeenCalledWith({
//   //       data: expect.any(FormData),
//   //       headers: { noContentType: true },
//   //     });
//   //   });

//   //   // Vérifier que la fonction de navigation a été appelée après la soumission
//   //   expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
//   // });
// });