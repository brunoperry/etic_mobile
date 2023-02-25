import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Info extends Component {
  #infoContainer;
  #infoButton;
  #isOpened = false;
  constructor(elemID, callback) {
    super(elemID, callback);

    this.#infoContainer = this.element.querySelector("#info-container");

    this.#infoButton = new ToggleButton("#info-button", (value) => {
      this.callback(value);
      !this.#isOpened ? this.open() : this.close();
    });
  }

  update(data) {
    this.infoButton.setText(data.name);
  }

  open() {
    if (this.#isOpened) return;
    this.#infoContainer.style.transform = "scaleY(1)";
    this.#infoButton.toggle(1);
    this.#isOpened = true;
  }
  close() {
    if (!this.#isOpened) return;
    this.#infoContainer.style.transform = "scaleY(0)";
    this.#infoButton.toggle(0);
    this.#isOpened = false;
  }
}
