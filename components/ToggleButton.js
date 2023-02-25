import Button from "./Button.js";

export default class ToggleButton extends Button {
  #togglesList;
  #currentToggleIndex = 0;

  constructor(elemID) {
    super(elemID);

    this.#togglesList = this.element.children;

    this.toggle(0);
  }

  toggle(index = null) {
    this.#togglesList[this.#currentToggleIndex].style.display = "none";
    if (index !== null) {
      this.#currentToggleIndex = index;
    } else {
      this.#currentToggleIndex++;
      if (this.#currentToggleIndex >= this.#togglesList.length) {
        this.#currentToggleIndex = 0;
      }
    }
    this.#togglesList[this.#currentToggleIndex].style.display = "initial";

    // this.#togglesList[this.#currentToggleIndex].style.display = "none";
    // this.#currentToggleIndex++;
    // if (this.#currentToggleIndex >= this.#togglesList.length) {
    //   this.#currentToggleIndex = 0;
    // }
    // this.#togglesList[this.#currentToggleIndex].style.display = "initial";
  }
}
