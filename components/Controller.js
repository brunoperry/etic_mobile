import Button from "./Button.js";
import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Controller extends Component {
  #actionButton;
  constructor(elemID, callback) {
    super(elemID, callback);

    const previousButton = new Button("#previous-button", (value) => {
      this.callback("previous");
    });

    const nextButton = new Button("#next-button", (value) => {
      this.callback("next");
    });

    this.#actionButton = new ToggleButton("#action-button", (value) => {
      this.callback("action");
    });
  }

  setState(state) {
    let val = 0;
    switch (state) {
      case "play":
        val = 0;
        break;
      case "pause":
        val = 1;
        break;
      case "loading":
        val = 2;
        break;
    }
    this.#actionButton.toggle(val);
  }
}
