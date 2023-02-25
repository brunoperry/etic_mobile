import Button from "./Button.js";
import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Controller extends Component {
  constructor(elemID, callback) {
    super(elemID, callback);

    const previousButton = new Button("#previous-button", (value) => {
      this.callback("previous");
    });

    const nextButton = new Button("#next-button", (value) => {
      this.callback("next");
    });

    const actionButton = new ToggleButton("#action-button", (value) => {
      this.callback("action");
    });
  }

  setState(state) {
    actionButton.toggle(state);
  }
}
