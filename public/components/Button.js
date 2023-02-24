import Component from "./Component.js";

export default class Button extends Component {
  constructor(buttonID) {
    super(buttonID);
  }

  get onClick() {
    return this.view.onclick;
  }
  set onClick(callback) {
    this.view.onclick = callback;
  }

  get text() {
    const label = this.getElement("label");
    return label ? (label.innerText = val) : "";
  }
  set text(val) {
    const label = this.getElement("label");
    if (label) label.innerText = val;
  }
}
