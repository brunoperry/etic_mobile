import Component from "./Component.js";

export default class Button extends Component {
  constructor(elemID, callback) {
    super(elemID, callback);

    if (this.element) this.element.onclick = () => this.callback();
  }

  setElement(element) {
    super.setElement(element);
    this.element.onclick = () => this.callback();
  }

  setText(text) {
    this.element.querySelector("label").innerText = text;
  }
}
