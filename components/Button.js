import Component from "./Component.js";

export default class Button extends Component {
  constructor(elemID) {
    super(elemID);
  }

  onClick() {}

  onClick(callback) {
    this.element.onclick = () => {
      callback("button clicked");
    };
  }
}
