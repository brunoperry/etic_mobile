import PopContent from "./PopContent.js";
import ToggleButton from "./ToggleButton.js";

export default class Info extends PopContent {
  #infoButton;
  constructor(elemID) {
    super(elemID);

    this.#infoButton = new ToggleButton("#info-button");
    this.#infoButton.onClick = () => {
      this.isOpened ? this.close() : this.open();
    };
  }

  update(data) {
    this.#infoButton.text = data.name;
  }

  open() {
    super.open();
    this.#infoButton.toggle(1);
  }

  close() {
    super.close();
    this.#infoButton.toggle(0);
  }

  get onchange() {
    return this.callback;
  }
  set onchange(callback) {
    this.callback = callback;
  }
}
