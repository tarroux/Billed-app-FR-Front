export const localStorageMock = (function () {
  let store = {};
  // return {
  //   getItem: function(key) {
  //     return JSON.stringify(store[key])
  //   },
  //   setItem: function(key, value) {
  //     store[key] = value.toString()
  //   },
  //   clear: function() {
  //     store = {}
  //   },
  //   removeItem: function(key) {
  //     delete store[key]
  //   }
  // }
  return {
    getItem: function (key) {
      // Retourner null si la clé n'existe pas (comportement de localStorage)
      return store[key] ? store[key] : null;
    },
    setItem: function (key, value) {
      // Stocker les valeurs en tant que chaînes de caractères
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key) {
      delete store[key];
    }
  };
})()