import Button from "./Button.js";

export default class ToggleButton extends Button {
  #toggles = [];
  #currentToggle = 0;
  constructor(buttonID) {
    super(buttonID);

    this.#toggles = this.view.children;
    this.toggle(0);
  }

  toggle(index = null) {
    this.#toggles[this.#currentToggle].style.display = "none";
    if (index !== null) {
      this.#currentToggle = index;
    } else {
      this.#currentToggle++;
      if (this.#currentToggle >= this.#toggles.length) {
        this.#currentToggle = 0;
      }
    }
    this.#toggles[this.#currentToggle].style.display = "initial";
  }
}
