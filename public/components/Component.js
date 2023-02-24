// export default class Component {
//   #element;
//   constructor(elementID) {
//     this.#element = document.querySelector(elementID);
//   }
// }

export default class Component {
  #element;
  callback;
  constructor(elementID, callback = () => console.log("no callback defined")) {
    this.view = elementID;
    this.callback = callback;
  }

  getElement(elementID) {
    return this.#element.querySelector(elementID);
  }
  setElement(element) {
    this.#element = element;
  }

  get view() {
    return this.#element;
  }
  set view(elementID = null) {
    if (elementID === null) return;
    this.#element = document.querySelector(elementID);
  }
}
