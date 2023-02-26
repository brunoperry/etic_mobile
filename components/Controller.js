import Button from "./Button.js";
import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Controller extends Component {
  currentState = "paused";
  #previousButton;
  #actionButton;
  #nextButton;
  constructor(elemID, callback) {
    super(elemID, callback);

    this.#previousButton = new Button("#previous-button", (value) => {
      this.callback("previous");
    });

    this.#nextButton = new Button("#next-button", (value) => {
      this.callback("next");
    });

    this.#actionButton = new ToggleButton("#action-button", (value) => {
      if (this.currentState === "loading") return;
      this.currentState === "pause" ? this.callback("play") : this.callback("pause");
    });
  }

  setState(state) {
    this.currentState = state;
    let val = 0;
    switch (this.currentState) {
      case "play":
        val = 0;
        break;
      case "pause":
        val = 1;
        break;
      case "loading":
        val = 2;
        break;
      case "error":
        val = 3;
        break;
    }
    this.#actionButton.toggle(val);
  }
}
