export default class Component {
  element;
  callback;

  constructor(elementID = null, callback = () => {}) {
    this.element = document.querySelector(elementID);
    this.callback = callback;
  }

  setElement(element) {
    this.element = element;
  }
}
